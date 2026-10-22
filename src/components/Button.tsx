import { ArrowRight } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  withArrow?: boolean
}

export function Button({ children, variant = 'primary', withArrow = false, className = '', ...props }: Props) {
  const styles = {
    primary: 'bg-marigold text-midnight hover:bg-[#ffc33f] border-marigold',
    secondary: 'bg-ivory/5 text-ivory hover:bg-ivory/10 border-ivory/25',
    ghost: 'bg-transparent text-ivory hover:text-marigold border-transparent',
  }

  return (
    <button
      className={`mj-button mj-button--${variant} inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-extrabold transition-colors disabled:cursor-not-allowed disabled:border-ivory/15 disabled:bg-ivory/8 disabled:text-ivory/35 disabled:opacity-100 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
      {withArrow && <ArrowRight size={17} aria-hidden="true" />}
    </button>
  )
}
