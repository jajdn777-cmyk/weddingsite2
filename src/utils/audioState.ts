export interface MusicPlaybackState {
  hasStarted: boolean;
  isMuted: boolean;
  isPlaying: boolean;
}

export function getNextMusicToggle(state: MusicPlaybackState): MusicPlaybackState {
  if (!state.hasStarted || !state.isPlaying) {
    return {
      hasStarted: true,
      isMuted: false,
      isPlaying: true,
    };
  }

  const nextMuted = !state.isMuted;
  return {
    hasStarted: true,
    isMuted: nextMuted,
    isPlaying: true,
  };
}
