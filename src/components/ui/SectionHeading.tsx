export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="max-w-2xl"><p className="mj-eyebrow text-xs font-extrabold uppercase tracking-[.2em] text-marigold">{eyebrow}</p><h1 className="mj-section-title mt-3 text-3xl font-extrabold tracking-[-.035em] text-ivory sm:text-4xl">{title}</h1>{copy && <p className="mj-description mt-3 text-sm leading-6 text-ivory/60 sm:text-base">{copy}</p>}</div>
}
