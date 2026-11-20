export interface CardTriggerState {
  hasTriggered: boolean;
  isOverlayBlocking: boolean;
  videoEnded: boolean;
  isIntersecting: boolean;
}

export function canTriggerInitialPlay(state: CardTriggerState): boolean {
  if (state.hasTriggered || state.isOverlayBlocking) {
    return false;
  }
  return state.videoEnded || state.isIntersecting;
}
