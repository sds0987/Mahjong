import type { HTMLAttributes, ReactNode } from 'react'

export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <div className={`rounded-2xl border border-ivory/12 bg-ivory/[.045] shadow-[0_16px_50px_rgba(2,6,18,.16)] ${className}`} {...props}>{children}</div>
}
