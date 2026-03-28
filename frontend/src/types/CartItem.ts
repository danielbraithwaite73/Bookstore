/**
 * One line in the shopping cart. The same book appears at most once; quantity aggregates adds.
 */
export interface CartItem {
  bookId: number;
  title: string;
  /** Snapshot of unit price at add time (displayed as unit price on the cart page). */
  price: number;
  quantity: number;
}
