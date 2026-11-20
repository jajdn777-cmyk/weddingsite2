import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { canTriggerInitialPlay } from '../utils/engagementCardTrigger';
import {
  CARD_LINES,
  computeCardLayout,
  computeSansPlacement,
  computeScriptPlacement,
  type CardLineSpec,
  type InkBounds,
} from '../utils/weddingCardLayout';
import './WeddingCard.css';

interface WeddingCardProps {
  videoEnded: boolean;
  isOverlayBlocking: boolean;
}

const FONT_FALLBACKS: Record<CardLineSpec['f'], string> = {
  '--f-sans': '"Tenor Sans", "Jost", "Helvetica Neue", Arial, sans-serif',
  '--f-addr': '"Inter", "Helvetica Neue", Arial, sans-serif',
  '--f-script': '"Ballet", "Pinyon Script", "Snell Roundhand", cursive',
};

const COLOR_VALUES: Record<CardLineSpec['c'], string> = {
  '--ink': '#434634',
  '--sage': '#7a8e74',
  '--green': '#546b57',
  '--black': '#000000',
};

export function WeddingCard({ videoEnded, isOverlayBlocking }: WeddingCardProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const hasTriggeredRef = useRef(false);
  const builtRef = useRef(false);
  const rafRef = useRef<number[]>([]);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isBuilt, setIsBuilt] = useState(false);
  const [animState, setAnimState] = useState<'pre' | 'go'>('pre');

  const applyLayout = useCallback(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card || !content) return;
    const { scale, left, top, cornerScale } = computeCardLayout(
      card.clientWidth,
      card.clientHeight,
    );
    content.style.left = `${left}px`;
    content.style.top = `${top}px`;
    content.style.transform = `scale(${scale})`;
    card.style.setProperty('--cs', cornerScale.toFixed(4));
  }, []);

  const triggerAnimation = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    rafRef.current.forEach((id) => cancelAnimationFrame(id));
    rafRef.current = [];
    const id1 = requestAnimationFrame(() => {
      const id2 = requestAnimationFrame(() => {
        card.classList.remove('pre');
        card.classList.add('go');
        setAnimState('go');
      });
      rafRef.current.push(id2);
    });
    rafRef.current.push(id1);
  }, []);

  const handleReplay = useCallback(() => {
    const card = cardRef.current;
    if (!card || !builtRef.current) return;
    card.classList.remove('go');
    card.classList.add('pre');
    setAnimState('pre');
    void card.offsetWidth;
    triggerAnimation();
  }, [triggerAnimation]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleReplay();
      }
    },
    [handleReplay],
  );

  // Measure and place all 13 lines inside the 1240x1748 canvas once fonts are ready
  useEffect(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    const section = sectionRef.current;
    if (!card || !content || !section) return;

    let cancelled = false;
    const createdNodes: HTMLElement[] = [];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const measureInk = (font: string, text: string): InkBounds => {
      if (!ctx) return { l: 0, r: text.length * 40, a: 70, d: 20 };
      ctx.font = font;
      const m = ctx.measureText(text);
      return {
        l: m.actualBoundingBoxLeft,
        r: m.actualBoundingBoxRight,
        a: m.actualBoundingBoxAscent,
        d: m.actualBoundingBoxDescent,
      };
    };

    const getVar = (varName: string, fallback: string): string => {
      const val = getComputedStyle(section).getPropertyValue(varName).trim();
      return val || fallback;
    };

    const placeLine = (line: CardLineSpec) => {
      const family = getVar(line.f, FONT_FALLBACKS[line.f]);
      const color = getVar(line.c, COLOR_VALUES[line.c]);

      const el = document.createElement('div');
      el.className = `wc-t a-${line.a}`;
      el.style.fontFamily = family;
      el.style.color = color;
      el.style.setProperty('--d', `${line.d}s`);
      if (line.dur) {
        el.style.setProperty('--t', `${line.dur}s`);
      }
      el.textContent = line.t;

      const strut = document.createElement('span');
      strut.className = 'wc-strut';
      el.appendChild(strut);
      content.appendChild(el);
      createdNodes.push(el);

      const placed = line.script
        ? computeScriptPlacement(
            {
              targetLeft: line.l,
              targetRight: line.r,
              centerY: line.cy ?? 0,
              inkAt100: measureInk(`100px ${family}`, line.t),
            },
            (fs) => measureInk(`${fs}px ${family}`, line.t),
          )
        : computeSansPlacement(
            {
              textLength: line.t.length,
              targetLeft: line.l,
              targetRight: line.r,
              base: line.base ?? 0,
              cap: line.cap ?? 30,
              refAscentAt200: measureInk(`200px ${family}`, line.ref ?? 'H').a,
            },
            (fs) => measureInk(`${fs}px ${family}`, line.t),
          );

      el.style.fontSize = `${placed.fontSize}px`;
      el.style.letterSpacing = `${placed.letterSpacing}px`;
      el.style.left = `${placed.left}px`;
      el.style.top = '0px';
      const off = strut.getBoundingClientRect().bottom - el.getBoundingClientRect().top;
      el.style.top = `${placed.base - off}px`;
      el.classList.add('ready');
    };

    const build = () => {
      if (cancelled || builtRef.current) return;
      builtRef.current = true;
      content.style.transform = 'none';
      CARD_LINES.forEach(placeLine);
      applyLayout();
      setIsBuilt(true);
    };

    applyLayout();

    const fontLoads = ["100px 'Tenor Sans'", "100px 'Ballet'", "100px 'Inter'"].map((f) =>
      document.fonts?.load ? document.fonts.load(f, 'AaH14&').catch(() => undefined) : Promise.resolve(),
    );
    Promise.all(fontLoads)
      .then(() => document.fonts?.ready)
      .then(build);

    const fallbackTimer = window.setTimeout(build, 2500);
    window.addEventListener('resize', applyLayout);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(applyLayout);
      ro.observe(card);
    }

    return () => {
      cancelled = true;
      builtRef.current = false;
      window.clearTimeout(fallbackTimer);
      window.removeEventListener('resize', applyLayout);
      ro?.disconnect();
      rafRef.current.forEach((id) => cancelAnimationFrame(id));
      rafRef.current = [];
      createdNodes.forEach((node) => node.remove());
    };
  }, [applyLayout]);

  // Observe card visibility
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            setIsIntersecting(true);
            break;
          }
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Trigger initial play only once fonts are built and the opening video overlay is gone
  useEffect(() => {
    if (!isBuilt) return;
    if (
      canTriggerInitialPlay({
        hasTriggered: hasTriggeredRef.current,
        isOverlayBlocking,
        videoEnded,
        isIntersecting,
      })
    ) {
      hasTriggeredRef.current = true;
      triggerAnimation();
    }
  }, [isBuilt, isOverlayBlocking, videoEnded, isIntersecting, triggerAnimation]);

  return (
    <section ref={sectionRef} id="wedding-card" dir="ltr" lang="en">
      <main
        ref={cardRef}
        id="card"
        className="wc-card pre"
        data-testid="wedding-card"
        data-state={animState}
        tabIndex={0}
        role="button"
        aria-label="Wedding invitation for Amira and Latif, Saturday 14 December 2024 at 7:00 PM. Click to replay animation."
        onClick={handleReplay}
        onKeyDown={handleKeyDown}
      >
        <img
          className="wc-paper"
          src="/assets/aistudio/paper_3d64b189.jpg"
          alt=""
        />
        <div className="wc-glow" aria-hidden="true" />
        <div className="wc-asset wc-tl" aria-hidden="true">
          <img src="/assets/aistudio/leaf-tl_e02b47cf.png" alt="" />
        </div>
        <div className="wc-asset wc-tr" aria-hidden="true">
          <img src="/assets/aistudio/flower-tr_b68e7f2e.png" alt="" />
        </div>
        <div className="wc-asset wc-bl" aria-hidden="true">
          <img src="/assets/aistudio/flower-bl_dc5cd7ce.png" alt="" />
        </div>
        <div className="wc-asset wc-br" aria-hidden="true">
          <img src="/assets/aistudio/leaf-br_b2b6955f.png" alt="" />
        </div>
        <div ref={contentRef} className="wc-content" id="content">
          <img
            className="a-up"
            src="/assets/aistudio/bismillah_7b7d0565.png"
            alt="Bismillah ir-Rahman ir-Rahim"
            style={
              {
                left: '464px',
                top: '226px',
                width: '311px',
                height: '74px',
                '--d': '.9s',
              } as CSSProperties
            }
          />
          <div
            className="wc-bar a-grow"
            style={{ left: '505px', '--d': '3.7s' } as CSSProperties}
            aria-hidden="true"
          />
          <div
            className="wc-bar a-grow"
            style={{ left: '728px', '--d': '3.7s' } as CSSProperties}
            aria-hidden="true"
          />
        </div>
      </main>
    </section>
  );
}
