import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import TopBar from './TopBar';

export default function Header() {
  const navigate = useNavigate();
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const { user, isLoggedIn, login, logout } = useAuthStore();
  const [searchText, setSearchText] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    navigate(`/products?q=${encodeURIComponent(searchText.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface shadow-sm">
      <TopBar />

      <div className="px-4 md:px-6 py-3 flex items-center gap-4">
        <button className="md:hidden" onClick={() => setMobileMenuOpen((o) => !o)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <Link to="/" className="font-bold text-lg tracking-wide shrink-0">
          GAYATRI <span className="text-accent">GRANITES</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search for granites, marble, tiles..."
            className="flex-1 border border-border rounded-l-md px-4 py-2 text-sm focus:outline-none focus:border-accent"
          />
          <button type="submit" className="bg-accent text-primary px-4 rounded-r-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <div className="ml-auto flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/orders" className="hidden sm:inline text-sm font-medium hover:text-accent-dark">
                My Orders
              </Link>
              <button onClick={logout} className="hidden sm:inline text-sm text-muted hover:text-primary">
                Logout
              </button>
            </>
          ) : (
            <button onClick={login} className="text-sm font-medium hover:text-accent-dark">
              Sign In
            </button>
          )}

          <Link to="/cart" className="relative flex items-center gap-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* mobile search - separate row below main header */}
      <form onSubmit={handleSearch} className="md:hidden px-4 pb-3 flex">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border border-border rounded-l-md px-3 py-2 text-sm"
        />
        <button type="submit" className="bg-accent text-primary px-3 rounded-r-md">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </button>
      </form>

      {/* mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border px-4 py-3 space-y-2">
          <Link to="/" className="block text-sm font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/products" className="block text-sm font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
            All Products
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/orders" className="block text-sm font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                My Orders
              </Link>
              <button onClick={logout} className="block text-sm text-muted py-1">Logout</button>
            </>
          ) : (
            <button onClick={login} className="block text-sm font-medium py-1">Sign In</button>
          )}
        </div>
      )}
    </header>
  );
}