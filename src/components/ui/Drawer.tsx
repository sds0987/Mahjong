import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  return <AnimatePresence>{open && <>
    <motion.button aria-label="Close drawer" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
    <motion.aside role="dialog" aria-modal="true" aria-label={title} className="fixed inset-x-0 bottom-0 z-[60] max-h-[82vh] overflow-y-auto rounded-t-3xl border-t border-marigold/30 bg-midnight p-5 shadow-2xl md:inset-y-0 md:left-auto md:w-[390px] md:rounded-none md:border-l md:border-t-0" initial={{ y: '100%', x: 0 }} animate={{ y: 0 }} exit={{ y: '100%' }}>
      <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-extrabold text-ivory">{title}</h2><button onClick={onClose} aria-label="Close drawer" className="grid h-11 w-11 place-items-center rounded-xl border border-ivory/15"><X size={19} /></button></div>
      {children}
    </motion.aside>
  </>}</AnimatePresence>
}
