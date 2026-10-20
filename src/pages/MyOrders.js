import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('moorthi_token');
      if (!token) {
        setError('Please log in to view your order history.');
        setLoading(false);
        return;
      }

      const res = await api.getMyOrders(token);
      if (res.success && res.data) {
        setOrders(res.data.orders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancellingId(orderId);
      const token = localStorage.getItem('moorthi_token');
      const res = await api.cancelOrder(orderId, 'Customer self-cancellation', token);
      if (res.success) {
        alert('Order has been cancelled successfully.');
        fetchOrders();
      } else {
        alert(res.message || 'Unable to cancel order.');
      }
    } catch (err) {
      alert(err.message || 'Error cancelling order');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="my-orders-page page-container" style={{ padding: '2.5rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--cafe-font-primary)', color: 'var(--cafe-terracotta)', fontSize: '2.25rem' }}>
          My Takeaway Orders
        </h1>
        <p style={{ color: 'var(--cafe-text-muted)' }}>
          View live counter preparation progress, pickup tokens, and historical receipts.
        </p>
      </header>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading your orders...</p>
        </div>
      ) : error ? (
        <div
          style={{
            background: 'var(--cafe-ivory)',
            border: '1px solid #e8dfd3',
            borderRadius: 'var(--surface-radius-card)',
            padding: '3rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--cafe-terracotta)', fontSize: '1.1rem' }}>{error}</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Go to Login
          </Link>
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            background: 'var(--cafe-ivory)',
            border: '1px solid #e8dfd3',
            borderRadius: 'var(--surface-radius-card)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '56px', color: 'var(--cafe-text-muted)' }}>
            receipt_long
          </span>
          <h2 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '1rem 0' }}>No Orders Found</h2>
          <p style={{ color: 'var(--cafe-text-muted)', marginBottom: '1.5rem' }}>
            You haven't placed any takeaway orders yet. Explore our delicious authentic menu!
          </p>
          <Link to="/menu" className="btn btn-primary">
            Explore Menu & Order
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((ord) => (
            <div
              key={ord._id}
              style={{
                background: 'var(--cafe-ivory)',
                border: '1px solid #e8dfd3',
                borderRadius: 'var(--surface-radius-card)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '1px solid #e8dfd3',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <span
                    style={{
                      background: 'rgba(192, 86, 33, 0.1)',
                      color: 'var(--cafe-terracotta)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    Token #{ord.dailyTokenNumber || '—'}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--cafe-font-primary)',
                      fontSize: '1.2rem',
                      margin: '6px 0 2px',
                      color: 'var(--cafe-espresso)',
                    }}
                  >
                    {ord.orderId || ord._id}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)' }}>
                    Ordered on {new Date(ord.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    className={`status-pill status-${(ord.status || 'placed').toLowerCase()}`}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    {ord.status}
                  </span>
                  <div style={{ marginTop: '6px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--cafe-terracotta)' }}>
                    ₹{(ord.totalAmount || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {(ord.items || []).map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                    <span>
                      {it.quantity}x {it.name} {it.variantName ? `(${it.variantName})` : ''}
                    </span>
                    <span style={{ fontWeight: '500' }}>₹{(it.lineTotal || (it.price * it.quantity) || 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px dashed #e8dfd3',
                  paddingTop: '0.75rem',
                  fontSize: '0.85rem',
                  color: 'var(--cafe-text-muted)',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <span>
                  Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})
                </span>
                <span>
                  Pickup Mode: <strong>{ord.pickupType}</strong>
                </span>

                {ord.status === 'PLACED' && (
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ color: '#c53030', borderColor: '#c53030' }}
                    disabled={cancellingId === ord._id}
                    onClick={() => handleCancelOrder(ord._id)}
                  >
                    {cancellingId === ord._id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
