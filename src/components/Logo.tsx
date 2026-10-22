import { Link } from 'react-router-dom'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-3" aria-label="The Mahjong Club home">
      <span className="grid h-10 w-10 grid-cols-2 gap-0.5 rounded-xl border border-marigold/45 bg-ivory p-1.5 shadow-sm transition-transform group-hover:-rotate-2">
        <span className="flex items-center justify-center rounded-[3px] bg-peacock text-[9px] font-extrabold text-ivory">東</span>
        <span className="flex items-center justify-center rounded-[3px] bg-midnight text-[9px] font-extrabold text-marigold">中</span>
        <span className="flex items-center justify-center rounded-[3px] bg-terracotta text-[9px] font-extrabold text-ivory">發</span>
        <span className="flex items-center justify-center rounded-[3px] bg-marigold text-[9px] font-extrabold text-midnight">萬</span>
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[10px] font-bold uppercase tracking-[0.24em] text-marigold">The</span>
          <span className="block text-[15px] font-extrabold tracking-tight text-ivory">Mahjong Club</span>
        </span>
      )}
    </Link>
  )
}
