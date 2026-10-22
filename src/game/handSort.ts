import type { Honor, Tile } from './types'
import { compareTiles } from './tiles'

export type HandSortMode = 'suit-rank' | 'honors-first' | 'manual'
export interface HandSortPreferences { mode: HandSortMode; autoSortAfterDraw: boolean }

export const HAND_SORT_KEY='mahjong-club:hand-sort:v1'
export const DEFAULT_HAND_SORT:HandSortPreferences={mode:'suit-rank',autoSortAfterDraw:false}
const honorOrder:Record<Honor,number>={east:0,south:1,west:2,north:3,red:4,green:5,white:6}

export function loadHandSortPreferences():HandSortPreferences { try { const saved=JSON.parse(localStorage.getItem(HAND_SORT_KEY)??'null'); return saved&&['suit-rank','honors-first','manual'].includes(saved.mode)?{mode:saved.mode,autoSortAfterDraw:Boolean(saved.autoSortAfterDraw)}:DEFAULT_HAND_SORT } catch { return DEFAULT_HAND_SORT } }
export function saveHandSortPreferences(value:HandSortPreferences){localStorage.setItem(HAND_SORT_KEY,JSON.stringify(value))}

export function compareHandTiles(a:Tile,b:Tile,mode:HandSortMode){
  if(mode==='manual')return 0
  if(mode==='honors-first'){
    if(a.kind==='honor'&&b.kind!=='honor')return -1
    if(a.kind!=='honor'&&b.kind==='honor')return 1
    if(a.kind==='honor'&&b.kind==='honor')return honorOrder[a.honor!]-honorOrder[b.honor!]
  }
  return compareTiles(a,b)
}

export function orderHand(tiles:Tile[],mode:HandSortMode,lastDrawnTileId?:string,separateDrawn=true){
  if(mode==='manual')return [...tiles]
  const indexed=tiles.map((tile,index)=>({tile,index})),drawn=separateDrawn?indexed.find(({tile})=>tile.id===lastDrawnTileId):undefined
  const base=indexed.filter(({tile})=>tile.id!==drawn?.tile.id).sort((a,b)=>compareHandTiles(a.tile,b.tile,mode)||a.index-b.index).map(({tile})=>tile)
  return drawn?[...base,drawn.tile]:base
}
