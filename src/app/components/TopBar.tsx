'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import './topBar.css';

const leftLinks = [
  { label: 'Shop', href: '/shop' },
];

const rightLinks: { label: string; href: string }[] = [];

export default function Topbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <header id="site-header" className={isScrolled ? 'is-scrolled' : ''}>
  <div className="header-inner">

    <button
      type="button"
      className="header-menu-btn"
      onClick={() => setIsMenuOpen((open) => !open)}
      aria-label="Toggle menu"
      aria-expanded={isMenuOpen}
    >
      <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'}`} />
    </button>

    <nav className="header-nav header-nav--left">
      {leftLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="header-nav-link"
        >
          {link.label}
        </Link>
      ))}
    </nav>

    <Link href="/" className="header-logo" aria-label="RYCE — home">
  <Image
    src="/assets/images/transparent.png"
    alt="RYCE"
    width={155}
    height={78}
    priority
  />
</Link>

    <div className="header-right">
      <nav className="header-nav header-nav--right">
        {rightLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="header-nav-link"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="header-icons">
        <button
          type="button"
          className="header-icon-btn"
          aria-label="Search"
        >
          <i className="bi bi-search" />
        </button>

       

       

        <Link
          href="/cart"
          className="header-icon-btn header-icon-btn--cart"
          aria-label="Cart"
        >
          <i className="bi bi-bag" />
          <span className="header-cart-count">0</span>
        </Link>
      </div>
    </div>

  </div>

      <div className={`header-drawer ${isMenuOpen ? 'is-open' : ''}`}>
        <nav className="header-drawer-nav">
          {[...leftLinks, ...rightLinks].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="header-drawer-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {isMenuOpen && (
        <div className="header-drawer-backdrop" onClick={() => setIsMenuOpen(false)} />
      )}</header>
  );
}