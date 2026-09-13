'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import './hero.css';

type Slide = {
  image: string;
  eyebrow: string;
  heading: string;
  headingAccent?: string;
  subtext: string;
  ctaText: string;
  ctaHref: string;
};

const slides: Slide[] = [
  {
    image: '/assets/images/1ST.jpeg',
    eyebrow: 'The SS’26 Edit',
    heading: 'Simple by',
    headingAccent: 'Nature',
    subtext:
      'Considered pieces cut from natural fibers, made to move quietly with you through the day.',
    ctaText: 'Shop New Arrivals',
    ctaHref: '/collections/new-arrivals',
  },
  {
    image: '/assets/images/1ST.jpeg',
    eyebrow: 'Core Essentials',
    heading: 'Refined by',
    headingAccent: 'Design',
    subtext:
      'Clean silhouettes and a restrained palette — clothing built around what you actually wear.',
    ctaText: 'Shop Essentials',
    ctaHref: '/collections/essentials',
  },
  {
    image: '/assets/images/2ND.jpeg',
    eyebrow: 'Now Restocked',
    heading: 'Everyday',
    headingAccent: 'Staples',
    subtext:
      'The pieces you keep reaching for, back in stock — in every size, in every neutral.',
    ctaText: 'View Restocks',
    ctaHref: '/collections/restocked',
  },
  {
    image: '/assets/images/ryce-hero-4.jpg',
    eyebrow: 'The Lookbook',
    heading: 'Wear it',
    headingAccent: 'Your Way',
    subtext:
      'A closer look at how the collection comes together, styled from studio to street.',
    ctaText: 'Explore the Lookbook',
    ctaHref: '/pages/lookbook',
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
          <a href={slides[active].ctaHref} className="hero-btn-primary">
            {slides[active].ctaText}
          </a>
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