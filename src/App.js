import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';

// Public / Customer Pages
import Home from './pages/Home.js';
import About from './pages/About.js';
import Menu from './pages/Menu.js';
import Gallery from './pages/Gallery.js';
import Contact from './pages/Contact.js';
import CustomerLogin from './pages/CustomerLogin.js';
import CustomerSignup from './pages/CustomerSignup.js';
import ForgotPassword from './pages/ForgotPassword.js';
import ItemDetails from './pages/ItemDetails.js';
import Cart from './pages/Cart.js';
import Checkout from './pages/Checkout.js';
import OrderSuccess from './pages/OrderSuccess.js';
import MyOrders from './pages/MyOrders.js';
import CustomerDashboard from './pages/CustomerDashboard.js';
import CustomerProfile from './pages/CustomerProfile.js';
import PaymentDetails from './pages/PaymentDetails.js';

// Admin Pages
import AdminLogin from './admin/AdminLogin.js';
import AdminDashboard from './admin/AdminDashboard.js';
import MenuManagement from './admin/MenuManagement.js';
import AddEditFood from './admin/AddEditFood.js';
import CategoryManagement from './admin/CategoryManagement.js';
import CustomerManagement from './admin/CustomerManagement.js';
import SalesReports from './admin/SalesReports.js';
import OrderManagement from './admin/OrderManagement.js';

function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Routes>
          {/* Public & Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/item-details" element={<ItemDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/signup" element={<CustomerSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/payment-details" element={<PaymentDetails />} />

          {/* Admin Console Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/order-management" element={<OrderManagement />} />
          <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/menu-management" element={<MenuManagement />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/add-edit-food" element={<AddEditFood />} />
          <Route path="/admin/edit-food/:id" element={<AddEditFood />} />
          <Route path="/admin/category-management" element={<CategoryManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/customer-management" element={<CustomerManagement />} />
          <Route path="/admin/customers" element={<CustomerManagement />} />
          <Route path="/admin/sales-reports" element={<SalesReports />} />
          <Route path="/admin/reports" element={<SalesReports />} />

          {/* Stitch Manifest Slug Aliases */}
          <Route path="/home" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/food-menu" element={<Menu />} />
          <Route path="/menu-preview" element={<Menu />} />
          <Route path="/shopping-cart" element={<Cart />} />
          <Route path="/cart-checkout" element={<Checkout />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/customer-signup" element={<CustomerSignup />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard />} />
          <Route path="/customer-profile" element={<CustomerProfile />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/order-management" element={<OrderManagement />} />
          <Route path="/menu-management" element={<MenuManagement />} />
          <Route path="/add-edit-food" element={<AddEditFood />} />
          <Route path="/category-management" element={<CategoryManagement />} />
          <Route path="/customer-management" element={<CustomerManagement />} />
          <Route path="/sales-reports" element={<SalesReports />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
