import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCart, clearCart } from '../utils/cartStorage';
import api from '../utils/api';

const Checkout = () => {
  const [items, setItems] = useState([]);
  const [bill, setBill] = useState({ subtotal: 0, gst: 0, packagingCharge: 15, totalAmount: 15 });
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [pickupType, setPickupType] = useState('IMMEDIATE');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const current = getCart();
    if (current.length === 0) {
      navigate('/cart');
      return;
    }
    setItems(current);

    const savedNotes = sessionStorage.getItem('moorthi_order_notes') || '';
    setNotes(savedNotes);

    loadCustomerAndPreview(current);
  }, []);

  const loadCustomerAndPreview = async (cartItems) => {
    const token = localStorage.getItem('moorthi_token');

    // 1. Load user profile if authenticated
    if (token) {
      try {
        const meRes = await api.authMe(token);
        if (meRes.success && meRes.data) {
          const u = meRes.data.user || meRes.data;
          setCustomer({
            name: u.name || '',
            phone: u.phone || '',
            email: u.email || '',
          });
        }
      } catch (err) {
        console.warn('Could not load user profile', err);
      }
    }

    // 2. Fetch authoritative preview bill
    try {
      const payload = cartItems.map((it) => ({
        foodId: it.foodId,
        quantity: it.quantity,
        variantName: it.variantName || undefined,
      }));

      if (token) {
        const res = await api.previewOrder(payload, token);
        if (res.success && res.data) {
          setBill({
            subtotal: res.data.subtotal,
            gst: res.data.gst,
            packagingCharge: res.data.packagingCharge,
            totalAmount: res.data.totalAmount,
          });
          return;
        }
      }
    } catch {
      // Local fallback
    }

    const sub = cartItems.reduce((acc, it) => acc + (it.price || 0) * it.quantity, 0);
    const gst = Math.round(sub * 0.05 * 100) / 100;
    const pkg = 15;
    setBill({ subtotal: sub, gst, packagingCharge: pkg, totalAmount: sub + gst + pkg });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('moorthi_token');

    if (!token) {
      setError('Please log in or create an account to place and track your takeaway order.');
      navigate('/login?redirect=/checkout');
      return;
    }

    try {
      setSubmitting(true);
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const orderPayload = {
        itemsInput: items.map((it) => ({
          foodId: it.foodId,
          quantity: it.quantity,
          variantName: it.variantName || undefined,
        })),
        pickupType,
        paymentMethod,
        notes: notes.trim(),
      };

      const res = await api.placeOrder(orderPayload, token, idempotencyKey);

      if (res.success && res.data && res.data.order) {
        clearCart();
        sessionStorage.removeItem('moorthi_order_notes');
        const orderId = res.data.order.orderId || res.data.order._id;
        navigate(`/order-success?orderId=${orderId}`, { state: { order: res.data.order } });
      } else {
        setError(res.message || 'Failed to place order. Please review your cart.');
      }
    } catch (err) {
      setError(err.message || 'Network error while placing order. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page page-container" style={{ padding: '2.5rem 1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--cafe-font-primary)', color: 'var(--cafe-terracotta)', fontSize: '2.25rem' }}>
          Takeaway Counter Checkout
        </h1>
        <p style={{ color: 'var(--cafe-text-muted)' }}>
          Confirm your contact details, takeaway collection time, and counter settlement choice.
        </p>
      </header>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem', background: '#ffebee', color: '#c53030', padding: '1rem', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          {/* Left Column: Contact & Payment Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Customer Details Box */}
            <div
              style={{
                background: 'var(--cafe-ivory)',
                border: '1px solid #e8dfd3',
                borderRadius: 'var(--surface-radius-card)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '1.25rem', marginTop: 0 }}>
                1. Customer Information
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Anand Sundaram"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    className="input-field"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    style={{ width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* Collection Timing */}
            <div
              style={{
                background: 'var(--cafe-ivory)',
                border: '1px solid #e8dfd3',
                borderRadius: 'var(--surface-radius-card)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '1.25rem', marginTop: 0 }}>
                2. Takeaway Pickup Time
              </h2>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <label
                  style={{
                    flex: 1,
                    border: pickupType === 'IMMEDIATE' ? '2px solid var(--cafe-terracotta)' : '1px solid #e8dfd3',
                    background: pickupType === 'IMMEDIATE' ? 'rgba(192, 86, 33, 0.05)' : '#fff',
                    borderRadius: '8px',
                    padding: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <input
                    type="radio"
                    name="pickupType"
                    checked={pickupType === 'IMMEDIATE'}
                    onChange={() => setPickupType('IMMEDIATE')}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Immediate Collection</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)' }}>
                      Ready in 15–20 minutes at counter
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div
              style={{
                background: 'var(--cafe-ivory)',
                border: '1px solid #e8dfd3',
                borderRadius: 'var(--surface-radius-card)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '1.25rem', marginTop: 0 }}>
                3. Payment Method (Pay at Counter)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
                {[
                  { id: 'UPI', label: 'UPI / QR Scan', desc: 'Scan dynamic GPay/PhonePe/Paytm QR at pickup counter' },
                  { id: 'COUNTER_CASH', label: 'Cash at Counter', desc: 'Settle in cash with our billing cashier' },
                  { id: 'CARD', label: 'Card Swipe / Tap', desc: 'Credit / Debit card payment at point of pickup' },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    style={{
                      border: paymentMethod === pm.id ? '2px solid var(--cafe-terracotta)' : '1px solid #e8dfd3',
                      background: paymentMethod === pm.id ? 'rgba(192, 86, 33, 0.05)' : '#fff',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{pm.label}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)' }}>{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Button */}
          <div>
            <div
              style={{
                background: 'var(--cafe-ivory)',
                border: '1px solid #e8dfd3',
                borderRadius: 'var(--surface-radius-card)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-card)',
                position: 'sticky',
                top: '100px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--cafe-font-primary)',
                  fontSize: '1.35rem',
                  marginTop: 0,
                  borderBottom: '2px solid var(--cafe-terracotta)',
                  paddingBottom: '0.75rem',
                }}
              >
                Order Summary
              </h2>

              <div style={{ maxHeight: '200px', overflowY: 'auto', margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>
                      {it.quantity}x {it.name} {it.variantName ? `(${it.variantName})` : ''}
                    </span>
                    <strong>₹{((it.price || 0) * it.quantity).toFixed(2)}</strong>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #e8dfd3', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cafe-text-muted)' }}>
                  <span>Subtotal</span>
                  <span>₹{bill.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cafe-text-muted)' }}>
                  <span>GST (5%)</span>
                  <span>₹{bill.gst.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--cafe-text-muted)' }}>
                  <span>Packaging Charge</span>
                  <span>₹{bill.packagingCharge.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px dashed #dec0b5',
                    paddingTop: '0.75rem',
                    fontSize: '1.25rem',
                  }}
                >
                  <strong>Total to Pay</strong>
                  <strong style={{ color: 'var(--cafe-terracotta)' }}>₹{bill.totalAmount.toFixed(2)}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}
              >
                {submitting ? 'Placing Order...' : 'Confirm & Place Pickup Order'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/cart" style={{ color: 'var(--cafe-terracotta)', fontSize: '0.9rem', textDecoration: 'none' }}>
                  ← Modify Cart Items
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
