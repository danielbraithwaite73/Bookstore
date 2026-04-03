import { useState } from 'react';
import type { Book } from '../types/Book';
import { addBook } from '../api/BooksAPI';
import './BookForm.css';

interface NewBookFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewBookForm = ({ onSuccess, onCancel }: NewBookFormProps) => {
  const [formData, setFormData] = useState<Book>({
    bookId: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'pageCount' || name === 'price') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBook(formData);
    onSuccess();
  };

  return (
    <div className="card shadow-sm book-admin-form mb-4">
      <div className="card-header py-3 text-bg-success">
        <h2 className="h5 mb-0">Add new book</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-title">
                Title
              </label>
              <input
                id="new-title"
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-author">
                Author
              </label>
              <input
                id="new-author"
                type="text"
                name="author"
                className="form-control"
                value={formData.author}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-publisher">
                Publisher
              </label>
              <input
                id="new-publisher"
                type="text"
                name="publisher"
                className="form-control"
                value={formData.publisher}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-isbn">
                ISBN
              </label>
              <input
                id="new-isbn"
                type="text"
                name="isbn"
                className="form-control"
                value={formData.isbn}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-classification">
                Classification
              </label>
              <input
                id="new-classification"
                type="text"
                name="classification"
                className="form-control"
                value={formData.classification}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-category">
                Category
              </label>
              <input
                id="new-category"
                type="text"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-pageCount">
                Page count
              </label>
              <input
                id="new-pageCount"
                type="number"
                name="pageCount"
                className="form-control"
                value={formData.pageCount}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="new-price">
                Price
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  id="new-price"
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  min={0}
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions d-flex flex-wrap gap-2 pt-4 mt-2 border-top">
            <button type="submit" className="btn btn-success px-4">
              Add book
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewBookForm;
