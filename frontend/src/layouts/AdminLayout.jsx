import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';
import AdminLayoutSkeleton from '../components/admin/AdminLayoutSkeleton';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../api/client';

export default function AdminLayout() {
  const { user, loading, isAdmin, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  if (loading) {
    return <AdminLayoutSkeleton />;
  }

  if (!user) {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-danger px-4 text-center">
        Access denied — admin only.
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen w-full md:w-auto">
        <Topbar />
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}