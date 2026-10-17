import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';
import Home from './pages/Home.js';
import About from './pages/About.js';
import Menu from './pages/Menu.js';
import Gallery from './pages/Gallery.js';
import Contact from './pages/Contact.js';
import AdminLogin from './admin/AdminLogin.js';
import AdminDashboard from './admin/AdminDashboard.js';
import MenuManagement from './admin/MenuManagement.js';
import AddEditFood from './admin/AddEditFood.js';
import CategoryManagement from './admin/CategoryManagement.js';
import CustomerManagement from './admin/CustomerManagement.js';
import SalesReports from './admin/SalesReports.js';
import CustomerLogin from './pages/CustomerLogin.js';
import CustomerSignup from './pages/CustomerSignup.js';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/signup" element={<CustomerSignup />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/menu-management" element={<MenuManagement />} />
          <Route path="/admin/add-edit-food" element={<AddEditFood />} />
          <Route path="/admin/category-management" element={<CategoryManagement />} />
          <Route path="/admin/customer-management" element={<CustomerManagement />} />
          <Route path="/admin/sales-reports" element={<SalesReports />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
