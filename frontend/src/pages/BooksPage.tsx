import { Link, useSearchParams } from 'react-router-dom';
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
          <p className="text-center text-muted small mt-3 mb-0">
            <Link to="/adminbooks">Admin: manage books</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BooksPage;
