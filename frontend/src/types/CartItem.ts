/** One cart line; same bookId is merged by adding quantities. */
export interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
}
