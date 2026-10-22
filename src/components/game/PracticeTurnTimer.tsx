import { Timer } from 'lucide-react'
import { memo, useEffect, useState } from 'react'

export const PracticeTurnTimer = memo(function PracticeTurnTimer({ turnKey, paused }: { turnKey: string; paused: boolean }) {
  const [seconds, setSeconds] = useState(30)
  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000)
    return () => clearInterval(timer)
  }, [paused, turnKey])
  return <span className={`tabular inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-extrabold ${seconds <= 8 ? 'border-saffron/60 bg-saffron/15 text-[#ffb17d]' : 'border-ivory/12 bg-ivory/5 text-ivory/70'}`} aria-live="off" aria-label={`${seconds} seconds remaining`}><Timer size={14}/><span aria-hidden="true">0:{String(seconds).padStart(2,'0')}</span></span>
})
