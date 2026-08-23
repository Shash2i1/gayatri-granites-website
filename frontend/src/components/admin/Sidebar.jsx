import { NavLink } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/charge-settings', label: 'Charge Settings' },
];

export default function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUiStore();

  return (
    <>
      {/* backdrop - mobile only, shown when drawer is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full md:h-auto md:min-h-screen w-64 md:w-60
          bg-primary text-white flex flex-col shrink-0 z-50
          transform transition-transform duration-200 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="font-bold text-lg tracking-wide">
              GAYATRI <span className="text-accent">GRANITES</span>
            </div>
            <div className="text-xs text-white/50 mt-0.5">Admin Panel</div>
          </div>

          {/* close button - mobile only */}
          <button onClick={closeSidebar} className="md:hidden text-white/70 hover:text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `block px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-primary'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}