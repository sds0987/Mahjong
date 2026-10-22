import { UsersRound } from 'lucide-react'
import type { ReactNode } from 'react'

export function EmptyState({ title, copy, action }: { title: string; copy: string; action?: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-ivory/20 p-7 text-center"><UsersRound className="mx-auto text-marigold" /><h3 className="mt-4 font-extrabold text-ivory">{title}</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-ivory/55">{copy}</p>{action && <div className="mt-5">{action}</div>}</div>
}
