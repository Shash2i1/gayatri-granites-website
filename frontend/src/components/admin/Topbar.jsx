import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUiStore();

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between md:justify-end px-4 md:px-8 gap-4">
      <button onClick={toggleSidebar} className="md:hidden text-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-sm text-muted truncate max-w-[160px]">
          {user?.email}
        </span>
        <button
          onClick={logout}
          className="text-sm font-medium px-3 md:px-4 py-1.5 rounded-md bg-primary text-white hover:bg-black transition-colors whitespace-nowrap"
        >
          Logout
        </button>
      </div>
    </header>
  );
}