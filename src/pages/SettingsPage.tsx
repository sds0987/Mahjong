import { Bell, Contrast, Languages, Palette, Volume2, WandSparkles } from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { Card } from '../components/ui/Card'
import { useToast } from '../components/ui/Toast'
import { useApp } from '../context/AppContext'

const themes = ['Kolkata Royal','Jaipur Courtyard','Mumbai Monsoon','Kerala House','Chennai Club'] as const

export function SettingsPage() {
  const { sound, setSound, reducedMotion, setReducedMotion, highContrast, setHighContrast, theme, setTheme, presentationTheme, setPresentationTheme } = useApp()
  const { showToast } = useToast()
  return <AppShell><div className="mx-auto max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-[.18em] text-marigold">Preferences</p><h1 className="mt-3 text-3xl font-extrabold">Settings</h1><p className="mt-2 text-sm text-ivory/50">Make every table comfortable for you.</p>
    <Card className="mt-8 divide-y divide-ivory/10"><Toggle icon={Palette} label="Presentation theme" copy="Use the emerald clubhouse style across app screens. Game tables keep their selected theme." checked={presentationTheme} onChange={(value) => { setPresentationTheme(value); showToast(value ? 'Presentation theme enabled' : 'Classic theme restored') }} /><Toggle icon={Volume2} label="Sound effects" copy="Tile, turn, and action sounds" checked={sound} onChange={setSound} /><Toggle icon={WandSparkles} label="Reduced motion" copy="Minimise tile and panel animation" checked={reducedMotion} onChange={setReducedMotion} /><Toggle icon={Contrast} label="High-contrast tiles" copy="White tile faces with darker outlines" checked={highContrast} onChange={setHighContrast} /><Toggle icon={Bell} label="Game reminders" copy="Mock setting for room invitations" checked={true} onChange={() => showToast('Reminder preference saved')} /></Card>
    <Card className="mt-5 p-6"><div className="flex items-center gap-2"><Languages size={19} className="text-marigold" /><h2 className="font-extrabold">Language</h2></div><label className="mt-5 block text-sm font-bold text-ivory/65">Interface language<select className="mt-2 h-12 w-full rounded-xl border border-ivory/15 bg-midnight px-4 text-ivory"><option>English</option><option disabled>हिन्दी — coming soon</option></select></label></Card>
    <Card className="mt-5 p-6"><h2 className="font-extrabold">Default table theme</h2><div className="mt-5 grid gap-2 sm:grid-cols-2">{themes.map((name) => <button key={name} onClick={() => { setTheme(name); showToast(`${name} selected`) }} aria-pressed={theme === name} className={`min-h-12 rounded-xl border px-4 text-left text-sm font-bold ${theme === name ? 'border-marigold bg-marigold text-midnight' : 'border-ivory/12 bg-ivory/5 text-ivory/65'}`}>{name}</button>)}</div></Card>
  </div></AppShell>
}

function Toggle({ icon: Icon, label, copy, checked, onChange }: { icon: typeof Volume2; label: string; copy: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex min-h-20 items-center gap-4 p-5 sm:p-6"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ivory/7 text-marigold"><Icon size={19} /></span><span className="flex-1"><strong className="block text-sm">{label}</strong><small className="mt-1 block text-xs text-ivory/40">{copy}</small></span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-marigold" /></label> }
