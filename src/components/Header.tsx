import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'
import { Logo } from './Logo'

const links = [
  { label: 'Play', href: '/lobby', route: true },
  { label: 'Learn', href: '/learn', route: true },
  { label: 'How It Works', href: '#how-it-works', route: false },
  { label: 'Community', href: '#community', route: false },
]

export function Header({ onPlay }: { onPlay: () => void }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="relative z-40 border-b border-ivory/10 bg-midnight/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {links.map(({ label, href, route }) => route ? <Link key={label} to={href} className="text-sm font-semibold text-ivory/75 transition-colors hover:text-marigold">{label}</Link> : <a key={label} href={href} className="text-sm font-semibold text-ivory/75 transition-colors hover:text-marigold">{label}</a>)}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/lobby" className="px-3 py-2 text-sm font-bold text-ivory/80 transition-colors hover:text-ivory">Sign In</Link>
          <Button onClick={onPlay} withArrow>Play Now</Button>
        </div>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-ivory/15 text-ivory lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-ivory/10 bg-midnight lg:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5" aria-label="Mobile navigation">
              {links.map(({ label, href, route }) => route ? <Link key={label} to={href} onClick={close} className="rounded-lg px-3 py-3 text-sm font-bold text-ivory/85 hover:bg-ivory/5">{label}</Link> : <a key={label} href={href} onClick={close} className="rounded-lg px-3 py-3 text-sm font-bold text-ivory/85 hover:bg-ivory/5">{label}</a>)}
              <Link to="/lobby" onClick={close} className="mt-1 rounded-lg px-3 py-3 text-left text-sm font-bold text-ivory/85 hover:bg-ivory/5">Sign In</Link>
              <Button onClick={() => { close(); onPlay() }} className="mt-3" withArrow>Play Now</Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
