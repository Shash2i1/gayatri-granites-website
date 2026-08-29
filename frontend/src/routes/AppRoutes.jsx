import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import StoreLayout from '../layouts/StoreLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminLayoutSkeleton from '../components/admin/AdminLayoutSkeleton';

import DashboardPage from '../pages/admin/DashboardPage';
// import CategoriesPage from '../pages/admin/CategoriesPage';
import ProductsPage from '../pages/admin/ProductsPage';
import AdminProductDetailPage from '../pages/admin/ProductDetailPage';
import OrderDetailPage from '../pages/admin/OrderDetailPage';
import OrdersPage from '../pages/admin/OrdersPage';
import CustomersPage from '../pages/admin/CustomersPage';
import CustomerDetailPage from '../pages/admin/CustomerDetailPage';
import ChargeSettingsPage from '../pages/admin/ChargeSettingsPage';

import HomePage from '../pages/store/HomePage';
import ProductListPage from '../pages/store/ProductListPage';
import StoreProductDetailPage from '../pages/store/ProductDetailPage';
import CartPage from '../pages/store/CartPage';
import CheckoutPage from '../pages/store/CheckoutPage';
import StoreOrderDetailPage from '../pages/store/OrderDetailPage';
import MyOrdersPage from '../pages/store/MyOrdersPage';
import TermsPage from '../pages/store/TermsPage';
import ShippingPolicyPage from '../pages/store/ShippingPolicyPage';

import LoginPage from '../pages/common/LoginPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Customer-facing storefront - public by default */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<StoreProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="shipping-policy" element={<ShippingPolicyPage />} />

          {/* these three require login */}
          <Route
            path="checkout"
            element={
              // <ProtectedRoute>
                <CheckoutPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders/:id"
            element={
              <ProtectedRoute>
                <StoreOrderDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin panel - entire subtree requires admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin fallback={<AdminLayoutSkeleton />}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          {/* <Route path="categories" element={<CategoriesPage />} /> */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<AdminProductDetailPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          <Route path="charge-settings" element={<ChargeSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}