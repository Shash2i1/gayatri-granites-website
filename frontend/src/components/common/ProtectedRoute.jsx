import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children, requireAdmin = false, fallback = null }) {
  const { user, loading, isAdmin } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      fallback ?? (
        <div className="min-h-screen flex items-center justify-center text-muted">
          Loading...
        </div>
      )
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-danger px-4 text-center">
        Access denied — admin only.
      </div>
    );
  }

  return children;
}