/**
 * API origin (no trailing slash). Override with VITE_API_BASE in .env.development / .env.production.
 */
export const API_BASE =
  import.meta.env.VITE_API_BASE ?? 'https://localhost:5000';

export const CART_STORAGE_KEY = 'bookstore_cart_session';

/** Saved when opening add-to-cart; CartPage "Continue shopping" navigates here. */
export const BOOKS_RETURN_PATH_KEY = 'bookstore_books_return_path';
