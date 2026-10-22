import { motion } from 'framer-motion'

const hand = ['一', '二', '三', '四', '五', '六', '七', '八', '九']

function Tile({ mark, delay = 0 }: { mark: string; delay?: number }) {
  const red = mark === '中'
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28 }}
      className={`tile-shadow flex h-10 w-7 items-center justify-center rounded-[5px] border border-[#e5dcc6] bg-ivory text-[13px] font-extrabold sm:h-12 sm:w-8 ${red ? 'text-terracotta' : 'text-peacock'}`}
      aria-hidden="true"
    >
      {mark}
    </motion.span>
  )
}

function Player({ name, score, className, active = false }: { name: string; score: string; className: string; active?: boolean }) {
  return (
    <div className={`absolute flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-bold shadow-lg backdrop-blur-md sm:text-xs ${active ? 'border-marigold bg-marigold text-midnight' : 'border-ivory/15 bg-midnight/85 text-ivory'} ${className}`}>
      <span className={`grid h-6 w-6 place-items-center rounded-full ${active ? 'bg-midnight text-marigold' : 'bg-ivory/10 text-ivory'}`}>{name[0]}</span>
      <span>{name}</span>
      <span className="tabular opacity-70">{score}</span>
    </div>
  )
}

export function MahjongTable() {
  return (
    <div className="brass-corners ambient-shadow jaali-pattern relative mx-auto aspect-square w-full max-w-[560px] rounded-[32px] border border-marigold/25 bg-[#20253a] p-[8%]">
      <div className="relative h-full w-full rounded-[24px] border border-marigold/30 bg-peacock shadow-[inset_0_0_60px_rgba(0,0,0,.25)]">
        <div className="absolute inset-[13%] rounded-[18px] border border-ivory/10 bg-[#06483e] shadow-inner">
          <div className="absolute inset-1/2 grid h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl border border-marigold/35 bg-midnight/55">
            <div className="text-center">
              <div className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-marigold/75">East round</div>
              <div className="tabular text-lg font-extrabold text-ivory sm:text-2xl">00:42</div>
              <div className="mt-1 text-[9px] font-semibold text-ivory/55">YOUR TURN</div>
            </div>
          </div>
          <div className="absolute left-1/2 top-[8%] flex -translate-x-1/2 gap-1 opacity-65">
            {['北', '白', '發', '中', '東'].map((mark) => <Tile key={mark} mark={mark} />)}
          </div>
          <div className="absolute bottom-[7%] left-1/2 flex -translate-x-1/2 gap-1">
            {hand.slice(1, 8).map((mark, i) => <Tile key={mark} mark={mark} delay={0.25 + i * 0.04} />)}
          </div>
          <div className="absolute left-[7%] top-1/2 flex -translate-y-1/2 flex-col gap-1 opacity-55">
            {['三', '七', '東', '發'].map((mark) => <Tile key={mark} mark={mark} />)}
          </div>
          <div className="absolute right-[7%] top-1/2 flex -translate-y-1/2 flex-col gap-1 opacity-55">
            {['六', '九', '南', '中'].map((mark) => <Tile key={mark} mark={mark} />)}
          </div>
        </div>
        <Player name="Meera" score="+24" className="left-1/2 top-2 -translate-x-1/2" />
        <Player name="Kabir" score="+8" className="right-2 top-1/2 -translate-y-1/2" />
        <Player name="You" score="+31" className="bottom-2 left-1/2 -translate-x-1/2" active />
        <Player name="Tara" score="+17" className="left-2 top-1/2 -translate-y-1/2" />
      </div>
      <div className="pointer-events-none absolute left-[3%] top-[3%] h-10 w-10 rounded-full border border-marigold/20" />
      <div className="pointer-events-none absolute bottom-[3%] right-[3%] h-10 w-10 rounded-full border border-marigold/20" />
    </div>
  )
}
