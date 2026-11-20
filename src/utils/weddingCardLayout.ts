export const CARD_WIDTH = 1240;
export const CARD_HEIGHT = 1748;
export const CARD_GUTTER = 16;

export type RevealKind = 'up' | 'wipe' | 'pop';

export interface CardLineSpec {
  t: string;
  f: '--f-sans' | '--f-addr' | '--f-script';
  c: '--ink' | '--sage' | '--green' | '--black';
  l: number;
  r: number;
  base?: number;
  cap?: number;
  ref?: string;
  cy?: number;
  script?: 1;
  a: RevealKind;
  d: number;
  dur?: number;
}

export const CARD_LINES: readonly CardLineSpec[] = [
  { t: 'You Are Invited To', f: '--f-sans', c: '--ink', l: 412, r: 827, base: 408, cap: 30, ref: 'H', a: 'up', d: 1.5 },
  { t: 'The Wedding Of', f: '--f-sans', c: '--ink', l: 440, r: 801, base: 470, cap: 30, ref: 'H', a: 'up', d: 1.7 },
  { t: 'Amira', f: '--f-script', c: '--ink', l: 433, r: 807, cy: 621, script: 1, a: 'wipe', d: 2.3, dur: 1.9 },
  { t: '&', f: '--f-sans', c: '--sage', l: 597, r: 644, base: 775, cap: 50, ref: '&', a: 'pop', d: 3.0 },
  { t: 'Latif', f: '--f-script', c: '--ink', l: 435, r: 805, cy: 861, script: 1, a: 'wipe', d: 3.1, dur: 2.2 },
  { t: 'DECEMBER', f: '--f-sans', c: '--ink', l: 513, r: 729, base: 1055, cap: 26, ref: 'H', a: 'up', d: 3.9 },
  { t: 'SATURDAY', f: '--f-sans', c: '--ink', l: 196, r: 434, base: 1168, cap: 27, ref: 'H', a: 'up', d: 4.15 },
  { t: '14', f: '--f-sans', c: '--green', l: 548, r: 696, base: 1207, cap: 98, ref: '14', a: 'pop', d: 4.0 },
  { t: 'AT 07:00 PM', f: '--f-sans', c: '--ink', l: 794, r: 1056, base: 1168, cap: 27, ref: 'H', a: 'up', d: 4.3 },
  { t: '2024', f: '--f-sans', c: '--ink', l: 547, r: 694, base: 1306, cap: 37, ref: '2024', a: 'up', d: 4.5 },
  { t: '123 Anywhere St., Any City,', f: '--f-addr', c: '--black', l: 367, r: 877, base: 1398, cap: 26, ref: 'H', a: 'up', d: 4.8 },
  { t: 'ST 12345', f: '--f-addr', c: '--black', l: 527, r: 713, base: 1447, cap: 26, ref: 'H', a: 'up', d: 4.95 },
  { t: 'Reception to follow', f: '--f-script', c: '--ink', l: 409, r: 848, cy: 1529.5, script: 1, a: 'wipe', d: 5.3, dur: 2.0 },
];

export interface CardLayoutMetrics {
  scale: number;
  left: number;
  top: number;
  cornerScale: number;
}

export function computeCardLayout(viewportWidth: number, viewportHeight: number): CardLayoutMetrics {
  if (viewportWidth <= 0 || viewportHeight <= 0) {
    return { scale: 1, left: 0, top: 0, cornerScale: 1 };
  }
  const s = Math.max(0.01, Math.min((viewportWidth - CARD_GUTTER * 2) / CARD_WIDTH, viewportHeight / CARD_HEIGHT));
  const surplus = viewportWidth / (CARD_WIDTH * s);
  const boost = Math.min(1.5, Math.max(1, 1 + (surplus - 1) * 0.5));
  return {
    scale: s,
    left: (viewportWidth - CARD_WIDTH * s) / 2,
    top: (viewportHeight - CARD_HEIGHT * s) / 2,
    cornerScale: Number((s * boost).toFixed(4)),
  };
}

export interface InkBounds {
  l: number;
  r: number;
  a: number;
  d: number;
}

export interface ScriptPlacementInput {
  targetLeft: number;
  targetRight: number;
  centerY: number;
  inkAt100: InkBounds;
}

export function computeScriptPlacement(
  input: ScriptPlacementInput,
  measureAtSize: (fontSize: number) => InkBounds,
): { fontSize: number; letterSpacing: number; left: number; base: number } {
  const width100 = Math.max(1, input.inkAt100.l + input.inkAt100.r);
  const fontSize = ((input.targetRight - input.targetLeft) / width100) * 100;
  const ink = measureAtSize(fontSize);
  return {
    fontSize,
    letterSpacing: 0,
    left: input.targetLeft + ink.l,
    base: input.centerY + (ink.a - ink.d) / 2,
  };
}

export interface SansPlacementInput {
  textLength: number;
  targetLeft: number;
  targetRight: number;
  base: number;
  cap: number;
  refAscentAt200: number;
}

export function computeSansPlacement(
  input: SansPlacementInput,
  measureAtSize: (fontSize: number) => InkBounds,
): { fontSize: number; letterSpacing: number; left: number; base: number } {
  const refA = Math.max(1, input.refAscentAt200);
  const fontSize = (input.cap / refA) * 200;
  const ink = measureAtSize(fontSize);
  const letterSpacing =
    input.textLength > 1
      ? (input.targetRight - input.targetLeft - (ink.l + ink.r)) / (input.textLength - 1)
      : 0;
  return {
    fontSize,
    letterSpacing,
    left: input.targetLeft + ink.l,
    base: input.base,
  };
}
