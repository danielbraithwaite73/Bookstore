/**
 * Book as returned by the API (camelCase JSON). Mirrors the server-side Book entity.
 */
export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  /** Unit price in dollars; line total in the cart is price × quantity. */
  price: number;
}
