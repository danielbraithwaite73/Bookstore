/**
 * Main shopping/browse page: category sidebar + book list + floating cart summary.
 * Category selection is reflected as repeated `cat` query params so BookList and the URL stay in sync.
 */
import { useSearchParams } from 'react-router-dom';
import BookList from '../components/BookList';
import CartSummary from '../components/CartSummary';
import CategoryFilter from '../components/CategoryFilter';

function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategories = searchParams.getAll('cat');

  const setSelectedCategories = (cats: string[]) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        p.delete('cat');
        for (const c of cats) {
          p.append('cat', c);
        }
        p.set('page', '1');
        return p;
      },
      { replace: true }
    );
  };

  return (
    <div className="container mt-4 pt-5">
      <CartSummary />
      <div className="row text-start">
        <div className="col-md-3 mb-4">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
        <div className="col-md-9">
          <BookList />
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
