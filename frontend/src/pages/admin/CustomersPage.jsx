import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as customersApi from '../../api/customers';
import { useToastStore } from '../../store/toastStore';
import CustomerListSkeleton from '../../components/admin/CustomerListSkeleton';

export default function CustomersPage() {
  const { showToast } = useToastStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await customersApi.fetchUsers();
        setUsers(data);
      } catch {
        showToast('Could not load customers.', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-6">Customers</h1>

      {loading && <CustomerListSkeleton />}

      {!loading && users.length === 0 && <p className="text-muted text-sm">No customers yet.</p>}

      {!loading && users.length > 0 && (
        <>
          {/* mobile: cards */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {users.map((u) => (
              <Link
                key={u.id}
                to={`/admin/customers/${u.id}`}
                className="bg-surface border border-border rounded-lg p-4 block"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{u.name || u.email}</span>
                  {u.blocked && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger/10 text-danger font-medium">
                      Blocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-1">{u.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/10 text-muted">{u.role}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/10 text-muted">{u.provider}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* desktop: table */}
          <div className="hidden md:block bg-surface border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-background/50">
                    <td className="px-6 py-3">
                      <Link to={`/admin/customers/${u.id}`} className="hover:text-accent-dark">
                        <div className="font-medium">{u.name || '—'}</div>
                        <div className="text-xs text-muted">{u.email}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-muted">{u.role}</td>
                    <td className="px-6 py-3 text-muted">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-3">
                      {u.blocked ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-danger/10 text-danger font-medium">
                          Blocked
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success font-medium">
                          Active
                        </span>
                      )}
                    </td>
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