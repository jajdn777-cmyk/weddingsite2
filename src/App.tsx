import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, Heart } from 'lucide-react';
import { ShootingStarsCanvas } from './components/ShootingStarsCanvas';
import { IntroVideoOverlay } from './components/IntroVideoOverlay';
import {
  BackgroundMusic,
  type BackgroundMusicHandle,
} from './components/BackgroundMusic';
import { WeddingCard } from './components/WeddingCard';
import { FoggedCountdown } from './components/FoggedCountdown';
import { PoemSection } from './components/PoemSection';
import { ScheduleSection } from './components/ScheduleSection';
import { DressCodeSection } from './components/DressCodeSection';
import { RsvpSection } from './components/RsvpSection';
import { VenueSection } from './components/VenueSection';
import {
  BotanicalBlossomSvg,
  BotanicalCornerAsset,
} from './components/FloralDecorations';

function shouldAutostart(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('autostart') === '1';
}

export default function App() {
  const autostart = shouldAutostart();
  const [introFinished, setIntroFinished] = useState(autostart);
  const [siteRevealed, setSiteRevealed] = useState(autostart);
  const [logoError, setLogoError] = useState(false);
  const musicRef = useRef<BackgroundMusicHandle | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="top" className="relative min-h-screen bg-[#F7F1EB] text-[#434634]">

      {/* Animated shooting stars & drifting petals */}
      <ShootingStarsCanvas />

      {/* Background music starting cleanly when intro video finishes + bottom-left mute toggle */}
      <BackgroundMusic
        ref={musicRef}
        shouldPlay={introFinished}
        showControl={siteRevealed}
      />

      {/* First screen: Wax seal envelope video overlay (no text on top) */}
      {!introFinished && (
        <IntroVideoOverlay
          onTapUnlock={() => musicRef.current?.unlockFromGesture()}
          onRevealStart={() => setSiteRevealed(true)}
          onComplete={() => setIntroFinished(true)}
        />
      )}

      {/* Main site content (no header, no top RSVP button): unblurs smoothly after video */}
      <motion.div
        initial={
          autostart
            ? { opacity: 1, filter: 'blur(0px)', scale: 1 }
            : { opacity: 0, filter: 'blur(18px)', scale: 1.03 }
        }
        animate={
          siteRevealed
            ? { opacity: 1, filter: 'blur(0px)', scale: 1 }
            : { opacity: 0, filter: 'blur(18px)', scale: 1.03 }
        }
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        data-testid="main-invitation-shell"
        data-revealed={siteRevealed ? 'true' : 'false'}
        className="relative z-10"
      >
        <div>
          <WeddingCard
            videoEnded={siteRevealed}
            isOverlayBlocking={!siteRevealed}
          />
          <FoggedCountdown />
          <PoemSection />
          <ScheduleSection />
          <DressCodeSection />
          <RsvpSection />
          <VenueSection />
        </div>

        <footer className="relative z-10 overflow-hidden border-t border-[#7A8E74]/25 bg-[#F7F1EB] px-4 py-12 text-center">
          <BotanicalCornerAsset
            variant="leaf-br"
            corner="bl"
            opacity={0.34}
            swayDegrees={0.8}
            className="w-14 sm:w-32 lg:w-44"
          />
          <BotanicalCornerAsset
            variant="leaf-br"
            corner="br"
            opacity={0.34}
            swayDegrees={0.8}
            className="w-14 sm:w-32 lg:w-44"
          />
          <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center space-y-4">
            <BotanicalBlossomSvg className="h-11 w-11" />
            <p
              style={{ fontFamily: 'var(--font-calligraphy)' }}
              className="text-3xl text-[#434634] sm:text-4xl"
            >
              امیره و لطیف
            </p>
            <p className="text-xs leading-relaxed text-[#5D634E] sm:text-sm">
              با سپاس از تشریف‌فرمایی و قدوم مبارک شما در این جشن فرخنده
            </p>
            <button
              type="button"
              onClick={scrollToTop}
              className="mt-2 inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[#546B57] transition-colors hover:text-[#434634]"
            >
              <span>بازگشت به بالا</span>
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <div className="mt-4 flex flex-col items-center gap-3 border-t border-[#7A8E74]/30 pt-6">
              {!logoError ? (
                <div className="h-16 w-16 overflow-hidden rounded-2xl shadow-[0_8px_22px_rgba(67,70,52,0.14)] ring-1 ring-[#BF9042]/45 sm:h-20 sm:w-20">
                  <img
                    src="/assets/aistudio/arvin_atelire_logo_d98b48cf.jpg"
                    alt="Arvin Atelier logo"
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#546B57] font-display text-lg font-bold text-[#FFFCF5] ring-1 ring-[#BF9042]/45">
                  AA
                </div>
              )}
              <p
                dir="ltr"
                lang="en"
                style={{ fontFamily: '"Cinzel", var(--font-card), serif' }}
                className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#5D634E] sm:text-sm"
              >
                <span>DESIGNED WITH LOVE BY THE ARVIN ATELIER TEAM</span>
                <Heart
                  aria-hidden="true"
                  className="h-3.5 w-3.5 shrink-0 fill-[#546B57] text-[#546B57]"
                />
              </p>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
