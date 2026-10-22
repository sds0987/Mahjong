import http from 'node:http'
import path from 'node:path'
import express from 'express'
import { Server } from 'socket.io'
import QRCode from 'qrcode'
import { ZodError, type ZodType } from 'zod'
import { claimSchema, createRoomSchema, discardSchema, identitySchema, joinRoomSchema, kickSchema, leaveSchema, readySchema, startSchema, syncSchema, updateSettingsSchema, type StructuredError } from '../src/network/protocol'
import { RoomFailure, RoomManager, type LanRoom } from './RoomManager'
import { privateLanAddresses } from './network'
import { loadRooms, saveRooms } from './persistence'
import { ProfileStore } from './ProfileStore'
import type { GameState } from '../src/game/types'

interface ServerOptions { port?: number; host?: string; dataDir?: string; persist?: boolean; tickMs?: number }
type Identity = { roomId: string; playerId: string; playerToken: string }

export async function createLanServer(options: ServerOptions = {}) {
  const port = options.port ?? Number(process.env.PORT || 3000)
  const host = options.host ?? process.env.HOST ?? '0.0.0.0'
  const dataDir = options.dataDir ?? path.resolve('data')
  const app = express()
  const httpServer = http.createServer(app)
  const io = new Server(httpServer, { cors: { origin: process.env.NODE_ENV === 'production' ? false : true } })
  const urls = privateLanAddresses(port)
  const manager = new RoomManager(urls)
  if (options.persist !== false) manager.importRooms(await loadRooms(dataDir))
  const profiles = new ProfileStore(path.join(dataDir,'profiles.json'))
  await profiles.load()
  const sockets = new Map<string, string>()
  const rate = new Map<string, { count: number; resetAt: number }>()

  app.use(express.json({limit:'25mb'}))
  app.get('/api/health', (_request, response) => response.json({ ok: true, urls }))
  app.get('/api/profile/:playerId',(request,response)=>response.json(profiles.getProfile(request.params.playerId,String(request.query.displayName||'Ananya Rao'))))
  app.get('/api/match/:matchId',(request,response)=>{const match=profiles.getMatch(request.params.matchId);if(!match)return response.status(404).json({message:'Match not found.'});response.json(match)})
  app.get('/api/match/:matchId/results',(request,response)=>{const summary=profiles.getSummary(request.params.matchId);if(!summary)return response.status(404).json({message:'Progression summary not found.'});response.json(summary)})
  app.post('/api/profile/process-practice',async(request,response)=>{try{const body=request.body as {playerId?:string;displayName?:string;gameState?:GameState;snapshots?:GameState[]};if(!body.playerId||!body.gameState||!Array.isArray(body.snapshots))return response.status(400).json({message:'Player, game state, and action chain are required.'});response.json(await profiles.process(body.gameState,body.playerId,body.displayName||'Player',body.snapshots))}catch(error){response.status(422).json({message:error instanceof Error?error.message:'Match processing failed.'})}})
  const dist = path.resolve('dist')
  app.use(express.static(dist))
  app.get('*path', (_request, response) => response.sendFile(path.join(dist, 'index.html')))

  const structured = (error: unknown, commandId?: string): StructuredError => {
    if (error instanceof RoomFailure) return error.detail
    if (error instanceof ZodError) return { code: 'INVALID_PAYLOAD', message: error.issues[0]?.message ?? 'Invalid request.', commandId }
    return { code: 'INVALID_PAYLOAD', message: 'The server could not process that request.', commandId }
  }
  const limited = (socketId: string) => {
    const now = Date.now(), entry = rate.get(socketId)
    if (!entry || entry.resetAt < now) { rate.set(socketId, { count: 1, resetAt: now + 5000 }); return false }
    entry.count++
    return entry.count > 40
  }
  const parse = <T>(schema: ZodType<T>, payload: unknown): T => schema.parse(payload)
  const identityFor = (socket: { data: Record<string, unknown> }) => socket.data.identity as Identity | undefined
  const emitError = (socket: { emit: (event: string, value: unknown) => void }, error: unknown, commandId?: string) => socket.emit('server:error', structured(error, commandId))
  const broadcast = async (room: LanRoom) => {
    const roomView = manager.roomView(room)
    for (const seat of room.seats) {
      if (!seat || seat.isBot) continue
      const socketId = sockets.get(seat.playerId)
      if (!socketId) continue
      io.to(socketId).emit('room:snapshot', roomView)
      const game = manager.playerView(room, seat.playerId)
      if (game) io.to(socketId).emit('game:snapshot', game)
    }
  }
  const joinIdentity = (socket: any, identity: Identity) => {
    socket.data.identity = identity
    sockets.set(identity.playerId, socket.id)
    socket.join(identity.roomId)
  }
  io.on('connection', (socket) => {
    const on = <T>(event: string, schema: ZodType<T>, fn: (payload: T) => Promise<void> | void) => socket.on(event, async (payload: unknown) => {
      if (limited(socket.id)) return emitError(socket, new RoomFailure({ code: 'RATE_LIMITED', message: 'Too many requests. Please pause for a moment.' }))
      try { await fn(parse(schema, payload)) } catch (error) { emitError(socket, error, typeof payload === 'object' && payload ? String((payload as any).commandId ?? '') || undefined : undefined) }
    })

    on('room:create', createRoomSchema, async (payload) => {
      const result = manager.create(payload)
      const identity = { roomId: result.room.roomId, playerId: result.playerId, playerToken: result.playerToken }
      joinIdentity(socket, identity)
      const base = result.room.lanUrls[0] ?? `http://localhost:${port}`
      socket.emit('room:created', { identity, room: manager.roomView(result.room), joinUrl: `${base}/join/${result.room.roomId}`, qrDataUrl: await QRCode.toDataURL(`${base}/join/${result.room.roomId}`) })
      await broadcast(result.room)
    })
    on('room:join', joinRoomSchema, async (payload) => {
      const result = manager.join(payload.roomCode.toUpperCase(), payload.displayName, payload.seat, payload.password)
      const identity = { roomId: result.room.roomId, playerId: result.playerId, playerToken: result.playerToken }
      joinIdentity(socket, identity)
      socket.emit('room:joined', { identity, room: manager.roomView(result.room) })
      await broadcast(result.room)
    })
    on('player:reconnect', identitySchema, async (payload) => { const room = manager.reconnect(payload.roomId, payload.playerId, payload.playerToken); joinIdentity(socket, payload); socket.emit('player:reconnected', { identity: payload }); await broadcast(room) })
    on('room:ready', readySchema, async (payload) => { const room = manager.setReady(payload.roomId, payload.playerId, payload.playerToken, payload.ready); await broadcast(room) })
    on('room:start', startSchema, async (payload) => { const room = manager.start(payload.roomId, payload.playerId, payload.playerToken); await broadcast(room) })
    on('room:leave', leaveSchema, async (payload) => { const room = manager.leave(payload.roomId,payload.playerId,payload.playerToken); socket.leave(payload.roomId); sockets.delete(payload.playerId); delete socket.data.identity; if(manager.rooms.has(room.roomId))await broadcast(room) })
    on('room:kick', kickSchema, async (payload) => { const room=manager.kick(payload.roomId,payload.playerId,payload.playerToken,payload.targetPlayerId);const targetSocket=sockets.get(payload.targetPlayerId);if(targetSocket){io.to(targetSocket).emit('room:kicked',{roomId:payload.roomId});io.sockets.sockets.get(targetSocket)?.leave(payload.roomId);sockets.delete(payload.targetPlayerId)}await broadcast(room) })
    on('room:update-settings', updateSettingsSchema, async (payload) => { const room=manager.updateSettings(payload.roomId,payload.playerId,payload.playerToken,{turnDuration:payload.turnDuration,matchHands:payload.matchHands,fillBots:payload.fillBots,botReplacement:payload.botReplacement});await broadcast(room) })
    on('game:discard', discardSchema, async (payload) => { const identity = identityFor(socket); if (!identity || identity.roomId !== payload.roomId) throw new RoomFailure({ code: 'UNAUTHORIZED', message: 'Reconnect before playing.' }); const room = manager.command(payload.roomId, identity.playerId, payload.playerToken, { commandId: payload.commandId, type: 'discard', tileId: payload.tileId }); await broadcast(room) })
    on('game:claim', claimSchema, async (payload) => { const identity = identityFor(socket); if (!identity || identity.roomId !== payload.roomId) throw new RoomFailure({ code: 'UNAUTHORIZED', message: 'Reconnect before playing.' }); const room = manager.command(payload.roomId, identity.playerId, payload.playerToken, { commandId: payload.commandId, type: payload.claim, tileIds: payload.tileIds }); await broadcast(room) })
    on('game:request-sync', syncSchema, async (payload) => { const room = manager.require(payload.roomId); manager.authorize(room, payload.playerId, payload.playerToken); socket.emit('room:snapshot', manager.roomView(room)); const game = manager.playerView(room, payload.playerId); if (game) socket.emit('game:snapshot', game) })
    on('ping', identitySchema, (payload) => { manager.authorize(manager.require(payload.roomId), payload.playerId, payload.playerToken); socket.emit('pong', { serverTimestamp: Date.now() }) })
    socket.on('disconnect', async () => { const identity = identityFor(socket); if (!identity) return; sockets.delete(identity.playerId); manager.disconnect(identity.playerId); try { await broadcast(manager.require(identity.roomId)) } catch { /* room expired */ } })
  })

  let timer: NodeJS.Timeout | undefined
  let persistenceTimer: NodeJS.Timeout | undefined
  const start = () => new Promise<{ port: number; host: string; urls: string[] }>((resolve) => {
    httpServer.listen(port, host, () => {
      const address = httpServer.address(); const actualPort = typeof address === 'object' && address ? address.port : port
      timer = setInterval(() => { const versions = new Map([...manager.rooms].map(([code, room]) => [code, room.stateVersion])); manager.tick(); for (const [code, room] of manager.rooms) if (versions.get(code) !== room.stateVersion) void broadcast(room) }, options.tickMs ?? 250)
      if (options.persist !== false) persistenceTimer = setInterval(() => void saveRooms(dataDir, manager.exportRooms()), 10000)
      resolve({ port: actualPort, host, urls: privateLanAddresses(actualPort) })
    })
  })
  const stop = async () => { if (timer) clearInterval(timer); if (persistenceTimer) clearInterval(persistenceTimer); if (options.persist !== false) await saveRooms(dataDir, manager.exportRooms()); await io.close(); if (httpServer.listening) await new Promise<void>((resolve) => httpServer.close(() => resolve())) }
  return { app, io, httpServer, manager, start, stop }
}
