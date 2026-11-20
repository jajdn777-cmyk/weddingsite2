import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Cake, DoorOpen, Heart, Sparkles, Utensils } from 'lucide-react';
import { BotanicalCornerAsset, ScheduleGardeniaSvg } from './FloralDecorations';

const SCHEDULE_ITEMS = [
  {
    time: '۰۶:۰۰ شام',
    title: 'ورود و استقبال از مهمانان گرامی',
    description: 'پذیرایی اولیه با چای، نوشیدنی‌های گرم و شیرینی سنتی',
    Icon: DoorOpen,
  },
  {
    time: '۰۷:۰۰ شب',
    title: 'تلاوت کلام‌الله مجید و آغاز محفل',
    description: 'خوش‌آمدگویی و طنین آیات متبرکه قرآن کریم',
    Icon: Sparkles,
  },
  {
    time: '۰۸:۰۰ شب',
    title: 'آیین شرعی عقد نکاح و نکاح‌خط',
    description: 'لحظهٔ مقدس ثبت پیوند زناشویی با حضور بزرگواران و شهود',
    Icon: Heart,
  },
  {
    time: '۰۹:۰۰ شب',
    title: 'صرف شام فاخر و پذیرایی',
    description: 'بوفهٔ کامل غذاهای اصیل افغانی و دسرها',
    Icon: Utensils,
  },
  {
    time: '۱۰:۰۰ شب',
    title: 'برش کیک و شادمانی پایان محفل',
    description: 'عکس‌های یادگاری، بریدن کیک و بدرود مهمانان عزیز',
    Icon: Cake,
  },
];

export function ScheduleSection() {
  const reduceMotion = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 72%', 'end 60%'],
  });

  const blossomTop = useTransform(scrollYProgress, [0, 1], ['4%', '94%']);
  const blossomRotate = useTransform(scrollYProgress, [0, 1], [-12, 32]);

  return (
    <section
      id="schedule"
      className="relative z-10 w-full overflow-hidden border-y border-[#7A8E74]/20 bg-[#F7F1EB] py-16 sm:py-24"
    >
      <BotanicalCornerAsset
        variant="leaf-tl"
        corner="tl"
        opacity={0.42}
        swayDegrees={0.95}
        className="w-24 sm:w-40 lg:w-48"
      />
      <BotanicalCornerAsset
        variant="leaf-br"
        corner="br"
        opacity={0.42}
        swayDegrees={0.95}
        className="w-24 sm:w-40 lg:w-48"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mb-14 text-center sm:mb-16"
        >
          <span className="block text-xs font-medium tracking-[0.14em] text-[#7A8E74]">
            برنامه محفل
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-[#434634] sm:text-4xl">
            محفل در یک نگاه
          </h2>
          <div
            aria-hidden="true"
            className="mx-auto mt-3.5 h-px w-12 bg-gradient-to-r from-transparent via-[#BF9042]/75 to-transparent"
          />
        </motion.div>

        <div ref={timelineRef} className="relative z-10 mx-auto max-w-2xl">
          {/* Minimal vertical axis line on the right */}
          <div
            aria-hidden="true"
            className="absolute top-3 bottom-3 right-3.5 w-[1.5px] bg-[#7A8E74]/45 sm:right-4"
          />

          {/* Card-matched white gardenia blossom with sage leaves & gold center anchored on the vertical axis */}
          <motion.div
            style={
              reduceMotion
                ? { top: '50%' }
                : { top: blossomTop, rotate: blossomRotate }
            }
            className="pointer-events-none absolute right-3.5 z-20 translate-x-1/2 -translate-y-1/2 drop-shadow-[0_6px_16px_rgba(84,107,87,0.28)] sm:right-4"
          >
            <div
              aria-hidden="true"
              className="absolute inset-1 rounded-full bg-[#BF9042]/20 blur-md"
            />
            <ScheduleGardeniaSvg className="relative h-10 w-10 sm:h-11 sm:w-11" />
          </motion.div>

          <ol className="space-y-10 sm:space-y-12">
            {SCHEDULE_ITEMS.map((item, idx) => {
              const IconComponent = item.Icon;
              return (
                <motion.li
                  key={item.time}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.7,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative flex items-start justify-between gap-4 pr-12 sm:gap-8 sm:pr-14"
                >
                  {/* Open minimal circular node centered on the right axis */}
                  <span
                    aria-hidden="true"
                    className="absolute top-2.5 right-3.5 z-10 h-3 w-3 translate-x-1/2 rounded-full border-2 border-[#546B57] bg-[#F7F1EB] sm:right-4"
                  />

                  {/* Right side in RTL: Title & concise description */}
                  <div className="min-w-0 flex-1 text-right">
                    <h3 className="font-display text-lg font-bold leading-snug text-[#434634] sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#5D634E] sm:text-sm">
                      {item.description}
                    </p>
                  </div>

                  {/* Left side in RTL: Time + minimal icon on far left */}
                  <div className="flex shrink-0 items-center gap-2 pt-1.5 text-xs font-medium text-[#546B57] tabular-nums sm:gap-2.5 sm:text-sm">
                    <span className="whitespace-nowrap">{item.time}</span>
                    <IconComponent
                      className="h-4 w-4 shrink-0 text-[#7A8E74]"
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
