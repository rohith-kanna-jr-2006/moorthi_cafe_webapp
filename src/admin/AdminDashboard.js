import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../utils/api';
import { getTodayBusinessDate, getYesterdayBusinessDate, getBusinessDateRange } from '../utils/businessDate';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [todayBestSellers, setTodayBestSellers] = useState([]);
  const [todayDailyReport, setTodayDailyReport] = useState([]);
  const [sevenDayDailyReport, setSevenDayDailyReport] = useState([]);
  const [salesError, setSalesError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem('moorthi_token') : null;

    if (!token) {
      setError('Admin authentication required. Please log in.');
      setLoading(false);
      return;
    }

    const todayDate = getTodayBusinessDate();
    const sevenDayRange = getBusinessDateRange(7);

    let dashboardSettled = false;
    const settleLoading = () => {
      if (dashboardSettled && isMounted) {
        setLoading(false);
      }
    };

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
      })
      .finally(() => {
        if (!isMounted) return;
        dashboardSettled = true;
        settleLoading();
      });

    const fetchTodaySales = async () => {
      try {
        const result = await api.getSalesReport(todayDate, todayDate, token);
        if (!isMounted) return;
        if (result.success && result.data) {
          setTodayBestSellers(result.data.bestSellers || []);
          setTodayDailyReport(result.data.dailyReport || []);
        }
      } catch (err) {
        if (isMounted) setSalesError('Today sales report unavailable');
        console.warn('Today sales report fetch failed:', err);
      }
    };

    const fetchSevenDayReport = async () => {
      try {
        const result = await api.getSalesReport(sevenDayRange.from, sevenDayRange.to, token);
        if (!isMounted) return;
        if (result.success && result.data) {
          setSevenDayDailyReport(result.data.dailyReport || []);
        }
      } catch (err) {
        if (isMounted) setSalesError('Sales report unavailable');
        console.warn('Seven-day sales report fetch failed:', err);
      }
    };

    Promise.all([fetchTodaySales(), fetchSevenDayReport()])
      .finally(() => {});

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

  const closeMobile = () => {};

  const metrics = data?.metrics || {};
  const revenue = metrics.revenue || {};
  const orders = metrics.orders || {};
  const activeTokensQueue = metrics.activeTokensQueue || {};
  const recentOrders = data?.recentOrders || {};

  const todayBestSellersForDisplay = todayBestSellers || [];
  const latestDailyReport = sevenDayDailyReport.length > 0 ? sevenDayDailyReport : todayDailyReport;

  const calculateRevenueTrend = () => {
    const todayDate = getTodayBusinessDate();
    const yesterdayDate = getYesterdayBusinessDate();

    const todayEntry = latestDailyReport.find(d => d.date === todayDate);
    const yesterdayEntry = latestDailyReport.find(d => d.date === yesterdayDate);

    const todayRevenue = todayEntry ? Number(todayEntry.sales || 0) : 0;
    const yesterdayRevenue = yesterdayEntry ? Number(yesterdayEntry.sales || 0) : 0;

    if (todayRevenue === 0 && yesterdayRevenue === 0) {
      return { change: 0, direction: 'stable', available: false, reason: 'no_sales_both_days' };
    }
    if (todayRevenue === 0) {
      return { change: 0, direction: 'down', available: false, reason: 'no_sales_today' };
    }
    if (yesterdayRevenue === 0) {
      return { change: 0, direction: 'up', available: false, reason: 'no_sales_yesterday' };
    }

    const pctChange = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    if (pctChange > 0) return { change: pctChange, direction: 'up', available: true };
    if (pctChange < 0) return { change: Math.abs(pctChange), direction: 'down', available: true };
    return { change: 0, direction: 'stable', available: true };
  };

  const revenueTrend = calculateRevenueTrend();

  const totalOrders = orders.total || 0;
  const readyPct = totalOrders > 0 ? Math.round(((orders.READY || 0) / totalOrders) * 100) : 0;
  const prepPct = totalOrders > 0 ? Math.round(((orders.PREPARING || 0) / totalOrders) * 100) : 0;
  const pendPct = totalOrders > 0 ? Math.max(0, 100 - readyPct - prepPct) : 0;

  return (
    <AdminLayout pageTitle="Operations & Kitchen Dashboard" pageDescription="Live order orchestration, kitchen load metrics, and settlement audit for Chidambaram Heritage Counter.">
      <section className="stitch-kpi-grid">
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
            {revenueTrend?.available ? (
              <>
                <span className="material-symbols-outlined text-secondary text-[16px] font-bold" style={{ color: 'var(--stitch-secondary)' }}>trending_up</span>
                <span style={{ fontWeight: 700, color: 'var(--stitch-secondary)' }}>
                  {revenueTrend.direction === 'up' ? '▲' : revenueTrend.direction === 'down' ? '▼' : '●'}
                </span>
                <span>{Math.round(revenueTrend.change)}% vs prev day</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-secondary text-[16px] font-bold" style={{ color: 'var(--stitch-secondary)' }}>trending_up</span>
                {revenueTrend?.reason === 'no_sales_yesterday' && (
                  <span style={{ fontWeight: 700, color: 'var(--stitch-on-surface-variant)' }}>No comparison — no sales yesterday</span>
                )}
                {revenueTrend?.reason === 'no_sales_today' && (
                  <span style={{ fontWeight: 700, color: 'var(--stitch-on-surface-variant)' }}>No sales today</span>
                )}
                {revenueTrend?.reason === 'no_sales_both_days' && (
                  <span style={{ fontWeight: 700, color: 'var(--stitch-on-surface-variant)' }}>No sales data for comparison</span>
                )}
                {revenueTrend?.reason === 'no_data' && (
                  <span style={{ fontWeight: 700, color: 'var(--stitch-on-surface-variant)' }}>Insufficient comparison data</span>
                )}
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

        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar error"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Stock & Batters</span>
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

      <div className="stitch-content-grid">
        <div className="stitch-grid-col-8 stitch-card-panel">
          <div className="stitch-panel-header">
            <div className="stitch-panel-title-group">
              <div className="stitch-panel-icon-box">
                <span className="material-symbols-outlined text-[20px]">room_service</span>
              </div>
              <div>
                <h2 className="stitch-panel-title">Recent Kitchen & Counter Orders</h2>
                <p className="stitch-panel-subtitle">Live counter & online orders awaiting kitchen preparation or pickup</p>
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
                  <th>Diner & Details</th>
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

        <div className="stitch-grid-col-4">
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
    </AdminLayout>
  );
};

export default AdminDashboard;