import { AnimatePresence, motion } from 'framer-motion'
import { Crown, Expand, History, LogOut, Settings2, Shrink, Undo2, Wifi } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ClaimOption, GameState, Tile } from '../../game/types'
import { presentTile } from '../../game/presentation'
import { Button } from '../Button'
import { buildPublicDiscards } from '../../game/discards'
import { loadHandSortPreferences, orderHand, saveHandSortPreferences, type HandSortPreferences } from '../../game/handSort'
import { MahjongTile } from '../mahjong/MahjongTile'
import { HandSortControl } from './HandSortControl'
import { SharedDiscardRiver } from './SharedDiscardRiver'
import { PracticeTurnTimer } from './PracticeTurnTimer'
import { TableLogDrawer } from './TableLogDrawer'

type Props = {
  state: GameState; selected: string | null; onSelect: (id:string)=>void; humanTurn:boolean; claims:ClaimOption[];
  onDiscard:()=>void; onDoubleDiscard:(tile:Tile)=>void; onClaim:(claim:ClaimOption|null)=>void; onWin:()=>void; onKong:()=>void;
  canWin:boolean; canKong:boolean; undoAvailable:boolean; onUndo:()=>void; paused:boolean; highContrast:boolean; onPause:()=>void; onSettings:()=>void; onLeave:()=>void;
}

