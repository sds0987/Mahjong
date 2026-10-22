import { motion } from 'framer-motion'
import {
  ArrowDown,
  BookOpen,
  Calculator,
  CheckCircle2,
  CircleHelp,
  CloudRain,
  Crown,
  DoorOpen,
  GraduationCap,
  History,
  Landmark,
  Palmtree,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Waves,
  Wifi,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { MahjongTable } from '../components/MahjongTable'
import { useProfile } from '../profile/ProfileContext'
import { practiceRank } from '../profile/config'

const steps = [
  { icon: BookOpen, title: 'Learn the rules', copy: 'A calm five-minute introduction to the 16-tile game.' },
  { icon: DoorOpen, title: 'Create a private room', copy: 'Choose a table, pace, and your preferred house settings.' },
  { icon: UsersRound, title: 'Invite three friends', copy: 'Share one simple room code. No complicated setup.' },
  { icon: Calculator, title: 'Play with automatic scoring', copy: 'We track turns, tai, and the table so you can enjoy the game.' },
]

const features = [
  { icon: GraduationCap, title: 'Taiwanese 16-tile rules', copy: 'Authentic play with a clear, approachable rules guide.' },
  { icon: UsersRound, title: 'Private rooms', copy: 'A quiet table for your people, wherever they are.' },
  { icon: Calculator, title: 'Automatic tai calculation', copy: 'Transparent scoring with every combination explained.' },
  { icon: RefreshCw, title: 'Reconnect to games', copy: 'Step away and return to your seat without losing the round.' },
  { icon: History, title: 'Match replays', copy: 'Review decisions, hands, and scoring after every session.' },
  { icon: CircleHelp, title: 'Beginner-friendly guidance', copy: 'Contextual hints arrive when helpful, never in the way.' },
]

const themes = [
  { name: 'Kolkata Royal', subtitle: 'Deep green & brass', icon: Landmark, colors: 'from-[#0a493e] to-[#112e2a]', detail: 'Measured club-room calm with fine brass lines.' },
  { name: 'Jaipur Courtyard', subtitle: 'Ivory & terracotta', icon: Crown, colors: 'from-[#ca6849] to-[#8d3729]', detail: 'Warm stone tones and a quiet geometric screen.' },
  { name: 'Mumbai Monsoon', subtitle: 'Indigo & rain silver', icon: CloudRain, colors: 'from-[#233757] to-[#101827]', detail: 'Cool evening blues with a soft monsoon rhythm.' },
  { name: 'Kerala House', subtitle: 'Teak & leaf green', icon: Palmtree, colors: 'from-[#3d6b4d] to-[#173c35]', detail: 'Natural greens balanced by warm timber accents.' },
  { name: 'Chennai Club', subtitle: 'Saffron & charcoal', icon: Waves, colors: 'from-[#d36932] to-[#6c3428]', detail: 'Confident coastal warmth with clean modern lines.' },
]

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: .55 },
}

