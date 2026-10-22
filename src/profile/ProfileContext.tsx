/* oxlint-disable react/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { GameState } from '../game/types'
import { createProfile } from './progression'
import type { PlayerProfile, ProgressionSummary } from './types'

const PLAYER_ID='p1',DISPLAY_NAME='Ananya Rao'
interface Value{profile:PlayerProfile;loading:boolean;refresh:()=>Promise<void>;processPractice:(state:GameState,snapshots:GameState[])=>Promise<ProgressionSummary>}
const Context=createContext<Value|null>(null)
export function ProfileProvider({children}:{children:ReactNode}){const [profile,setProfile]=useState(()=>createProfile(PLAYER_ID,DISPLAY_NAME)),[loading,setLoading]=useState(true)
  const refresh=useCallback(async()=>{try{const response=await fetch(`/api/profile/${PLAYER_ID}?displayName=${encodeURIComponent(DISPLAY_NAME)}`);if(response.ok)setProfile(await response.json() as PlayerProfile)}finally{setLoading(false)}},[])
  useEffect(()=>{void refresh()},[refresh])
  const processPractice=useCallback(async(state:GameState,snapshots:GameState[])=>{const response=await fetch('/api/profile/process-practice',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({playerId:PLAYER_ID,displayName:DISPLAY_NAME,gameState:state,snapshots})});const value=await response.json() as {profile?:PlayerProfile;summary?:ProgressionSummary;message?:string};if(!response.ok||!value.profile||!value.summary)throw new Error(value.message??'Progression could not be saved.');setProfile(value.profile);sessionStorage.setItem(`mahjong-club:progression:${value.summary.matchId}`,JSON.stringify(value.summary));return value.summary},[])
  return <Context.Provider value={{profile,loading,refresh,processPractice}}>{children}</Context.Provider>}
export function useProfile(){const value=useContext(Context);if(!value)throw new Error('useProfile must be inside ProfileProvider');return value}
