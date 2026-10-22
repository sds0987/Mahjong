import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, History, RotateCcw, Trophy } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { PracticeBoard } from '../components/game/PracticeBoard'
import { Modal } from '../components/ui/Modal'
import { botView, chooseBotDiscard } from '../game/bots'
import { TUTORIAL_KEY } from '../game/constants'
import { applyClaim, canHumanWin, canPlayerWin, createGame, declareConcealedKong, declareWin, discardTile, humanClaimOptions, resolveBotClaims, startNextHand } from '../game/engine'
import { clearGame, loadGame, saveGame } from '../game/persistence'
import type { ClaimOption, GameSettings, GameSpeed, GameState, Tile } from '../game/types'
import { PracticeSetup } from '../components/game/PracticeSetup'
import { useApp } from '../context/AppContext'
import { useProfile } from '../profile/ProfileContext'

const tutorial = [
  ['Your hand', 'Build five sets and one pair. You begin with 16 tiles and draw before discarding.'],
  ['Draw and discard', 'Select one ivory tile, then press Discard. The separated tile is your latest draw.'],
  ['Calls', 'Chow uses a sequence and only follows the player before you. Pong and kong can answer any player.'],
  ['Flowers', 'Flowers and seasons remain public beside each seat and are replaced automatically.'],
  ['Winning', 'Win appears only when the rules engine confirms five sets and a pair.'],
  ['The ledger', 'Open Table Log for recent actions. Public melds and flowers remain visible on the table.'],
]
const speedMs:Record<GameSpeed,number>={slow:1050,normal:560,fast:180}

