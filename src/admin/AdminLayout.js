import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ children, pageTitle, pageDescription }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items matching Dashboard
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/order-management', label: 'Orders', icon: 'receipt_long' },
    { path: '/admin/menu-management', label: 'Menu', icon: 'menu_book' },
    { path: '/admin/category-management', label: 'Categories', icon: 'category' },
    { path: '/admin/add-edit-food', label: 'Add/Edit Food', icon: 'edit_note' },
    { path: '/admin/customer-management', label: 'Customers', icon: 'group' },
    { path: '/admin/sales-reports', label: 'Sales Reports', icon: 'bar_chart' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('moorthi_token');
    localStorage.removeItem('moorthi_user');
    navigate('/admin/login');
  };

  // Set active section based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = navItems.find(item => currentPath.startsWith(item.path));
    setActiveSection(matchedItem ? matchedItem.path : '');
  }, [location.pathname]);

  const closeMobile = () => setMobileMenuOpen(false);

  const renderSidebar = () => (
    <>
      {mobileMenuOpen && (
        <div
          className="stitch-sidebar-backdrop"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}
      <aside className={`stitch-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div>
          {/* Brand */}
          <div className="stitch-sidebar-brand">
            <div className="stitch-brand-icon-box">
              <span className="material-symbols-outlined">restaurant</span>
            </div>
            <div>
              <div className="stitch-brand-title">Moorthi Cafe</div>
              <div className="stitch-brand-subtitle">Counter & Kitchen Console</div>
            </div>
          </div>

          <div className="stitch-sidebar-divider"></div>

          {/* Navigation */}
          <nav className="stitch-nav-menu" aria-label="Admin navigation">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`stitch-nav-item ${activeSection === item.path ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="stitch-sidebar-footer">
          <div className="stitch-terminal-status">
            <span>Terminal ID: CHD-CTR-01</span>
            <span className="stitch-pulse-dot"></span>
          </div>
          <div className="stitch-unit-badge">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span style={{ fontWeight: 600 }}>Chidambaram Heritage Unit</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <Link
              to="/"
              onClick={closeMobile}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.375rem',
                borderRadius: '0.375rem',
                fontSize: '0.6875rem',
                color: 'var(--stitch-secondary-fixed)',
                textDecoration: 'none',
                backgroundColor: 'rgba(159, 245, 193, 0.08)'
              }}
            >
              Customer Portal
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.375rem 0.5rem',
                borderRadius: '0.375rem',
                fontSize: '0.6875rem',
                color: '#ffffff',
                backgroundColor: 'rgba(186, 26, 26, 0.6)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );

  const renderHeader = () => (
    <header className="stitch-header">
      <div className="stitch-header-left">
        <button
          className="stitch-icon-btn stitch-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          title="Toggle Menu"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
        <div className="stitch-pill-badge high">
          <span className="material-symbols-outlined text-[18px]" style={{ color: 'var(--stitch-primary)' }}>location_on</span>
          <span>Chidambaram Central Counter</span>
        </div>
        <div className="stitch-pill-badge green">
          <span className="stitch-status-dot"></span>
          <span>Kitchen Online / Active</span>
        </div>
      </div>

      <div className="stitch-header-right">
        <div className="stitch-shift-badge">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          <span>Today | Shift A (06:00 - 15:00)</span>
        </div>

        <button className="stitch-icon-btn" title="Notifications">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="stitch-alert-indicator"></span>
        </button>

        <div className="stitch-user-profile">
          <div className="stitch-user-meta">
            <span className="stitch-user-name">S. Ramanathan</span>
            <span className="stitch-user-role">Counter Manager</span>
          </div>
          <div className="stitch-user-avatar">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );

  const renderPageHeader = () => (
    <div className="stitch-dashboard-banner">
      <div>
        <div className="stitch-banner-overline">
          <span>Heritage Hospitality Ops</span>
          <span>•</span>
          <span>Counter #01</span>
        </div>
        <h1 className="stitch-banner-title">{pageTitle || 'Admin Page'}</h1>
        <p className="stitch-banner-desc">{pageDescription || 'Admin management page'}</p>
      </div>

      <div className="stitch-banner-actions">
        <div className="stitch-badge-btn">
          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
          <span>Business Date: {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        </div>
        <Link to="/admin/order-management" className="stitch-badge-btn" style={{ textDecoration: 'none' }}>
          <span className="material-symbols-outlined text-[16px]">tune</span>
          <span>Counter Orders</span>
        </Link>
      </div>
    </div>
  );

  // Check for auth token
  const token = typeof window !== 'undefined' ? localStorage.getItem('moorthi_token') : null;

  if (!token) {
    return (
      <div className="stitch-dashboard-shell">
        {renderSidebar()}
        <div className="stitch-main-container">
          {renderHeader()}
          <main className="stitch-main-content">
            <div className="stitch-dashboard-banner">
              <div>
                <span className="stitch-banner-overline">
                  <span>Heritage Hospitality Ops</span>
                  <span>•</span>
                  <span>Counter #01</span>
                </span>
                <h1 className="stitch-banner-title">Operations & Kitchen Dashboard</h1>
              </div>
            </div>
            <div className="stitch-card-panel" style={{ borderLeft: '4px solid var(--stitch-error)', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--stitch-error)', fontSize: '2rem' }}>error</span>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--stitch-on-surface)', fontSize: '1.25rem' }}>Authentication Required</h3>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--stitch-on-surface-variant)' }}>Admin authentication required. Please log in.</p>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <Link to="/admin/login" className="stitch-action-btn primary">
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Sign In as Admin</span>
                </Link>
                <Link to="/" className="stitch-action-btn secondary">
                  <span>Back to Customer Portal</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="stitch-dashboard-shell">
      {renderSidebar()}

      <div className="stitch-main-container">
        {renderHeader()}

        <main className="stitch-main-content" id="main-content">
          {renderPageHeader()}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;