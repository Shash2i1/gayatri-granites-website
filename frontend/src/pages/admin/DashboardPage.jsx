import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import * as dashboardApi from '../../api/dashboard';
import * as ordersApi from '../../api/orders';
import { useToastStore } from '../../store/toastStore';
import { ORDER_STATUSES } from '../../constants/orderEnums';
import KpiCard from '../../components/admin/KpiCard';
import DashboardSkeleton from '../../components/admin/DashboardSkeleton';

const PIE_COLORS = {
  PENDING: '#c9922e',
  CONFIRMED: '#0a8a4c',
  DISPATCHED: '#2a6fdb',
  DELIVERED: '#1a1a1a',
  CANCELLED: '#c0392b',
};

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export default function DashboardPage() {
  const { showToast } = useToastStore();
  const [summary, setSummary] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 29); // last 30 days

        const [summaryData, topProductsData, salesReport, allOrders] = await Promise.all([
          dashboardApi.fetchDashboardSummary(),
          dashboardApi.fetchTopProducts(5),
          dashboardApi.fetchSalesReport(formatDate(startDate), formatDate(endDate)),
          ordersApi.fetchOrders(),
        ]);

        setSummary(summaryData);

        setTopProducts(
          topProductsData.map((item) => ({
            name:
              item.productName.length > 18
                ? item.productName.slice(0, 18) + '…'
                : item.productName,
            quantity: item.quantitySold,
          }))
        );

        // aggregate sales report (list of orders) by day
        const byDay = {};
        for (let i = 0; i < 30; i++) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + i);
          byDay[formatDate(d)] = 0;
        }
        salesReport.forEach((order) => {
          const day = order.createdAt.split('T')[0];
          if (byDay[day] !== undefined && order.status !== 'CANCELLED') {
            byDay[day] += order.totalAmount;
          }
        });
        setSalesTrend(
          Object.entries(byDay).map(([date, revenue]) => ({
            date: date.slice(5), // MM-DD
            revenue: Math.round(revenue),
          }))
        );

        // order status distribution from all orders
        const counts = ORDER_STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
        allOrders.forEach((o) => {
          if (counts[o.status] !== undefined) counts[o.status]++;
        });
        setStatusDistribution(
          Object.entries(counts)
            .filter(([, count]) => count > 0)
            .map(([status, count]) => ({ name: status, value: count }))
        );
      } catch {
        showToast('Could not load dashboard data.', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  if (loading) return <DashboardSkeleton />;
  if (!summary) return <p className="text-danger">Could not load dashboard.</p>;

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-6">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Total Orders" value={summary.totalOrders} />
        <KpiCard label="Orders Today" value={summary.ordersToday} accentColor="text-accent-dark" />
        <KpiCard
          label="Total Revenue"
          value={`₹${summary.totalRevenue.toLocaleString('en-IN')}`}
          accentColor="text-success"
        />
        <KpiCard
          label="Revenue This Month"
          value={`₹${summary.revenueThisMonth.toLocaleString('en-IN')}`}
          accentColor="text-success"
        />
        <KpiCard label="Total Products" value={summary.totalProducts} />
        <KpiCard label="Total Customers" value={summary.totalCustomers} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Revenue trend */}
        <div className="bg-surface border border-border rounded-lg p-4 md:p-5">
          <h2 className="font-semibold text-sm mb-4">Revenue — Last 30 Days</h2>
          {salesTrend.every((d) => d.revenue === 0) ? (
            <p className="text-sm text-muted py-16 text-center">No sales data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e2dd" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#c9922e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Order status distribution */}
        <div className="bg-surface border border-border rounded-lg p-4 md:p-5">
          <h2 className="font-semibold text-sm mb-4">Orders by Status</h2>
          {statusDistribution.length === 0 ? (
            <p className="text-sm text-muted py-16 text-center">No orders yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusDistribution.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] ?? '#888'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top products */}
      <div className="bg-surface border border-border rounded-lg p-4 md:p-5">
        <h2 className="font-semibold text-sm mb-4">Top Selling Products</h2>
        {topProducts.length === 0 ? (
          <p className="text-sm text-muted py-16 text-center">No sales data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e2dd" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
              <Tooltip formatter={(value) => [value, 'Units sold']} />
              <Bar dataKey="quantity" fill="#1a1a1a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}