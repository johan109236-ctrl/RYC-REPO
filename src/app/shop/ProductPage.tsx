'use client';

import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductPage({ data }: { data: any }) {
  const { addItem } = useCart();

  const [currentImg, setCurrentImg]       = useState(0);
  const [selectedSize, setSelectedSize]   = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [justAdded, setJustAdded]         = useState(false);
  const [qty, setQty]                     = useState(1);
  const [stockMap, setStockMap]           = useState<Record<string, number> | null>(null);

  const MAX_QTY_PER_ORDER = 3;

  const hasColors = data.colors?.length > 0;
  const isComingSoon = Boolean(data.comingSoon);

  const norm = (s?: string | null) => (s ?? '').trim().toLowerCase();

  useEffect(() => {
    if (isComingSoon) return;
    let cancelled = false;

    fetch(`/api/stock?product=${encodeURIComponent(data.name)}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const map: Record<string, number> = {};
        for (const v of json.stock ?? []) {
          map[`${norm(v.color)}::${norm(v.size)}`] = v.stock;
        }
        setStockMap(map);
      })
      .catch((err) => console.error('Could not load stock:', err));

    return () => {
      cancelled = true;
    };
  }, [data.name, isComingSoon]);

  function getStock(color: string | null, size: string): number | null {
    if (!stockMap) return null;
    const key = `${norm(color)}::${norm(size)}`;
    return key in stockMap ? stockMap[key] : null;
  }

  function isSizeSoldOut(size: string) {
    if (!stockMap) return false;
    if (hasColors) {
      if (!selectedColor) return false;
      const s = getStock(selectedColor, size);
      return s !== null && s <= 0;
    }
    const s = getStock(null, size);
    return s !== null && s <= 0;
  }

  function isColorSoldOut(colorLabel: string) {
    if (!stockMap || !data.sizes) return false;
    return data.sizes.every((size: string) => {
      const s = getStock(colorLabel, size);
      return s !== null && s <= 0;
    });
  }

  // If the color changes and the previously picked size is sold out
  // for the new color, clear the size so the state doesn't go stale.
  useEffect(() => {
    if (selectedSize && isSizeSoldOut(selectedSize)) {
      setSelectedSize(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, stockMap]);

  const activeImages =
    data.colors?.find((c: any) => c.label === selectedColor)?.images ??
    data.images ??
    [];

  const selectedSoldOut = Boolean(selectedSize && isSizeSoldOut(selectedSize));

  // Cap quantity by remaining stock for the selected combo (if known)
  const selectedStock =
    selectedSize ? getStock(hasColors ? selectedColor : null, selectedSize) : null;
  const maxQty =
    selectedStock !== null && selectedStock > 0
      ? Math.min(MAX_QTY_PER_ORDER, selectedStock)
      : MAX_QTY_PER_ORDER;

  useEffect(() => {
    setQty((q) => Math.min(q, maxQty));
  }, [maxQty]);

  const canAddToCart =
    !isComingSoon &&
    Boolean(selectedSize) &&
    (!hasColors || Boolean(selectedColor)) &&
    !selectedSoldOut;

  const handleAddToCart = () => {
    if (!canAddToCart || !selectedSize) return;
    addItem(
      {
        id: data.id,
        slug: data.slug,
        name: data.name,
        price: data.price,
        image: activeImages[0] ?? data.image,
        size: selectedSize,
        color: selectedColor ?? undefined,
      },
      qty
    );
    setJustAdded(true);
    setQty(1);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const total = activeImages.length;
  const prev  = () => setCurrentImg((i) => (i - 1 + total) % total);
  const next  = () => setCurrentImg((i) => (i + 1) % total);

  return (
    <>
      <style>{`

        /* ── PAGE ─────────────────────────────────────────── */
        #product-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2.5rem 2rem 6rem;
        }

        /* ── BREADCRUMB ───────────────────────────────────── */
        .pp-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin-bottom: 2rem;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .pp-breadcrumb a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .pp-breadcrumb a:hover      { color: var(--text-primary); }
        .pp-breadcrumb-sep          { opacity: 0.45; }
        .pp-breadcrumb-current      { color: var(--text-primary); }

        /* ── TWO-COLUMN LAYOUT ────────────────────────────── */
        .pp-layout {
          display: grid;
          grid-template-columns: 55fr 45fr;
          gap: 3.5rem;
          align-items: start;
        }

        /* ── GALLERY WRAPPER ──────────────────────────────── */
        .pp-gallery {
          position: sticky;
          top: 5rem;
        }

        /* ── SLIDESHOW ────────────────────────────────────── */
        .pp-slide {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          background: var(--bg-surface);
          overflow: hidden;
        }

        .pp-slide-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .pp-slide-img.is-active {
          opacity: 1;
          pointer-events: auto;
        }

        .pp-slide-img.is-contain {
          object-fit: contain;
          object-position: center;
          background: #fff;
        }

        /* ── ARROWS ───────────────────────────────────────── */
        .pp-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary, #fff);
          border: 1px solid var(--border-subtle, rgba(43,42,38,0.18));
          color: var(--text-primary);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
          font-size: 1rem;
          line-height: 1;
        }
        .pp-arrow:hover {
          background: var(--text-primary);
          color: var(--bg-primary);
        }
        .pp-arrow--prev { left:  0.85rem; }
        .pp-arrow--next { right: 0.85rem; }

        /* ── DOTS ─────────────────────────────────────────── */
        .pp-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 0.85rem;
        }
        .pp-dot {
          width: 22px;
          height: 2px;
          background: var(--border-subtle, rgba(43,42,38,0.2));
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .pp-dot.is-active {
          background: var(--text-primary);
        }

        /* ── COUNTER ──────────────────────────────────────── */
        .pp-counter {
          text-align: center;
          margin-top: 0.5rem;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: var(--text-secondary);
        }

        /* ── STICKY INFO PANEL ────────────────────────────── */
        .pp-info {
          position: sticky;
          top: 5rem;
          max-height: calc(100vh - 6rem);
          overflow-y: auto;
        }

        /* ── CATEGORY TAG ─────────────────────────────────── */
        .pp-tag {
          display: inline-block;
          margin-bottom: 0.85rem;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        /* ── PRODUCT NAME ─────────────────────────────────── */
        .pp-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.85rem, 3vw, 2.6rem);
          font-weight: 300;
          line-height: 1.08;
          color: var(--text-primary);
          margin: 0 0 1rem;
        }

        /* ── PRICE ────────────────────────────────────────── */
        .pp-price {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }
        .pp-price-note {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.68rem;
          color: var(--text-secondary);
          letter-spacing: 0.05em;
          margin-bottom: 1.75rem;
        }

        /* ── DIVIDER ──────────────────────────────────────── */
        .pp-divider {
          border: none;
          border-top: 1px solid var(--border-subtle, rgba(43,42,38,0.12));
          margin: 0 0 1.75rem;
        }

        /* ── SECTION LABEL ────────────────────────────────── */
        .pp-section-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .pp-section-label span {
          font-weight: 400;
          color: var(--text-primary);
          text-transform: none;
          letter-spacing: 0;
        }

        /* ── COLOR SWATCHES ───────────────────────────────── */
        .pp-color-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 1.75rem;
        }
        .pp-color-btn {
          position: relative;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: transform 0.15s ease;
          outline: none;
        }
        .pp-color-btn::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid transparent;
          transition: border-color 0.2s ease;
        }
        .pp-color-btn.is-selected::after { border-color: var(--text-primary); }
        .pp-color-btn:hover              { transform: scale(1.1); }

        /* ── SIZE BUTTONS ─────────────────────────────────── */
        .pp-size-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
        }
        .pp-size-btn {
          min-width: 44px;
          height: 44px;
          padding: 0 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          border: 1px solid var(--border-subtle, rgba(43,42,38,0.2));
          background: transparent;
          color: var(--text-primary);
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .pp-size-btn:hover       { border-color: var(--text-primary); }
        .pp-size-btn.is-selected {
          background: var(--text-primary);
          border-color: var(--text-primary);
          color: var(--bg-primary);
        }

        /* ── SOLD OUT STATES ──────────────────────────────── */
        .pp-size-btn.is-soldout,
        .pp-color-btn.is-soldout {
          opacity: 0.35;
          cursor: not-allowed;
          position: relative;
        }

        .pp-size-btn.is-soldout {
          text-decoration: line-through;
        }
        .pp-size-btn.is-soldout:hover {
          border-color: var(--border-subtle, rgba(43,42,38,0.2));
        }

        .pp-color-btn.is-soldout:hover {
          transform: none;
        }
        .pp-color-btn.is-soldout::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.6) 0px,
            rgba(255, 255, 255, 0.6) 1px,
            transparent 1px,
            transparent 4px
          );
        }

        .pp-size-soldout-label {
          font-size: 0.65em;
          opacity: 0.7;
          white-space: pre;
        }

        /* ── ADD TO CART ──────────────────────────────────── */
        .pp-add-btn {
          width: 100%;
          padding: 1rem 2rem;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          background: var(--text-primary);
          color: var(--bg-primary);
          border: 1px solid var(--text-primary);
          cursor: pointer;
          transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
          margin-bottom: 0.75rem;
        }
        .pp-add-btn:hover {
          background: transparent;
          color: var(--text-primary);
        }
        .pp-add-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .pp-add-btn:disabled:hover {
          background: var(--text-primary);
          color: var(--bg-primary);
        }

        /* ── QTY STEPPER ──────────────────────────────────── */
        .pp-qty-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .pp-qty-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .pp-qty-stepper {
          display: flex;
          align-items: center;
          border: 1px solid var(--border-subtle, rgba(43,42,38,0.2));
        }
        .pp-qty-stepper button {
          width: 34px;
          height: 34px;
          border: none;
          background: transparent;
          font-size: 1rem;
          color: var(--text-primary);
          cursor: pointer;
        }
        .pp-qty-stepper button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .pp-qty-stepper span {
          min-width: 32px;
          text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.85rem;
        }
        .pp-qty-max-note {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem;
          color: var(--text-secondary);
        }

        .pp-coming-soon-note { font-weight: 600; color: var(--text-primary); }
        .pp-color-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pp-color-btn:disabled:hover { transform: none; }
        .pp-size-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pp-color-btn.is-soldout:disabled,
        .pp-size-btn.is-soldout:disabled { opacity: 0.35; }

        /* ── DESCRIPTION ──────────────────────────────────── */
        .pp-desc {
          margin-top: 1.75rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--border-subtle, rgba(43,42,38,0.12));
        }
        .pp-desc p {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          line-height: 1.75;
          color: var(--text-secondary);
          margin: 0;
        }

        /* ── ACCORDION ────────────────────────────────────── */
        .pp-accordion {
          border-top: 1px solid var(--border-subtle, rgba(43,42,38,0.12));
          margin-top: 0.5rem;
        }
        .pp-accordion-item {
          border-bottom: 1px solid var(--border-subtle, rgba(43,42,38,0.12));
        }
        .pp-accordion-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-primary);
          background: none;
          border: none;
          cursor: pointer;
        }
        .pp-accordion-icon {
          font-size: 1.1rem;
          font-weight: 300;
          line-height: 1;
          transition: transform 0.25s ease;
        }
        .pp-accordion-item.is-open .pp-accordion-icon {
          transform: rotate(45deg);
        }

        /* ── ACCORDION SMOOTH ANIMATION ───────────────────── */
        .pp-accordion-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease;
          overflow: hidden;
        }
        .pp-accordion-item.is-open .pp-accordion-body {
          grid-template-rows: 1fr;
        }
        .pp-accordion-body-inner {
          overflow: hidden;
          padding: 0;
          transition: padding 0.3s ease;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.78rem;
          font-weight: 400;
          line-height: 1.8;
          color: var(--text-secondary);
        }
        .pp-accordion-item.is-open .pp-accordion-body-inner {
          padding: 0 0 1.25rem;
        }

        /* ── SIZE CHART IMAGE ─────────────────────────────── */
        .pp-size-chart-img {
          width: 100%;
          height: auto;
          display: block;
          border: 1px solid var(--border-subtle, rgba(43,42,38,0.1));
        }

        /* ── MOBILE ───────────────────────────────────────── */
        @media (max-width: 768px) {
          #product-page  { padding: 1.5rem 1.25rem 4rem; }
          .pp-breadcrumb { margin-bottom: 1.25rem; }
          .pp-layout     { grid-template-columns: 1fr; gap: 1.75rem; }
          .pp-gallery    { position: static; }
          .pp-info       { position: static; max-height: none; overflow: visible; }
          .pp-name       { font-size: clamp(1.5rem, 6vw, 2rem); }
          .pp-add-btn    { padding: 0.95rem 1.5rem; }
          .pp-arrow      { width: 34px; height: 34px; font-size: 0.85rem; }
        }

      `}</style>

      <div id="product-page">

        {/* BREADCRUMB */}
        <div className="pp-breadcrumb">
          <a href="/shop">Shop</a>
          <span className="pp-breadcrumb-sep">/</span>
          <span className="pp-breadcrumb-current">{data.name}</span>
        </div>

        <div className="pp-layout">

          {/* LEFT: SLIDESHOW */}
          <div className="pp-gallery">
            <div className="pp-slide">

              {activeImages.map((img: string, i: number) => (
                <img
                  key={i}
                  src={img}
                  alt={`${data.name} – view ${i + 1}`}
                  className={`pp-slide-img ${i === currentImg ? 'is-active' : ''} ${
                    img.includes('SIZE-CHART') ? 'is-contain' : ''
                  }`}
                />
              ))}

              {total > 1 && (
                <button className="pp-arrow pp-arrow--prev" onClick={prev} aria-label="Previous image">
                  &#8592;
                </button>
              )}

              {total > 1 && (
                <button className="pp-arrow pp-arrow--next" onClick={next} aria-label="Next image">
                  &#8594;
                </button>
              )}

            </div>

            {total > 1 && (
              <div className="pp-dots">
                {activeImages.map((_: string, i: number) => (
                  <button
                    key={i}
                    className={`pp-dot ${i === currentImg ? 'is-active' : ''}`}
                    onClick={() => setCurrentImg(i)}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {total > 1 && (
              <div className="pp-counter">
                {currentImg + 1} / {total}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="pp-info">

            <span className="pp-tag">{data.category}</span>
            <h1 className="pp-name">{data.name}</h1>
            <div className="pp-price">{data.price}</div>
            {isComingSoon ? (
              <div className="pp-price-note pp-coming-soon-note">Not available for order yet — check back soon.</div>
            ) : (
              <div className="pp-price-note">Inclusive of all taxes</div>
            )}

            <hr className="pp-divider" />

            {/* COLOUR */}
            {data.colors?.length > 0 && (
              <>
                <div className="pp-section-label">
                  Colour {selectedColor && <span>— {selectedColor}</span>}
                </div>
                <div className="pp-color-row">
                  {data.colors.map((color: any) => {
                    const soldOut = isColorSoldOut(color.label);
                    return (
                      <button
                        key={color.label}
                        className={`pp-color-btn ${selectedColor === color.label ? 'is-selected' : ''} ${soldOut ? 'is-soldout' : ''}`}
                        style={{ background: color.swatch }}
                        title={soldOut ? `${color.label} — Sold out` : color.label}
                        aria-label={soldOut ? `${color.label} — Sold out` : color.label}
                        onClick={() => {
                          setSelectedColor(color.label);
                          setCurrentImg(0);
                        }}
                        disabled={isComingSoon || soldOut}
                      />
                    );
                  })}
                </div>
              </>
            )}

            {/* SIZE */}
            <div className="pp-section-label">
              Size {selectedSize && <span>— {selectedSize}</span>}
            </div>
            <div className="pp-size-grid">
              {data.sizes?.map((size: string) => {
                const soldOut = isSizeSoldOut(size);
                return (
                  <button
                    key={size}
                    className={`pp-size-btn ${selectedSize === size ? 'is-selected' : ''} ${soldOut ? 'is-soldout' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    disabled={isComingSoon || soldOut}
                  >
                    {size}
                    {soldOut && <span className="pp-size-soldout-label"> · Sold out</span>}
                  </button>
                );
              })}
            </div>

            {/* QTY */}
            {!isComingSoon && (
              <>
                <div className="pp-qty-row">
                  <span className="pp-qty-label">Quantity</span>
                  <div className="pp-qty-stepper">
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Decrease quantity">−</button>
                    <span>{qty}</span>
                    <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                {qty >= maxQty && (
                  <p className="pp-qty-max-note">
                    {maxQty < MAX_QTY_PER_ORDER
                      ? `Only ${maxQty} left in this size.`
                      : `Limit of ${MAX_QTY_PER_ORDER} per order.`}
                  </p>
                )}
              </>
            )}

            {/* ADD TO CART */}
            <button className="pp-add-btn" disabled={!canAddToCart} onClick={handleAddToCart}>
              {isComingSoon
                ? 'Coming Soon'
                : justAdded
                ? 'Added ✓'
                : !selectedSize
                ? 'Select a Size'
                : hasColors && !selectedColor
                ? 'Select a Colour'
                : selectedSoldOut
                ? 'Sold Out'
                : `Add ${qty} to Cart`}
            </button>

            {/* DESCRIPTION */}
            <div className="pp-desc">
              <p>{data.description}</p>
            </div>

            {/* ACCORDIONS */}
            <div className="pp-accordion">

              <div className={`pp-accordion-item ${openAccordion === 'details' ? 'is-open' : ''}`}>
                <button
                  className="pp-accordion-trigger"
                  onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                >
                  Details <span className="pp-accordion-icon">+</span>
                </button>
                <div className="pp-accordion-body">
                  <div className="pp-accordion-body-inner">{data.details}</div>
                </div>
              </div>

              <div className={`pp-accordion-item ${openAccordion === 'care' ? 'is-open' : ''}`}>
                <button
                  className="pp-accordion-trigger"
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                >
                  Care <span className="pp-accordion-icon">+</span>
                </button>
                <div className="pp-accordion-body">
                  <div className="pp-accordion-body-inner">{data.care}</div>
                </div>
              </div>

              {/* SIZE CHART */}
              {data.sizeChart && (
                <div className={`pp-accordion-item ${openAccordion === 'sizechart' ? 'is-open' : ''}`}>
                  <button
                    className="pp-accordion-trigger"
                    onClick={() => setOpenAccordion(openAccordion === 'sizechart' ? null : 'sizechart')}
                  >
                    Size Chart <span className="pp-accordion-icon">+</span>
                  </button>
                  <div className="pp-accordion-body">
                    <div className="pp-accordion-body-inner">
                      <img
                        src={data.sizeChart}
                        alt="Size Chart"
                        className="pp-size-chart-img"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}