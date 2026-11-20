import test from 'node:test';
import assert from 'node:assert/strict';
import { canTriggerInitialPlay } from './engagementCardTrigger';

test('does not trigger behind the opening video overlay even when intersecting', () => {
  assert.equal(
    canTriggerInitialPlay({
      hasTriggered: false,
      isOverlayBlocking: true,
      videoEnded: false,
      isIntersecting: true,
    }),
    false,
  );
});

test('triggers once when opening video ends', () => {
  assert.equal(
    canTriggerInitialPlay({
      hasTriggered: false,
      isOverlayBlocking: false,
      videoEnded: true,
      isIntersecting: false,
    }),
    true,
  );
});

test('triggers once when card scrolls into view after overlay clears', () => {
  assert.equal(
    canTriggerInitialPlay({
      hasTriggered: false,
      isOverlayBlocking: false,
      videoEnded: false,
      isIntersecting: true,
    }),
    true,
  );
});

test('never auto-triggers a second time once hasTriggered is true', () => {
  assert.equal(
    canTriggerInitialPlay({
      hasTriggered: true,
      isOverlayBlocking: false,
      videoEnded: true,
      isIntersecting: true,
    }),
    false,
  );
});
