import { motion, useReducedMotion } from 'motion/react';

export type BotanicalAssetVariant =
  | 'leaf-tl'
  | 'leaf-br'
  | 'flower-tr'
  | 'flower-bl';

export type BotanicalCorner = 'tl' | 'tr' | 'bl' | 'br';

interface AssetMeta {
  src: string;
  aspectRatio: string;
  naturalVertical: 'top' | 'bottom';
  naturalHorizontal: 'left' | 'right';
}

const ASSET_META: Record<BotanicalAssetVariant, AssetMeta> = {
  'leaf-tl': {
    src: '/assets/aistudio/leaf-tl_e02b47cf.png',
    aspectRatio: '299 / 495',
    naturalVertical: 'top',
    naturalHorizontal: 'left',
  },
  'leaf-br': {
    src: '/assets/aistudio/leaf-br_b2b6955f.png',
    aspectRatio: '354 / 491',
    naturalVertical: 'bottom',
    naturalHorizontal: 'right',
  },
  'flower-tr': {
    src: '/assets/aistudio/flower-tr_b68e7f2e.png',
    aspectRatio: '542 / 568',
    naturalVertical: 'top',
    naturalHorizontal: 'right',
  },
  'flower-bl': {
    src: '/assets/aistudio/flower-bl_dc5cd7ce.png',
    aspectRatio: '539 / 569',
    naturalVertical: 'bottom',
    naturalHorizontal: 'left',
  },
};

const CORNER_POSITION_CLASS: Record<BotanicalCorner, string> = {
  tl: '-top-px -left-px',
  tr: '-top-px -right-px',
  bl: '-bottom-px -left-px',
  br: '-bottom-px -right-px',
};

const CORNER_ORIGIN: Record<BotanicalCorner, string> = {
  tl: '0% 0%',
  tr: '100% 0%',
  bl: '0% 100%',
  br: '100% 100%',
};

const CORNER_OFFSET: Record<BotanicalCorner, { x: number; y: number }> = {
  tl: { x: -10, y: -10 },
  tr: { x: 10, y: -10 },
  bl: { x: -10, y: 10 },
  br: { x: 10, y: 10 },
};

interface BotanicalCornerAssetProps {
  variant: BotanicalAssetVariant;
  corner: BotanicalCorner;
  /** Width utility classes only (e.g. "w-24 sm:w-36"); height follows exact image aspect ratio. */
  className?: string;
  swayDegrees?: number;
  opacity?: number;
}

export function BotanicalCornerAsset({
  variant,
  corner,
  className = 'w-24 sm:w-36',
  swayDegrees = 1.0,
  opacity = 0.55,
}: BotanicalCornerAssetProps) {
  const reduceMotion = useReducedMotion();
  const meta = ASSET_META[variant];

  const targetVertical = corner.startsWith('t') ? 'top' : 'bottom';
  const targetHorizontal = corner.endsWith('l') ? 'left' : 'right';

  const flipX = targetHorizontal !== meta.naturalHorizontal;
  const flipY = targetVertical !== meta.naturalVertical;
  const offset = CORNER_OFFSET[corner];
  const origin = CORNER_ORIGIN[corner];

  // Sway inward smoothly around the anchored corner stem
  const signedSway =
    corner === 'tl' || corner === 'br' ? swayDegrees : -swayDegrees;

  const flipTransform = [
    flipX ? 'scaleX(-1)' : '',
    flipY ? 'scaleY(-1)' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      aria-hidden="true"
      initial={
        reduceMotion
          ? { opacity }
          : { opacity: 0, x: offset.x, y: offset.y }
      }
      whileInView={{ opacity, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
      style={{ aspectRatio: meta.aspectRatio }}
      className={`pointer-events-none absolute z-0 select-none ${CORNER_POSITION_CLASS[corner]} ${className}`}
    >
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                rotate: [
                  0,
                  signedSway * 0.45,
                  signedSway,
                  -signedSway * 0.3,
                  0,
                ],
              }
        }
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ transformOrigin: origin }}
        className="h-full w-full"
      >
        <div
          className="h-full w-full"
          style={flipTransform ? { transform: flipTransform } : undefined}
        >
          <img
            src={meta.src}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="block h-full w-full select-none drop-shadow-[0_6px_14px_rgba(67,70,52,0.06)]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Symmetrical uncropped sage-and-ivory sprig for open section headers & dividers */
