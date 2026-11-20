export const WEDDING_DATE_ISO = '2026-11-30T18:00:00';

export interface CountdownBreakdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalSeconds: number;
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: number | string): string {
  return String(input).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

export function padTwo(value: number): string {
  const safe = Math.max(0, Math.floor(value));
  return String(safe).padStart(2, '0');
}

export function getCountdownBreakdown(
  targetIso: string = WEDDING_DATE_ISO,
  nowMs: number = Date.now(),
): CountdownBreakdown {
  const targetMs = new Date(targetIso).getTime();
  if (Number.isNaN(targetMs)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: false,
      totalSeconds: 0,
    };
  }

  const diffMs = targetMs - nowMs;
  const isPast = diffMs <= 0;
  const absSeconds = Math.floor(Math.abs(diffMs) / 1000);

  const days = Math.floor(absSeconds / 86400);
  const hours = Math.floor((absSeconds % 86400) / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast,
    totalSeconds: absSeconds,
  };
}
