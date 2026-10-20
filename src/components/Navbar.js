import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart } from '../utils/cartStorage';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    updateNavbarState();
    const handleCartUpdate = () => updateNavbarState();
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const updateNavbarState = () => {
    const items = getCart();
    const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(count);
    setIsLoggedIn(!!localStorage.getItem('moorthi_token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('moorthi_token');
    localStorage.removeItem('moorthi_user');
    window.dispatchEvent(new Event('storage'));
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="navbar-wrapper" style={{ borderBottom: '1px solid #dec0b5', background: 'var(--cafe-cream)' }}>
      <nav className="navbar page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0' }}>
        <Link to="/" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--cafe-terracotta)', fontSize: '28px' }}>
            restaurant
          </span>
          <span style={{ fontFamily: 'var(--cafe-font-primary)', fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--cafe-espresso)' }}>
            Hotel New Moorthi Cafe
          </span>
        </Link>

        <div className="menu" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link to="/" className="nav-link" style={{ textDecoration: 'none', color: 'var(--cafe-espresso)', fontWeight: '600' }}>
            Home
          </Link>
          <Link to="/about" className="nav-link" style={{ textDecoration: 'none', color: 'var(--cafe-espresso)', fontWeight: '600' }}>
            About
          </Link>
          <Link to="/menu" className="nav-link" style={{ textDecoration: 'none', color: 'var(--cafe-espresso)', fontWeight: '600' }}>
            Menu
          </Link>
          <Link to="/gallery" className="nav-link" style={{ textDecoration: 'none', color: 'var(--cafe-espresso)', fontWeight: '600' }}>
            Gallery
          </Link>
          <Link to="/contact" className="nav-link" style={{ textDecoration: 'none', color: 'var(--cafe-espresso)', fontWeight: '600' }}>
            Contact
          </Link>

          {/* Cart / Tray Link */}
          <Link
            to="/cart"
            className="nav-link cart-nav-link"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--cafe-terracotta)',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              shopping_bag
            </span>
            <span>Tray ({cartCount})</span>
          </Link>

          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/dashboard" className="nav-link" style={{ textDecoration: 'none', color: 'var(--cafe-terracotta)', fontWeight: '600' }}>
                Dashboard
              </Link>
              <Link to="/my-orders" className="nav-link" style={{ textDecoration: 'none', color: 'var(--cafe-leaf)', fontWeight: '600' }}>
                My Orders
              </Link>
              <Link to="/profile" className="nav-link" style={{ textDecoration: 'none', color: 'var(--cafe-espresso)', fontWeight: '600' }}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid #dec0b5',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: 'var(--cafe-text-muted)',
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="nav-actions" style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.9rem' }}>
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
