export function ScoreBadge({ score, dark = false }: { score: number; dark?: boolean }) {
  return <span className={`tabular rounded-full px-2 py-1 text-[10px] font-extrabold ${dark ? 'bg-midnight/8 text-midnight' : 'bg-ivory/10 text-ivory'}`}>{score.toLocaleString('en-IN')}</span>
}
