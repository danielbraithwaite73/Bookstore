import { useState } from 'react';
import type { Book } from '../types/Book';
import { updateBook } from '../api/BooksAPI';
import './BookForm.css';

interface EditBookFormProps {
  book: Book;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditBookForm = ({ book, onSuccess, onCancel }: EditBookFormProps) => {
  const [formData, setFormData] = useState<Book>({ ...book });

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
    await updateBook(formData.bookId, formData);
    onSuccess();
  };

  return (
    <div className="card shadow-sm book-admin-form mb-4">
      <div className="card-header py-3 text-bg-primary">
        <h2 className="h5 mb-0">
          Edit book
          <span className="d-block small fw-normal opacity-75 mt-1">
            ID {formData.bookId}
          </span>
        </h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="edit-title">
                Title
              </label>
              <input
                id="edit-title"
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
              <label className="form-label" htmlFor="edit-author">
                Author
              </label>
              <input
                id="edit-author"
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
              <label className="form-label" htmlFor="edit-publisher">
                Publisher
              </label>
              <input
                id="edit-publisher"
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
              <label className="form-label" htmlFor="edit-isbn">
                ISBN
              </label>
              <input
                id="edit-isbn"
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
              <label className="form-label" htmlFor="edit-classification">
                Classification
              </label>
              <input
                id="edit-classification"
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
              <label className="form-label" htmlFor="edit-category">
                Category
              </label>
              <input
                id="edit-category"
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
              <label className="form-label" htmlFor="edit-pageCount">
                Page count
              </label>
              <input
                id="edit-pageCount"
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
              <label className="form-label" htmlFor="edit-price">
                Price
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  id="edit-price"
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
            <button type="submit" className="btn btn-primary px-4">
              Save changes
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

export default EditBookForm;
