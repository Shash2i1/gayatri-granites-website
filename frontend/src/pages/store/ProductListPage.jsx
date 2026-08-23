import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import * as storeApi from '../../api/store';
import ProductCard from '../../components/store/ProductCard';
import ProductGridSkeleton from '../../components/store/ProductGridSkeleton';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('q');

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    storeApi.fetchCategories().then(setCategories);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        data = await storeApi.searchProducts(searchQuery);
      } else if (categoryId) {
        data = await storeApi.fetchProductsByCategory(categoryId);
      } else {
        data = await storeApi.fetchAllProducts();
      }
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, [categoryId, searchQuery]);

  useEffect(() => {
    load();
  }, [load]);

  const activeCategory = categories.find((c) => String(c.id) === categoryId);

  const handleCategoryClick = (id) => {
    setFilterOpen(false);
    if (id === null) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  const pageTitle = searchQuery
    ? `Search results for "${searchQuery}"`
    : activeCategory
    ? activeCategory.name
    : 'All Products';

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* breadcrumb */}
      <div className="text-xs text-muted mb-4">
        <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-primary">Products</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">{pageTitle}</h1>
        <button
          onClick={() => setFilterOpen(true)}
          className="lg:hidden text-sm font-medium border border-border rounded-md px-3 py-1.5 flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
          </svg>
          Filter
        </button>
      </div>

      <div className="flex gap-8">
        {/* desktop sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <CategoryFilterList
            categories={categories}
            activeCategoryId={categoryId}
            onSelect={handleCategoryClick}
          />
        </aside>

        {/* mobile filter drawer */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-surface p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filter by Category</h3>
                <button onClick={() => setFilterOpen(false)} className="text-muted">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <CategoryFilterList
                categories={categories}
                activeCategoryId={categoryId}
                onSelect={handleCategoryClick}
              />
            </div>
          </div>
        )}

        {/* products grid */}
        <div className="flex-1">
          {loading && <ProductGridSkeleton count={9} />}

          {!loading && products.length === 0 && (
            <p className="text-muted text-sm">No products found.</p>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryFilterList({ categories, activeCategoryId, onSelect }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Categories</h3>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onSelect(null)}
            className={`text-sm w-full text-left px-2 py-1.5 rounded-md ${
              !activeCategoryId ? 'bg-accent/10 text-accent-dark font-medium' : 'text-muted hover:bg-background'
            }`}
          >
            All Products
          </button>
        </li>
        {categories.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`text-sm w-full text-left px-2 py-1.5 rounded-md ${
                String(activeCategoryId) === String(c.id)
                  ? 'bg-accent/10 text-accent-dark font-medium'
                  : 'text-muted hover:bg-background'
              }`}
            >
              {c.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}