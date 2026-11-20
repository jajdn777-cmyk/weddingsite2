import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroVideoOverlayProps {
  onTapUnlock?: () => void;
  onRevealStart: () => void;
  onComplete: () => void;
}

export function IntroVideoOverlay({
  onTapUnlock,
  onRevealStart,
  onComplete,
}: IntroVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'blooming' | 'done'>('idle');
  const triggeredRevealRef = useRef(false);

  const beginReveal = () => {
    if (triggeredRevealRef.current) return;
    triggeredRevealRef.current = true;
    setPhase('blooming');
    onRevealStart();
    window.setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 850);
  };

  const handleTapToOpen = async () => {
    if (phase !== 'idle') return;
    onTapUnlock?.();
    const video = videoRef.current;
    if (!video) {
      beginReveal();
      return;
    }

    setPhase('playing');
    try {
      video.currentTime = 0;
      await video.play();
    } catch {
      beginReveal();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || triggeredRevealRef.current) return;
    if (video.duration && video.currentTime >= Math.max(0.2, video.duration - 0.5)) {
      beginReveal();
    }
  };

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="intro-curtain"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'blooming' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#F7F1EB]"
          data-testid="intro-video-overlay"
        >
          {/* Fullscreen click/tap surface with ZERO text overlay, matching the clean envelope experience */}
          <button
            type="button"
            onClick={handleTapToOpen}
            aria-label="باز کردن کارت دعوت"
            className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden focus:outline-none"
          >
            <video
              ref={videoRef}
              src="/assets/aistudio/tmpklt33x_z_b7fc9c16.mp4"
              playsInline
              muted
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={beginReveal}
              className="h-full w-full object-cover object-center"
            />
          </button>

          {/* Warm ivory-gold light bloom synced with the envelope shine */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={
              phase === 'blooming'
                ? { opacity: 1, scale: 1.8 }
                : { opacity: 0, scale: 0.7 }
            }
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,#FFFCF5_0%,#F7F1EB_46%,rgba(247,241,235,0.88)_76%,transparent_100%)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
