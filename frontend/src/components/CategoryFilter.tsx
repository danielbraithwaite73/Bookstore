/**
 * Sidebar checklist of categories from the API. This component does not own URL state itself:
 * the parent (BooksPage) writes selected values to search params so BookList refetches with the same filters.
 */
import { useEffect, useState } from 'react';
import { API_BASE } from '../constants';
import './CategoryFilter.css';

function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
}) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/Books/GetBookCategories`);
        const data: unknown = await response.json();
        if (Array.isArray(data) && data.every((x) => typeof x === 'string')) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchCategories();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedCategories = selectedCategories.includes(target.value)
      ? selectedCategories.filter((x) => x !== target.value)
      : [...selectedCategories, target.value];
    setSelectedCategories(updatedCategories);
  }

  return (
    <div className="category-filter">
      <h5 className="text-start">Categories</h5>
      <div className="category-list">
        {categories.map((c) => (
          <div key={c} className="category-item">
            <input
              type="checkbox"
              id={`cat-${c}`}
              value={c}
              className="category-checkbox"
              checked={selectedCategories.includes(c)}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={`cat-${c}`}>{c}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
