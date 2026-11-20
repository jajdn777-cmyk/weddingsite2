import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getCountdownBreakdown,
  padTwo,
  toPersianDigits,
  WEDDING_DATE_ISO,
} from './countdown';

test('padTwo pads single digits and clamps negatives', () => {
  assert.equal(padTwo(0), '00');
  assert.equal(padTwo(7), '07');
  assert.equal(padTwo(42), '42');
  assert.equal(padTwo(-3), '00');
});

test('toPersianDigits converts ASCII digits to Dari/Persian numerals', () => {
  assert.equal(toPersianDigits('09'), '۰۹');
  assert.equal(toPersianDigits(12), '۱۲');
  assert.equal(toPersianDigits('2026'), '۲۰۲۶');
});

test('getCountdownBreakdown calculates exact remaining days, hours, minutes, seconds before Nov 30, 2026', () => {
  const targetMs = new Date(WEDDING_DATE_ISO).getTime();
  const offsetMs = ((12 * 24 + 5) * 3600 + 23 * 60 + 45) * 1000;
  const result = getCountdownBreakdown(WEDDING_DATE_ISO, targetMs - offsetMs);

  assert.equal(result.isPast, false);
  assert.equal(result.days, 12);
  assert.equal(result.hours, 5);
  assert.equal(result.minutes, 23);
  assert.equal(result.seconds, 45);
});
