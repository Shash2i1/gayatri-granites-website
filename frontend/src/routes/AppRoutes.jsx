import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';
import CategoriesPage from '../components/admin/CategoriesPage';
import ProductsPage from '../pages/admin/ProductsPage';
import AdminProductDetailPage from '../pages/admin/ProductDetailPage';
import OrderDetailPage from '../pages/admin/OrderDetailPage';
import OrdersPage from '../pages/admin/OrdersPage';
import StoreLayout from '../layouts/StoreLayout';
import HomePage from '../pages/store/HomePage';
import ProductListPage from '../pages/store/ProductListPage';
import StoreProductDetailPage from '../pages/store/ProductDetailPage';
import CartPage from '../pages/store/CartPage';
import CheckoutPage from '../pages/store/CheckoutPage';
import StoreOrderDetailPage from '../pages/store/OrderDetailPage';
import MyOrdersPage from '../pages/store/MyOrdersPage';
import CustomersPage from '../pages/admin/CustomersPage';
import CustomerDetailPage from '../pages/admin/CustomerDetailPage';
import TermsPage from '../pages/store/TermsPage';
import ShippingPolicyPage from '../pages/store/ShippingPolicyPage';
import ChargeSettingsPage from '../pages/admin/ChargeSettingsPage';
import LoginPage from '../pages/common/LoginPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication routes*/}
        <Route path='/login' element={<LoginPage/>}>

        </Route>
        {/* Customer-facing storefront */}
        <Route path="/" element={<StoreLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/:id" element={<StoreProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<MyOrdersPage />} />
          <Route path="orders/:id" element={<StoreOrderDetailPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="shipping-policy" element={<ShippingPolicyPage />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<AdminProductDetailPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailPage />} />
          {/* <Route path="inventory" element={<InventoryPage />} /> */}
          <Route path="charge-settings" element={<ChargeSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}