export function PracticeBoard(props: Props) {
  const {state}=props; const human=state.players[0]
  const [logOpen,setLogOpen]=useState(false); const [unread,setUnread]=useState(0); const [toast,setToast]=useState<string|null>(null); const [fullscreen,setFullscreen]=useState(Boolean(document.fullscreenElement))
  const [sortPreferences,setSortPreferences]=useState(loadHandSortPreferences); const [sortedDrawId,setSortedDrawId]=useState<string>()
  const seenHistory=useRef(state.history.length); const logButton=useRef<HTMLButtonElement>(null); const handRack=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(state.history.length<=seenHistory.current)return
    const count=state.history.length-seenHistory.current; const latest=state.history.at(-1); seenHistory.current=state.history.length
    if(!logOpen)setUnread((value)=>value+count)
    if(latest){setToast(latest.message);const timer=window.setTimeout(()=>setToast(null),2400);return()=>clearTimeout(timer)}
  },[state.history,logOpen])
  useEffect(()=>{ if(state.lastDrawnTileId) handRack.current?.querySelector(`[data-tile-id="${state.lastDrawnTileId}"]`)?.scrollIntoView({inline:'end',block:'nearest',behavior:'smooth'}) },[state.lastDrawnTileId])
  useEffect(()=>{const sync=()=>setFullscreen(Boolean(document.fullscreenElement));document.addEventListener('fullscreenchange',sync);return()=>document.removeEventListener('fullscreenchange',sync)},[])
  const openLog=()=>{setLogOpen(true);setUnread(0)}; const closeLog=()=>{setLogOpen(false);window.setTimeout(()=>logButton.current?.focus(),0)}
  const toggleFullscreen=async()=>{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}
  const active=state.players[state.currentPlayerIndex]
  const separateDrawn=Boolean(state.lastDrawnTileId)&&!sortPreferences.autoSortAfterDraw&&sortedDrawId!==state.lastDrawnTileId
  const orderedHand=orderHand(human.hand,sortPreferences.mode,state.lastDrawnTileId,separateDrawn)
  const discards=useMemo(()=>buildPublicDiscards(state.history,state.players,state.result,state.latestDiscard),[state.history,state.players,state.result,state.latestDiscard])
  const updateSortPreferences=(next:HandSortPreferences)=>{setSortPreferences(next);saveHandSortPreferences(next)}
  const sortNow=()=>{if(sortPreferences.mode==='manual')updateSortPreferences({...sortPreferences,mode:'suit-rank'});setSortedDrawId(state.lastDrawnTileId??`turn-${state.history.length}`)}
  const instruction=props.humanTurn?(props.selected?'Selected — discard or choose another tile.':'Your turn — choose a tile to discard.'):props.claims.length?'Claim the discarded tile?':state.phase==='awaiting-claim'?'Waiting for other players…':`${active.name} is thinking…`
  const theme=state.settings.theme==='Jaipur Courtyard'?'board-jaipur':state.settings.theme==='Mumbai Monsoon'?'board-mumbai':state.settings.theme==='Chennai Club'?'board-chennai':'board-peacock'
  return <main className="h-dvh overflow-hidden bg-[#0c1120] text-ivory" aria-live="off">
    <header className="flex h-14 items-center justify-between gap-2 border-b border-ivory/10 bg-midnight px-2.5 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-marigold/35 bg-peacock text-xs font-black text-marigold">東</div><div className="min-w-0"><p className="truncate text-[10px] font-black uppercase tracking-[.12em] text-marigold sm:text-xs">Monsoon Mahjong</p><p className="truncate text-[10px] font-bold text-ivory/55">{state.roundWind} round · Hand {state.handNumber} · Dealer {state.players[state.dealerIndex].name}</p></div></div>
      <div className="hidden items-center gap-2 lg:flex"><Status label="Wall" value={String(state.wall.length)}/><Status label="Turn" value={active.isHuman?'Your turn':active.name}/><PracticeTurnTimer key={`${state.currentPlayerIndex}-${state.history.length}`} turnKey={`${state.currentPlayerIndex}-${state.history.length}`} paused={props.paused}/></div>
      <div className="flex shrink-0 items-center gap-1"><button onClick={props.onPause} className="status-action" aria-label={props.paused?'Resume':'Pause'}>{props.paused?'Resume':'Pause'}</button><button ref={logButton} onClick={openLog} className="status-action relative" aria-label={`Table Log${unread?`, ${unread} unread`:''}`}><History/><span className="hidden sm:inline">Table Log</span>{unread>0&&<span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-midnight bg-terracotta px-1 text-[9px] font-black text-white">{Math.min(99,unread)}</span>}</button><button onClick={props.onSettings} className="status-action" aria-label="Settings"><Settings2/></button><button onClick={toggleFullscreen} className="status-action hidden sm:inline-flex" aria-label={fullscreen?'Exit full screen':'Full screen'}>{fullscreen?<Shrink/>:<Expand/>}</button><button onClick={props.onLeave} className="status-action" aria-label="Leave table"><LogOut/></button></div>
    </header>
    <section className={`game-board jaali-pattern ${theme}`} aria-label="Mahjong table">
      <div className="opponent-row">{[3,2,1].map((index)=><OpponentPanel key={index} state={state} index={index} highContrast={props.highContrast}/>)}</div>
      <div className="center-play"><SharedDiscardRiver discards={discards} status={instruction} meta={`${state.wall.length} live tiles · Hand ${state.handNumber}/${state.settings.matchHands}`} highContrast={props.highContrast}/></div>
      <div className={`human-zone ${props.humanTurn?'human-zone--active':''}`}>
        <div className="human-meta"><div className="flex min-w-0 items-center gap-2"><span className="seat-avatar">{human.seat.slice(0,1).toUpperCase()}</span><div className="min-w-0"><div className="flex items-center gap-1.5"><b className="truncate text-sm">{human.name}</b>{state.dealerIndex===0&&<span className="dealer-badge"><Crown/>Dealer</span>}<span className="flex items-center gap-1 text-[10px] text-emerald"><Wifi size={11}/>Connected</span></div><p className="tabular text-[11px] text-ivory/55">{human.seat} seat · {human.score.toLocaleString('en-IN')} points</p></div></div><PublicTiles player={human} highContrast={props.highContrast}/></div>
        <div className="hand-toolbar"><div><b>Your Hand</b><span>{human.hand.length} tiles</span>{sortPreferences.autoSortAfterDraw&&<em>Auto-sort on</em>}</div><HandSortControl preferences={sortPreferences} onChange={updateSortPreferences} onSort={sortNow}/></div>
        <div className="action-row"><p className="min-w-0 flex-1 truncate text-xs font-bold text-ivory/65">{instruction}</p>{props.undoAvailable&&<button className="compact-action" onClick={props.onUndo}><Undo2/>Undo <kbd>U</kbd></button>}{props.humanTurn&&<Button className="h-11 min-h-11 px-5" onClick={props.onDiscard} disabled={!props.selected}>Discard <kbd>D</kbd></Button>}{props.canWin&&<button className="win-action" onClick={props.onWin}>Win <kbd>W</kbd></button>}{props.canKong&&<button className="compact-action" onClick={props.onKong}>Kong</button>}{props.claims.map((option,i)=><Button className="h-11 min-h-11 px-4 capitalize" key={`${option.type}-${i}`} onClick={()=>props.onClaim(option)}>{option.type}</Button>)}{props.claims.length>0&&<button className="compact-action" onClick={()=>props.onClaim(null)}>Pass <kbd>P</kbd></button>}</div>
        <div ref={handRack} className="hand-rack" role="group" aria-label="Your Mahjong hand" onKeyDown={(event)=>{if(!['ArrowLeft','ArrowRight'].includes(event.key))return;const buttons=[...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];const current=buttons.indexOf(document.activeElement as HTMLButtonElement);if(current<0)return;event.preventDefault();buttons[Math.max(0,Math.min(buttons.length-1,current+(event.key==='ArrowRight'?1:-1)))]?.focus()}}><div className="hand-rack-shadow"/>{orderedHand.map((tile)=><span key={tile.id} data-tile-id={tile.id} className="inline-flex shrink-0"><MahjongTile tile={presentTile(tile,tile.id===state.lastDrawnTileId)} variant="hand" highContrast={props.highContrast} selected={props.selected===tile.id} disabled={!props.humanTurn} onClick={()=>props.onSelect(tile.id)} onDoubleClick={state.settings.doubleClickDiscard&&props.humanTurn?()=>props.onDoubleDiscard(tile):undefined}/></span>)}</div>
      </div>
    </section>
    <AnimatePresence>{toast&&!logOpen&&<motion.div role="status" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="action-toast">{toast}</motion.div>}</AnimatePresence>
    <div className="sr-only" aria-live="polite">{state.history.at(-1)?.message} {active.isHuman?'Your turn.':`${active.name}'s turn.`}</div>
    <TableLogDrawer open={logOpen} onClose={closeLog} state={state}/>
  </main>
}

