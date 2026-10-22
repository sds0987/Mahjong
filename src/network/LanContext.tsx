import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { io, type Socket } from 'socket.io-client'
import { makeCommandId, TOKEN_STORAGE_KEY, type PlayerGameView, type RoomView, type StructuredError } from './protocol'
import { LanContext, type LanIdentity, type LanState } from './LanState'

function storedIdentity():LanIdentity|undefined { try { return JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY)??'null')??undefined } catch { return undefined } }
function serverUrl(){return import.meta.env.VITE_LAN_SERVER_URL||(import.meta.env.DEV?`${window.location.protocol}//${window.location.hostname}:3000`:window.location.origin)}

export function LanProvider({children}:{children:ReactNode}){
  const socketRef=useRef<Socket|null>(null),versionRef=useRef(0)
  const [connected,setConnected]=useState(false),[identity,setIdentity]=useState<LanIdentity|undefined>(storedIdentity)
  const [room,setRoom]=useState<RoomView>(),[game,setGame]=useState<PlayerGameView>(),[error,setError]=useState<StructuredError>(),[joinUrl,setJoinUrl]=useState<string>(),[qrDataUrl,setQrDataUrl]=useState<string>()
  const saveIdentity=useCallback((next:LanIdentity)=>{setIdentity(next);localStorage.setItem(TOKEN_STORAGE_KEY,JSON.stringify(next))},[])
  useEffect(()=>{const socket=io(serverUrl(),{transports:['websocket','polling']});socketRef.current=socket
    socket.on('connect',()=>{setConnected(true);const saved=storedIdentity();if(saved)socket.emit('player:reconnect',saved)})
    socket.on('disconnect',()=>setConnected(false));socket.on('server:error',(value:StructuredError)=>setError(value))
    socket.on('room:created',(value:{identity:LanIdentity;room:RoomView;joinUrl:string;qrDataUrl:string})=>{saveIdentity(value.identity);setRoom(value.room);setJoinUrl(value.joinUrl);setQrDataUrl(value.qrDataUrl)})
    socket.on('room:joined',(value:{identity:LanIdentity;room:RoomView})=>{saveIdentity(value.identity);setRoom(value.room)})
    socket.on('room:snapshot',(value:RoomView)=>setRoom(value))
    socket.on('game:snapshot',(value:PlayerGameView)=>{if(versionRef.current&&value.stateVersion>versionRef.current+2){const saved=storedIdentity();if(saved)socket.emit('game:request-sync',saved)}versionRef.current=value.stateVersion;setGame(value)})
    return()=>{socket.disconnect();socketRef.current=null}},[saveIdentity])
  const emitIdentity=useCallback((event:string,extra:Record<string,unknown>={})=>{if(identity)socketRef.current?.emit(event,{...identity,...extra})},[identity])
  const value=useMemo<LanState>(()=>({connected,identity,room,game,error,joinUrl,qrDataUrl,
    createRoom:(options)=>socketRef.current?.emit('room:create',{...options,rulesPreset:'Taiwanese Practice v1'}),
    joinRoom:(roomCode,displayName,password)=>socketRef.current?.emit('room:join',{roomCode:roomCode.toUpperCase(),displayName,password:password||undefined}),
    setReady:(ready)=>emitIdentity('room:ready',{ready}),startGame:()=>emitIdentity('room:start'),
    discard:(tileId)=>emitIdentity('game:discard',{commandId:makeCommandId(),tileId}),claim:(claim,tileIds)=>emitIdentity('game:claim',{commandId:makeCommandId(),claim,tileIds}),
    clearError:()=>setError(undefined),leave:()=>{if(identity)socketRef.current?.emit('room:leave',identity);localStorage.removeItem(TOKEN_STORAGE_KEY);setIdentity(undefined);setRoom(undefined);setGame(undefined)}
  }),[connected,identity,room,game,error,joinUrl,qrDataUrl,emitIdentity])
  return <LanContext.Provider value={value}>{children}</LanContext.Provider>
}
