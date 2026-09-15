'use client';

import { FormEvent, useState } from 'react';

export default function SubscribePage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl text-center">
        <span className="font-[Montserrat,sans-serif] text-xs tracking-[0.22em] uppercase text-[var(--text-secondary)]">
          Stay Updated
        </span>
        <h1 className="mt-5 font-[Cormorant_Garamond,serif] text-5xl sm:text-6xl font-light tracking-tight text-[var(--text-primary)]">
          Be the first to know.
        </h1>
        <p className="mt-5 max-w-md mx-auto font-[Montserrat,sans-serif] text-sm leading-7 text-[var(--text-secondary)]">
          Sign up with your email and we&apos;ll let you know when new pieces and collections are ready.
        </p>

        {submitted ? (
          <p className="mt-10 font-[Montserrat,sans-serif] text-sm tracking-wide text-[var(--text-primary)]">
            You&apos;re on the list. We&apos;ll be in touch.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <label htmlFor="subscribe-email" className="sr-only">Email address</label>
            <input
              id="subscribe-email"
              name="email"
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 min-h-12 border border-[var(--border-subtle,rgba(43,42,38,0.18))] bg-transparent px-4 font-[Montserrat,sans-serif] text-sm outline-none focus:border-[var(--text-primary)]"
            />
            <button
              type="submit"
              className="min-h-12 px-7 bg-[var(--text-primary)] text-[var(--bg-surface)] font-[Montserrat,sans-serif] text-xs tracking-[0.16em] uppercase transition-opacity hover:opacity-80"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </main>
  );
}