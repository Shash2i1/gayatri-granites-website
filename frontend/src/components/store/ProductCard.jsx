import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPrice != null && product.discountPrice < product.basePrice;

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="aspect-square bg-background overflow-hidden relative">
        {product.primaryImageUrl ? (
          <img
            src={product.primaryImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs">No image</div>
        )}
        {product.stockStatus === 'OUT_OF_STOCK' && (
          <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="text-[11px] text-muted">{product.categoryName}</p>
        <h3 className="text-sm font-semibold mt-0.5 line-clamp-2 min-h-[2.5em]">{product.name}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          {hasDiscount ? (
            <>
              <span className="text-xs text-muted line-through">₹{product.basePrice}</span>
              <span className="font-bold">₹{product.discountPrice}</span>
            </>
          ) : (
            <span className="font-bold">₹{product.basePrice}</span>
          )}
          <span className="text-[11px] text-muted">/ {product.pricingUnit.replace('PER_', '').toLowerCase()}</span>
        </div>
      </div>
    </Link>
  );
}