export function BotanicalDividerSprigSvg({
  className = 'h-7 w-40',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Delicate gold stem arcs */}
      <path
        d="M110 18 C82 18 58 14 26 20"
        stroke="#7A8E74"
        strokeOpacity="0.65"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M110 18 C138 18 162 14 194 20"
        stroke="#7A8E74"
        strokeOpacity="0.65"
        strokeWidth="1.15"
        strokeLinecap="round"
      />

      {/* Left sage leaves */}
      <path
        d="M84 17 C76 9 66 7 60 11 C67 16 76 18 84 17 Z"
        fill="#7A8E74"
        fillOpacity="0.72"
      />
      <path
        d="M72 18 C64 26 54 28 48 24 C55 19 64 17 72 18 Z"
        fill="#546B57"
        fillOpacity="0.68"
      />
      <path
        d="M52 17 C45 11 36 10 31 14 C37 18 45 19 52 17 Z"
        fill="#7A8E74"
        fillOpacity="0.62"
      />
      <circle cx="24" cy="20" r="2.2" fill="#BF9042" fillOpacity="0.75" />

      {/* Right sage leaves (mirrored) */}
      <path
        d="M136 17 C144 9 154 7 160 11 C153 16 144 18 136 17 Z"
        fill="#7A8E74"
        fillOpacity="0.72"
      />
      <path
        d="M148 18 C156 26 166 28 172 24 C165 19 156 17 148 18 Z"
        fill="#546B57"
        fillOpacity="0.68"
      />
      <path
        d="M168 17 C175 11 184 10 189 14 C183 18 175 19 168 17 Z"
        fill="#7A8E74"
        fillOpacity="0.62"
      />
      <circle cx="196" cy="20" r="2.2" fill="#BF9042" fillOpacity="0.75" />

      {/* Center ivory blossom */}
      <g transform="translate(110 18)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M0 -1.8 C3.6 -5.5 5.2 -10.5 0 -12.5 C-5.2 -10.5 -3.6 -5.5 0 -1.8 Z"
            fill="#F6EFE5"
            stroke="#C7B9A5"
            strokeWidth="0.6"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle
          cx="0"
          cy="0"
          r="2.8"
          fill="#BF9042"
          stroke="#8F6728"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}

export function BotanicalBlossomSvg({
  className = 'h-9 w-9',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ivoryGardeniaPetal" cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#FFFCF5" />
          <stop offset="65%" stopColor="#EFE7DC" />
          <stop offset="100%" stopColor="#D7CAB9" />
        </radialGradient>
        <radialGradient id="gardeniaGoldCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E6C78B" />
          <stop offset="70%" stopColor="#BF9042" />
          <stop offset="100%" stopColor="#946B2B" />
        </radialGradient>
      </defs>
      {/* Subtle sage leaves peeking behind */}
      <g>
        <path
          d="M32 32 C42 18 54 14 58 20 C52 28 42 32 32 32 Z"
          fill="#7A8E74"
          fillOpacity="0.82"
        />
        <path
          d="M32 32 C22 46 10 50 6 44 C12 36 22 32 32 32 Z"
          fill="#546B57"
          fillOpacity="0.8"
        />
        <path
          d="M32 32 C44 42 52 50 47 55 C39 50 34 42 32 32 Z"
          fill="#7A8E74"
          fillOpacity="0.72"
        />
      </g>
      <g transform="translate(32 32)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M0 -3 C7 -11 11 -21 0 -26 C-11 -21 -7 -11 0 -3 Z"
            fill="url(#ivoryGardeniaPetal)"
            stroke="#C7B9A5"
            strokeWidth="0.65"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle
          cx="0"
          cy="0"
          r="5.5"
          fill="url(#gardeniaGoldCenter)"
          stroke="#8F6728"
          strokeWidth="0.7"
        />
        <circle cx="-1.8" cy="-1.4" r="0.9" fill="#FFF7DF" />
        <circle cx="2" cy="-0.8" r="0.9" fill="#FFF7DF" />
        <circle cx="0" cy="2.1" r="0.9" fill="#FFF7DF" />
      </g>
    </svg>
  );
}

