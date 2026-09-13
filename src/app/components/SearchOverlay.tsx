'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { products } from '../shop/shop-data';
import './searchOverlay.css';

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset search text each time the overlay is opened
      setQuery('');
      // let the overlay mount before focusing
      const t = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) =>
      [p.name, p.category, p.tag, p.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true">
      <div className="search-overlay-backdrop" onClick={onClose} />

      <div className="search-overlay-panel">
        <div className="search-overlay-bar">
          <i className="bi bi-search search-overlay-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-overlay-input"
            placeholder="Search products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="button"
            className="search-overlay-close"
            onClick={onClose}
            aria-label="Close search"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="search-overlay-results">
          {query.trim() === '' && (
            <p className="search-overlay-hint">Start typing to search the shop.</p>
          )}

          {query.trim() !== '' && results.length === 0 && (
            <p className="search-overlay-hint">
              No products found for “{query}”.
            </p>
          )}

          {results.map((product) => (
            <Link
              key={product.id}
              href={product.href}
              className="search-result-item"
              onClick={onClose}
            >
              <img
                src={product.image}
                alt={product.name}
                className="search-result-image"
              />
              <div className="search-result-info">
                <span className="search-result-name">{product.name}</span>
                <span className="search-result-meta">{product.category}</span>
                <span className="search-result-price">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
