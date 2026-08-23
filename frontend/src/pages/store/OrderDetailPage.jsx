import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as myOrdersApi from '../../api/myOrders';
import { ORDER_STATUS_STYLES } from '../../constants/storeOrderEnums';
import Skeleton from '../../components/common/Skeleton';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    myOrdersApi
      .fetchMyOrder(id)
      .then(setOrder)
      .catch(() => setError('Order not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadInvoice = () => {
    window.open(myOrdersApi.getInvoiceUrl(id), '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-16 text-center">
        <p className="text-danger">{error ?? 'Something went wrong.'}</p>
        <Link to="/orders" className="text-accent-dark text-sm mt-4 inline-block">← Back to My Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <Link to="/orders" className="text-sm text-muted hover:text-primary">← Back to My Orders</Link>

      <div className="flex items-center gap-3 mt-2">
        <h1 className="text-xl md:text-2xl font-bold">Order #{order.id}</h1>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_STYLES[order.status]}`}>
          {order.status}
        </span>
      </div>
      <p className="text-xs text-muted mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>

      <section className="bg-surface border border-border rounded-lg p-5 mt-6">
        <h2 className="font-semibold mb-4">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
            <div>
              <div className="font-medium">{item.productName}</div>
              {item.variantSku && <div className="text-xs text-muted">{item.variantSku}</div>}
              <div className="text-xs text-muted">{item.quantity} × ₹{item.priceAtPurchase}</div>
            </div>
            <div className="font-medium">₹{(item.quantity * item.priceAtPurchase).toFixed(0)}</div>
          </div>
        ))}

        <div className="mt-4 pt-4 border-t border-border space-y-1 text-sm">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span><span>₹{order.subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>GST ({order.gstPercentage}%)</span><span>₹{order.gstAmount.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>SGST ({order.sgstPercentage}%)</span><span>₹{order.sgstAmount.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Shipping</span><span>₹{order.shippingCharge.toFixed(0)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-1">
            <span>Total</span><span>₹{order.totalAmount.toFixed(0)}</span>
          </div>
        </div>
      </section>

      <section className="bg-surface border border-border rounded-lg p-5 mt-4">
        <h2 className="font-semibold mb-2">Shipping</h2>
        <p className="text-sm text-muted">{order.shippingAddress}</p>
        <p className="text-sm text-muted mt-1">Phone: {order.phoneNumber}</p>
        {order.transportDetails && (
          <p className="text-sm text-muted mt-1">Transport: {order.transportDetails}</p>
        )}
      </section>

      <button
        onClick={handleDownloadInvoice}
        className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-black transition-colors mt-6"
      >
        Download Invoice (PDF)
      </button>
    </div>
  );
}