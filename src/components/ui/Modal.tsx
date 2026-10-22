import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-xl' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; maxWidth?: string }) {
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open, onClose])

  return <AnimatePresence>{open && (
    <motion.div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[#070a14]/82 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <motion.section role="dialog" aria-modal="true" aria-labelledby="modal-title" initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} className={`brass-corners my-auto w-full ${maxWidth} rounded-3xl border border-marigold/30 bg-ivory p-6 text-charcoal shadow-2xl sm:p-8`}>
        <header className="mb-6 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-2xl font-extrabold tracking-tight text-midnight">{title}</h2>
          <button onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-charcoal/15 hover:bg-charcoal/5" aria-label={`Close ${title}`}><X size={19} /></button>
        </header>
        {children}
      </motion.section>
    </motion.div>
  )}</AnimatePresence>
}
