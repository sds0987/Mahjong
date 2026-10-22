import { AnimatePresence, motion } from 'framer-motion'
import { Check, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './Button'

export function PracticeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [level, setLevel] = useState('Guided')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const close = () => { setReady(false); onClose() }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#080b16]/80 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && close()}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby="practice-title" initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} className="brass-corners ambient-shadow w-full max-w-lg rounded-3xl border border-marigold/30 bg-ivory p-6 text-charcoal sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-5">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-peacock"><Sparkles size={14} /> Practice table</span>
                <h2 id="practice-title" className="text-2xl font-extrabold tracking-tight text-midnight">{ready ? 'Your table is ready' : 'Pull up a chair'}</h2>
              </div>
              <button onClick={close} aria-label="Close practice setup" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-charcoal/15 hover:bg-charcoal/5"><X size={18} /></button>
            </div>
            {ready ? (
              <div className="py-5 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald text-white"><Check size={30} /></motion.div>
                <p className="font-bold text-midnight">Welcome{ name ? `, ${name}` : ''}.</p>
                <p className="mt-2 text-sm leading-6 text-charcoal/70">A {level.toLowerCase()} practice table with three friendly computer players is waiting. Full gameplay comes in the next build phase.</p>
                <Button onClick={close} className="mt-7 w-full">Got it</Button>
              </div>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); setReady(true) }}>
                <label htmlFor="player-name" className="mb-2 block text-sm font-bold text-midnight">What should we call you?</label>
                <input id="player-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-12 w-full rounded-xl border border-charcoal/20 bg-white px-4 text-sm text-charcoal placeholder:text-charcoal/40" />
                <fieldset className="mt-6">
                  <legend className="mb-3 text-sm font-bold text-midnight">Choose your pace</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {['Guided', 'Relaxed', 'Quick'].map((option) => (
                      <button key={option} type="button" onClick={() => setLevel(option)} className={`rounded-xl border px-3 py-3 text-xs font-extrabold transition-colors ${level === option ? 'border-peacock bg-peacock text-white' : 'border-charcoal/15 bg-white text-charcoal/70 hover:border-peacock/50'}`}>{option}</button>
                    ))}
                  </div>
                </fieldset>
                <Button type="submit" className="mt-7 w-full" withArrow>Join practice table</Button>
                <p className="mt-3 text-center text-xs text-charcoal/55">No account needed for practice.</p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
