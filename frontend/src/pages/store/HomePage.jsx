import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as storeApi from '../../api/store';
import ProductCard from '../../components/store/ProductCard';
import ProductGridSkeleton from '../../components/store/ProductGridSkeleton';
import Skeleton from '../../components/common/Skeleton';

const heroImages = [
  '/images/granite-background-img.png',
  '/images/granite-background-img-2.png',
  '/images/granite-background-img-3.png',
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          storeApi.fetchCategories(),
          storeApi.fetchAllProducts(),
        ]);
        setCategories(cats);
        setProducts(prods.slice(0, 8));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative text-white overflow-hidden">
        {/* Slideshow layers */}
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${src}')`,
              opacity: i === activeSlide ? 1 : 0,
            }}
          />
        ))}

        {/* overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20">
          <p className="text-accent text-xs md:text-sm font-medium mb-2">NATURAL STONE. TIMELESS BEAUTY.</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-xl">
            Premium Granite for <span className="text-accent">Every Space</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base mt-4 max-w-md">
            Discover our wide range of premium quality granites crafted to perfection for your dream spaces.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link
              to="/products"
              className="bg-accent text-primary text-center font-semibold px-6 py-3 rounded-md hover:bg-accent-light transition-colors"
            >
              Explore Collection
            </Link>
            <Link
              to="/products"
              className="border border-white/30 text-white text-center font-semibold px-6 py-3 rounded-md hover:bg-white/10 transition-colors"
            >
              View Products
            </Link>
          </div>

          {/* Slide indicators */}
          {heroImages.length > 1 && (
            <div className="flex gap-2 mt-10">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeSlide ? 'w-8 bg-accent' : 'w-1.5 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <h2 className="text-lg md:text-xl font-bold mb-6">Shop by Category</h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${c.id}`}
                className="border border-border rounded-lg p-4 text-center hover:border-accent hover:shadow-sm transition-all"
              >
                <p className="text-sm font-semibold">{c.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Best selling / featured products */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-accent text-xs font-medium">OUR PRODUCTS</p>
            <h2 className="text-lg md:text-xl font-bold">Best Selling Granites</h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-accent-dark hover:underline hidden sm:block">
            View all →
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <Link
          to="/products"
          className="block sm:hidden text-center text-sm font-medium text-accent-dark mt-6"
        >
          View all products →
        </Link>
      </section>
    </div>
  );
}