export function PracticePage() {
  const navigate=useNavigate(); const location=useLocation(); const {highContrast,setHighContrast}=useApp(); const {processPractice}=useProfile(); const [saved]=useState(()=>loadGame())
  const [state,setState]=useState<GameState|null>(()=>location.pathname.endsWith('/resume')?loadGame():null); const [selected,setSelected]=useState<string|null>(null)
  const [paused,setPaused]=useState(false); const [tutorialStep,setTutorialStep]=useState(()=>localStorage.getItem(TUTORIAL_KEY)?-1:0); const [settingsOpen,setSettingsOpen]=useState(false); const [undoState,setUndoState]=useState<GameState|null>(null); const snapshots=useRef<GameState[]>([])
  const processedMatch=useRef<string|null>(null);const [progressError,setProgressError]=useState<string>()
  const update=useCallback((next:GameState)=>{setState(next);saveGame(next);snapshots.current.push(next);localStorage.setItem(`mahjong-club:replay:${next.id}`,JSON.stringify(snapshots.current.slice(-500)))},[])
  const start=(settings:GameSettings)=>{clearGame();snapshots.current=[];update(createGame(settings));setSelected(null);navigate('/practice/resume',{replace:true})}
  useEffect(()=>{
    if(!state||paused||tutorialStep>=0||state.phase==='hand-complete'||state.phase==='match-complete')return
    const humanClaims=humanClaimOptions(state); if(state.phase==='awaiting-claim'&&humanClaims.length)return; if(state.phase==='awaiting-discard'&&state.currentPlayerIndex===0)return
    const timer=window.setTimeout(()=>{if(state.phase==='awaiting-claim')update(resolveBotClaims(state));else if(state.phase==='awaiting-discard'){if(canPlayerWin(state,state.currentPlayerIndex))update(declareWin(state,state.currentPlayerIndex,true));else update(discardTile(state,state.currentPlayerIndex,chooseBotDiscard(botView(state,state.currentPlayerIndex)).id))}setUndoState(null)},speedMs[state.settings.speed]);return()=>clearTimeout(timer)
  },[state,paused,tutorialStep,update])
  useEffect(()=>{if(state?.phase!=='match-complete'||processedMatch.current===state.id)return;processedMatch.current=state.id;processPractice(state,snapshots.current).then(()=>navigate(`/match/${state.id}/results`,{state:{settings:state.settings}})).catch(error=>setProgressError(error instanceof Error?error.message:'Progression could not be saved.'))},[state,processPractice,navigate])
  const playDiscard=useCallback(()=>{if(!state||!selected||state.currentPlayerIndex!==0||state.phase!=='awaiting-discard')return;const tile=state.players[0].hand.find((item)=>item.id===selected);if(!tile)return;setUndoState(state);update(discardTile(state,0,tile.id));setSelected(null)},[state,selected,update])
  useEffect(()=>{
    if(!state)return
    const onKey=(event:KeyboardEvent)=>{if(event.target instanceof HTMLInputElement||event.target instanceof HTMLSelectElement)return;if(event.key.toLowerCase()==='d'&&selected&&state.currentPlayerIndex===0)playDiscard();if(event.key.toLowerCase()==='u'&&undoState){setState(undoState);setUndoState(null)}if(event.key.toLowerCase()==='w'&&canHumanWin(state))update(declareWin(state,0,true))}
    window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)
  },[state,selected,undoState,update,playDiscard])
  if(!state)return <PracticeSetup saved={saved} onResume={()=>{if(saved){setState(saved);navigate('/practice/resume',{replace:true})}}} onStart={start}/>
  const human=state.players[0]; const humanTurn=state.currentPlayerIndex===0&&state.phase==='awaiting-discard'; const claims=humanClaimOptions(state)
  const doubleDiscard=(tile:Tile)=>{if(!humanTurn)return;setUndoState(state);update(discardTile(state,0,tile.id));setSelected(null)}
  const claim=(option:ClaimOption|null)=>update(option?applyClaim(state,option):resolveBotClaims(state))
  const canKong=humanTurn&&human.hand.some((tile)=>human.hand.filter((other)=>tileKey(other)===tileKey(tile)).length===4)
  return <>
    <PracticeBoard state={state} selected={selected} onSelect={setSelected} humanTurn={humanTurn} claims={claims} onDiscard={playDiscard} onDoubleDiscard={doubleDiscard} onClaim={claim} canWin={canHumanWin(state)} canKong={canKong} onWin={()=>update(declareWin(state,0,true))} onKong={()=>update(declareConcealedKong(state,0))} undoAvailable={Boolean(undoState)} onUndo={()=>{if(undoState)setState(undoState);setUndoState(null)}} paused={paused} highContrast={highContrast} onPause={()=>setPaused(!paused)} onSettings={()=>setSettingsOpen(true)} onLeave={()=>navigate('/')}/>
    <AnimatePresence>{tutorialStep>=0&&<motion.div className="fixed inset-0 z-[100] grid place-items-end bg-black/65 p-4 sm:place-items-center" initial={{opacity:0}} animate={{opacity:1}}><motion.div initial={{y:20}} animate={{y:0}} className="w-full max-w-md rounded-3xl border border-marigold/25 bg-ivory p-6 text-charcoal"><p className="text-xs font-black uppercase tracking-widest text-peacock">Welcome · {tutorialStep+1} of 6</p><h2 className="mt-3 text-2xl font-extrabold text-midnight">{tutorial[tutorialStep][0]}</h2><p className="mt-3 leading-7 text-charcoal/70">{tutorial[tutorialStep][1]}</p><div className="mt-6 flex justify-between"><button className="min-h-11 px-3 text-sm font-extrabold text-peacock" onClick={()=>{localStorage.setItem(TUTORIAL_KEY,'1');setTutorialStep(-1)}}>Skip</button><Button onClick={()=>tutorialStep===5?(localStorage.setItem(TUTORIAL_KEY,'1'),setTutorialStep(-1)):setTutorialStep(tutorialStep+1)}>{tutorialStep===5?'Start playing':'Next'}<ChevronRight size={16}/></Button></div></motion.div></motion.div>}</AnimatePresence>
    <Modal open={paused} onClose={()=>setPaused(false)} title="Game paused"><p className="text-sm leading-6 text-charcoal/70">The bots and turn progression are paused. Your game is saved locally.</p><Button className="mt-6 w-full" onClick={()=>setPaused(false)}>Return to table</Button></Modal>
    <Modal open={settingsOpen} onClose={()=>setSettingsOpen(false)} title="Table settings"><label className="text-sm font-bold text-midnight">Game speed<select value={state.settings.speed} onChange={(event)=>update({...state,settings:{...state.settings,speed:event.target.value as GameSpeed}})} className="mt-2 h-12 w-full rounded-xl border border-charcoal/20 bg-white px-4"><option>slow</option><option>normal</option><option>fast</option></select></label><label className="mt-4 flex min-h-12 items-center justify-between rounded-xl border border-charcoal/15 px-4 text-sm font-bold text-midnight"><span>High-contrast tiles</span><input type="checkbox" checked={highContrast} onChange={(event)=>setHighContrast(event.target.checked)} className="h-5 w-5 accent-[#F2A900]"/></label><Button className="mt-6 w-full" onClick={()=>setSettingsOpen(false)}>Done</Button></Modal>
    <Modal open={state.phase==='hand-complete'} onClose={()=>{}} title={state.result?.winnerIndex===null?'Hand drawn':`${state.players[state.result?.winnerIndex??0].name} wins`}><p className="text-sm leading-6 text-charcoal/70">{state.result?.reason}</p>{state.result?.items.map((score)=><div key={score.id} className="mt-3 flex justify-between border-b border-charcoal/10 pb-2 text-sm"><span>{score.label}<small className="ml-2 text-charcoal/45">{score.explanation}</small></span><b>{score.tai} tai</b></div>)}<Button className="mt-6 w-full" onClick={()=>update(startNextHand(state))}>Start next hand</Button></Modal>
    <Modal open={state.phase==='match-complete'} onClose={()=>{}} title="Match complete"><Trophy className="mx-auto text-marigold" size={44}/><p className="mt-4 text-center text-sm text-charcoal/70">{progressError??'Verifying the match and calculating your progression…'}</p>{[...state.players].sort((a,b)=>b.score-a.score).map((player,index)=><div key={player.id} className="mt-3 flex justify-between rounded-xl bg-charcoal/5 p-3 text-sm"><b>{index+1}. {player.name}</b><span className="tabular">{player.score.toLocaleString('en-IN')}</span></div>)}{progressError&&<div className="mt-6 grid gap-2 sm:grid-cols-2"><Button variant="secondary" className="!text-midnight" onClick={()=>navigate(`/replay/${state.id}`)}><History size={16}/>Replay</Button><Button onClick={()=>start(state.settings)}><RotateCcw size={16}/>Play again</Button></div>}</Modal>
  </>
}

function tileKey(tile:Tile){return tile.kind==='suit'?`${tile.suit}-${tile.rank}`:tile.kind==='honor'?tile.honor!:tile.bonus!}
