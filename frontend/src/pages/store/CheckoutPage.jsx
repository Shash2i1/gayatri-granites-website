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

  // -----------------------------------------
  // Shipping details
  // -----------------------------------------
  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phoneNumber: '',
    addressLine: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [pricing, setPricing] = useState(null);
  const [pendingRazorpayOrder, setPendingRazorpayOrder] = useState(null);

  const checkoutItems = items.map((i) => ({
    productId: i.productId,
    variantId: i.variantId,
    quantity: i.quantity,
  }));

  // -----------------------------------------
  // Handle shipping field changes
  // -----------------------------------------
  const handleFieldChange = (field) => (e) => {
    setAddress((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Recalculate if any address information changes
    if (pricing) {
      setPricing(null);
      setPendingRazorpayOrder(null);
    }
  };

  // -----------------------------------------
  // Build shipping address string
  // -----------------------------------------
  const getShippingAddress = () => {
    return [
      address.addressLine,
      address.area,
      address.city,
      address.state,
      address.pincode,
    ]
      .filter(Boolean)
      .join(', ');
  };

  // -----------------------------------------
  // Calculate total
  // -----------------------------------------
  const handleCalculate = async () => {
    setError(null);

    if (
      !address.fullName.trim() ||
      !address.phoneNumber.trim() ||
      !address.addressLine.trim() ||
      !address.area.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.pincode.trim()
    ) {
      setError('Please fill in all shipping details.');
      return;
    }

    // Basic phone validation
    if (!/^\d{10}$/.test(address.phoneNumber.trim())) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    // Basic pincode validation
    if (!/^\d{6}$/.test(address.pincode.trim())) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }

    setProcessing(true);

    try {
      const shippingAddress = getShippingAddress();

      const orderResponse = await checkoutApi.createCheckoutOrder({
        items: checkoutItems,
        shippingAddress,
        phoneNumber: address.phoneNumber,
      });

      setPricing(orderResponse);
      setPendingRazorpayOrder(orderResponse);
    } catch (e) {
      setError(
        e?.response?.data?.message ??
          'Could not calculate total. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  };

  // -----------------------------------------
  // Razorpay payment
  // -----------------------------------------
  const handlePay = async () => {
    if (!pendingRazorpayOrder) return;

    setProcessing(true);
    setError(null);

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setError(
          'Could not load payment gateway. Please check your connection and try again.'
        );
        setProcessing(false);
        return;
      }

      const shippingAddress = getShippingAddress();

      const options = {
        key: pendingRazorpayOrder.razorpayKeyId,
        amount: pendingRazorpayOrder.amountInPaise,
        currency: pendingRazorpayOrder.currency,
        name: 'Gayatri Granites',
        description: 'Order payment',
        order_id: pendingRazorpayOrder.razorpayOrderId,

        prefill: {
          email: user?.email,
          contact: address.phoneNumber,
          name: address.fullName,
        },

        handler: async (response) => {
          try {
            const order = await checkoutApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              items: checkoutItems,
              shippingAddress,
              phoneNumber: address.phoneNumber,
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

        modal: {
          ondismiss: () => setProcessing(false),
        },

        theme: {
          color: '#1a1a1a',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setError(
        e?.response?.data?.message ??
          'Could not start payment. Please try again.'
      );
      setProcessing(false);
    }
  };

  // -----------------------------------------
  // Empty cart
  // -----------------------------------------
  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 text-center">
        <p className="text-muted">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* =====================================
            LEFT SIDE
        ====================================== */}
        <div className="lg:col-span-2 space-y-4">

          {/* Shipping Details */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="font-semibold mb-4">
              Shipping Details
            </h2>

            <div className="space-y-4">

              {/* Full Name */}
              <Input
                label="Full Name"
                value={address.fullName}
                onChange={handleFieldChange('fullName')}
                placeholder="Enter your full name"
              />

              {/* Phone Number */}
              <Input
                label="Phone Number"
                value={address.phoneNumber}
                onChange={handleFieldChange('phoneNumber')}
                placeholder="10-digit mobile number"
                type="tel"
                maxLength={10}
              />

              {/* Address */}
              <Input
                label="Address"
                value={address.addressLine}
                onChange={handleFieldChange('addressLine')}
                placeholder="House no, building name, street"
              />

              {/* Area */}
              <Input
                label="Area / Locality"
                value={address.area}
                onChange={handleFieldChange('area')}
                placeholder="Area or locality"
              />

              {/* City + State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Input
                  label="City"
                  value={address.city}
                  onChange={handleFieldChange('city')}
                  placeholder="City"
                />

                <Input
                  label="State"
                  value={address.state}
                  onChange={handleFieldChange('state')}
                  placeholder="State"
                />

              </div>

              {/* Pincode */}
              <Input
                label="Pincode"
                value={address.pincode}
                onChange={handleFieldChange('pincode')}
                placeholder="6-digit pincode"
                type="tel"
                maxLength={6}
              />

            </div>
          </div>

          {/* Items */}
          <div className="bg-surface border border-border rounded-lg p-5">
            <h2 className="font-semibold mb-4">
              Items
            </h2>

            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex justify-between text-sm py-2 border-b border-border last:border-0"
              >
                <span className="text-muted truncate pr-4">
                  {item.name} × {item.quantity}
                </span>

                <span className="font-medium shrink-0">
                  ₹{(item.unitPrice * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================
            RIGHT SIDE - ORDER SUMMARY
        ====================================== */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-lg p-5 sticky top-24">

            <h2 className="font-semibold mb-4">
              Order Summary
            </h2>

            {!pricing && (
              <p className="text-xs text-muted mb-4">
                Enter your shipping details and calculate the total
                to see GST, SGST, and shipping charges before paying.
              </p>
            )}

            {/* Pricing */}
            {pricing && (
              <div className="space-y-2 text-sm mb-4">

                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span>
                    ₹{pricing.subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-muted">
                  <span>GST</span>
                  <span>
                    ₹{pricing.gstAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-muted">
                  <span>SGST</span>
                  <span>
                    ₹{pricing.sgstAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-muted">
                  <span>Shipping</span>
                  <span>
                    ₹{pricing.shippingCharge.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between font-semibold text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span>
                    ₹{pricing.totalAmount.toFixed(2)}
                  </span>
                </div>

              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-danger text-sm mb-3">
                {error}
              </p>
            )}

            {/* Calculate / Pay */}
            {!pricing ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCalculate}
                disabled={processing}
              >
                {processing
                  ? 'Calculating...'
                  : 'Calculate Total'}
              </Button>
            ) : (
              <Button
                variant="accent"
                className="w-full"
                onClick={handlePay}
                disabled={processing}
              >
                {processing
                  ? 'Processing...'
                  : `Pay ₹${pricing.totalAmount.toFixed(0)}`}
              </Button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
