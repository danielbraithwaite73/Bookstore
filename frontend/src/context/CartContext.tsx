/**
 * React context for the shopping cart: in-memory state mirrored to sessionStorage
 * so cart survives navigation and reloads within the same browser tab.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../types/CartItem';
import { CART_STORAGE_KEY } from '../constants';

/**
 * Hydrates cart from sessionStorage on first load. Invalid or corrupted JSON yields an empty cart
 * instead of crashing the UI.
 */
function loadCartFromStorage(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is CartItem =>
        typeof x === 'object' &&
        x !== null &&
        typeof (x as CartItem).bookId === 'number' &&
        typeof (x as CartItem).title === 'string' &&
        typeof (x as CartItem).price === 'number' &&
        typeof (x as CartItem).quantity === 'number'
    );
  } catch {
    return [];
  }
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  setItemQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage());

  // Keep storage in sync whenever the user adds, edits, or removes lines.
  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  /**
   * Adds a line or merges into an existing line for the same bookId by summing quantities.
   * Unit price comes from the item passed in (typically the server price at time of add).
   */
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookId === item.bookId);
      if (existingItem) {
        return prevCart.map((c) =>
          c.bookId === item.bookId
            ? { ...c, quantity: c.quantity + item.quantity }
            : c
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (bookId: number) => {
    setCart((prevCart) => prevCart.filter((c) => c.bookId !== bookId));
  };

  /** Quantities ≤ 0 remove the line to avoid zero-qty rows in the cart. */
  const setItemQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((c) => (c.bookId === bookId ? { ...c, quantity } : c))
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        setItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/** Fails fast if used outside CartProvider—usually a wiring mistake during refactors. */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
