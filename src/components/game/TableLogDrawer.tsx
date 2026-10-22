import { AnimatePresence, motion } from 'framer-motion'
import { Pin, PinOff, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { GameEvent, GameState } from '../../game/types'

const PIN_KEY = 'mahjong-club:ledger-pinned:v1'

function groupedEvents(events: GameEvent[]) {
  const groups: Array<{ id: number; message: string; type: string }> = []
  for (let i = 0; i < events.length; i++) {
    const current = events[i]; const next = events[i+1]; const after = events[i+2]
    if (current.type === 'draw' && next?.type === 'discard' && after?.type === 'pass' && current.playerIndex === next.playerIndex) {
      groups.push({ id: current.id, type: 'turn', message: `${next.message.replace(' discards ', ' drew and discarded ')} No claim.` }); i += 2
    } else groups.push({ id: current.id, type: current.type, message: current.message })
  }
  return groups.slice(-18).reverse()
}

export function TableLogDrawer({ open, onClose, state }: { open: boolean; onClose: () => void; state: GameState }) {
  const [pinned, setPinned] = useState(() => localStorage.getItem(PIN_KEY) === '1')
  const [clearedThrough, setClearedThrough] = useState(-1)
  const drawerRef = useRef<HTMLElement>(null); const timerRef = useRef<number | null>(null); const hovering = useRef(false); const keyboardActive = useRef(false)
  const events = useMemo(() => groupedEvents(state.history.filter((event) => event.id > clearedThrough)), [state.history, clearedThrough])
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!pinned && open && !hovering.current && !keyboardActive.current) timerRef.current = window.setTimeout(onClose, 10000)
  }, [open, pinned, onClose])
  useEffect(() => { if (open) resetTimer(); return () => { if (timerRef.current) clearTimeout(timerRef.current) } }, [open, resetTimer])
  useEffect(() => {
    if (!open) return
    const drawer = drawerRef.current; const focusables = drawer?.querySelectorAll<HTMLElement>('button,[href],select,[tabindex]:not([tabindex="-1"])'); focusables?.[0]?.focus(); resetTimer()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && focusables?.length) { const first=focusables[0], last=focusables[focusables.length-1]; if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()} else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()} }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, resetTimer])
  const togglePin = () => { const next=!pinned; setPinned(next); localStorage.setItem(PIN_KEY,next?'1':'0'); resetTimer() }
  const important = (type:string) => ['win','kong','pong','chow','flower','hand-start'].includes(type)
  return <AnimatePresence>{open&&<><motion.button aria-label="Close Table Log" className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-[2px]" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}/><motion.aside ref={drawerRef} role="dialog" aria-modal="true" aria-label="Table Log" onPointerEnter={()=>{hovering.current=true;if(timerRef.current)clearTimeout(timerRef.current)}} onPointerLeave={()=>{hovering.current=false;resetTimer()}} onKeyDownCapture={()=>{keyboardActive.current=true;if(timerRef.current)clearTimeout(timerRef.current)}} onBlurCapture={(event)=>{if(!event.currentTarget.contains(event.relatedTarget as Node)){keyboardActive.current=false;resetTimer()}}} onScroll={resetTimer} onPointerDown={resetTimer} className="fixed inset-y-0 right-0 z-[90] flex w-[min(94vw,390px)] flex-col border-l border-marigold/25 bg-[#11182a] shadow-2xl" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:28,stiffness:320}}>
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-ivory/10 px-4"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-marigold">Game ledger</p><h2 className="text-lg font-extrabold text-ivory">Table Log</h2></div><div className="flex gap-1"><button className="table-icon hidden md:grid" onClick={togglePin} aria-label={pinned?'Unpin Table Log':'Pin Table Log'} title={pinned?'Unpin':'Pin'}>{pinned?<PinOff/>:<Pin/>}</button><button className="table-icon" onClick={()=>setClearedThrough(state.history.at(-1)?.id??-1)} aria-label="Clear displayed log" title="Clear display"><Trash2/></button><button className="table-icon" onClick={onClose} aria-label="Close Table Log"><X/></button></div></header>
    <div className="min-h-0 flex-1 overflow-y-auto p-5" onWheel={resetTimer}>
      <LogSection title="Recent actions">{events.length?events.map((event)=><div key={event.id} className={`rounded-xl border p-3 ${important(event.type)?'border-marigold/30 bg-marigold/8':'border-ivory/8 bg-ivory/[.025]'}`}><p className="text-xs leading-5 text-ivory/72">{event.message}</p></div>):<Muted>Log cleared for this view.</Muted>}</LogSection>
      <LogSection title="Exposed sets">{state.players.map((p)=><Summary key={p.id} name={p.name} value={p.melds.map((m)=>m.type).join(', ')||'None'}/>)}</LogSection>
      <LogSection title="Flowers">{state.players.map((p)=><Summary key={p.id} name={p.name} value={p.flowers.length?`${p.flowers.length} revealed`:'None'}/>)}</LogSection>
      <LogSection title="Hand information"><Summary name="Round" value={`${state.roundWind} · Hand ${state.handNumber}`}/><Summary name="Dealer" value={state.players[state.dealerIndex].name}/><Summary name="Live wall" value={`${state.wall.length} tiles`}/></LogSection>
    </div>
    {!pinned&&<p className="shrink-0 border-t border-ivory/8 px-5 py-3 text-[10px] text-ivory/35">Closes after 10 seconds of inactivity</p>}
  </motion.aside></>}</AnimatePresence>
}

function LogSection({title,children}:{title:string;children:React.ReactNode}) { return <section className="mb-7"><h3 className="mb-3 text-[10px] font-black uppercase tracking-[.18em] text-ivory/38">{title}</h3><div className="space-y-2">{children}</div></section> }
function Summary({name,value}:{name:string;value:string}) { return <div className="flex justify-between gap-4 text-xs"><b className="text-ivory/72">{name}</b><span className="capitalize text-right text-ivory/42">{value}</span></div> }
function Muted({children}:{children:React.ReactNode}) { return <p className="rounded-xl border border-dashed border-ivory/12 p-4 text-center text-xs text-ivory/35">{children}</p> }
