import { z } from 'zod'
import type { ClaimType, GamePhase, Meld, ScoreItem, Tile } from '../game/types'
import type { PublicDiscard } from '../game/discards'

export const commandBase = z.object({ commandId:z.string().min(8).max(100), roomId:z.string().length(6), playerToken:z.string().min(24).max(200) })
export const createRoomSchema=z.object({displayName:z.string().trim().min(1).max(20),roomName:z.string().trim().min(1).max(40),turnDuration:z.number().int().min(10).max(120),matchHands:z.number().int().min(1).max(16),rulesPreset:z.literal('Taiwanese Practice v1'),fillBots:z.boolean(),botReplacement:z.boolean(),password:z.string().max(40).optional()})
export const joinRoomSchema=z.object({roomCode:z.string().length(6),displayName:z.string().trim().min(1).max(20),seat:z.number().int().min(0).max(3).optional(),password:z.string().max(40).optional()})
export const identitySchema=z.object({roomId:z.string().length(6),playerId:z.string().min(8),playerToken:z.string().min(24)})
export const readySchema=identitySchema.extend({ready:z.boolean()})
export const startSchema=identitySchema
export const leaveSchema=identitySchema
export const kickSchema=identitySchema.extend({targetPlayerId:z.string().min(8)})
export const updateSettingsSchema=identitySchema.extend({turnDuration:z.number().int().min(10).max(120).optional(),matchHands:z.number().int().min(1).max(16).optional(),fillBots:z.boolean().optional(),botReplacement:z.boolean().optional()})
export const discardSchema=commandBase.extend({tileId:z.string().min(1)})
export const claimSchema=commandBase.extend({claim:z.enum(['win','kong','pong','chow','pass']),tileIds:z.array(z.string()).max(3).optional()})
export const syncSchema=identitySchema

export type ConnectionState='connected'|'reconnecting'|'bot-controlling'|'disconnected'
export interface PublicPlayerView {playerId:string;displayName:string;seatIndex:number;seatWind:string;score:number;isHost:boolean;isBot:boolean;ready:boolean;connection:ConnectionState;concealedCount:number;hand?:Tile[];flowers:Tile[];melds:Meld[];discards:Tile[];latestAction?:string}
export interface PlayerGameView {matchId:string;handId:string;stateVersion:number;lastEventSequence:number;serverTimestamp:number;phase:GamePhase;players:PublicPlayerView[];dealerIndex:number;currentPlayerIndex:number;roundWind:string;handNumber:number;completedHands:number;wallCount:number;latestDiscard:{tile:Tile;playerIndex:number}|null;lastDrawnTileId?:string;publicDiscards:PublicDiscard[];legalActions:Array<{type:ClaimType|'discard';tileIds?:string[]}>;result?:{winnerIndex:number|null;selfDraw:boolean;items:ScoreItem[];totalTai:number;reason:string};events:Array<{sequence:number;type:string;message:string;timestamp:number}>;timer?:TimerView}
export interface TimerView {kind:'turn'|'claim';startedAt:number;deadline:number;serverTimestamp:number}
export interface RoomPlayerView {playerId:string;displayName:string;seatIndex:number;isHost:boolean;isBot:boolean;ready:boolean;connection:ConnectionState;quality:'good'|'fair'|'offline'}
export interface RoomView {roomId:string;roomName:string;hostPlayerId:string;rulesPreset:string;turnDuration:number;matchHands:number;fillBots:boolean;botReplacement:boolean;hasPassword:boolean;createdAt:number;players:RoomPlayerView[];started:boolean;lanUrls:string[]}
export interface StructuredError {code:'INVALID_PAYLOAD'|'ROOM_NOT_FOUND'|'ROOM_FULL'|'NAME_TAKEN'|'NOT_HOST'|'NOT_READY'|'UNAUTHORIZED'|'ILLEGAL_ACTION'|'DUPLICATE_COMMAND'|'RATE_LIMITED'|'BAD_PASSWORD';message:string;commandId?:string}

export const TOKEN_STORAGE_KEY='mahjong-club:lan-identity:v1'
export const makeCommandId=()=>globalThis.crypto.randomUUID()
