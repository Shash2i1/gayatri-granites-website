import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export default function CartItemRow({ item }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0">
      <Link to={`/products/${item.productId}`} className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-background">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : null}
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.productId}`} className="font-medium text-sm hover:text-accent-dark line-clamp-2">
          {item.name}
        </Link>
        {item.variantLabel && <p className="text-xs text-muted mt-0.5">{item.variantLabel}</p>}
        <p className="text-sm text-muted mt-1">
          ₹{item.unitPrice} / {item.pricingUnit.replace('PER_', '').toLowerCase()}
        </p>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center font-bold text-sm"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center font-bold text-sm"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.productId, item.variantId)}
            className="text-xs text-danger font-medium hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="text-sm font-semibold shrink-0">
        ₹{(item.unitPrice * item.quantity).toFixed(0)}
      </div>
    </div>
  );
}