import { BookOpen, CircleUserRound, Gamepad2, LayoutDashboard, Settings } from 'lucide-react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Logo } from '../Logo'
import { PlayerAvatar } from '../game/PlayerAvatar'

const nav = [
  { to: '/lobby', label: 'Lobby', icon: LayoutDashboard },
  { to: '/game/demo-001', label: 'Table', icon: Gamepad2 },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/profile', label: 'Profile', icon: CircleUserRound },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AppShell({ children, fullBleed = false }: { children: ReactNode; fullBleed?: boolean }) {
  const { player } = useApp()
  return <div className="min-h-screen bg-midnight text-ivory">
    <header className="sticky top-0 z-40 border-b border-ivory/10 bg-midnight/92 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-[1500px] items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Application navigation">
          {nav.slice(0,4).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${isActive ? 'bg-marigold text-midnight' : 'text-ivory/65 hover:bg-ivory/5 hover:text-ivory'}`}><Icon size={17} />{label}</NavLink>)}
        </nav>
        <div className="flex items-center gap-3">
          <label className="hidden items-center gap-2 text-xs text-ivory/45 sm:flex">Language<select aria-label="Language" className="rounded-lg border border-ivory/15 bg-ivory/5 px-2 py-2 text-xs font-bold text-ivory"><option className="text-charcoal">English</option><option className="text-charcoal">हिन्दी</option></select></label>
          <NavLink to="/profile" aria-label="Open profile"><PlayerAvatar player={player} size="sm" /></NavLink>
        </div>
      </div>
    </header>
    <main className={`${fullBleed ? '' : 'mx-auto max-w-[1500px] px-4 py-7 sm:px-6 sm:py-10'} pb-24 lg:pb-10`}>{children}</main>
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-ivory/12 bg-[#0d1222]/96 px-1 pb-[max(.4rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
      {nav.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-bold ${isActive ? 'text-marigold' : 'text-ivory/50'}`}><Icon size={19} /><span>{label}</span></NavLink>)}
    </nav>
  </div>
}
