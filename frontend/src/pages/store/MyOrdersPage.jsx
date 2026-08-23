import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as myOrdersApi from '../../api/myOrders';
import { ORDER_STATUS_STYLES } from '../../constants/storeOrderEnums';
import Skeleton from '../../components/common/Skeleton';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    myOrdersApi
      .fetchMyOrders()
      .then((data) => setOrders(data.sort((a, b) => b.id - a.id)))
      .catch(() => setError('Could not load your orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <h1 className="text-xl md:text-2xl font-bold mb-6">My Orders</h1>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {!loading && error && <p className="text-danger text-sm">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted mb-4">You haven't placed any orders yet.</p>
          <Link to="/products" className="text-accent-dark font-medium hover:underline">
            Browse products →
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block bg-surface border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">Order #{order.id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ORDER_STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <p className="text-xs text-muted mt-1 line-clamp-1">
                {order.items.map((i) => i.productName).join(', ')}
              </p>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="font-semibold text-sm">₹{order.totalAmount.toFixed(0)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}