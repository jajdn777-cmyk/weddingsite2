import { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { getNextMusicToggle, type MusicPlaybackState } from '../utils/audioState';

const MUSIC_SRC =
  '/assets/aistudio/Arman_Garshasbi_-_Benshin_Tamashayat_Konam_Music_Video__________________________________-_Arman_Garshasbi__128k__19d71b94.mp3';

export interface BackgroundMusicHandle {
  unlockFromGesture: () => void;
}

interface BackgroundMusicProps {
  ref?: React.Ref<BackgroundMusicHandle>;
  shouldPlay: boolean;
  showControl: boolean;
}

export function BackgroundMusic({
  ref,
  shouldPlay,
  showControl,
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedFromVideoRef = useRef(false);
  const [state, setState] = useState<MusicPlaybackState>({
    hasStarted: false,
    isMuted: false,
    isPlaying: false,
  });

  useImperativeHandle(ref, () => ({
    unlockFromGesture() {
      const audio = audioRef.current;
      if (!audio || startedFromVideoRef.current) return;
      audio.muted = true;
      audio
        .play()
        .then(() => {
          if (!startedFromVideoRef.current) {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
          }
        })
        .catch(() => {
          audio.muted = false;
        });
    },
  }));

  useEffect(() => {
    if (!shouldPlay || startedFromVideoRef.current) return;
    startedFromVideoRef.current = true;

    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio.volume = 0.85;
    audio
      .play()
      .then(() => {
        setState({ hasStarted: true, isMuted: false, isPlaying: true });
      })
      .catch(() => {
        // Browser blocked unmuted autoplay (e.g. ?autostart=1 without prior tap); show unmute state ready to play on click
        setState({ hasStarted: false, isMuted: true, isPlaying: false });
      });
  }, [shouldPlay]);

  const handleToggleMute = async () => {
    const audio = audioRef.current;
    const next = getNextMusicToggle(state);

    if (audio) {
      audio.muted = next.isMuted;
      if (audio.paused) {
        try {
          audio.volume = 0.85;
          await audio.play();
        } catch {
          // Ignore playback restriction errors cleanly
        }
      }
    }

    setState(next);
  };

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />

      {showControl && (
        <motion.button
          type="button"
          onClick={handleToggleMute}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          data-testid="music-mute-button"
          aria-pressed={state.isMuted}
          aria-label={state.isMuted ? 'پخش موسیقی' : 'قطع موسیقی'}
          className="fixed bottom-[max(14px,env(safe-area-inset-bottom,0px))] left-[max(14px,env(safe-area-inset-left,0px))] z-40 flex h-11 w-11 min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-[#7A8E74]/45 bg-[#FFFCF5]/88 text-[#434634] shadow-[0_6px_20px_rgba(67,70,52,0.14)] backdrop-blur-md transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#546B57]"
        >
          {state.isMuted ? (
            <VolumeX className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          )}
        </motion.button>
      )}
    </>
  );
}
