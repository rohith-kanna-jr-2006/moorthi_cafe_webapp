import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

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

  return (
    <div className="admin-page-layout">
      {/* Admin Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo-mark">
            <span className="material-symbols-outlined">restaurant</span>
          </div>
          <div>
            <div className="admin-brand-title">Moorthi Cafe</div>
            <div className="admin-brand-subtitle">Counter & Kitchen Console</div>
          </div>
        </div>

        <nav className="admin-nav-menu">
          <Link to="/admin/dashboard" className="admin-nav-item">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/order-management" className="admin-nav-item active">
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Orders</span>
          </Link>
          <Link to="/admin/menu-management" className="admin-nav-item">
            <span className="material-symbols-outlined">menu_book</span>
            <span>Menu</span>
          </Link>
          <Link to="/admin/category-management" className="admin-nav-item">
            <span className="material-symbols-outlined">category</span>
            <span>Categories</span>
          </Link>
          <Link to="/admin/add-edit-food" className="admin-nav-item">
            <span className="material-symbols-outlined">edit_note</span>
            <span>Add/Edit Food</span>
          </Link>
          <Link to="/admin/customer-management" className="admin-nav-item">
            <span className="material-symbols-outlined">group</span>
            <span>Customers</span>
          </Link>
          <Link to="/admin/sales-reports" className="admin-nav-item">
            <span className="material-symbols-outlined">bar_chart</span>
            <span>Sales Reports</span>
          </Link>
        </nav>
      </aside>

      {/* Main Admin Console Area */}
      <div className="admin-main-content">
        <header className="admin-header">
          <div>
            <h1 className="admin-page-title">Live Kitchen & Counter Orders</h1>
            <p className="admin-page-desc">Track, confirm, prepare, and complete customer orders in real-time.</p>
          </div>
          <button className="btn btn-secondary" onClick={fetchOrders} disabled={loading}>
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
              sync
            </span>
            Refresh Orders
          </button>
        </header>

        {statusMessage && (
          <div className="alert alert-success" style={{ margin: '1rem 0' }}>
            {statusMessage}
          </div>
        )}

        {/* Tab Filters */}
        <div className="admin-order-tabs">
          {['ALL', 'PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              className={`order-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'ALL' ? 'All Orders' : tab}
            </button>
          ))}
        </div>

        {/* Search & Stats Bar */}
        <div className="admin-search-bar" style={{ margin: '1.5rem 0' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search by Token #, Order ID (HNMC-...), customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ maxWidth: '480px' }}
          />
        </div>

        {loading ? (
          <div className="loading-state" style={{ padding: '3rem', textAlign: 'center' }}>
            <p>Loading live counter orders from database...</p>
          </div>
        ) : error ? (
          <div className="error-banner" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--cafe-terracotta)' }}>{error}</p>
            <button className="btn btn-primary" onClick={fetchOrders}>
              Retry Connection
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--cafe-text-muted)' }}>
              receipt
            </span>
            <h3>No orders found</h3>
            <p>There are no orders matching status '{activeTab}'.</p>
          </div>
        ) : (
          <div className="admin-orders-grid">
            {filteredOrders.map((order) => (
              <div key={order._id} className="admin-order-card">
                <div className="admin-order-card-header">
                  <div>
                    <span className="token-badge">Token #{order.dailyTokenNumber || '—'}</span>
                    <h3 className="order-id-label">{order.orderId || order._id}</h3>
                    <div className="order-time-text">
                      Placed: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span className={`status-pill status-${(order.status || 'placed').toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="admin-order-customer-info">
                  <strong>Customer:</strong> {order.customer?.name || 'Guest Diner'} (
                  {order.customer?.phone || 'No phone'})
                </div>

                <div className="admin-order-items-list">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="order-line-item">
                      <span className="line-item-qty">{item.quantity}x</span>
                      <span className="line-item-name">
                        {item.name} {item.variantName ? `(${item.variantName})` : ''}
                      </span>
                      <span className="line-item-total">₹{(item.lineTotal || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="admin-order-totals">
                  <div className="totals-row">
                    <span>Subtotal:</span>
                    <span>₹{(order.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="totals-row">
                    <span>GST (5%):</span>
                    <span>₹{(order.gst || 0).toFixed(2)}</span>
                  </div>
                  <div className="totals-row">
                    <span>Packaging Charge:</span>
                    <span>₹{(order.packagingCharge || 0).toFixed(2)}</span>
                  </div>
                  <div className="totals-row grand-total">
                    <strong>Total Amount:</strong>
                    <strong>₹{(order.totalAmount || 0).toFixed(2)}</strong>
                  </div>
                </div>

                <div className="admin-order-payment-info">
                  <span>
                    Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                  </span>
                  <span>Pickup: {order.pickupType}</span>
                </div>

                {order.notes && (
                  <div className="order-special-notes">
                    <strong>Kitchen Notes:</strong> {order.notes}
                  </div>
                )}

                <div className="admin-order-actions">
                  {order.status === 'PLACED' && (
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={updatingId === order._id}
                      onClick={() => handleStatusUpdate(order._id, 'CONFIRMED')}
                    >
                      Confirm Order
                    </button>
                  )}
                  {order.status === 'CONFIRMED' && (
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={updatingId === order._id}
                      onClick={() => handleStatusUpdate(order._id, 'PREPARING')}
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'PREPARING' && (
                    <button
                      className="btn btn-sm btn-success"
                      style={{ backgroundColor: 'var(--cafe-leaf)', color: '#fff' }}
                      disabled={updatingId === order._id}
                      onClick={() => handleStatusUpdate(order._id, 'READY')}
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'READY' && (
                    <button
                      className="btn btn-sm btn-primary"
                      disabled={updatingId === order._id}
                      onClick={() => handleStatusUpdate(order._id, 'COMPLETED')}
                    >
                      Complete Pickup
                    </button>
                  )}
                  {!['COMPLETED', 'CANCELLED'].includes(order.status) && (
                    <button
                      className="btn btn-sm btn-secondary"
                      style={{ color: '#c53030', borderColor: '#c53030' }}
                      disabled={updatingId === order._id}
                      onClick={() => handleStatusUpdate(order._id, 'CANCELLED')}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
