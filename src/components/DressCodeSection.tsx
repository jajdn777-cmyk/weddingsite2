import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BotanicalDividerSprigSvg } from './FloralDecorations';

interface AttireSwatch {
  id: string;
  persianName: string;
  hex: string;
  note: string;
}

const ATTIRE_SWATCHES: AttireSwatch[] = [
  {
    id: 'ivory-cream',
    persianName: 'عاجی و کرم روشن',
    hex: '#F2ECE1',
    note: 'رنگ‌های عاجی و کرم ملایم برای پیراهن‌های حریر، شال‌های دست‌دوز و لباس‌های رسمی.',
  },
  {
    id: 'sage-green',
    persianName: 'سبز مریم‌گلی ملایم',
    hex: '#7A8E74',
    note: 'سبز مریم‌گلی لطیف هماهنگ با برگ‌های سبز و گل‌آرایی محفل.',
  },
  {
    id: 'forest-olive',
    persianName: 'سبز زیتونی تیره',
    hex: '#546B57',
    note: 'طیف سبز زیتونی عمیق برای درخشش آرام و باوقار در نورپردازی تالار.',
  },
  {
    id: 'antique-gold',
    persianName: 'طلایی شامپاینی و بژ',
    hex: '#C9A461',
    note: 'رنگ‌های طلایی ملایم و بژ گرم برای کت‌وشلوار، دریشی و اکسسوری‌های مجلسی.',
  },
];

export function DressCodeSection() {
  const [selectedId, setSelectedId] = useState<string>(ATTIRE_SWATCHES[1].id);
  const activeSwatch =
    ATTIRE_SWATCHES.find((s) => s.id === selectedId) ?? ATTIRE_SWATCHES[1];

  return (
    <section
      id="dress-code"
      className="relative z-10 mx-auto max-w-2xl px-5 py-16 text-center sm:px-8 sm:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-lg"
      >
        <div className="mb-3 flex justify-center">
          <BotanicalDividerSprigSvg className="h-7 w-40 opacity-85" />
        </div>
        <span
          dir="ltr"
          style={{ fontFamily: '"Cinzel", var(--font-card), serif' }}
          className="block text-[11px] font-semibold uppercase tracking-[0.26em] text-[#7A8E74]"
        >
          DRESS CODE
        </span>
        <h2 className="mt-2 font-display text-3xl font-bold text-[#434634] sm:text-4xl">
          پوشش پیشنهادی
        </h2>
        <div
          aria-hidden="true"
          className="mx-auto mt-3.5 h-px w-12 bg-gradient-to-r from-transparent via-[#BF9042]/75 to-transparent"
        />

        <p className="mt-6 text-sm leading-[2] text-[#565B48] sm:text-base">
          لباس رسمی در طیف رنگ‌های سبز مریم‌گلی، عاجی کرم، سبز زیتونی و طلایی
          ملایم، با انتخاب پارچه و سبک دلخواه شما.
        </p>

        {/* Minimal circular palette swatches with generous touch target */}
        <div
          role="group"
          aria-label="رنگ‌های پیشنهادی پوشش"
          className="mt-9 flex items-center justify-center gap-5 sm:gap-7"
        >
          {ATTIRE_SWATCHES.map((swatch) => {
            const isSelected = swatch.id === activeSwatch.id;
            return (
              <button
                key={swatch.id}
                type="button"
                onClick={() => setSelectedId(swatch.id)}
                aria-pressed={isSelected}
                aria-label={swatch.persianName}
                className="group relative flex min-h-[48px] min-w-[48px] cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#546B57] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F1EB]"
              >
                <span
                  aria-hidden="true"
                  className={`block h-11 w-11 rounded-full border border-[#434634]/25 shadow-sm transition-transform duration-200 sm:h-13 sm:w-13 ${
                    isSelected
                      ? 'scale-110 ring-2 ring-[#546B57] ring-offset-4 ring-offset-[#F7F1EB]'
                      : 'opacity-85 group-hover:scale-105 group-hover:opacity-100'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="sr-only">{swatch.persianName}</span>
              </button>
            );
          })}
        </div>

        {/* Clean single-level description caption */}
        <div className="mx-auto mt-8 max-w-md border-t border-[#7A8E74]/30 pt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSwatch.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-[54px]"
            >
              <p className="font-display text-lg font-bold text-[#434634]">
                {activeSwatch.persianName}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#5D634E] sm:text-sm">
                {activeSwatch.note}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
