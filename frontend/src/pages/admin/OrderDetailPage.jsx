import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as ordersApi from '../../api/orders';
import { useToastStore } from '../../store/toastStore';
import { useConfirmStore } from '../../store/confirmStore';
import { ORDER_STATUSES, ORDER_STATUS_STYLES } from '../../constants/orderEnums';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Skeleton from '../../components/common/Skeleton';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { showToast } = useToastStore();
  const { confirm } = useConfirmStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [statusInput, setStatusInput] = useState('');
  const [transportInput, setTransportInput] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ordersApi.fetchOrder(id);
      setOrder(data);
      setStatusInput(data.status);
      setTransportInput(data.transportDetails ?? '');
    } catch {
      showToast('Could not load order.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusUpdate = async () => {
    try {
      const updated = await ordersApi.updateOrderStatus(id, statusInput);
      setOrder(updated);
      showToast('Status updated.', 'success');
    } catch {
      showToast('Could not update status.', 'error');
    }
  };

  const handleAssignTransport = async () => {
    try {
      const updated = await ordersApi.assignTransport(id, transportInput);
      setOrder(updated);
      showToast('Transport details saved.', 'success');
    } catch {
      showToast('Could not save transport details.', 'error');
    }
  };

  const handleRefund = async () => {
    if (!refundReason.trim()) {
      showToast('Please enter a refund reason.', 'error');
      return;
    }
    const confirmed = await confirm({
      title: 'Process refund?',
      message: 'This will mark the order as CANCELLED. This cannot be undone here.',
      confirmLabel: 'Process Refund',
      variant: 'danger',
    });
    if (!confirmed) return;

    try {
      const updated = await ordersApi.processRefund(id, refundReason);
      setOrder(updated);
      setStatusInput(updated.status);
      showToast('Refund processed.', 'success');
    } catch {
      showToast('Could not process refund.', 'error');
    }
  };

  const handleInvoiceDownload = () => {
    window.open(ordersApi.getInvoiceUrl(id), '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!order) return <p className="text-danger">Order not found.</p>;

  return (
    <div>
      <Link to="/admin/orders" className="text-sm text-muted hover:text-primary">
        ← Back to Orders
      </Link>

      <div className="flex items-center gap-3 mt-2">
        <h1 className="text-xl md:text-2xl font-bold">Order #{order.id}</h1>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${ORDER_STATUS_STYLES[order.status]}`}>
          {order.status}
        </span>
      </div>
      <p className="text-sm text-muted">{order.userEmail} · {order.phoneNumber}</p>
      <p className="text-xs text-muted mt-1">Placed {new Date(order.createdAt).toLocaleString()}</p>

      {/* Items */}
      <section className="bg-surface border border-border rounded-lg p-4 md:p-6 mt-6">
        <h2 className="font-semibold mb-4">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
              <div>
                <div className="font-medium">{item.productName}</div>
                {item.variantSku && <div className="text-xs text-muted">{item.variantSku}</div>}
                <div className="text-xs text-muted">{item.quantity} × ₹{item.priceAtPurchase}</div>
              </div>
              <div className="font-medium">₹{(item.quantity * item.priceAtPurchase).toFixed(0)}</div>
            </div>
          ))}
        </div>

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

      {/* Shipping */}
      <section className="bg-surface border border-border rounded-lg p-4 md:p-6 mt-6">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm text-muted">{order.shippingAddress}</p>
      </section>

      {/* Status / Transport / Refund / Invoice - grid on desktop, stacked on mobile */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Update Status</h3>
          <div className="flex gap-2">
            <Select value={statusInput} onChange={(e) => setStatusInput(e.target.value)}>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Button variant="accent" onClick={handleStatusUpdate}>Save</Button>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Transport Details</h3>
          <div className="flex gap-2">
            <Input
              value={transportInput}
              onChange={(e) => setTransportInput(e.target.value)}
              placeholder="Carrier, vehicle no., ETA"
            />
            <Button variant="accent" onClick={handleAssignTransport}>Save</Button>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Process Refund</h3>
          <div className="flex gap-2">
            <Input
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Reason for refund"
            />
            <Button variant="danger" onClick={handleRefund}>Refund</Button>
          </div>
          {order.refundReason && (
            <p className="text-xs text-muted mt-2">Previous: {order.refundReason}</p>
          )}
        </div>

        <div className="bg-surface border border-border rounded-lg p-4 flex flex-col justify-center">
          <h3 className="text-sm font-semibold mb-2">Invoice</h3>
          <Button variant="outline" onClick={handleInvoiceDownload}>Download PDF</Button>
        </div>
      </section>
    </div>
  );
}