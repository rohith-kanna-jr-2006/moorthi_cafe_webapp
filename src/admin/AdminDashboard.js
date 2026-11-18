import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { getTodayBusinessDate, getBusinessDateRange } from '../utils/businessDate';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [todayBestSellers, setTodayBestSellers] = useState([]);
  const [todayDailyReport, setTodayDailyReport] = useState([]);
  const [sevenDayDailyReport, setSevenDayDailyReport] = useState([]);
  const [salesError, setSalesError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem('moorthi_token') : null;

    if (!token) {
      setError('Admin authentication required. Please log in.');
      setLoading(false);
      return;
    }

    // Get Asia/Kolkata business dates
    const todayDate = getTodayBusinessDate();
    const sevenDayRange = getBusinessDateRange(7);

    // Fetch dashboard first - this is critical
    api.getAdminDashboard(token)
      .then((dashboardResult) => {
        if (!isMounted) return;
        if (dashboardResult.success && dashboardResult.data) {
          setData(dashboardResult.data);
        } else {
          setError(dashboardResult.message || 'Failed to load operational dashboard data');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Dashboard API error:', err);
        setError(err.message || 'Failed to connect to dashboard API');
        setLoading(false);
      });

    // Fetch sales reports independently - dashboard doesn't depend on these
    // Request 1: Today's sales report for Top Selling items
    const fetchTodaySales = async () => {
      try {
        const result = await api.getSalesReport(todayDate, todayDate, token);
        if (!isMounted) return;
        if (result.success && result.data) {
          // Store today's top sellers separately
          setTodayBestSellers(result.data.bestSellers || []);
          setTodayDailyReport(result.data.dailyReport || []);
        }
      } catch (err) {
        console.warn('Today sales report fetch failed:', err);
      }
    };

    // Request 2: Seven-day sales report for Revenue Trend
    const fetchSevenDayReport = async () => {
      try {
        const result = await api.getSalesReport(sevenDayRange.from, sevenDayRange.to, token);
        if (!isMounted) return;
        if (result.success && result.data) {
          setSevenDayDailyReport(result.data.dailyReport || []);
        }
      } catch (err) {
        console.warn('Seven-day sales report fetch failed:', err);
      }
    };

    // Run both sales requests in parallel
    Promise.all([fetchTodaySales(), fetchSevenDayReport()])
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return '₹' + num.toLocaleString('en-IN');
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'N/A';
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'READY') {
      return (
        <span className="stitch-status-badge ready">
          <span className="stitch-status-dot"></span> Ready for Pickup
        </span>
      );
    }
    if (s === 'PREPARING') {
      return (
        <span className="stitch-status-badge preparing">
          <span className="stitch-status-dot animate-pulse"></span> Preparing
        </span>
      );
    }
    if (s === 'COMPLETED') {
      return (
        <span className="stitch-status-badge completed">
          <span className="material-symbols-outlined text-[14px]">check_circle</span> Completed
        </span>
      );
    }
    if (s === 'CANCELLED') {
      return (
        <span className="stitch-status-badge" style={{ backgroundColor: '#f2ede7', color: '#57423a' }}>
          <span className="material-symbols-outlined text-[14px]">cancel</span> Cancelled
        </span>
      );
    }
    return (
      <span className="stitch-status-badge pending">
        <span className="stitch-status-dot" style={{ backgroundColor: 'var(--stitch-error)' }}></span> Pending
      </span>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('moorthi_token');
    localStorage.removeItem('moorthi_user');
    navigate('/admin/login');
  };

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
              <div className="stitch-brand-subtitle">Counter &amp; Kitchen Console</div>
            </div>
          </div>

          <div className="stitch-sidebar-divider"></div>

          {/* Navigation */}
          <nav className="stitch-nav-menu">
            <Link to="/admin/dashboard" className="stitch-nav-item active" onClick={closeMobile}>
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/order-management" className="stitch-nav-item" onClick={closeMobile}>
              <span className="material-symbols-outlined">receipt_long</span>
              <span>Orders</span>
            </Link>
            <Link to="/admin/menu-management" className="stitch-nav-item" onClick={closeMobile}>
              <span className="material-symbols-outlined">menu_book</span>
              <span>Menu</span>
            </Link>
            <Link to="/admin/category-management" className="stitch-nav-item" onClick={closeMobile}>
              <span className="material-symbols-outlined">category</span>
              <span>Categories</span>
            </Link>
            <Link to="/admin/add-edit-food" className="stitch-nav-item" onClick={closeMobile}>
              <span className="material-symbols-outlined">edit_note</span>
              <span>Add/Edit Food</span>
            </Link>
            <Link to="/admin/customer-management" className="stitch-nav-item" onClick={closeMobile}>
              <span className="material-symbols-outlined">group</span>
              <span>Customers</span>
            </Link>
            <Link to="/admin/sales-reports" className="stitch-nav-item" onClick={closeMobile}>
              <span className="material-symbols-outlined">bar_chart</span>
              <span>Sales Reports</span>
            </Link>
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

  if (loading) {
    return (
      <div className="stitch-dashboard-shell">
        {renderSidebar()}
        <div className="stitch-main-container">
          {renderHeader()}
          <main className="stitch-main-content">
            <div className="stitch-dashboard-banner">
              <div>
                <span className="stitch-banner-overline">Heritage Hospitality Ops • Counter #01</span>
                <h1 className="stitch-banner-title">Operations &amp; Kitchen Dashboard</h1>
                <p className="stitch-banner-desc">Loading real-time kitchen orchestration and counter queue...</p>
              </div>
            </div>
            <div className="stitch-card-panel" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ display: 'inline-block', width: '2.5rem', height: '2.5rem', border: '3px solid var(--stitch-surface-container-high)', borderTopColor: 'var(--stitch-primary)', borderRadius: '50%', animation: 'stitchSpin 1s infinite linear' }}></div>
              <p style={{ marginTop: '1rem', color: 'var(--stitch-on-surface-variant)', fontWeight: 600 }}>Connecting to Moorthi Cafe API...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stitch-dashboard-shell">
        {renderSidebar()}
        <div className="stitch-main-container">
          {renderHeader()}
          <main className="stitch-main-content">
            <div className="stitch-dashboard-banner">
              <div>
                <span className="stitch-banner-overline">Heritage Hospitality Ops • Counter #01</span>
                <h1 className="stitch-banner-title">Operations &amp; Kitchen Dashboard</h1>
              </div>
            </div>
            <div className="stitch-card-panel" style={{ borderLeft: '4px solid var(--stitch-error)', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--stitch-error)', fontSize: '2rem' }}>error</span>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--stitch-on-surface)', fontSize: '1.25rem' }}>Authentication Required or API Error</h3>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--stitch-on-surface-variant)' }}>{error}</p>
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

  const metrics = data?.metrics || {};
  const revenue = metrics.revenue || {};
  const orders = metrics.orders || {};
  const activeTokensQueue = metrics.activeTokensQueue || {};
  const recentOrders = data?.recentOrders || {};

  // Sales report data - separated for today vs seven-day reports
  const todayBestSellersForDisplay = todayBestSellers || [];
  const latestDailyReport = sevenDayDailyReport.length > 0 ? sevenDayDailyReport : todayDailyReport;

  // Calculate revenue trend with proper date handling
  // dailyReport is sorted by date ASCENDING in backend (sort by _id: 1)
  // So the last element is the most recent day (today), second-to-last is yesterday
  const calculateRevenueTrend = () => {
    if (latestDailyReport.length < 2) return null;
    const todayRevenue = Number(latestDailyReport[latestDailyReport.length - 1]?.sales || 0);
    const yesterdayRevenue = Number(latestDailyReport[latestDailyReport.length - 2]?.sales || 0);

    if (yesterdayRevenue === 0 && todayRevenue === 0) return { change: 0, direction: 'stable' };
    if (yesterdayRevenue === 0) return { change: Infinity, direction: 'up', limited: true };
    if (todayRevenue === 0) return { change: -Infinity, direction: 'down', limited: true };

    const pctChange = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    if (pctChange > 0) return { change: pctChange, direction: 'up' };
    if (pctChange < 0) return { change: Math.abs(pctChange), direction: 'down' };
    return { change: 0, direction: 'stable' };
  };

  const revenueTrend = calculateRevenueTrend();

  // Orders breakdown ratios for progress bar
  const totalOrders = orders.total || 0;
  const readyPct = totalOrders > 0 ? Math.round(((orders.READY || 0) / totalOrders) * 100) : 0;
  const prepPct = totalOrders > 0 ? Math.round(((orders.PREPARING || 0) / totalOrders) * 100) : 0;
  const pendPct = totalOrders > 0 ? Math.max(0, 100 - readyPct - prepPct) : 0;

  return (
    <div className="stitch-dashboard-shell">
      {renderSidebar()}

      <div className="stitch-main-container">
        {renderHeader()}

        <main className="stitch-main-content">
          {/* Banner */}
          <div className="stitch-dashboard-banner">
            <div>
              <div className="stitch-banner-overline">
                <span>Heritage Hospitality Ops</span>
                <span>•</span>
                <span>Counter #01</span>
              </div>
              <h1 className="stitch-banner-title">Operations &amp; Kitchen Dashboard</h1>
              <p className="stitch-banner-desc">Live order orchestration, kitchen load metrics, and settlement audit for Chidambaram Heritage Counter.</p>
            </div>

            <div className="stitch-banner-actions">
              <div className="stitch-badge-btn">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <span>{metrics.businessDate ? `Business Date: ${metrics.businessDate}` : 'Today (Shift A)'}</span>
              </div>
              <Link to="/admin/order-management" className="stitch-badge-btn" style={{ textDecoration: 'none' }}>
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Counter Orders</span>
              </Link>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <section className="stitch-kpi-grid">
            {/* Card 1: Revenue */}
            <div className="stitch-kpi-card">
              <div className="stitch-kpi-bar primary"></div>
              <div className="stitch-kpi-header">
                <div>
                  <span className="stitch-kpi-label">Today's Revenue</span>
                  <span className="stitch-kpi-value">{formatCurrency(revenue.total)}</span>
                </div>
                <div className="stitch-kpi-icon-box primary">
                  <span className="material-symbols-outlined text-[22px]">currency_rupee</span>
                </div>
              </div>
              <div className="stitch-kpi-meta">
                {latestDailyReport.length >= 2 ? (
                  <>
                    <span className="material-symbols-outlined text-secondary text-[16px] font-bold" style={{ color: 'var(--stitch-secondary)' }}>trending_up</span>
                    <span style={{ fontWeight: 700, color: 'var(--stitch-secondary)' }}>
                      {revenueTrend?.direction === 'up' ? '▲' : revenueTrend?.direction === 'down' ? '▼' : '●'}
                    </span>
                    {revenueTrend?.change !== undefined && revenueTrend?.change !== Infinity && revenueTrend?.change !== -Infinity && (
                      <span>{Math.round(revenueTrend.change)}% vs prev day</span>
                    )}
                    {revenueTrend?.limited && <span>Insufficient comparison data</span>}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-secondary text-[16px] font-bold" style={{ color: 'var(--stitch-secondary)' }}>trending_up</span>
                    <span style={{ fontWeight: 700, color: 'var(--stitch-secondary)' }}>Live Audit</span>
                    <span>• Total settled today</span>
                  </>
                )}
              </div>
              <div className="stitch-kpi-footer-bar">
                <span>UPI: <strong style={{ color: 'var(--stitch-on-surface)' }}>{formatCurrency(revenue.upi)}</strong></span>
                <span style={{ height: '12px', width: '1px', backgroundColor: 'var(--stitch-surface-container-high)' }}></span>
                <span>Cash: <strong style={{ color: 'var(--stitch-on-surface)' }}>{formatCurrency(revenue.cash)}</strong></span>
                {revenue.card > 0 && (
                  <>
                    <span style={{ height: '12px', width: '1px', backgroundColor: 'var(--stitch-surface-container-high)' }}></span>
                    <span>Card: <strong style={{ color: 'var(--stitch-on-surface)' }}>{formatCurrency(revenue.card)}</strong></span>
                  </>
                )}
              </div>
            </div>

            {/* Card 2: Today's Orders */}
            <div className="stitch-kpi-card">
              <div className="stitch-kpi-bar secondary"></div>
              <div className="stitch-kpi-header">
                <div>
                  <span className="stitch-kpi-label">Today's Orders</span>
                  <span className="stitch-kpi-value">{totalOrders} Orders</span>
                </div>
                <div className="stitch-kpi-icon-box secondary">
                  <span className="material-symbols-outlined text-[22px]">receipt</span>
                </div>
              </div>
              <div className="stitch-kpi-progress-track">
                <div style={{ width: `${readyPct}%`, backgroundColor: 'var(--stitch-secondary)', height: '100%' }}></div>
                <div style={{ width: `${prepPct}%`, backgroundColor: 'var(--stitch-tertiary-fixed-dim)', height: '100%' }}></div>
                <div style={{ width: `${pendPct}%`, backgroundColor: 'var(--stitch-primary)', height: '100%' }}></div>
              </div>
              <div className="stitch-kpi-footer-bar">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--stitch-secondary)' }}></span>
                  {orders.READY || 0} Ready
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--stitch-tertiary-fixed-dim)' }}></span>
                  {orders.PREPARING || 0} Prep
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--stitch-primary)' }}></span>
                  {(orders.PLACED || 0) + (orders.CONFIRMED || 0)} Pend
                </span>
              </div>
            </div>

            {/* Card 3: Active Tokens */}
            <div className="stitch-kpi-card">
              <div className="stitch-kpi-bar tertiary"></div>
              <div className="stitch-kpi-header">
                <div>
                  <span className="stitch-kpi-label">Active Tokens Queue</span>
                  <span className="stitch-kpi-value">
                    {activeTokensQueue.count > 0
                      ? `Token #${activeTokensQueue.lowestToken} - #${activeTokensQueue.highestToken}`
                      : 'No Active Tokens'}
                  </span>
                </div>
                <div className="stitch-kpi-icon-box tertiary">
                  <span className="material-symbols-outlined text-[22px]">confirmation_number</span>
                </div>
              </div>
              <div className="stitch-kpi-meta">
                <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--stitch-tertiary)' }}>schedule</span>
                <span>Active queue count: <strong>{activeTokensQueue.count || 0} orders</strong></span>
              </div>
              <div className="stitch-kpi-footer-bar">
                <span style={{ color: 'var(--stitch-on-surface-variant)' }}>Station telemetry unavailable</span>
                <span style={{ color: 'var(--stitch-on-surface-variant)' }}>No live station sync</span>
              </div>
            </div>

            {/* Card 4: Inventory & Alerts */}
            <div className="stitch-kpi-card">
              <div className="stitch-kpi-bar error"></div>
              <div className="stitch-kpi-header">
                <div>
                  <span className="stitch-kpi-label">Stock &amp; Batters</span>
                  <span className="stitch-kpi-value" style={{ fontSize: '1.25rem', color: 'var(--stitch-on-surface-variant)' }}>No Telemetry</span>
                </div>
                <div className="stitch-kpi-icon-box" style={{ backgroundColor: 'var(--stitch-surface-container-high)', color: 'var(--stitch-on-surface-variant)' }}>
                  <span className="material-symbols-outlined text-[22px]">sensors_off</span>
                </div>
              </div>
              <div className="stitch-kpi-meta">
                <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--stitch-on-surface-variant)' }}>info</span>
                <span>Live inventory monitoring requires backend IoT integration</span>
              </div>
              <div className="stitch-kpi-footer-bar">
                <span style={{ color: 'var(--stitch-on-surface-variant)' }}>Stock levels unavailable</span>
                <span style={{ color: 'var(--stitch-on-surface-variant)' }}>Batter status unavailable</span>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="stitch-actions-row">
            <Link to="/admin/add-edit-food" className="stitch-action-btn primary">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Add New Food Item</span>
            </Link>
            <Link to="/admin/order-management" className="stitch-action-btn secondary">
              <span className="material-symbols-outlined text-[20px]">kitchen</span>
              <span>View Live Counter Queue</span>
            </Link>
            <Link to="/admin/sales-reports" className="stitch-action-btn secondary">
              <span className="material-symbols-outlined text-[20px]">file_download</span>
              <span>Download Day-End Report</span>
            </Link>
          </section>

          {/* Main Content 12-Column Grid */}
          <div className="stitch-content-grid">
            {/* Left Column (8 cols): Recent Orders Table */}
            <div className="stitch-grid-col-8 stitch-card-panel">
              <div className="stitch-panel-header">
                <div className="stitch-panel-title-group">
                  <div className="stitch-panel-icon-box">
                    <span className="material-symbols-outlined text-[20px]">room_service</span>
                  </div>
                  <div>
                    <h2 className="stitch-panel-title">Recent Kitchen &amp; Counter Orders</h2>
                    <p className="stitch-panel-subtitle">Live counter &amp; online orders awaiting kitchen preparation or pickup</p>
                  </div>
                </div>
                <Link
                  to="/admin/order-management"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'var(--stitch-primary)',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <span>View All Orders</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              <div className="stitch-table-wrapper">
                <table className="stitch-orders-table">
                  <thead>
                    <tr>
                      <th>Token / ID</th>
                      <th>Diner &amp; Details</th>
                      <th>Items Ordered</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => {
                        const tokenNum = order.dailyTokenNumber || (order.orderId ? order.orderId.slice(-4) : 'N/A');
                        const orderCode = order.orderId ? `#MC-${order.orderId.slice(-4)}` : `#${(order._id || '').slice(-6)}`;
                        const dinerName = order.customer?.name || 'Counter Walk-in';
                        const isDineIn = order.pickupType === 'DINE_IN';
                        const itemsSummary = order.items && order.items.length > 0
                          ? order.items.map((it) => `${it.quantity || 1}x ${it.name}`).join(', ')
                          : 'Counter Selection';

                        return (
                          <tr key={order._id || order.id}>
                            <td>
                              <span className="stitch-token-primary">#{tokenNum}</span>
                              <span className="stitch-token-sub">{orderCode}</span>
                            </td>
                            <td>
                              <span style={{ fontWeight: 600, color: 'var(--stitch-on-surface)', display: 'block' }}>
                                {dinerName}
                              </span>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.6875rem', color: 'var(--stitch-secondary)', fontWeight: 500 }}>
                                <span className="material-symbols-outlined text-[14px]">
                                  {isDineIn ? 'table_restaurant' : 'takeout_dining'}
                                </span>
                                {isDineIn ? 'Dine-in Order' : 'Parcel / Takeaway'}
                              </span>
                            </td>
                            <td>
                              <div style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={itemsSummary}>
                                {itemsSummary}
                              </div>
                            </td>
                            <td>
                              <strong style={{ color: 'var(--stitch-on-surface)', fontSize: '0.9375rem' }}>
                                {formatCurrency(order.totalAmount)}
                              </strong>
                            </td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>
                              <span style={{ color: 'var(--stitch-on-surface-variant)', fontSize: '0.75rem' }}>
                                {formatTime(order.createdAt)}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <Link
                                to="/admin/order-management"
                                className="stitch-icon-btn"
                                style={{ display: 'inline-flex', width: '2rem', height: '2rem' }}
                                title="Manage Order Status"
                              >
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--stitch-on-surface-variant)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>receipt_long</span>
                          No active kitchen orders currently placed. New orders will appear here in real time.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column (4 cols): Side Panels */}
            <div className="stitch-grid-col-4">
              {/* Panel 1: Top Selling Items */}
              <div className="stitch-card-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--stitch-primary)' }}>local_fire_department</span>
                    <h3 style={{ margin: 0, fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.125rem', fontWeight: 700 }}>
                      Top Selling Today
                    </h3>
                  </div>
                  <Link to="/admin/sales-reports" style={{ textDecoration: 'none' }}>
                    <span style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: 'var(--stitch-primary-fixed)', color: 'var(--stitch-primary)', fontWeight: 700 }}>
                      View Report
                    </span>
                  </Link>
                </div>

                <div>
                  {todayBestSellersForDisplay.length > 0 ? (
                    todayBestSellersForDisplay.slice(0, 4).map((item, idx) => (
                      <div key={item.name} className="stitch-top-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="stitch-item-thumb" style={{ backgroundColor: 'var(--stitch-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--stitch-on-surface-variant)' }}>restaurant</span>
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.875rem', color: 'var(--stitch-on-surface)', display: 'block' }}>{item.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--stitch-on-surface-variant)' }}>{item.quantitySold} sold</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ color: 'var(--stitch-primary)', display: 'block' }}>{formatCurrency(item.revenueGenerated)}</strong>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--stitch-on-surface-variant)' }}>
                            {idx === 0 ? 'Top Seller' : idx === 1 ? 'Strong' : idx === 2 ? 'Steady' : 'Popular'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--stitch-on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>bar_chart</span>
                      {salesError ? 'Sales data unavailable' : 'No sales data available for today.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Panel 2: Kitchen Station Load */}
              <div className="stitch-card-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--stitch-secondary)' }}>precision_manufacturing</span>
                    <h3 style={{ margin: 0, fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.125rem', fontWeight: 700 }}>
                      Kitchen Station Load
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: 'var(--stitch-surface-container-high)', color: 'var(--stitch-on-surface-variant)', fontWeight: 500 }}>
                    No Telemetry
                  </span>
                </div>

                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--stitch-on-surface-variant)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem', opacity: 0.4 }}>sensors_off</span>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Station telemetry unavailable</p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem' }}>
                    Kitchen equipment load monitoring requires backend IoT integration.
                  </p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem' }}>
                    Current active orders: <strong>{activeTokensQueue.count || 0}</strong> in queue
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;