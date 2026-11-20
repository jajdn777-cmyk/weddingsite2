import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MapPin, Navigation } from 'lucide-react';
import { BotanicalCornerAsset } from './FloralDecorations';

export function VenueSection() {
  const reduceMotion = useReducedMotion();
  const [chandelierError, setChandelierError] = useState(false);

  return (
    <section
      id="venue"
      className="relative z-10 w-full overflow-hidden border-t border-[#7A8E74]/25 pt-0 pb-20 text-center sm:pb-24"
    >
      <BotanicalCornerAsset
        variant="leaf-tl"
        corner="tl"
        opacity={0.48}
        swayDegrees={0.95}
        className="w-24 sm:w-40 lg:w-48"
      />
      <BotanicalCornerAsset
        variant="leaf-tl"
        corner="tr"
        opacity={0.48}
        swayDegrees={0.95}
        className="w-24 sm:w-40 lg:w-48"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        {/* Ceiling-mounted chandelier anchored flush to the section's top border */}
        {!chandelierError && (
          <motion.div
            aria-hidden="true"
            data-testid="venue-chandelier"
            initial={reduceMotion ? false : { opacity: 0, y: -56, scale: 1.05 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none relative z-10 mx-auto mb-2 flex w-36 flex-col items-center sm:w-44"
          >
            {/* Delicate antique-gold ceiling mount anchoring the chandelier chain to the top border */}
            <svg
              viewBox="0 0 40 14"
              fill="none"
              className="relative z-20 h-3.5 w-10"
            >
              <path
                d="M2 0 H38 C32 4 26 6 20 6 C14 6 8 4 2 0 Z"
                fill="#BF9042"
                fillOpacity="0.38"
              />
              <line
                x1="20"
                y1="5.5"
                x2="20"
                y2="10"
                stroke="#8C6324"
                strokeWidth="1.2"
                strokeOpacity="0.75"
              />
              <circle
                cx="20"
                cy="11.5"
                r="2"
                stroke="#8C6324"
                strokeWidth="1.1"
                strokeOpacity="0.8"
                fill="#F7F1EB"
              />
            </svg>
            <div
              aria-hidden="true"
              className="absolute inset-x-2 top-10 bottom-2 rounded-full bg-[radial-gradient(circle_at_50%_58%,rgba(255,252,245,0.85)_0%,rgba(247,241,235,0.22)_56%,transparent_76%)]"
            />
            <motion.img
              src="/assets/aistudio/chandelier-removebg-preview_d271c721.png"
              alt=""
              referrerPolicy="no-referrer"
              onError={() => setChandelierError(true)}
              animate={reduceMotion ? undefined : { rotate: [-1.1, 1.1, -1.1] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                transformOrigin: 'top center',
                filter: 'contrast(0.92) brightness(1.06)',
              }}
              className="relative z-10 -mt-1.5 h-auto w-full opacity-80 mix-blend-multiply select-none"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <span className="block text-xs font-semibold tracking-widest text-[#7A8E74]">
            محل برگزاری
          </span>
          <h2 className="mt-1.5 font-display text-3xl font-bold text-[#434634] sm:text-4xl">
            تالار عروسی تاج کانتیننتال · تالار فریال
          </h2>
          <div className="mx-auto mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#BF9042] to-transparent" />

          <div className="mt-8 overflow-hidden rounded-3xl border border-[#7A8E74]/35 bg-gradient-to-b from-[#FCF9F4]/95 to-[#F1EAE0]/90 shadow-[0_12px_36px_rgba(67,70,52,0.12)]">
            {/* Exact requested Google Maps iframe */}
            <div className="relative aspect-[4/3] w-full bg-[#EDE6DA] sm:aspect-[16/9]">
              <iframe
                title="نقشه تالار عروسی تاج کانتیننتال"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3286.6108806804455!2d69.14069517633226!3d34.53808529191994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d16f211dfc784b%3A0x75a57d1ecfc6edcd!2zVGFqIENvbnRpbmVudGFsIFdlZGRpbmcgSGFsbCDYqtin2YTYp9ixINi52LHZiNiz24wg2KrYp9isINqp2KfZhtiq24zZhtmG2KrYp9mE!5e0!3m2!1sen!2snl!4v1794991171153!5m2!1sen!2snl"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full"
              />
            </div>

            <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row sm:px-8">
              <div className="flex items-center gap-2 text-sm font-medium text-[#434634]">
                <MapPin className="h-4 w-4 shrink-0 text-[#546B57]" aria-hidden="true" />
                <span>کابل، تالار عروسی تاج کانتیننتال</span>
              </div>

              <a
                href="https://maps.google.com/?q=Taj+Continental+Wedding+Hall+Kabul"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5E7761] via-[#546B57] to-[#5E7761] px-6 py-2.5 text-xs font-bold text-[#FFFCF5] shadow-sm transition-all hover:brightness-105 whitespace-nowrap shrink-0"
              >
                <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                <span>مسیریابی در گوگل مپ</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
