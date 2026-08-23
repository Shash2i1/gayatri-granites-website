import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as storeApi from '../../api/store';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from '../../store/toastStore';
import ImageGallery from '../../components/store/ImageGallery';
import Skeleton from '../../components/common/Skeleton';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToastStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    storeApi
      .fetchProductDetail(id)
      .then((data) => {
        setProduct(data);
        if (data.variants.length > 0) setSelectedVariant(data.variants[0]);
      })
      .catch(() => setError('Product not found or no longer available.'))
      .finally(() => setLoading(false));
  }, [id]);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    const base = product.discountPrice ?? product.basePrice;
    return base + (selectedVariant?.priceAdjustment ?? 0);
  }, [product, selectedVariant]);

  const handleAddToCart = () => {
    const primaryImage =
      product.images.find((img) => img.isPrimary)?.imageUrl ?? product.images[0]?.imageUrl ?? null;

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      variantLabel: selectedVariant
        ? `${selectedVariant.size} · ${selectedVariant.finish} · ${selectedVariant.thicknessMm}mm`
        : null,
      quantity,
      unitPrice,
      imageUrl: primaryImage,
      pricingUnit: product.pricingUnit,
    });

    showToast('Added to cart', 'success');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 text-center">
        <p className="text-danger">{error ?? 'Something went wrong.'}</p>
        <Link to="/products" className="text-accent-dark text-sm mt-4 inline-block">← Back to products</Link>
      </div>
    );
  }

  const outOfStock = product.stockStatus === 'OUT_OF_STOCK';
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.basePrice;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="text-xs text-muted mb-4">
        <Link to="/" className="hover:text-primary">Home</Link> /{' '}
        <Link to="/products" className="hover:text-primary">Products</Link> /{' '}
        <span className="text-primary">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <ImageGallery images={product.images} productName={product.name} />

        <div>
          {product.stockStatus === 'IN_STOCK' && (
            <span className="inline-block bg-success/10 text-success text-xs font-medium px-2.5 py-1 rounded-full mb-3">
              In Stock
            </span>
          )}

          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
          <p className="text-sm text-muted mt-1">{product.origin}</p>

          <div className="flex items-baseline gap-3 mt-4">
            {hasDiscount ? (
              <>
                <span className="text-lg text-muted line-through">₹{product.basePrice}</span>
                <span className="text-3xl font-bold">₹{unitPrice.toFixed(0)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold">₹{unitPrice.toFixed(0)}</span>
            )}
            <span className="text-sm text-muted">/ {product.pricingUnit.replace('PER_', '').toLowerCase()}</span>
          </div>

          <p className="text-sm text-muted mt-4 leading-relaxed">{product.description}</p>

          {product.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-2">Select Variant</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`text-xs px-3 py-2 rounded-md border ${
                      selectedVariant?.id === v.id
                        ? 'border-primary bg-primary text-white'
                        : 'border-border text-primary hover:border-primary'
                    }`}
                  >
                    {v.size} · {v.finish} · {v.thicknessMm}mm
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-md bg-background border border-border font-bold"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-md bg-background border border-border font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className="flex-1 border border-primary text-primary font-semibold py-3 rounded-md hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="flex-1 bg-accent text-primary font-semibold py-3 rounded-md hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}