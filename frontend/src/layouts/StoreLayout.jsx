import { Outlet } from 'react-router-dom';
import Header from '../components/store/Header';
import Footer from '../components/store/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

export default function StoreLayout() {
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