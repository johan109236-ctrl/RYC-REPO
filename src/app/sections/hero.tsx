'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import './hero.css';

type Slide = {
  image: string;
  eyebrow: string;
  heading: string;
  headingAccent?: string;
  subtext: string;
  ctaText: string;
  href: string;
};

const slides: Slide[] = [
  {
    image: '/assets/images/HOME.jpg',
    eyebrow: 'First Drop',
    heading: 'Our',
    headingAccent: 'Premium Pleated Pants',
    subtext:
      'RYCE IS JUST GETTING STARTED. DISCOVER OUR FIRST DROP.',
    ctaText: 'PURCHASE',
    href: '/shop/pleated-pants',
  },
  {
    image: '/assets/images/CLASPHOME.jpeg',
    eyebrow: 'In the Works',
    heading: 'Simple by',
    headingAccent: 'Nature',
    subtext:
      'A relaxed everyday jacket built for comfort and easy layering. Clean lines, understated details, and  made to be worn often.',
    ctaText: 'Follow Along',
    href: '/subscribe',
  },
];

const AUTOPLAY_MS = 6000;

export default function Hero() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, active]);

  return (
    <section
      id="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-track">
        {slides.map((slide, index) => (
          <div
            key={slide.heading + index}
            className={`hero-slide ${index === active ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
            aria-hidden={index !== active}
          >
            <div className="hero-overlay" />
          </div>
        ))}
      </div>

      <div className="hero-container" key={active}>
        <div className="hero-eyebrow hero-fade-up" style={{ animationDelay: '0.15s' }}>
          <span className="hero-line" />
          <span className="hero-eyebrow-text">{slides[active].eyebrow}</span>
          <span className="hero-line" />
        </div>

        <h1 className="hero-heading hero-fade-up" style={{ animationDelay: '0.3s' }}>
          {slides[active].heading}
          <br />
          <em className="hero-accent">{slides[active].headingAccent}</em>
        </h1>

        <p className="hero-subtext hero-fade-up" style={{ animationDelay: '0.5s' }}>
          {slides[active].subtext}
        </p>

        <div className="hero-fade-up" style={{ animationDelay: '0.7s' }}>
          <Link href={slides[active].href} className="hero-btn-primary">
            {slides[active].ctaText}
          </Link>
        </div>
      </div>

      <button
        type="button"
        className="hero-arrow hero-arrow--prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        <i className="bi bi-arrow-left" />
      </button>
      <button
        type="button"
        className="hero-arrow hero-arrow--next"
        onClick={next}
        aria-label="Next slide"
      >
        <i className="bi bi-arrow-right" />
      </button>

      <div className="hero-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.heading + index}
            type="button"
            className={`hero-dot ${index === active ? 'is-active' : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className="hero-dot-fill" />
          </button>
        ))}
      </div>

      <div className="hero-counter">
        <span className="hero-counter-current">{String(active + 1).padStart(2, '0')}</span>
        <span className="hero-counter-divider" />
        <span className="hero-counter-total">{String(slides.length).padStart(2, '0')}</span>
      </div>
    </section>
  );
}