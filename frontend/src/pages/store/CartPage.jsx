import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import * as publicSettingsApi from '../../api/publicSettings';
import CartItemRow from '../../components/store/CartItemRow';
import Skeleton from '../../components/common/Skeleton';

export default function CartPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0));
  const { isLoggedIn, login } = useAuthStore();

  const [charges, setCharges] = useState(null);
  const [loadingCharges, setLoadingCharges] = useState(true);

  useEffect(() => {
    publicSettingsApi
      .fetchPublicChargeSettings()
      .then(setCharges)
      .finally(() => setLoadingCharges(false));
  }, []);

  const gstAmount = charges ? (subtotal * charges.gstPercentage) / 100 : 0;
  const sgstAmount = charges ? (subtotal * charges.sgstPercentage) / 100 : 0;
  const shippingCharge = charges?.shippingCharge ?? 0;
  const estimatedTotal = subtotal + gstAmount + sgstAmount + shippingCharge;

  const handleCheckout = () => {
    if (!isLoggedIn) {
      login();
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 text-center">
        <p className="text-muted mb-4">Your cart is empty.</p>
        <Link
          to="/products"
          className="inline-block bg-primary text-white font-medium px-6 py-3 rounded-md hover:bg-black transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-bold mb-6">My Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg px-4 md:px-6">
          {items.map((item) => (
            <CartItemRow key={`${item.productId}-${item.variantId}`} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-lg p-5 sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {loadingCharges ? (
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>GST ({charges?.gstPercentage ?? 0}%)</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>SGST ({charges?.sgstPercentage ?? 0}%)</span>
                  <span>₹{sgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>₹{shippingCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                  <span>Estimated Total</span>
                  <span>₹{estimatedTotal.toFixed(2)}</span>
                </div>
              </div>
            )}

            <p className="text-xs text-muted mb-4">
              Final total is confirmed by the server at checkout before payment.
            </p>

            <button
              onClick={handleCheckout}
              className="w-full bg-accent text-primary font-semibold py-3 rounded-md hover:bg-accent-dark transition-colors"
            >
              {isLoggedIn ? 'Proceed to Checkout' : 'Sign in to Checkout'}
            </button>

            <Link
              to="/products"
              className="block text-center text-sm text-muted hover:text-primary mt-3"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}