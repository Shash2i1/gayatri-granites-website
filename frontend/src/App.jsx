import AppRoutes from './routes/AppRoutes';
import ConfirmModal from './components/common/ConfirmModal';
import ToastContainer from './components/common/ToastContainer';

export default function App() {
  return (
    <>
      <AppRoutes />
      <ConfirmModal />
      <ToastContainer />
    </>
  );
}