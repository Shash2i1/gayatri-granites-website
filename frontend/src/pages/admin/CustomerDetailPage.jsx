import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as customersApi from '../../api/customers';
import { useToastStore } from '../../store/toastStore';
import { useConfirmStore } from '../../store/confirmStore';
import { ORDER_STATUS_STYLES } from '../../constants/orderEnums';
import Button from '../../components/common/Button';
import Skeleton from '../../components/common/Skeleton';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const { showToast } = useToastStore();
  const { confirm } = useConfirmStore();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customersApi.fetchUserDetail(id);
      setDetail(data);
    } catch {
      showToast('Could not load customer.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggleBlock = async () => {
    const willBlock = !detail.user.blocked;
    const confirmed = await confirm({
      title: willBlock ? 'Block this customer?' : 'Unblock this customer?',
      message: willBlock
        ? 'They will no longer be able to log in or place orders.'
        : 'They will regain access to their account.',
      confirmLabel: willBlock ? 'Block' : 'Unblock',
      variant: willBlock ? 'danger' : 'accent',
    });
    if (!confirmed) return;

    try {
      const updatedUser = await customersApi.updateUserStatus(id, willBlock);
      setDetail({ ...detail, user: updatedUser });
      showToast(willBlock ? 'Customer blocked.' : 'Customer unblocked.', 'success');
    } catch {
      showToast('Could not update customer status.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!detail) return <p className="text-danger">Customer not found.</p>;

  const { user, orders, totalOrders } = detail;

  return (
    <div>
      <Link to="/admin/customers" className="text-sm text-muted hover:text-primary">
        ← Back to Customers
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{user.name || user.email}</h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
        <Button
          variant={user.blocked ? 'accent' : 'danger'}
          onClick={handleToggleBlock}
          className="w-full sm:w-auto"
        >
          {user.blocked ? 'Unblock Customer' : 'Block Customer'}
        </Button>
      </div>

      <section className="bg-surface border border-border rounded-lg p-4 md:p-6 mt-6">
        <h2 className="font-semibold mb-4">Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted text-xs">Role</p>
            <p className="font-medium">{user.role}</p>
          </div>
          <div>
            <p className="text-muted text-xs">Provider</p>
            <p className="font-medium">{user.provider}</p>
          </div>
          <div>
            <p className="text-muted text-xs">Joined</p>
            <p className="font-medium">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </p>
          </div>
          <div>
            <p className="text-muted text-xs">Status</p>
            <p className={`font-medium ${user.blocked ? 'text-danger' : 'text-success'}`}>
              {user.blocked ? 'Blocked' : 'Active'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface border border-border rounded-lg p-4 md:p-6 mt-6">
        <h2 className="font-semibold mb-4">Order History ({totalOrders})</h2>

        {orders.length === 0 && <p className="text-sm text-muted">No orders yet.</p>}

        {orders.length > 0 && (
          <div className="space-y-2">
            {orders.map((o) => (
              <Link
                key={o.id}
                to={`/admin/orders/${o.id}`}
                className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0 hover:text-accent-dark"
              >
                <span className="font-medium">Order #{o.id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ORDER_STATUS_STYLES[o.status]}`}>
                  {o.status}
                </span>
                <span className="text-muted">{new Date(o.createdAt).toLocaleDateString()}</span>
                <span className="font-medium">₹{o.totalAmount.toFixed(0)}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}