import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CARD_GUTTER,
  CARD_HEIGHT,
  CARD_LINES,
  CARD_WIDTH,
  computeCardLayout,
  computeSansPlacement,
  computeScriptPlacement,
} from './weddingCardLayout';

test('CARD_LINES contains all 13 invitation lines in order', () => {
  assert.equal(CARD_LINES.length, 13);
  assert.equal(CARD_LINES[0]?.t, 'You Are Invited To');
  assert.equal(CARD_LINES[2]?.t, 'Amira');
  assert.equal(CARD_LINES[4]?.t, 'Latif');
  assert.equal(CARD_LINES[12]?.t, 'Reception to follow');
});

test('computeCardLayout centers content and caps corner artwork boost on wide desktop', () => {
  const layout = computeCardLayout(1440, 900);
  const expectedScale = 900 / CARD_HEIGHT;
  assert.ok(Math.abs(layout.scale - expectedScale) < 1e-6);
  assert.ok(Math.abs(layout.top) < 1e-6);
  assert.ok(Math.abs(layout.left - (1440 - CARD_WIDTH * expectedScale) / 2) < 1e-6);
  // Wide viewport triggers 1.5x boost cap
  assert.ok(Math.abs(layout.cornerScale - Number((expectedScale * 1.5).toFixed(4))) < 1e-6);
});

test('computeCardLayout fits within 16px side gutters on mobile portrait', () => {
  const layout = computeCardLayout(390, 844);
  const expectedScale = (390 - CARD_GUTTER * 2) / CARD_WIDTH;
  assert.ok(Math.abs(layout.scale - expectedScale) < 1e-6);
  assert.ok(Math.abs(layout.left - CARD_GUTTER) < 1e-6);
  assert.ok(layout.top > 0);
  // Corner scale matches base scale (no wide-screen boost needed when surplus ~ 1.09)
  assert.ok(layout.cornerScale >= layout.scale);
});

test('computeCardLayout guards against zero or negative dimensions', () => {
  const zero = computeCardLayout(0, 0);
  assert.deepEqual(zero, { scale: 1, left: 0, top: 0, cornerScale: 1 });
});

test('computeScriptPlacement scales font to target width and centers vertically', () => {
  const result = computeScriptPlacement(
    {
      targetLeft: 433,
      targetRight: 804,
      centerY: 621,
      inkAt100: { l: 10, r: 190, a: 70, d: 30 },
    },
    (fs) => ({
      l: 0.1 * fs,
      r: 1.9 * fs,
      a: 0.7 * fs,
      d: 0.3 * fs,
    }),
  );

  // target width = 371, width at 100px = 200 -> fontSize = 185.5
  assert.ok(Math.abs(result.fontSize - 185.5) < 1e-6);
  assert.equal(result.letterSpacing, 0);
  assert.ok(Math.abs(result.left - (433 + 18.55)) < 1e-6);
  // base = 621 + (0.7*185.5 - 0.3*185.5)/2 = 621 + 37.1 = 658.1
  assert.ok(Math.abs(result.base - 658.1) < 1e-6);
});

test('computeSansPlacement computes cap-scaled font size and letter spacing', () => {
  const singleChar = computeSansPlacement(
    {
      textLength: 1,
      targetLeft: 597,
      targetRight: 644,
      base: 775,
      cap: 50,
      refAscentAt200: 150,
    },
    () => ({ l: 2, r: 45, a: 50, d: 2 }),
  );
  assert.ok(Math.abs(singleChar.fontSize - (50 / 150) * 200) < 1e-6);
  assert.equal(singleChar.letterSpacing, 0);
  assert.equal(singleChar.left, 599);

  const multiChar = computeSansPlacement(
    {
      textLength: 5,
      targetLeft: 100,
      targetRight: 300,
      base: 400,
      cap: 30,
      refAscentAt200: 150,
    },
    () => ({ l: 0, r: 120, a: 30, d: 0 }),
  );
  // Target width 200 - ink width 120 = 80 over 4 gaps => 20px letter-spacing
  assert.equal(multiChar.letterSpacing, 20);
});
