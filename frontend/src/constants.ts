/** Base URL for the ASP.NET API (HTTPS dev certificate on port 5000). Must stay in sync with backend launch settings. */
export const API_BASE = 'https://localhost:5000';

/**
 * sessionStorage key for persisting the shopping cart for the lifetime of the browser tab.
 * Cleared when the tab closes; not shared across tabs.
 */
export const CART_STORAGE_KEY = 'bookstore_cart_session';

/**
 * sessionStorage key for "Continue shopping": full path + query when the user last clicked Add to cart,
 * so returning from the cart restores the same list page, filters, and sort.
 */
export const BOOKS_RETURN_PATH_KEY = 'bookstore_books_return_path';
