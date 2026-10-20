import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';

const OrderSuccess = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const orderIdFromQuery = searchParams.get('orderId');
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order && !!orderIdFromQuery);

  useEffect(() => {
    if (!order && orderIdFromQuery) {
      fetchOrder(orderIdFromQuery);
    }
  }, [orderIdFromQuery]);

  const fetchOrder = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('moorthi_token');
      if (token) {
        const res = await api.getOrderById(id, token);
        if (res.success && res.data && res.data.order) {
          setOrder(res.data.order);
        }
      }
    } catch (err) {
      console.warn('Could not fetch order details', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-success-page page-container" style={{ padding: '3rem 1rem', maxWidth: '720px' }}>
      <div
        style={{
          background: 'var(--cafe-ivory)',
          border: '1px solid #e8dfd3',
          borderRadius: 'var(--surface-radius-panel)',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(10, 108, 68, 0.12)',
            color: 'var(--cafe-leaf)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
            check_circle
          </span>
        </div>

        <h1
          style={{
            fontFamily: 'var(--cafe-font-primary)',
            color: 'var(--cafe-terracotta)',
            fontSize: '2.2rem',
            margin: '0 0 0.5rem',
          }}
        >
          Takeaway Order Confirmed!
        </h1>
        <p style={{ color: 'var(--cafe-text-muted)', fontSize: '1.05rem', margin: '0 0 2rem' }}>
          Your kitchen order has been sent directly to the Hotel New Moorthi Cafe counter tawa & steam stations.
        </p>

        {/* Daily Token Badge */}
        <div
          style={{
            background: 'var(--cafe-cream)',
            border: '2px dashed var(--cafe-terracotta)',
            borderRadius: '16px',
            padding: '1.5rem',
            margin: '0 auto 2rem',
            maxWidth: '420px',
          }}
        >
          <span style={{ fontSize: '0.9rem', color: 'var(--cafe-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
            Your Daily Pickup Token
          </span>
          <div
            style={{
              fontFamily: 'var(--cafe-font-primary)',
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'var(--cafe-terracotta)',
              margin: '0.35rem 0',
            }}
          >
            Token #{order?.dailyTokenNumber || '—'}
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--cafe-espresso)', fontWeight: '600' }}>
            Order ID: {order?.orderId || orderIdFromQuery || 'Confirmed'}
          </div>
        </div>

        {/* Pickup Notice */}
        <div
          style={{
            background: 'rgba(10, 108, 68, 0.08)',
            border: '1px solid rgba(10, 108, 68, 0.25)',
            borderRadius: '8px',
            padding: '12px 16px',
            margin: '0 auto 2rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--cafe-leaf)', fontSize: '28px' }}>
            schedule
          </span>
          <div>
            <strong style={{ color: 'var(--cafe-leaf)', display: 'block' }}>Estimated Pickup: 15–20 minutes</strong>
            <span style={{ fontSize: '0.85rem', color: 'var(--cafe-espresso)' }}>
              Please present your token at the counter cashier to collect and settle your hot parcel.
            </span>
          </div>
        </div>

        {/* Line Items Snapshot */}
        {order?.items && order.items.length > 0 && (
          <div
            style={{
              textAlign: 'left',
              borderTop: '1px solid #e8dfd3',
              borderBottom: '1px solid #e8dfd3',
              padding: '1.5rem 0',
              margin: '0 0 2rem',
            }}
          >
            <h3 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '0 0 1rem' }}>Order Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {order.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                  <span>
                    {it.quantity}x {it.name} {it.variantName ? `(${it.variantName})` : ''}
                  </span>
                  <strong>₹{(it.lineTotal || (it.price * it.quantity) || 0).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed #e8dfd3', marginTop: '1rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem' }}>
              <strong>Total Bill:</strong>
              <strong style={{ color: 'var(--cafe-terracotta)' }}>₹{(order.totalAmount || 0).toFixed(2)}</strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)', marginTop: '4px' }}>
              Payment Method: <strong>{order.paymentMethod || 'UPI'}</strong> (Status: {order.paymentStatus || 'PENDING'})
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/my-orders" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem' }}>
            Track in My Orders
          </Link>
          <Link to="/menu" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
            Order More Dishes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
