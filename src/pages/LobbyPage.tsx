import { Copy, Globe2, Play, Plus, Swords, Trophy, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { PlayerAvatar } from '../components/game/PlayerAvatar'
import { RoomCard } from '../components/game/RoomCard'
import { RuleBadge } from '../components/game/RuleBadge'
import { AppShell } from '../components/layout/AppShell'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { SectionHeading } from '../components/ui/SectionHeading'
import { useToast } from '../components/ui/Toast'
import { useApp } from '../context/AppContext'
import { friends, recentMatches } from '../data/mockData'
import type { RoomSettings } from '../types'
import { useProfile } from '../profile/ProfileContext'
import { practiceRank } from '../profile/config'

export function LobbyPage() {
  const navigate = useNavigate()
  const { player, room, updateRoomSettings } = useApp()
  const { showToast } = useToast()
  const [createOpen, setCreateOpen] = useState(false)
  const [code, setCode] = useState('')
  const [settings, setSettings] = useState<RoomSettings>(room.settings)
  const { profile } = useProfile()

  const createRoom = () => { updateRoomSettings(settings); setCreateOpen(false); showToast('Private room created'); navigate(`/room/${room.code}`) }
  const joinRoom = () => { if (!code.trim()) { showToast('Enter a room code first', 'info'); return } showToast(`Joining ${code.toUpperCase()}`); navigate(`/room/${code.toUpperCase()}`) }

  return <AppShell>
    <div className="flex flex-col gap-8 xl:flex-row">
      <div className="min-w-0 flex-1">
        <SectionHeading eyebrow="Good evening, Ananya" title="Your table is waiting" copy="Create a private room, join your friends, or warm up with a guided practice hand." />
        <Card className="jaali-pattern mt-8 overflow-hidden border-marigold/20 bg-peacock p-5 sm:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4"><PlayerAvatar player={player} size="lg" /><div><div className="flex items-center gap-2"><h2 className="text-xl font-extrabold">{player.name}</h2><span className="inline-flex items-center gap-1 text-xs font-bold text-emerald"><i className="h-2 w-2 rounded-full bg-emerald" /> Online</span></div><p className="mt-1 text-sm text-ivory/60">{player.city} · Club member</p></div></div>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <div className="rounded-xl border border-ivory/12 bg-midnight/25 px-4 py-3"><span className="text-[10px] font-bold uppercase tracking-wider text-ivory/45">Practice rating</span><div className="tabular mt-1 flex items-center gap-2 text-lg font-extrabold"><Trophy size={16} className="text-marigold" />{profile.practiceRating}</div><small className="text-ivory/40">{practiceRank(profile.practiceRating)}</small></div>
              <div className="rounded-xl border border-ivory/12 bg-midnight/25 px-4 py-3"><span className="text-[10px] font-bold uppercase tracking-wider text-ivory/45">Level {profile.level}</span><div className="tabular mt-1 text-lg font-extrabold text-emerald">{profile.currentXp} XP</div><button onClick={()=>navigate('/profile')} className="text-[10px] font-bold text-marigold">View Profile</button></div>
            </div>
          </div>
        </Card>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <RoomCard title="Create a private room" copy="Set the rules, share a code, and invite three friends to your table." action={<Button onClick={() => setCreateOpen(true)} className="w-full" withArrow><Plus size={18} />Create Private Room</Button>} />
          <RoomCard title="Join with a code" copy="Enter the six-character code shared by your host." action={<div className="flex gap-2"><input aria-label="Room code" value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && joinRoom()} placeholder="e.g. IND-482" className="min-w-0 flex-1 rounded-xl border border-ivory/15 bg-ivory/8 px-4 text-sm font-bold uppercase text-ivory placeholder:text-ivory/30" /><Button onClick={joinRoom}>Join</Button></div>} />
          <RoomCard title="Practice with bots" copy="Play a complete four-hand match against three local computer players." action={<Button variant="secondary" onClick={() => navigate('/practice')} className="w-full"><Play size={18} />Practice With Bots</Button>} />
          <RoomCard title="Public matchmaking" copy="Balanced tables based on experience and preferred pace." comingSoon action={<button disabled className="min-h-12 w-full cursor-not-allowed rounded-xl border border-ivory/10 bg-ivory/5 text-sm font-bold text-ivory/35"><Swords size={17} className="mr-2 inline" />Matchmaking unavailable</button>} />
        </div>

        <Card className="mt-6 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-lg font-extrabold">Recent matches</h2><p className="mt-1 text-sm text-ivory/45">Your last three tables</p></div><RuleBadge /></div>
          <div className="mt-5 divide-y divide-ivory/8">{recentMatches.map((match) => <div key={match.id} className="grid grid-cols-[1fr_auto] gap-3 py-4 sm:grid-cols-[1.3fr_1fr_auto]"><div><p className="text-sm font-bold">{match.room}</p><p className="mt-1 text-xs text-ivory/40">{match.playedAt}</p></div><span className="hidden self-center text-xs font-bold text-ivory/55 sm:block">{match.result}</span><span className={`tabular self-center rounded-full px-3 py-1 text-xs font-extrabold ${match.score > 0 ? 'bg-emerald/12 text-emerald' : 'bg-terracotta/12 text-[#ff9f82]'}`}>{match.score > 0 ? '+' : ''}{match.score}</span></div>)}</div>
        </Card>
      </div>

      <aside className="w-full shrink-0 xl:w-80">
        <Card className="p-5"><div className="flex items-center justify-between"><h2 className="font-extrabold">Friends online</h2><span className="rounded-full bg-emerald/15 px-2 py-1 text-[10px] font-extrabold text-emerald">{friends.length} ONLINE</span></div><div className="mt-5 space-y-4">{friends.map((friend) => <div key={friend.id} className="flex items-center gap-3"><PlayerAvatar player={friend} size="sm" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{friend.name}</p><p className="truncate text-xs text-ivory/40">{friend.activity}</p></div><button onClick={() => showToast(`Invite sent to ${friend.name}`)} aria-label={`Invite ${friend.name}`} className="grid h-11 w-11 place-items-center rounded-xl border border-ivory/12 text-ivory/60 hover:border-marigold/40 hover:text-marigold"><UsersRound size={17} /></button></div>)}</div></Card>
        <Card className="mt-4 p-5"><div className="flex items-center gap-2 text-marigold"><Globe2 size={18} /><h2 className="font-extrabold">Club note</h2></div><p className="mt-3 text-sm leading-6 text-ivory/55">English is active. Hindi interface support is prepared and will arrive in a future release.</p><button onClick={() => navigator.clipboard?.writeText('IND-482').then(() => showToast('Invite code copied'))} className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-extrabold text-marigold"><Copy size={15} />Copy sample code</button></Card>
      </aside>
    </div>

    <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a private room">
      <form onSubmit={(e) => { e.preventDefault(); createRoom() }} className="space-y-5">
        <label className="block text-sm font-bold text-midnight">Room name<input value={settings.roomName} onChange={(e) => setSettings({ ...settings, roomName: e.target.value })} className="mt-2 h-12 w-full rounded-xl border border-charcoal/20 bg-white px-4" required /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-midnight">Turn timer<select value={settings.turnTimer} onChange={(e) => setSettings({ ...settings, turnTimer: Number(e.target.value) })} className="mt-2 h-12 w-full rounded-xl border border-charcoal/20 bg-white px-3"><option value="30">30 seconds</option><option value="45">45 seconds</option><option value="60">60 seconds</option></select></label>
          <label className="text-sm font-bold text-midnight">Starting points<input type="number" value={settings.startingPoints} onChange={(e) => setSettings({ ...settings, startingPoints: Number(e.target.value) })} className="tabular mt-2 h-12 w-full rounded-xl border border-charcoal/20 bg-white px-4" /></label>
          <label className="text-sm font-bold text-midnight">Maximum tai<select value={settings.maximumTai} onChange={(e) => setSettings({ ...settings, maximumTai: Number(e.target.value) })} className="mt-2 h-12 w-full rounded-xl border border-charcoal/20 bg-white px-3"><option>8</option><option>12</option><option>16</option></select></label>
          <div className="space-y-3 pt-1">{[['Private room','privateRoom'],['Allow spectators','allowSpectators']].map(([label,key]) => <label key={key} className="flex min-h-11 items-center justify-between gap-3 text-sm font-bold text-midnight">{label}<input type="checkbox" checked={Boolean(settings[key as keyof RoomSettings])} onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })} className="h-5 w-5 accent-peacock" /></label>)}</div>
        </div>
        <Button type="submit" className="w-full" withArrow>Create Room</Button>
      </form>
    </Modal>
  </AppShell>
}
