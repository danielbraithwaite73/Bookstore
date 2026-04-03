import type { Book } from '../types/Book';
import { API_BASE } from '../constants';

const API_URL = `${API_BASE}/Books`;

export interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

export const fetchBooks = async (
  pageSize: number,
  pageNum: number
): Promise<FetchBooksResponse> => {
  const response = await fetch(
    `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortTitle=false`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  return await response.json();
};

export const addBook = async (newBook: Book): Promise<Book> => {
  const response = await fetch(`${API_URL}/AddBook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBook),
  });

  if (!response.ok) {
    throw new Error('Failed to add book');
  }

  return await response.json();
};

export const updateBook = async (
  bookId: number,
  updatedBook: Book
): Promise<Book> => {
  const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedBook),
  });

  if (!response.ok) {
    throw new Error('Failed to update book');
  }

  return await response.json();
};

export const deleteBook = async (bookId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete book');
  }
};
