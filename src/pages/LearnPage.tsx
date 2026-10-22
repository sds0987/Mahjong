import { ArrowRight, BookOpen, CheckCircle2, Flower2, Layers3, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { MahjongHand } from '../components/mahjong/MahjongHand'
import { MahjongTile } from '../components/mahjong/MahjongTile'
import { MeldGroup } from '../components/mahjong/MeldGroup'
import { AppShell } from '../components/layout/AppShell'
import { Card } from '../components/ui/Card'
import { SectionHeading } from '../components/ui/SectionHeading'
import { playerHand } from '../data/mockData'
import type { MahjongTileData, Meld } from '../types'

const topics = [
  { icon: Layers3, title: 'Understanding the 16-tile hand', copy: 'Taiwanese Mahjong uses a larger hand than many other variants. You begin with 16 tiles and draw a 17th before discarding.' },
  { icon: CheckCircle2, title: 'Five sets and one pair', copy: 'A standard winning hand contains five groups—chows, pongs, or kongs—plus one matching pair.' },
  { icon: RotateCcw, title: 'How a turn works', copy: 'Draw one tile, consider your combinations, then discard one. Other players may be able to call that discard.' },
  { icon: Trophy, title: 'How to win', copy: 'Complete five sets and a pair, then declare Mahjong. Special hands can follow different patterns.' },
]

const glossary = [
  ['Chow', 'Three sequential tiles from one numbered suit.'], ['Pong', 'Three identical tiles.'], ['Kong', 'Four identical tiles, declared as a set.'],
  ['Tai', 'The scoring unit used to measure hand value.'], ['Wall', 'The face-down tiles players draw from.'], ['Dealer', 'The East player, who begins the hand.'],
]

const learnMelds: Meld[] = [
  { id:'chow', type:'chow', tiles: playerHand.slice(0,3) },
  { id:'pong', type:'pong', tiles: playerHand.slice(6,9) },
  { id:'kong', type:'kong', tiles: [...playerHand.slice(12,15), { ...playerHand[12], id:'d4' }] },
]

export function LearnPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<MahjongTileData | null>(null)
  return <AppShell>
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><SectionHeading eyebrow="Learn the game" title="Taiwanese Mahjong, one clear idea at a time" copy="A visual introduction to the social 16-tile game. No memorisation required before your first practice hand." /><Button onClick={() => navigate('/game/practice-001')} withArrow>Try a Practice Hand</Button></div>

    <Card className="jaali-pattern mt-8 grid overflow-hidden border-marigold/20 bg-peacock lg:grid-cols-[.8fr_1.2fr]">
      <div className="p-7 sm:p-10"><div className="flex items-center gap-2 text-marigold"><BookOpen size={20} /><span className="text-xs font-extrabold uppercase tracking-[.18em]">What is Taiwanese Mahjong?</span></div><h2 className="mt-5 text-2xl font-extrabold">A game of pattern, memory, and conversation.</h2><p className="mt-4 text-sm leading-7 text-ivory/65">Four players build a complete hand by drawing and discarding tiles. Taiwanese rules use 16 tiles, flower bonuses, and tai-based scoring—creating longer patterns and rich strategic choices.</p></div>
      <div className="border-t border-ivory/10 bg-midnight/25 p-5 lg:border-l lg:border-t-0"><MahjongHand tiles={playerHand.slice(0,16)} size="md" label="Example sixteen tile hand" /></div>
    </Card>

    <div className="mt-6 grid gap-4 sm:grid-cols-2">{topics.map((topic) => <Card key={topic.title} className="p-6"><topic.icon className="text-marigold" size={22} /><h2 className="mt-6 text-lg font-extrabold">{topic.title}</h2><p className="mt-2 text-sm leading-6 text-ivory/55">{topic.copy}</p></Card>)}</div>

    <section className="mt-14"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-marigold">Building blocks</p><h2 className="mt-3 text-2xl font-extrabold">Chow, pong, and kong</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{learnMelds.map((meld) => <Card key={meld.id} className="flex items-center justify-between p-5"><MeldGroup meld={meld} /><p className="ml-5 text-sm leading-6 text-ivory/55">{meld.type === 'chow' ? 'A numbered sequence.' : meld.type === 'pong' ? 'Three of a kind.' : 'Four of a kind.'}</p></Card>)}</div></section>

    <section className="mt-14 grid gap-5 lg:grid-cols-2">
      <Card className="p-6 sm:p-8"><div className="flex items-center gap-2 text-marigold"><Flower2 size={20} /><h2 className="text-lg font-extrabold">Flower tiles</h2></div><div className="mt-6 flex gap-2">{['梅','蘭','菊','竹'].map((value, index) => <MahjongTile key={value} tile={{ id:`flower-${index}`, suit:'flower', value, label:['Plum Flower','Orchid Flower','Chrysanthemum Flower','Bamboo Flower'][index] }} size="lg" />)}</div><p className="mt-6 text-sm leading-6 text-ivory/55">Flowers are bonus tiles placed face-up when drawn. A flower matching your seat can add tai to a winning hand.</p></Card>
      <Card className="p-6 sm:p-8"><div className="flex items-center gap-2 text-marigold"><Sparkles size={20} /><h2 className="text-lg font-extrabold">Basic tai scoring</h2></div><div className="mt-5 space-y-3 text-sm">{[['Winning hand','1 tai'],['Self-draw','1 tai'],['All pongs','4 tai'],['Dealer bonus','1 tai']].map(([name,value]) => <div key={name} className="flex justify-between rounded-xl bg-ivory/5 px-4 py-3"><span className="text-ivory/60">{name}</span><strong className="tabular text-marigold">{value}</strong></div>)}</div></Card>
    </section>

    <section className="mt-14"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-marigold">Try it</p><h2 className="mt-3 text-2xl font-extrabold">Interactive sample hand</h2><p className="mt-2 text-sm text-ivory/55">Select any tile to learn what it is.</p><Card className="mt-5 p-4 sm:p-7"><MahjongHand tiles={playerHand} size="md" selectedId={selected?.id} onSelect={setSelected} label="Interactive sample hand" /><div className="mt-3 flex min-h-16 items-center rounded-xl border border-marigold/20 bg-marigold/7 px-4 text-sm">{selected ? <><strong className="mr-2 text-marigold">{selected.label}.</strong><span className="text-ivory/60">A {selected.suit} tile{selected.drawn ? ', shown here as the newly drawn seventeenth tile.' : '.'}</span></> : <span className="text-ivory/45">Choose a tile above to inspect it.</span>}</div></Card></section>

    <section className="mt-14"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-marigold">Quick glossary</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{glossary.map(([term, meaning]) => <div key={term} className="rounded-xl border border-ivory/10 bg-ivory/4 p-4"><strong>{term}</strong><p className="mt-1 text-xs leading-5 text-ivory/50">{meaning}</p></div>)}</div></section>

    <div className="mt-14 rounded-3xl border border-marigold/25 bg-marigold p-7 text-midnight sm:flex sm:items-center sm:justify-between sm:p-9"><div><h2 className="text-2xl font-extrabold">Ready to learn by playing?</h2><p className="mt-2 text-sm text-midnight/70">Hints stay on while you take your first hand.</p></div><button onClick={() => navigate('/game/practice-001')} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-midnight px-5 text-sm font-extrabold text-ivory sm:mt-0">Start practice <ArrowRight size={17} /></button></div>
  </AppShell>
}
