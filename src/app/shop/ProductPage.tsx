'use client';

import { useState } from 'react';

export default function ProductPage({ data }: { data: any }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  return (
    <>
      <style>{`

        #product-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2.5rem 2rem 6rem;
        }

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

        .pp-breadcrumb a:hover {
          color: var(--text-primary);
        }

        .pp-breadcrumb-sep {
          opacity: 0.45;
        }

        .pp-breadcrumb-current {
          color: var(--text-primary);
        }

        .pp-layout {
          display: grid;
          grid-template-columns: 55fr 45fr;
          gap: 3rem;
          align-items: start;
        }

        .pp-gallery {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .pp-gallery-img {
          width: 100%;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          object-position: center top;
          display: block;
          background: var(--bg-surface);
        }

        .pp-gallery-img:first-child {
          aspect-ratio: 4 / 5;
        }

        .pp-info {
          position: sticky;
          top: 5rem;
        }

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

        .pp-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.85rem, 3vw, 2.6rem);
          font-weight: 300;
          line-height: 1.08;
          color: var(--text-primary);
          margin: 0 0 1rem;
        }

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

        .pp-divider {
          border: none;
          border-top: 1px solid var(--border-subtle, rgba(43, 42, 38, 0.12));
          margin: 0 0 1.75rem;
        }

        .pp-size-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-bottom: 0.75rem;
          display: block;
        }

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
          border: 1px solid var(--border-subtle, rgba(43, 42, 38, 0.2));
          background: transparent;
          color: var(--text-primary);
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
        }

        .pp-size-btn:hover {
          border-color: var(--text-primary);
        }

        .pp-size-btn.is-selected {
          background: var(--text-primary);
          border-color: var(--text-primary);
          color: var(--bg-primary);
        }

        .pp-size-btn.is-oos {
          opacity: 0.35;
          cursor: not-allowed;
          text-decoration: line-through;
        }

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

        .pp-desc {
          margin-top: 1.75rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--border-subtle, rgba(43, 42, 38, 0.12));
        }

        .pp-desc p {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          line-height: 1.75;
          color: var(--text-secondary);
          margin: 0;
        }

        .pp-accordion {
          border-top: 1px solid var(--border-subtle, rgba(43, 42, 38, 0.12));
          margin-top: 0.5rem;
        }

        .pp-accordion-item {
          border-bottom: 1px solid var(--border-subtle, rgba(43, 42, 38, 0.12));
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

        .pp-accordion-body {
          display: none;
          padding: 0 0 1.25rem;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.78rem;
          font-weight: 400;
          line-height: 1.8;
          color: var(--text-secondary);
        }

        .pp-accordion-item.is-open .pp-accordion-body {
          display: block;
        }

        @media (max-width: 768px) {
          #product-page {
            padding: 1.5rem 1.25rem 4rem;
          }

          .pp-breadcrumb {
            margin-bottom: 1.25rem;
          }

          .pp-layout {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }

          .pp-gallery {
            flex-direction: row;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 0.4rem;
            scrollbar-width: none;
          }

          .pp-gallery::-webkit-scrollbar {
            display: none;
          }

          .pp-gallery-img {
            flex: 0 0 88vw;
            max-width: 88vw;
            aspect-ratio: 3 / 4;
            scroll-snap-align: start;
          }

          .pp-gallery-img:first-child {
            aspect-ratio: 3 / 4;
          }

          .pp-info {
            position: static;
          }

          .pp-name {
            font-size: clamp(1.5rem, 6vw, 2rem);
          }

          .pp-add-btn {
            padding: 0.95rem 1.5rem;
          }
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

          {/* LEFT: IMAGES */}
          <div className="pp-gallery">
            {data.images?.map((image: string, index: number) => (
              <img
                key={index}
                src={image}
                alt={data.name}
                className="pp-gallery-img"
              />
            ))}
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="pp-info">

            <span className="pp-tag">{data.category}</span>

            <h1 className="pp-name">{data.name}</h1>

            <div className="pp-price">₹{data.price}</div>

            <div className="pp-price-note">Inclusive of all taxes</div>

            <hr className="pp-divider" />

            <span className="pp-size-label">Select Size</span>

            <div className="pp-size-grid">
              {data.sizes?.map((size: string) => (
                <button
                  key={size}
                  className={`pp-size-btn ${selectedSize === size ? 'is-selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <button className="pp-add-btn" disabled={!selectedSize}>
              {selectedSize ? 'Add to Cart' : 'Select a Size'}
            </button>

            <div className="pp-desc">
              <p>{data.description}</p>
            </div>

            <div className="pp-accordion">

              <div className={`pp-accordion-item ${openAccordion === 'details' ? 'is-open' : ''}`}>
                <button
                  className="pp-accordion-trigger"
                  onClick={() => setOpenAccordion(openAccordion === 'details' ? null : 'details')}
                >
                  Details
                  <span className="pp-accordion-icon">+</span>
                </button>
                <div className="pp-accordion-body">{data.details}</div>
              </div>

              <div className={`pp-accordion-item ${openAccordion === 'care' ? 'is-open' : ''}`}>
                <button
                  className="pp-accordion-trigger"
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                >
                  Care
                  <span className="pp-accordion-icon">+</span>
                </button>
                <div className="pp-accordion-body">{data.care}</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}