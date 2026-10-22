import { LockKeyhole, UsersRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '../ui/Card'

export function RoomCard({ title, copy, action, comingSoon = false }: { title: string; copy: string; action?: ReactNode; comingSoon?: boolean }) {
  return <Card className="relative p-5"><div className="flex items-start justify-between gap-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-peacock text-white">{comingSoon ? <UsersRound size={20} /> : <LockKeyhole size={20} />}</span>{comingSoon && <span className="rounded-full border border-marigold/30 bg-marigold/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-marigold">Coming soon</span>}</div><h3 className="mt-5 text-lg font-extrabold text-ivory">{title}</h3><p className="mt-2 text-sm leading-6 text-ivory/55">{copy}</p>{action && <div className="mt-5">{action}</div>}</Card>
}
