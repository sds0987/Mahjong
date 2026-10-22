import { Check, Copy, Crown, LogOut, MessageCircle, Play, Send, Share2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { PlayerAvatar } from '../components/game/PlayerAvatar'
import { RuleBadge } from '../components/game/RuleBadge'
import { AppShell } from '../components/layout/AppShell'
import { Card } from '../components/ui/Card'
import { Modal } from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { useApp } from '../context/AppContext'
import { chatMessages } from '../data/mockData'

export function RoomPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { room, player, toggleReady, fillSeats } = useApp()
  const { showToast } = useToast()
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(chatMessages)
  const allReady = room.players.every((item) => item?.ready)

  const copyCode = () => navigator.clipboard?.writeText(roomCode || room.code).then(() => showToast('Room code copied'))
  const send = () => { if (!message.trim()) return; setMessages((items) => [...items, { id: Date.now(), name: 'Ananya', text: message.trim(), time: 'Now' }]); setMessage('') }

  return <AppShell>
    <div className="flex flex-wrap items-start justify-between gap-5">
      <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-marigold">Private room</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight">{room.settings.roomName}</h1><div className="mt-3 flex flex-wrap items-center gap-3"><RuleBadge /><span className="text-xs font-semibold text-ivory/45">Host: {player.name}</span></div></div>
      <div className="flex items-center gap-2 rounded-2xl border border-marigold/25 bg-marigold/8 p-2 pl-4"><div><span className="block text-[9px] font-extrabold uppercase tracking-widest text-ivory/45">Room code</span><strong className="tabular text-lg tracking-[.14em] text-marigold">{roomCode || room.code}</strong></div><button onClick={copyCode} className="grid h-11 w-11 place-items-center rounded-xl bg-marigold text-midnight" aria-label="Copy room code"><Copy size={18} /></button></div>
    </div>

    <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
      <div>
        <Card className="jaali-pattern brass-corners border-marigold/20 bg-peacock p-5 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {room.players.map((seat, index) => seat ? <article key={seat.id} className="flex min-h-40 flex-col justify-between rounded-2xl border border-ivory/15 bg-midnight/35 p-5">
              <div className="flex items-start justify-between"><PlayerAvatar player={seat} size="lg" />{seat.id === room.hostId && <span className="inline-flex items-center gap-1 rounded-full bg-marigold px-2.5 py-1 text-[10px] font-extrabold text-midnight"><Crown size={11} />HOST</span>}</div>
              <div><h2 className="font-extrabold">{seat.name}</h2><div className="mt-2 flex items-center gap-2"><span className={`inline-flex items-center gap-1.5 text-xs font-bold ${seat.ready ? 'text-emerald' : 'text-ivory/45'}`}>{seat.ready ? <Check size={15} /> : <i className="h-2 w-2 rounded-full border border-current" />}{seat.ready ? 'Ready' : 'Getting ready'}</span><span className="tabular text-xs text-ivory/35">{seat.rating} rating</span></div></div>
            </article> : <article key={index} className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-ivory/25 bg-midnight/15 p-5 text-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-ivory/8 text-marigold"><UserPlus size={21} /></span><h2 className="mt-3 text-sm font-extrabold">Seat {index + 1} is open</h2><button onClick={() => showToast('Invite link copied')} className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-bold text-marigold"><Share2 size={14} />Invite a player</button></article>)}
          </div>
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-ivory/12 bg-midnight/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm font-extrabold">Host controls</p><p className="mt-1 text-xs text-ivory/45">Fill the remaining seat with a mock player to test the full flow.</p></div><Button variant="secondary" onClick={() => { fillSeats(); showToast('All seats filled and ready') }}><UserPlus size={17} />Fill mock seats</Button>
          </div>
        </Card>

        <Card className="mt-5 p-5 sm:p-6"><h2 className="font-extrabold">Rules summary</h2><div className="mt-4 grid gap-3 text-sm sm:grid-cols-4"><RuleStat label="Rules" value="Taiwanese 16-Tile" /><RuleStat label="Turn timer" value={`${room.settings.turnTimer}s`} /><RuleStat label="Starting points" value={room.settings.startingPoints.toLocaleString('en-IN')} /><RuleStat label="Maximum" value={`${room.settings.maximumTai} tai`} /></div></Card>
      </div>

      <Card className="flex min-h-[520px] flex-col overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ivory/10 p-5"><MessageCircle size={18} className="text-marigold" /><h2 className="font-extrabold">Table chat</h2></div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((item) => <div key={item.id}><div className="flex items-baseline justify-between gap-3"><strong className="text-xs text-marigold">{item.name}</strong><span className="tabular text-[10px] text-ivory/30">{item.time}</span></div><p className="mt-1 rounded-xl rounded-tl-sm bg-ivory/7 px-3 py-2.5 text-sm leading-5 text-ivory/75">{item.text}</p></div>)}</div>
        <div className="border-t border-ivory/10 p-3"><div className="flex gap-2"><input aria-label="Chat message" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Message the table" className="min-w-0 flex-1 rounded-xl border border-ivory/12 bg-ivory/7 px-3 text-sm text-ivory placeholder:text-ivory/30" /><button onClick={send} aria-label="Send message" className="grid h-11 w-11 place-items-center rounded-xl bg-marigold text-midnight"><Send size={17} /></button></div></div>
      </Card>
    </div>

    <div className="mt-6 flex flex-col-reverse gap-3 rounded-2xl border border-ivory/10 bg-[#0d1222] p-4 sm:flex-row sm:items-center sm:justify-between">
      <button onClick={() => setLeaveOpen(true)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-terracotta/35 px-5 text-sm font-extrabold text-[#ff9f82] hover:bg-terracotta/10"><LogOut size={17} />Leave Room</button>
      <div className="flex flex-col gap-3 sm:flex-row"><Button variant="secondary" onClick={toggleReady}>{room.players[0]?.ready ? 'Mark Not Ready' : 'I’m Ready'}</Button><Button disabled={!allReady} onClick={() => navigate('/game/IND-482')} withArrow><Play size={17} />Start Match</Button></div>
    </div>
    {!allReady && <p className="mt-3 text-right text-xs text-ivory/40">Start Match unlocks when all four occupied seats are ready.</p>}

    <Modal open={leaveOpen} onClose={() => setLeaveOpen(false)} title="Leave this room?">
      <p className="text-sm leading-6 text-charcoal/70">Your seat will become available and the host may invite another player.</p><div className="mt-7 flex gap-3"><button onClick={() => setLeaveOpen(false)} className="min-h-12 flex-1 rounded-xl border border-charcoal/20 font-bold">Stay</button><Button onClick={() => navigate('/lobby')} className="flex-1">Leave Room</Button></div>
    </Modal>
  </AppShell>
}

function RuleStat({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-ivory/5 p-3"><span className="text-[9px] font-bold uppercase tracking-wider text-ivory/35">{label}</span><p className="tabular mt-1 font-bold text-ivory/80">{value}</p></div> }
