import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import * as checkoutApi from '../../api/checkout';
import { loadRazorpayScript } from '../../utils/razorpay';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [pricing, setPricing] = useState(null);
  const [pendingRazorpayOrder, setPendingRazorpayOrder] = useState(null);

  const checkoutItems = items.map((i) => ({
    productId: i.productId,
    variantId: i.variantId,
    quantity: i.quantity,
  }));

  const handleCalculate = async () => {
    setError(null);
    if (!shippingAddress.trim() || !phoneNumber.trim()) {
      setError('Please fill in your shipping address and phone number.');
      return;
    }

    setProcessing(true);
    try {
      const orderResponse = await checkoutApi.createCheckoutOrder({
        items: checkoutItems,
        shippingAddress,
        phoneNumber,
      });
      setPricing(orderResponse);
      setPendingRazorpayOrder(orderResponse);
    } catch (e) {
      setError(e?.response?.data?.message ?? 'Could not calculate total. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePay = async () => {
    if (!pendingRazorpayOrder) return;

    setProcessing(true);
    setError(null);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Could not load payment gateway. Please check your connection and try again.');
        setProcessing(false);
        return;
      }

      const options = {
        key: pendingRazorpayOrder.razorpayKeyId,
        amount: pendingRazorpayOrder.amountInPaise,
        currency: pendingRazorpayOrder.currency,
        name: 'Gayatri Granites',
        description: 'Order payment',
        order_id: pendingRazorpayOrder.razorpayOrderId,
        prefill: { email: user?.email, contact: phoneNumber },
        handler: async (response) => {
          try {
            const order = await checkoutApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              items: checkoutItems,
              shippingAddress,
              phoneNumber,
            });
            clearCart();
            navigate(`/orders/${order.id}`);
          } catch {
            setError(
              'Payment succeeded but order confirmation failed. Please contact support with your payment reference.'
            );
          } finally {
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
        theme: { color: '#1a1a1a' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setError(e?.response?.data?.message ?? 'Could not start payment. Please try again.');
      setProcessing(false);
    }
  };

  const handleFieldChange = (setter) => (e) => {
    setter(e.target.value);
    if (pricing) {
      setPricing(null);
      setPendingRazorpayOrder(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 text-center">
        <p className="text-muted">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="font-semibold mb-4">Shipping Details</h2>
            <div className="space-y-4">
              <Input
                label="Shipping Address"
                value={shippingAddress}
                onChange={handleFieldChange(setShippingAddress)}
                placeholder="Full address including city, state, pincode"
              />
              <Input
                label="Phone Number"
                value={phoneNumber}
                onChange={handleFieldChange(setPhoneNumber)}
                placeholder="10-digit mobile number"
                type="tel"
              />
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="font-semibold mb-4">Items</h2>
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex justify-between text-sm py-2 border-b border-border last:border-0"
              >
                <span className="text-muted truncate pr-4">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium shrink-0">₹{(item.unitPrice * item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-lg p-5 sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {!pricing && (
              <p className="text-xs text-muted mb-4">
                Enter your shipping details and calculate the total to see GST, SGST, and
                shipping charges before paying.
              </p>
            )}

            {pricing && (
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>₹{pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>GST</span>
                  <span>₹{pricing.gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>SGST</span>
                  <span>₹{pricing.sgstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>₹{pricing.shippingCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span>₹{pricing.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {error && <p className="text-danger text-sm mb-3">{error}</p>}

            {!pricing ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCalculate}
                disabled={processing}
              >
                {processing ? 'Calculating...' : 'Calculate Total'}
              </Button>
            ) : (
              <Button
                variant="accent"
                className="w-full"
                onClick={handlePay}
                disabled={processing}
              >
                {processing ? 'Processing...' : `Pay ₹${pricing.totalAmount.toFixed(0)}`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}