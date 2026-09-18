import Link from 'next/link';

const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-subtle,rgba(43,42,38,0.12))]">
      <div className="max-w-[1400px] mx-auto px-8 py-14 max-[640px]:px-5 max-[640px]:py-10 flex flex-col items-center gap-6 text-center">
        <span className="font-[Cormorant_Garamond,serif] text-2xl font-light tracking-[0.08em] text-[var(--text-primary)]">
          RYCE
        </span>

        <div className="flex items-center gap-5">
          <a href="https://www.instagram.com/ryce.np/" target="_blank" rel="noopener noreferrer" aria-label="RYCE on Instagram" className="!text-[var(--text-secondary)] hover:!text-[var(--text-primary)] !no-underline transition-colors text-lg">
            <i className="bi bi-instagram" />
          </a>
          <a href="https://www.tiktok.com/@ryce.np?_r=1&_t=ZS-99pLf3VqN8B" target="_blank" rel="noopener noreferrer" aria-label="RYCE on TikTok" className="!text-[var(--text-secondary)] hover:!text-[var(--text-primary)] !no-underline transition-colors text-lg">
            <i className="bi bi-tiktok" />
          </a>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/subscribe" className="font-[Montserrat,sans-serif] text-[0.68rem] tracking-[0.1em] uppercase !text-[var(--text-secondary)] hover:!text-[var(--text-primary)] transition-colors !no-underline">
            Subscribe
          </Link>
          <Link href="/contact" className="font-[Montserrat,sans-serif] text-[0.68rem] tracking-[0.1em] uppercase !text-[var(--text-secondary)] hover:!text-[var(--text-primary)] transition-colors !no-underline">
            Contact Us
          </Link>
        </div>

        <div className="w-full border-t border-[var(--border-subtle,rgba(43,42,38,0.12))] pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <span className="font-[Montserrat,sans-serif] text-[0.68rem] tracking-[0.05em] text-[var(--text-secondary)]">
            © {YEAR} RYCE. All rights reserved.
          </span>

          <div className="flex items-center gap-5">
            <Link href="/terms" className="font-[Montserrat,sans-serif] text-[0.68rem] tracking-[0.1em] uppercase !text-[var(--text-secondary)] hover:!text-[var(--text-primary)] transition-colors !no-underline">
              Terms
            </Link>
            <Link href="/privacy" className="font-[Montserrat,sans-serif] text-[0.68rem] tracking-[0.1em] uppercase !text-[var(--text-secondary)] hover:!text-[var(--text-primary)] transition-colors !no-underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}