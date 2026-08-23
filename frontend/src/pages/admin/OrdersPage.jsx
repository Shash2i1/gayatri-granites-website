import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ordersApi from '../../api/orders';
import { useToastStore } from '../../store/toastStore';
import { ORDER_STATUSES, ORDER_STATUS_STYLES } from '../../constants/orderEnums';
import Select from '../../components/common/Select';
import OrderListSkeleton from '../../components/admin/OrderListSkeleton';

export default function OrdersPage() {
  const { showToast } = useToastStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await ordersApi.fetchOrders();
        setOrders(data.sort((a, b) => b.id - a.id));
      } catch {
        showToast('Could not load orders.', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  const filteredOrders =
    statusFilter === 'ALL' ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Orders</h1>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="ALL">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>

      {loading && <OrderListSkeleton />}

      {!loading && filteredOrders.length === 0 && (
        <p className="text-muted text-sm">No orders found.</p>
      )}

      {!loading && filteredOrders.length > 0 && (
        <>
          {/* mobile: cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredOrders.map((o) => (
              <Link
                key={o.id}
                to={`/admin/orders/${o.id}`}
                className="bg-surface border border-border rounded-lg p-4 block"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Order #{o.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ORDER_STATUS_STYLES[o.status]}`}>
                    {o.status}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 truncate">{o.userEmail}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-medium">₹{o.totalAmount.toFixed(0)}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* desktop: table */}
          <div className="hidden md:block bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-background/50">
                    <td className="px-6 py-3">
                      <Link to={`/admin/orders/${o.id}`} className="font-medium hover:text-accent-dark">
                        #{o.id}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-muted">{o.userEmail}</td>
                    <td className="px-6 py-3 text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_STYLES[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-medium">₹{o.totalAmount.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}