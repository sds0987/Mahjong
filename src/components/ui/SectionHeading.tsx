export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="max-w-2xl"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-marigold">{eyebrow}</p><h1 className="mt-3 text-3xl font-extrabold tracking-[-.035em] text-ivory sm:text-4xl">{title}</h1>{copy && <p className="mt-3 text-sm leading-6 text-ivory/60 sm:text-base">{copy}</p>}</div>
}