function Status({label,value}:{label:string;value:string}) { return <span className="status-chip"><small>{label}</small><b>{value}</b></span> }
function OpponentPanel({state,index,highContrast}:{state:GameState;index:number;highContrast:boolean}) { const player=state.players[index]; const active=state.currentPlayerIndex===index&&!state.phase.includes('complete'); const latest=[...state.history].reverse().find((event)=>event.playerIndex===index); return <article className={`opponent-panel ${active?'opponent-panel--active':''}`}><div className="flex items-center gap-2"><span className="seat-avatar">{player.seat.slice(0,1).toUpperCase()}</span><div className="min-w-0"><div className="flex items-center gap-1"><b className="truncate text-xs sm:text-sm">{player.name}</b>{index===state.dealerIndex&&<Crown className="text-marigold" size={13}/>}<span className="h-1.5 w-1.5 rounded-full bg-emerald" aria-label="Connected"/></div><p className="tabular text-[10px] text-ivory/50">{player.score.toLocaleString('en-IN')} · {player.hand.length} concealed</p></div>{active&&<span className="turn-dot"/>}</div><div className="opponent-backs" aria-label={`${player.hand.length} concealed tiles`}>{Array.from({length:Math.min(player.hand.length,17)},(_,i)=><MahjongTile key={i} tile={{id:`back-${index}-${i}`,suit:'wind',value:'',label:'Concealed tile'}} variant="opponent" faceDown/>)}</div><PublicTiles player={player} compact highContrast={highContrast}/><p className="latest-action">{latest?.message??'Waiting to play'}</p></article> }
function PublicTiles({player,compact=false,highContrast=false}:{player:GameState['players'][number];compact?:boolean;highContrast?:boolean}) { return <div className={`public-tiles ${compact?'public-tiles--compact':''}`}><div><span>Flowers</span>{player.flowers.length?<div className="flex gap-0.5">{player.flowers.map((tile)=><MahjongTile key={tile.id} tile={presentTile(tile)} variant="flower" highContrast={highContrast}/>)}</div>:<em>None</em>}</div><div><span>Melds</span>{player.melds.length?<div className="flex gap-1">{player.melds.map((meld,i)=><div className="flex gap-0.5" key={i}>{meld.tiles.map((tile)=><MahjongTile key={tile.id} tile={presentTile(tile)} variant="meld" highContrast={highContrast}/>)}</div>)}</div>:<em>None</em>}</div></div> }
