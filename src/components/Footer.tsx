import { Camera, Mail } from 'lucide-react'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-ivory/10 bg-[#0d1222]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-6 text-ivory/55">A welcoming home for learning and playing authentic social Mahjong across India.</p>
        </div>
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[.18em] text-marigold">Clubhouse</h3>
          <div className="mt-4 grid gap-3 text-sm text-ivory/60">
            <a href="#how-it-works" className="hover:text-ivory">How it works</a>
            <a href="#tables" className="hover:text-ivory">Table themes</a>
            <a href="#community" className="hover:text-ivory">Community</a>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[.18em] text-marigold">Say hello</h3>
          <div className="mt-4 flex gap-3">
            <a href="mailto:hello@themahjongclub.in" aria-label="Email The Mahjong Club" className="grid h-11 w-11 place-items-center rounded-xl border border-ivory/15 text-ivory/70 hover:border-marigold/50 hover:text-marigold"><Mail size={18} /></a>
            <a href="#community" aria-label="The Mahjong Club community photos" className="grid h-11 w-11 place-items-center rounded-xl border border-ivory/15 text-ivory/70 hover:border-marigold/50 hover:text-marigold"><Camera size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 text-xs text-ivory/40 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 The Mahjong Club</span>
          <div className="flex gap-5"><a href="#" className="hover:text-ivory">Privacy</a><a href="#" className="hover:text-ivory">Fair play</a><a href="#" className="hover:text-ivory">Terms</a></div>
        </div>
      </div>
    </footer>
  )
}
