import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, HelpCircle, History, LogOut, Settings, Volume2, VolumeX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { PlayerSeat } from '../components/game/PlayerSeat'
import { RuleBadge } from '../components/game/RuleBadge'
import { DiscardGrid } from '../components/mahjong/DiscardGrid'
import { MahjongHand } from '../components/mahjong/MahjongHand'
import { MahjongTile } from '../components/mahjong/MahjongTile'
import { MeldGroup } from '../components/mahjong/MeldGroup'
import { AppShell } from '../components/layout/AppShell'
import { Drawer } from '../components/ui/Drawer'
import { Modal } from '../components/ui/Modal'
import { Tooltip } from '../components/ui/Tooltip'
import { useToast } from '../components/ui/Toast'
import { useApp } from '../context/AppContext'
import { discards, gameLog as initialLog, playerHand, players, scoreItems } from '../data/mockData'
import type { GameAction, MahjongTileData, Meld } from '../types'

const melds: Meld[] = [{ id: 'meld-1', type: 'pong', tiles: playerHand.slice(6, 9) }]
const particles = Array.from({ length: 18 }, (_, i) => ({ left: `${8 + (i * 17) % 86}%`, delay: (i % 6) * .08, rotate: (i * 47) % 180 }))

export function GamePage() {
  const navigate = useNavigate()
  const { sound, setSound, reducedMotion, setReducedMotion, highContrast, setHighContrast } = useApp()
  const { showToast } = useToast()
  const [selected, setSelected] = useState<MahjongTileData | null>(null)
  const [turn, setTurn] = useState(0)
  const [phase, setPhase] = useState<'draw' | 'claim'>('draw')
  const [log, setLog] = useState(initialLog)
  const [resultsOpen, setResultsOpen] = useState(false)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [details, setDetails] = useState(false)
  const activePlayer = players[turn % players.length]
  const actions: GameAction[] = phase === 'claim' ? ['Pong', 'Win', 'Pass'] : ['Kong']
  const totalTai = useMemo(() => scoreItems.reduce((sum, item) => sum + item.tai, 0), [])

  const discard = () => {
    if (!selected) { showToast('Select a tile to discard', 'info'); return }
    setLog((items) => [`You discarded ${selected.label}`, ...items])
    setSelected(null); setTurn(1); setPhase('claim'); showToast('Tile discarded — Kabir is considering a call', 'info')
  }
  const action = (value: GameAction) => {
    if (value === 'Win') { setResultsOpen(true); return }
    setLog((items) => [`You chose ${value}`, ...items])
    setTurn((current) => (current + 1) % 4); setPhase('draw'); showToast(`${value} confirmed`)
  }

  return <AppShell fullBleed>
    <div className="flex min-h-[calc(100vh-72px)] flex-col">
      <h1 className="sr-only">Live Taiwanese Mahjong table</h1>
      <div className="flex items-center justify-between border-b border-ivory/10 bg-[#0d1222] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3"><RuleBadge /><span className="hidden text-xs font-semibold text-ivory/40 sm:block">East Round · Hand 3 · Dealer Ananya</span></div>
        <div className="flex items-center gap-2">
          <span className="tabular hidden rounded-full bg-ivory/6 px-3 py-2 text-xs font-bold text-ivory/55 sm:inline">Wall: 64 tiles</span>
          <Tooltip label={sound ? 'Mute sound' : 'Enable sound'}><button onClick={() => setSound(!sound)} aria-label={sound ? 'Mute sound' : 'Enable sound'} className="grid h-11 w-11 place-items-center rounded-xl border border-ivory/12 text-ivory/65 hover:text-marigold">{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</button></Tooltip>
          <Tooltip label="Game settings"><button onClick={() => setSettingsOpen(true)} aria-label="Open game settings" className="grid h-11 w-11 place-items-center rounded-xl border border-ivory/12 text-ivory/65 hover:text-marigold"><Settings size={18} /></button></Tooltip>
          <Tooltip label="How to play"><button onClick={() => navigate('/learn')} aria-label="Open help" className="grid h-11 w-11 place-items-center rounded-xl border border-ivory/12 text-ivory/65 hover:text-marigold"><HelpCircle size={18} /></button></Tooltip>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 xl:grid-cols-[1fr_300px]">
        <section className="relative flex min-h-[590px] items-center justify-center overflow-hidden bg-[#20253a] p-3 sm:p-6 lg:min-h-[calc(100vh-140px)]" aria-label="Mahjong table">
          <div className="jaali-pattern absolute inset-0 opacity-60" />
          <div className="relative h-[590px] w-full max-w-[860px] rounded-[28px] border border-marigold/30 bg-peacock p-3 shadow-[inset_0_0_100px_rgba(0,0,0,.25),0_30px_70px_rgba(0,0,0,.35)] sm:aspect-square sm:h-auto sm:w-[min(100%,calc(100vh-180px))] sm:p-8">
            <div className="absolute left-1/2 top-2 z-20 -translate-x-1/2 sm:top-4"><PlayerSeat player={players[2]} current={activePlayer.id === players[2].id} compact /></div>
            <div className="absolute right-1 top-1/2 z-20 -translate-y-1/2 sm:right-4"><PlayerSeat player={players[1]} current={activePlayer.id === players[1].id} compact /></div>
            <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 sm:bottom-4"><PlayerSeat player={players[0]} current={activePlayer.id === players[0].id} compact /></div>
            <div className="absolute left-1 top-1/2 z-20 -translate-y-1/2 sm:left-4"><PlayerSeat player={players[3]} current={activePlayer.id === players[3].id} compact /></div>

            <div className="absolute inset-[15%] rounded-[22px] border border-ivory/12 bg-[#06483e] shadow-inner">
              <div className="absolute left-1/2 top-[6%] -translate-x-1/2"><DiscardGrid tiles={discards.north} label="Meera" highContrast={highContrast} /></div>
              <div className="absolute right-[5%] top-1/2 -translate-y-1/2 scale-75 sm:scale-90"><DiscardGrid tiles={discards.east} label="Kabir" highContrast={highContrast} /></div>
              <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2"><DiscardGrid tiles={discards.south} label="Ananya" highContrast={highContrast} /></div>
              <div className="absolute left-[5%] top-1/2 -translate-y-1/2 scale-75 sm:scale-90"><DiscardGrid tiles={discards.west} label="Dev" highContrast={highContrast} /></div>
              <motion.div layout className="absolute inset-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-marigold/35 bg-midnight/65 text-center shadow-xl sm:h-32 sm:w-32">
                <div><span className="text-[9px] font-extrabold uppercase tracking-[.18em] text-marigold">East · Hand 3</span><strong className="tabular mt-1 block text-2xl text-ivory">64</strong><span className="text-[9px] font-bold text-ivory/45">TILES LEFT</span></div>
              </motion.div>
              <div className="absolute bottom-[5%] right-[4%] hidden gap-1 sm:flex"><MeldGroup meld={melds[0]} highContrast={highContrast} /></div>
              <div className="absolute left-[4%] top-[5%] hidden sm:block"><MahjongTile tile={{ id:'flower','suit':'flower',value:'梅',label:'Plum Flower' }} size="sm" highContrast={highContrast} /></div>
            </div>

            <div className="absolute inset-x-2 bottom-[9%] z-10 rounded-2xl border border-ivory/10 bg-midnight/82 px-2 pt-1 backdrop-blur-md sm:inset-x-[2%] sm:bottom-[12%]">
              <MahjongHand tiles={playerHand} size="md" selectedId={selected?.id} onSelect={setSelected} highContrast={highContrast} label="Your concealed hand" />
            </div>
          </div>

          <AnimatePresence>
            {phase === 'claim' && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-4 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 rounded-2xl border border-marigold/35 bg-midnight/95 p-2 shadow-2xl sm:flex"><span className="px-2 text-xs font-bold text-ivory/60">Call the discard?</span>{actions.map((item) => <button key={item} onClick={() => action(item)} className={`min-h-11 rounded-xl px-4 text-xs font-extrabold ${item === 'Win' ? 'bg-marigold text-midnight' : 'border border-ivory/15 text-ivory hover:bg-ivory/8'}`}>{item}</button>)}</motion.div>}
          </AnimatePresence>
        </section>

        <aside className="hidden border-l border-ivory/10 bg-[#0d1222] xl:flex xl:flex-col">
          <div className="border-b border-ivory/10 p-5"><div className="flex items-center gap-2"><History size={18} className="text-marigold" /><h2 className="font-extrabold">Game log</h2></div><p className="mt-1 text-xs text-ivory/35">Most recent first</p></div>
          <GameLog items={log} />
          <div className="border-t border-ivory/10 p-4"><button onClick={() => setLeaveOpen(true)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-terracotta/35 text-xs font-extrabold text-[#ff9f82]"><LogOut size={16} />Leave game</button></div>
        </aside>
      </div>

      <div className="sticky bottom-[62px] z-30 border-t border-ivory/12 bg-midnight/96 p-3 backdrop-blur-xl lg:bottom-0 xl:hidden">
        <div className="mx-auto flex max-w-4xl items-center gap-2 overflow-x-auto">
          <button onClick={() => setLogOpen(true)} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-ivory/15" aria-label="Open game log"><History size={18} /></button>
          {phase === 'claim' ? actions.map((item) => <button key={item} onClick={() => action(item)} className={`min-h-12 flex-1 whitespace-nowrap rounded-xl px-4 text-sm font-extrabold ${item === 'Win' ? 'bg-marigold text-midnight' : 'border border-ivory/15 bg-ivory/5'}`}>{item}</button>) : <Button onClick={discard} disabled={!selected} className="flex-1">Discard selected tile</Button>}
        </div>
      </div>
      {phase === 'draw' && <div className="fixed bottom-24 right-4 z-30 hidden sm:block xl:bottom-5 xl:right-[320px]"><Button onClick={discard} disabled={!selected}>Discard selected tile <ChevronRight size={17} /></Button></div>}
    </div>

    <Drawer open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Table settings"><div className="space-y-3"><SettingToggle label="Sound effects" copy="Tile and turn feedback" checked={sound} onChange={setSound} /><SettingToggle label="Reduced motion" copy="Minimise movement and transitions" checked={reducedMotion} onChange={setReducedMotion} /><SettingToggle label="High-contrast tiles" copy="White tile faces with darker borders" checked={highContrast} onChange={setHighContrast} /></div><div className="mt-6 rounded-xl border border-ivory/10 bg-ivory/5 p-4"><p className="text-xs font-bold text-marigold">Table theme</p><p className="mt-1 text-sm text-ivory/60">Kolkata Royal · deep green and brass</p></div></Drawer>
    <Drawer open={logOpen} onClose={() => setLogOpen(false)} title="Game log"><GameLog items={log} /></Drawer>

    <Modal open={leaveOpen} onClose={() => setLeaveOpen(false)} title="Leave the game?">
      <p className="text-sm leading-6 text-charcoal/70">You can reconnect while this hand is still active, but your seat may be controlled automatically.</p><div className="mt-7 flex gap-3"><button onClick={() => setLeaveOpen(false)} className="min-h-12 flex-1 rounded-xl border border-charcoal/20 font-bold">Keep Playing</button><Button onClick={() => navigate('/lobby')} className="flex-1">Leave Game</Button></div>
    </Modal>

    <Modal open={resultsOpen} onClose={() => setResultsOpen(false)} title="Ananya wins the hand" maxWidth="max-w-2xl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden="true">{!reducedMotion && particles.map((particle, i) => <motion.i key={i} className="absolute top-0 h-2 w-2 rounded-sm bg-marigold" style={{ left: particle.left }} initial={{ y: -20, opacity: 0, rotate: 0 }} animate={{ y: 620, opacity: [0,1,1,0], rotate: particle.rotate }} transition={{ duration: 1.8, delay: particle.delay }} />)}</div>
      <div className="relative">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="text-sm font-bold text-peacock">Self-draw · East Round</p><p className="mt-2 text-sm text-charcoal/65">Winning tile: <strong>Plum Flower</strong></p></div><div className="flex items-center gap-3"><MahjongTile tile={playerHand[playerHand.length - 1]} size="lg" highContrast={highContrast} /><div className="rounded-2xl bg-peacock px-5 py-3 text-center text-white"><strong className="tabular block text-3xl">{totalTai}</strong><span className="text-[10px] font-extrabold uppercase tracking-wider text-white/60">Total tai</span></div></div></div>
        <div className="mt-5 rounded-2xl border border-charcoal/10 bg-white p-4"><MahjongHand tiles={playerHand} size="sm" highContrast={highContrast} label="Completed winning hand" /></div>
        <div className="mt-5 divide-y divide-charcoal/10 rounded-2xl bg-[#f2eee3] px-4">{scoreItems.map((item) => <div key={item.label} className="flex items-center justify-between py-2.5 text-sm"><span>{item.label}</span><strong className="tabular">{item.tai} tai</strong></div>)}<div className="flex items-center justify-between py-3 font-extrabold text-peacock"><span>Total</span><span className="tabular">{totalTai} tai</span></div></div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">{players.slice(1).map((p) => <div key={p.id} className="rounded-xl border border-charcoal/10 p-3"><span className="block truncate text-[10px] font-bold text-charcoal/55">{p.name.split(' ')[0]}</span><strong className="tabular mt-1 block text-sm text-terracotta">−8,000</strong></div>)}</div>
        {details && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 rounded-xl border border-peacock/20 bg-peacock/5 p-4 text-sm leading-6 text-charcoal/70"><strong className="text-peacock">Why 8 tai?</strong> This hand contains four triplets plus a pair, was completed by self-draw, includes the matching seat flower, and receives the dealer bonus.</motion.div>}
        <div className="mt-6 grid gap-2 sm:grid-cols-3"><Button onClick={() => { setResultsOpen(false); setTurn(0); setPhase('draw'); showToast('Next hand started') }}>Next Hand</Button><button onClick={() => setDetails(!details)} className="min-h-12 rounded-xl border border-charcoal/20 text-sm font-extrabold text-midnight">View Details</button><button onClick={() => navigate('/lobby')} className="min-h-12 rounded-xl border border-terracotta/30 text-sm font-extrabold text-terracotta">Leave Table</button></div>
      </div>
    </Modal>
  </AppShell>
}

function GameLog({ items }: { items: string[] }) { return <div className="flex-1 space-y-1 overflow-y-auto p-3">{items.map((item, index) => <div key={`${item}-${index}`} className="flex gap-3 rounded-xl px-3 py-3 text-xs leading-5 text-ivory/60 hover:bg-ivory/5"><span className="tabular text-ivory/25">{String(index + 1).padStart(2,'0')}</span><span>{item}</span></div>)}</div> }
function SettingToggle({ label, copy, checked, onChange }: { label: string; copy: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex min-h-16 items-center justify-between gap-4 rounded-xl border border-ivory/10 bg-ivory/5 p-4"><span><strong className="block text-sm text-ivory">{label}</strong><small className="mt-1 block text-xs text-ivory/40">{copy}</small></span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-marigold" /></label> }
