import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRsvpInput } from './rsvp';

test('validateRsvpInput accepts valid attending submission and normalizes whitespace', () => {
  const result = validateRsvpInput({
    fullName: '  آریا رحیمی  ',
    contact: ' aria@example.com ',
    attendance: 'attending',
    guests: 3,
    message: '  مبارک باشد!  ',
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
  assert.equal(result.normalized.fullName, 'آریا رحیمی');
  assert.equal(result.normalized.contact, 'aria@example.com');
  assert.equal(result.normalized.guests, 3);
  assert.equal(result.normalized.message, 'مبارک باشد!');
});

test('validateRsvpInput zeroes guest count when declining', () => {
  const result = validateRsvpInput({
    fullName: 'طارق منصور',
    contact: '+93 700 123 456',
    attendance: 'declining',
    guests: 2,
    message: 'آرزوی خوشبختی دارم.',
  });

  assert.equal(result.valid, true);
  assert.equal(result.normalized.guests, 0);
});

test('validateRsvpInput rejects invalid inputs with Dari error messages', () => {
  const result = validateRsvpInput({
    fullName: 'ا',
    contact: 'bad@email',
    attendance: 'attending',
    guests: 9,
    message: '',
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.contact);
  assert.ok(result.errors.guests);
});

test('validateRsvpInput accepts Persian-digit phone numbers', () => {
  const result = validateRsvpInput({
    fullName: 'احمد شکیب',
    contact: '۰۷۹۹ ۱۲۳ ۴۵۶',
    attendance: 'attending',
    guests: 1,
    message: '',
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});
