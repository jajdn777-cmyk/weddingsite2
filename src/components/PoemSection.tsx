import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { BotanicalCornerAsset } from './FloralDecorations';

const POEM_LINES = [
  'به نام آنکه جان را فکرت آموخت',
  'چراغ دل به نور جان برافروخت',
  'بیا تا گل برافشانیم و می در ساغر اندازیم',
  'فلک را سقف بشکافیم و طرحی نو دراندازیم',
];

export function PoemSection() {
  return (
    <section
      id="poem"
      aria-label="شعر دعوت‌نامه"
      className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-[#BF9042]/35 bg-gradient-to-b from-[#FCF9F4]/90 via-[#F4EDE3]/85 to-[#FAF4EB]/90 px-6 py-14 text-center shadow-[0_12px_36px_rgba(67,70,52,0.07)] sm:px-14 sm:py-16"
      >
        <BotanicalCornerAsset
          variant="flower-tr"
          corner="tr"
          opacity={0.56}
          swayDegrees={0.85}
          className="w-24 sm:w-36"
        />
        <BotanicalCornerAsset
          variant="flower-bl"
          corner="bl"
          opacity={0.56}
          swayDegrees={0.85}
          className="w-24 sm:w-36"
        />

        <div className="relative z-10 mb-7 flex items-center justify-center gap-3 text-[#BF9042]">
          <span className="h-px w-16 bg-gradient-to-l from-[#BF9042]/75 to-transparent" />
          <Sparkles className="h-4 w-4 text-[#BF9042]" aria-hidden="true" />
          <span className="h-px w-16 bg-gradient-to-r from-[#BF9042]/75 to-transparent" />
        </div>

        <div dir="rtl" lang="fa" className="relative z-10 space-y-4 sm:space-y-6">
          {POEM_LINES.map((line, idx) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, filter: 'blur(6px)', y: 10 }}
              whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.85,
                delay: idx * 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ fontFamily: 'var(--font-calligraphy)' }}
              className="text-2xl leading-[2.4] font-normal text-[#434634] sm:text-3xl sm:leading-[2.45]"
            >
              {line}
            </motion.p>
          ))}
        </div>

        <div className="relative z-10 mt-7 flex items-center justify-center gap-3 text-[#BF9042]">
          <span className="h-px w-16 bg-gradient-to-l from-[#BF9042]/75 to-transparent" />
          <span aria-hidden="true" className="font-display text-base text-[#546B57]">
            ❦
          </span>
          <span className="h-px w-16 bg-gradient-to-r from-[#BF9042]/75 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