export function HomePage() {
  const navigate = useNavigate()
  const { profile } = useProfile()
  const [activeTheme, setActiveTheme] = useState('Kolkata Royal')
  const openPractice = () => navigate('/practice')

  return (
    <div className="mj-home min-h-screen overflow-hidden bg-midnight text-ivory">
      <Header onPlay={openPractice} />
      <main>
        <section className="mj-home-hero jaali-pattern relative border-b border-ivory/10">
          <div className="pointer-events-none absolute left-[-15%] top-[-20%] h-[500px] w-[500px] rounded-full bg-peacock/30 blur-[130px]" />
          <div className="pointer-events-none absolute bottom-[-30%] right-[-10%] h-[480px] w-[480px] rounded-full bg-terracotta/15 blur-[140px]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:py-20">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .65 }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-marigold/30 bg-marigold/8 px-3 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-marigold">
                <Sparkles size={14} aria-hidden="true" /> 16-tile Taiwanese Mahjong
              </div>
              <h1 className="mj-title max-w-2xl text-[clamp(2.55rem,5vw,4.65rem)] font-extrabold leading-[1.03] tracking-[-.045em] text-ivory">The Mahjong Club, <span className="mj-accent text-marigold">made social</span> for India</h1>
              <p className="mj-description mt-6 max-w-xl text-base leading-7 text-ivory/68 sm:text-lg sm:leading-8">Learn the 16-tile game, invite your friends, and play live online.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button onClick={openPractice} withArrow className="sm:px-6">Play a Practice Game</Button>
                <Button variant="secondary" onClick={() => navigate('/lan')} className="sm:px-6"><Wifi size={17} /> Play with Friends</Button>
                <Button variant="secondary" onClick={() => document.querySelector('#how-it-works')?.scrollIntoView()} className="sm:px-6">Learn in 5 Minutes <ArrowDown size={17} /></Button>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-ivory/55">
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald" /> No download</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald" /> Beginner friendly</span>
                <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald" /> Social play only</span>
              </div>
              <button onClick={()=>navigate('/profile')} className="mt-6 inline-flex items-center gap-3 rounded-xl border border-marigold/25 bg-marigold/8 px-4 py-3 text-left"><span className="grid h-9 w-9 place-items-center rounded-lg bg-marigold font-black text-midnight">{profile.level}</span><span><b className="block text-sm text-ivory">Level {profile.level} · {practiceRank(profile.practiceRating)}</b><small className="text-ivory/45">Practice Rating {profile.practiceRating} · View profile</small></span></button>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: .96, rotate: 1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .7, delay: .12 }} className="relative">
              <div className="absolute -left-8 top-1/4 hidden rounded-xl border border-marigold/25 bg-midnight/85 px-4 py-3 text-xs font-bold shadow-xl backdrop-blur lg:block"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald" />Friends online</div>
              <MahjongTable />
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="bg-soft-white py-20 text-charcoal sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-terracotta">From curious to playing</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em] text-midnight sm:text-4xl">A seat at the table in four simple steps</h2>
              <p className="mt-4 text-sm leading-6 text-charcoal/65 sm:text-base">You bring the people. We keep the rules, scoring, and rhythm clear.</p>
            </motion.div>
            <div className="relative mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="absolute left-[12%] right-[12%] top-10 hidden border-t border-dashed border-peacock/25 xl:block" />
              {steps.map((step, index) => (
                <motion.article key={step.title} {...reveal} transition={{ duration: .45, delay: index * .08 }} className="relative rounded-2xl border border-charcoal/10 bg-white p-6 shadow-[0_14px_36px_rgba(18,24,43,.06)]">
                  <div className="mb-7 flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-peacock text-white"><step.icon size={22} /></span>
                    <span className="tabular text-sm font-extrabold text-terracotta/65">0{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-midnight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/65">{step.copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(7,91,76,.36),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div {...reveal} className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-marigold">Built for the whole table</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em] sm:text-4xl">The strategy stays deep. Everything else gets simpler.</h2>
            </motion.div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.article key={feature.title} {...reveal} transition={{ duration: .45, delay: (index % 3) * .07 }} className="group brass-corners rounded-2xl border border-ivory/12 bg-ivory/[.045] p-6 transition-colors hover:border-marigold/35 hover:bg-ivory/[.07]">
                  <feature.icon size={22} className="text-marigold transition-transform group-hover:-translate-y-0.5" />
                  <h3 className="mt-8 text-lg font-extrabold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ivory/58">{feature.copy}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="tables" className="border-y border-ivory/10 bg-[#0d3f39] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <motion.div {...reveal} className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-extrabold uppercase tracking-[.2em] text-marigold">Choose your table</p>
                <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em] sm:text-4xl">A familiar atmosphere, never a distraction</h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-ivory/60">Cosmetic themes inspired by place, light, and material. Tiles and gameplay always remain authentic and clear.</p>
            </motion.div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {themes.map((theme) => {
                const selected = activeTheme === theme.name
                return (
                  <motion.button
                    key={theme.name}
                    onClick={() => setActiveTheme(theme.name)}
                    whileHover={{ y: -4 }}
                    className={`group overflow-hidden rounded-2xl border text-left transition-colors ${selected ? 'border-marigold bg-marigold/10' : 'border-ivory/15 bg-midnight/20 hover:border-ivory/35'}`}
                    aria-pressed={selected}
                  >
                    <span className={`jaali-pattern flex aspect-[1.1] items-center justify-center bg-gradient-to-br ${theme.colors}`}>
                      <span className={`grid h-16 w-16 place-items-center rounded-full border backdrop-blur-sm ${selected ? 'border-marigold bg-marigold text-midnight' : 'border-ivory/20 bg-midnight/40 text-ivory'}`}><theme.icon size={26} /></span>
                    </span>
                    <span className="block p-4">
                      <span className="block text-sm font-extrabold text-ivory">{theme.name}</span>
                      <span className="mt-1 block text-[11px] font-semibold text-ivory/50">{theme.subtitle}</span>
                    </span>
                  </motion.button>
                )
              })}
            </div>
            <motion.div layout className="mt-5 flex flex-col gap-3 rounded-2xl border border-marigold/25 bg-midnight/35 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div><span className="text-xs font-extrabold uppercase tracking-[.16em] text-marigold">Selected table</span><p className="mt-1 text-sm text-ivory/65">{themes.find((theme) => theme.name === activeTheme)?.detail}</p></div>
              <span className="shrink-0 rounded-full bg-ivory/8 px-3 py-2 text-xs font-bold text-ivory">{activeTheme}</span>
            </motion.div>
          </div>
        </section>

        <section id="community" className="bg-soft-white py-20 text-charcoal sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid overflow-hidden rounded-[28px] border border-charcoal/10 bg-white shadow-[0_24px_70px_rgba(18,24,43,.10)] lg:grid-cols-[1fr_.9fr]">
              <div className="p-7 sm:p-12 lg:p-16">
                <p className="text-xs font-extrabold uppercase tracking-[.2em] text-terracotta">The club is open</p>
                <h2 className="mt-4 max-w-xl text-3xl font-extrabold tracking-[-.035em] text-midnight sm:text-4xl">Good games begin with a welcoming table.</h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-charcoal/65 sm:text-base">Start with a guided practice round, then bring your favourite people together for a live game.</p>
                <Button onClick={openPractice} className="mt-8" withArrow>Play a Practice Game</Button>
              </div>
              <div className="jaali-pattern relative flex min-h-72 items-center justify-center bg-peacock p-8">
                <div className="absolute inset-7 rounded-[24px] border border-marigold/30" />
                <div className="relative text-center">
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl border border-marigold/40 bg-midnight/45 text-marigold shadow-xl"><Wifi size={38} /></div>
                  <p className="mt-5 text-lg font-extrabold text-ivory">One room code. Four seats.</p>
                  <p className="mt-2 text-sm text-ivory/60">Across the city or across the country.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
