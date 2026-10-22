import { createContext, useContext } from 'react'
import type { PlayerGameView, RoomView, StructuredError } from './protocol'

export interface LanIdentity { roomId: string; playerId: string; playerToken: string }
export interface CreateOptions { displayName: string; roomName: string; turnDuration: number; matchHands: number; fillBots: boolean; botReplacement: boolean; password?: string }
export interface LanState { connected:boolean; identity?:LanIdentity; room?:RoomView; game?:PlayerGameView; error?:StructuredError; joinUrl?:string; qrDataUrl?:string; createRoom:(options:CreateOptions)=>void;joinRoom:(roomCode:string,displayName:string,password?:string)=>void;setReady:(ready:boolean)=>void;startGame:()=>void;discard:(tileId:string)=>void;claim:(claim:'win'|'kong'|'pong'|'chow'|'pass',tileIds?:string[])=>void;clearError:()=>void;leave:()=>void }

export const LanContext=createContext<LanState|null>(null)

export function useLan(){const value=useContext(LanContext);if(!value)throw new Error('useLan must be used within LanProvider');return value}