export function ScheduleGardeniaSvg({
  className = 'h-11 w-11',
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="gardeniaPetalOuter" cx="50%" cy="35%" r="68%">
          <stop offset="0%" stopColor="#FFFCF6" />
          <stop offset="55%" stopColor="#F2EAE0" />
          <stop offset="100%" stopColor="#D7C8B5" />
        </radialGradient>
        <radialGradient id="gardeniaPetalInner" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F6EFE5" />
          <stop offset="100%" stopColor="#DFD2C1" />
        </radialGradient>
        <radialGradient id="gardeniaCenterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F7DFAC" />
          <stop offset="60%" stopColor="#C9994A" />
          <stop offset="100%" stopColor="#8C6324" />
        </radialGradient>
      </defs>

      {/* Sage leaves framing the white gardenia */}
      <g>
        <path
          d="M40 40 C54 22 69 17 74 25 C66 35 53 40 40 40 Z"
          fill="#546B57"
          fillOpacity="0.9"
        />
        <path
          d="M40 40 C26 58 11 63 6 55 C14 45 27 40 40 40 Z"
          fill="#7A8E74"
          fillOpacity="0.88"
        />
        <path
          d="M40 40 C24 24 14 14 21 9 C31 15 36 27 40 40 Z"
          fill="#7A8E74"
          fillOpacity="0.78"
        />
        <path
          d="M40 40 C56 56 66 66 59 71 C49 65 44 53 40 40 Z"
          fill="#546B57"
          fillOpacity="0.82"
        />
      </g>

      <g transform="translate(40 40)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <g key={`outer-${deg}`} transform={`rotate(${deg})`}>
            <path
              d="M0 -6 C8 -15 13 -27 5 -32 C2 -34 0 -32 0 -30 C0 -32 -2 -34 -5 -32 C-13 -27 -8 -15 0 -6 Z"
              fill="url(#gardeniaPetalOuter)"
              stroke="#BBAE9B"
              strokeWidth="0.65"
            />
            <path
              d="M0 -10 L0 -25"
              stroke="#BF9042"
              strokeOpacity="0.3"
              strokeWidth="0.65"
              strokeLinecap="round"
            />
          </g>
        ))}

        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => (
          <g key={`inner-${deg}`} transform={`rotate(${deg})`}>
            <path
              d="M0 -4 C6 -12 10 -20 3.5 -24.5 C1.5 -26 0 -24.5 0 -23 C0 -24.5 -1.5 -26 -3.5 -24.5 C-10 -20 -6 -12 0 -4 Z"
              fill="url(#gardeniaPetalInner)"
              stroke="#C8BAA7"
              strokeWidth="0.55"
            />
          </g>
        ))}

        <circle cx="0" cy="0" r="8" fill="#6F5123" fillOpacity="0.78" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <g key={`stamen-${deg}`} transform={`rotate(${deg})`}>
            <line
              x1="0"
              y1="-3"
              x2="0"
              y2="-7.5"
              stroke="#F4D793"
              strokeWidth="0.85"
            />
            <circle cx="0" cy="-8" r="1.15" fill="#FBF0C9" />
          </g>
        ))}
        <circle
          cx="0"
          cy="0"
          r="4.2"
          fill="url(#gardeniaCenterGlow)"
          stroke="#75521B"
          strokeWidth="0.6"
        />
      </g>
    </svg>
  );
}
