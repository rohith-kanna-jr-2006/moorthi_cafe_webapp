import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../utils/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('moorthi_token');
      if (!token) {
        setError('Admin authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const params = {};
      if (activeTab !== 'ALL') {
        params.status = activeTab;
      }
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await api.getAdminOrders(params, token);
      if (res.success && res.data) {
        setOrders(res.data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load counter orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setStatusMessage('');
      const token = localStorage.getItem('moorthi_token');
      const res = await api.updateOrderStatus(orderId, { status: newStatus }, token);
      if (res.success) {
        setStatusMessage(`Order updated to ${newStatus}`);
        setTimeout(() => setStatusMessage(''), 3000);
        fetchOrders();
      } else {
        alert(res.message || 'Failed to update order status');
      }
    } catch (err) {
      alert(err.message || 'Error updating order');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const orderId = (ord.orderId || '').toLowerCase();
    const tokenStr = String(ord.dailyTokenNumber || '');
    const custName = (ord.customer?.name || '').toLowerCase();
    const custPhone = (ord.customer?.phone || '').toLowerCase();
    return orderId.includes(q) || tokenStr.includes(q) || custName.includes(q) || custPhone.includes(q);
  });

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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setStatusMessage('');
      const token = localStorage.getItem('moorthi_token');
      const res = await api.updateOrderStatus(orderId, { status: newStatus }, token);
      if (res.success) {
        setStatusMessage(`Order updated to ${newStatus}`);
        setTimeout(() => setStatusMessage(''), 3000);
        fetchOrders();
      } else {
        alert(res.message || 'Failed to update order status');
      }
    } catch (err) {
      alert(err.message || 'Error updating order');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const orderId = (ord.orderId || '').toLowerCase();
    const tokenStr = String(ord.dailyTokenNumber || '');
    const custName = (ord.customer?.name || '').toLowerCase();
    const custPhone = (ord.customer?.phone || '').toLowerCase();
    return orderId.includes(q) || tokenStr.includes(q) || custName.includes(q) || custPhone.includes(q);
  });

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

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setStatusMessage('');
      const token = localStorage.getItem('moorthi_token');
      const res = await api.updateOrderStatus(orderId, { status: newStatus }, token);
      if (res.success) {
        setStatusMessage(`Order updated to ${newStatus}`);
        setTimeout(() => setStatusMessage(''), 3000);
        fetchOrders();
      } else {
        alert(res.message || 'Failed to update order status');
      }
    } catch (err) {
      alert(err.message || 'Error updating order');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const orderId = (ord.orderId || '').toLowerCase();
    const tokenStr = String(ord.dailyTokenNumber || '');
    const custName = (ord.customer?.name || '').toLowerCase();
    const custPhone = (ord.customer?.phone || '').toLowerCase();
    return orderId.includes(q) || tokenStr.includes(q) || custName.includes(q) || custPhone.includes(q);
  });

  return (
    <AdminLayout pageTitle="Live Kitchen & Counter Orders" pageDescription="Track, confirm, prepare, and complete customer orders in real-time.">
      {statusMessage && (
        <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--stitch-secondary)', backgroundColor: 'var(--stitch-secondary-fixed)', color: 'var(--stitch-on-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      <div className="stitch-actions-row" style={{ marginBottom: '1.5rem' }}>
        {['ALL', 'PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            className={`stitch-action-btn ${activeTab === tab ? 'primary' : 'secondary'}`}
            onClick={() => setActiveTab(tab)}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            {tab === 'ALL' ? 'All Orders' : tab}
          </button>
        ))}
      </div>

      <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <input
          type="text"
          className="input-field"
          placeholder="Search by Token #, Order ID (HNMC-...), customer name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ maxWidth: '480px', width: '100%' }}
        />
      </div>

      {loading ? (
        <div className="stitch-card-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ display: 'inline-block', width: '2.5rem', height: '2.5rem', border: '3px solid var(--stitch-surface-container-high)', borderTopColor: 'var(--stitch-primary)', borderRadius: '50%', animation: 'stitchSpin 1s infinite linear' }}></div>
          <p style={{ marginTop: '1rem', color: 'var(--stitch-on-surface-variant)', fontWeight: 600 }}>Loading live counter orders from database...</p>
        </div>
      ) : error ? (
        <div className="stitch-card-panel" style={{ borderLeft: '4px solid var(--stitch-error)', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--stitch-error)', fontSize: '2rem' }}>error</span>
            <div>
              <h3 style={{ margin: 0, color: 'var(--stitch-on-surface)', fontSize: '1.25rem' }}>Failed to Load Orders</h3>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--stitch-on-surface-variant)' }}>{error}</p>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button className="stitch-action-btn primary" onClick={fetchOrders}>
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="stitch-card-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--stitch-on-surface-variant)' }}>
              receipt_long
            </span>
            <h3 style={{ marginTop: '1rem', color: 'var(--stitch-on-surface)' }}>No orders found</h3>
            <p style={{ color: 'var(--stitch-on-surface-variant)' }}>There are no orders matching status '{activeTab}'.</p>
          </div>
        ) : (
          <div className="stitch-card-panel" style={{ overflow: 'hidden' }}>
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
                  {filteredOrders.map((order) => {
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
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </AdminLayout>
      );
    };

    export default OrderManagement;