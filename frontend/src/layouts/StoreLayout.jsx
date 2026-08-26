import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/store/Header';
import Footer from '../components/store/Footer';
import { useAuthStore } from '../store/authStore';
import ScrollToTop from '../components/common/ScrollToTop';

export default function StoreLayout() {
  const { fetchCurrentUser, user } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);


  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}