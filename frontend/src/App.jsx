import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import ConfirmModal from './components/common/ConfirmModal';
import ToastContainer from './components/common/ToastContainer';
import { useAuthStore } from './store/authStore';

export default function App() {
  const fetchCurrentUser = useAuthStore((s) => s.fetchCurrentUser);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <>
      <AppRoutes />
      <ConfirmModal />
      <ToastContainer />
    </>
  );
}