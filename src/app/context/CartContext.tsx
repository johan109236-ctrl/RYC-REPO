'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export type CartItem = {
  id: string;          // product id
  slug: string;
  name: string;
  price: string;       // display price, e.g. "NRS 1500"
  image: string;
  size: string;
  color?: string;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (id: string, size: string, color?: string) => void;
  updateQty: (id: string, size: string, color: string | undefined, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'ryce-cart';
export const MAX_QTY_PER_LINE = 3;

// Price strings look like "NRS 1500" — pull the number out for totals.
function parsePrice(price: string): number {
  const match = price.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

function sameLine(a: { id: string; size: string; color?: string }, b: { id: string; size: string; color?: string }) {
  return a.id === b.id && a.size === b.size && (a.color ?? '') === (b.color ?? '');
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage once, on mount. This intentionally runs as
  // an effect (not a lazy useState initializer) so server-rendered HTML and
  // the first client render match, avoiding a hydration mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist on every change (after initial hydration, so we don't
  // immediately overwrite storage with an empty array on first render).
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextType['addItem'] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((line) => sameLine(line, item));
      if (existing) {
        return prev.map((line) =>
          sameLine(line, item)
            ? { ...line, qty: Math.min(line.qty + qty, MAX_QTY_PER_LINE) }
            : line
        );
      }
      return [...prev, { ...item, qty: Math.min(qty, MAX_QTY_PER_LINE) }];
    });
  };

  const removeItem: CartContextType['removeItem'] = (id, size, color) => {
    setItems((prev) => prev.filter((line) => !sameLine(line, { id, size, color })));
  };

  const updateQty: CartContextType['updateQty'] = (id, size, color, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((line) => !sameLine(line, { id, size, color }))
        : prev.map((line) =>
            sameLine(line, { id, size, color })
              ? { ...line, qty: Math.min(qty, MAX_QTY_PER_LINE) }
              : line
          )
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = items.reduce((sum, line) => sum + parsePrice(line.price) * line.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export { parsePrice };