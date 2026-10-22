import { beforeEach, describe, expect, it, vi } from 'vitest'
import { buildPublicDiscards } from '../discards'
import { compareHandTiles, loadHandSortPreferences, orderHand, saveHandSortPreferences } from '../handSort'
import type { GameEvent, PlayerState, Tile } from '../types'

const tile=(id:string,kind:Tile['kind']='suit',rank=1):Tile=>kind==='suit'?{id,kind,suit:'characters',rank}:kind==='honor'?{id,kind,honor:id.includes('east')?'east':'red'}:{id,kind,bonus:'plum'}
const players:PlayerState[]=['east','south','west','north'].map((seat,index)=>({id:`p${index}`,name:['Ananya','Meera','Kabir','Dev'][index],seat:seat as PlayerState['seat'],isHuman:index===0,score:30000,hand:[],flowers:[],melds:[],discards:[]}))

describe('shared discard river model',()=>{
  it('keeps authoritative chronological order and appends new discards',()=>{
    const history:GameEvent[]=[{id:1,type:'discard',message:'',playerIndex:1,tile:tile('characters-2-0','suit',2)},{id:2,type:'pass',message:''},{id:3,type:'discard',message:'',playerIndex:2,tile:tile('characters-7-0','suit',7)}]
    const river=buildPublicDiscards(history,players)
    expect(river.map(item=>item.id)).toEqual(['characters-2-0','characters-7-0'])
    expect(river.map(item=>item.turnNumber)).toEqual([1,2])
    expect(river[1]).toMatchObject({playerId:'p2',playerName:'Kabir',seatWind:'west'})
  })
  it('preserves a claimed tile and identifies its claimant',()=>{
    const discarded=tile('characters-3-0','suit',3)
    const history:GameEvent[]=[{id:1,type:'discard',message:'',playerIndex:0,tile:discarded},{id:2,type:'pong',message:'',playerIndex:3,tile:discarded}]
    expect(buildPublicDiscards(history,players)[0]).toMatchObject({id:discarded.id,claimed:true,claimedBy:'Dev'})
  })
})

describe('local hand sorting',()=>{
  beforeEach(()=>{const memory=new Map<string,string>();vi.stubGlobal('localStorage',{getItem:(key:string)=>memory.get(key)??null,setItem:(key:string,value:string)=>memory.set(key,value),removeItem:(key:string)=>memory.delete(key)})})
  const duplicateA=tile('characters-2-0','suit',2),duplicateB=tile('characters-2-1','suit',2),east=tile('honor-east-0','honor'),red=tile('honor-red-0','honor'),one=tile('characters-1-0','suit',1)
  it('sorts by suit and rank without changing physical IDs',()=>{
    const input=[duplicateA,east,one,duplicateB],ordered=orderHand(input,'suit-rank',undefined,false)
    expect(ordered.map(item=>item.id)).toEqual([one.id,duplicateA.id,duplicateB.id,east.id])
    expect(new Set(ordered.map(item=>item.id))).toEqual(new Set(input.map(item=>item.id)))
  })
  it('sorts honors in the canonical order and keeps duplicates stable',()=>{
    const ordered=orderHand([red,duplicateB,east,duplicateA],'honors-first',undefined,false)
    expect(ordered.map(item=>item.id)).toEqual([east.id,red.id,duplicateB.id,duplicateA.id])
    expect(compareHandTiles(east,red,'honors-first')).toBeLessThan(0)
  })
  it('keeps the newest draw separated until an explicit sort',()=>{
    expect(orderHand([duplicateA,east,one],'suit-rank',one.id,true).at(-1)?.id).toBe(one.id)
    expect(orderHand([duplicateA,east,one],'suit-rank',one.id,false).map(item=>item.id)).toEqual([one.id,duplicateA.id,east.id])
  })
  it('manual mode preserves the supplied order',()=>expect(orderHand([east,one,duplicateA],'manual')).toEqual([east,one,duplicateA]))
  it('persists the auto-sort preference locally',()=>{saveHandSortPreferences({mode:'honors-first',autoSortAfterDraw:true});expect(loadHandSortPreferences()).toEqual({mode:'honors-first',autoSortAfterDraw:true})})
})
