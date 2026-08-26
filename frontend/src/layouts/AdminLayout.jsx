import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Topbar from '../components/admin/Topbar';

export default function AdminLayout() {
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