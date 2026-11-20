import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextMusicToggle } from './audioState';

test('toggling mute unmutes and starts if playback had not yet started', () => {
  assert.deepEqual(
    getNextMusicToggle({ hasStarted: false, isMuted: true, isPlaying: false }),
    { hasStarted: true, isMuted: false, isPlaying: true },
  );
});

test('toggling mute mutes active playback and keeps track running', () => {
  assert.deepEqual(
    getNextMusicToggle({ hasStarted: true, isMuted: false, isPlaying: true }),
    { hasStarted: true, isMuted: true, isPlaying: true },
  );
});

test('toggling mute again restores sound cleanly', () => {
  assert.deepEqual(
    getNextMusicToggle({ hasStarted: true, isMuted: true, isPlaying: true }),
    { hasStarted: true, isMuted: false, isPlaying: true },
  );
});
