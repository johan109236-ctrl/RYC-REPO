import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-xl text-center">
        <span className="font-[Montserrat,sans-serif] text-xs tracking-[0.22em] uppercase text-[var(--text-secondary)]">
          Contact
        </span>
        <h1 className="mt-5 font-[Cormorant_Garamond,serif] text-5xl sm:text-6xl font-light tracking-tight text-[var(--text-primary)]">
          Get in touch.
        </h1>
        <p className="mt-5 max-w-md mx-auto font-[Montserrat,sans-serif] text-sm leading-7 text-[var(--text-secondary)]">
          Have a question about RYCE, an order, or something else? Reach out and we&apos;ll get back to you.
        </p>

        <div className="mt-10 border-t border-[var(--border-subtle,rgba(43,42,38,0.12))] pt-8">
          <a
            href="mailto:hello@ryceclothing.com"
            className="font-[Montserrat,sans-serif] text-sm tracking-wide !text-[var(--text-primary)] hover:opacity-60 transition-opacity"
          >
            hello@ryceclothing.com
          </a>
        </div>

        <Link
          href="/subscribe"
          className="inline-block mt-8 font-[Montserrat,sans-serif] text-xs tracking-[0.16em] uppercase !text-[var(--text-secondary)] hover:!text-[var(--text-primary)] transition-colors"
        >
          Subscribe for updates →
        </Link>
      </div>
    </main>
  );
}