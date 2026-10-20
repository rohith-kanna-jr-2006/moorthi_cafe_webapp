import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItemQty, clearCart } from '../utils/cartStorage';
import api from '../utils/api';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [billSummary, setBillSummary] = useState({
    subtotal: 0,
    gst: 0,
    packagingCharge: 15,
    totalAmount: 15,
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCart = async () => {
    const currentItems = getCart();
    setItems(currentItems);

    if (currentItems.length > 0) {
      // Calculate or preview bill
      try {
        setLoading(true);
        const token = localStorage.getItem('moorthi_token');
        const previewPayload = currentItems.map((it) => ({
          foodId: it.foodId,
          quantity: it.quantity,
          variantName: it.variantName || undefined,
        }));

        if (token) {
          const res = await api.previewOrder(previewPayload, token);
          if (res.success && res.data) {
            setBillSummary({
              subtotal: res.data.subtotal,
              gst: res.data.gst,
              packagingCharge: res.data.packagingCharge,
              totalAmount: res.data.totalAmount,
            });
            return;
          }
        }
      } catch (err) {
        console.warn('API preview not available, using local calculation', err);
      } finally {
        setLoading(false);
      }

      // Local fallback calculation
      const sub = currentItems.reduce((acc, it) => acc + (it.price || 0) * it.quantity, 0);
      const gst = Math.round(sub * 0.05 * 100) / 100;
      const pkg = 15;
      const total = Math.round((sub + gst + pkg) * 100) / 100;
      setBillSummary({ subtotal: sub, gst, packagingCharge: pkg, totalAmount: total });
    } else {
      setBillSummary({ subtotal: 0, gst: 0, packagingCharge: 0, totalAmount: 0 });
    }
  };

  const handleQtyChange = (foodId, variantName, newQty) => {
    updateCartItemQty(foodId, variantName, newQty);
  };

  const handleClear = () => {
    if (window.confirm('Clear all items from your dining tray?')) {
      clearCart();
    }
  };

  const handleProceed = () => {
    sessionStorage.setItem('moorthi_order_notes', notes);
    navigate('/checkout');
  };

  return (
    <div className="cart-page page-container" style={{ padding: '2.5rem 1rem' }}>
      <header className="cart-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--cafe-font-primary)', color: 'var(--cafe-terracotta)', fontSize: '2.25rem' }}>
          Your Dining Tray
        </h1>
        <p style={{ color: 'var(--cafe-text-muted)', marginTop: '0.5rem' }}>
          Review your authentic South Indian dishes before placing your counter pickup order.
        </p>
      </header>

      {items.length === 0 ? (
        <div
          className="empty-cart-card"
          style={{
            background: 'var(--cafe-ivory)',
            border: '1px solid var(--cafe-border)',
            borderRadius: 'var(--surface-radius-card)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '64px', color: 'var(--cafe-terracotta)' }}>
            shopping_basket
          </span>
          <h2 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '1rem 0' }}>Your Tray is Empty</h2>
          <p style={{ color: 'var(--cafe-text-muted)', marginBottom: '2rem' }}>
            Explore our heritage tiffin, aromatic biryanis, and golden roasts.
          </p>
          <Link to="/menu" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            Explore Full Menu
          </Link>
        </div>
      ) : (
        <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
          {/* Cart Items List */}
          <div className="cart-items-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontWeight: '600', color: 'var(--cafe-espresso)' }}>
                {items.reduce((sum, i) => sum + i.quantity, 0)} Items Selected
              </span>
              <button
                onClick={handleClear}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#c53030',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  delete_sweep
                </span>
                Clear Tray
              </button>
            </div>

            <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item, idx) => (
                <div
                  key={`${item.foodId}-${item.variantName || 'default'}-${idx}`}
                  className="cart-item-card"
                  style={{
                    background: 'var(--cafe-ivory)',
                    border: '1px solid #e8dfd3',
                    borderRadius: 'var(--surface-radius-card)',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: '68px',
                          height: '68px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #e8dfd3',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '68px',
                          height: '68px',
                          borderRadius: '8px',
                          background: '#f2ede7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--cafe-terracotta)',
                        }}
                      >
                        <span className="material-symbols-outlined">restaurant</span>
                      </div>
                    )}
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--cafe-font-primary)' }}>
                        {item.name}
                      </h3>
                      {item.variantName && (
                        <span
                          style={{
                            fontSize: '0.85rem',
                            color: 'var(--cafe-leaf)',
                            fontWeight: '600',
                            display: 'block',
                            marginTop: '2px',
                          }}
                        >
                          Variant: {item.variantName}
                        </span>
                      )}
                      <span style={{ fontSize: '0.95rem', color: 'var(--cafe-terracotta)', fontWeight: 'bold' }}>
                        ₹{(item.price || 0).toFixed(2)} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#f8f3ed',
                        borderRadius: '6px',
                        border: '1px solid #e8dfd3',
                        padding: '2px',
                      }}
                    >
                      <button
                        onClick={() => handleQtyChange(item.foodId, item.variantName, item.quantity - 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          color: 'var(--cafe-espresso)',
                        }}
                      >
                        -
                      </button>
                      <span style={{ padding: '0 10px', fontWeight: 'bold', fontSize: '1rem' }}>{item.quantity}</span>
                      <button
                        onClick={() => handleQtyChange(item.foodId, item.variantName, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          color: 'var(--cafe-espresso)',
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ minWidth: '80px', textAlign: 'right' }}>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--cafe-terracotta)' }}>
                        ₹{((item.price || 0) * item.quantity).toFixed(2)}
                      </strong>
                    </div>

                    <button
                      onClick={() => handleQtyChange(item.foodId, item.variantName, 0)}
                      title="Remove item"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--cafe-text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Kitchen Notes */}
            <div
              style={{
                marginTop: '1.5rem',
                background: 'var(--cafe-ivory)',
                padding: '1.25rem',
                borderRadius: 'var(--surface-radius-card)',
                border: '1px solid #e8dfd3',
              }}
            >
              <label
                htmlFor="orderNotes"
                style={{ fontWeight: '600', display: 'block', marginBottom: '6px', color: 'var(--cafe-espresso)' }}
              >
                Special Cooking Instructions / Kitchen Notes (Optional):
              </label>
              <textarea
                id="orderNotes"
                rows="2"
                maxLength="150"
                className="input-field"
                placeholder="e.g. Less spicy, extra coconut chutney, roast dosa crisp..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--cafe-text-muted)' }}>{150 - notes.length} characters remaining</span>
            </div>
          </div>

          {/* Bill Summary Column */}
          <div className="cart-summary-section">
            <div
              style={{
                background: 'var(--cafe-ivory)',
                border: '1px solid #e8dfd3',
                borderRadius: 'var(--surface-radius-card)',
                padding: '1.5rem',
                position: 'sticky',
                top: '100px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--cafe-font-primary)',
                  fontSize: '1.35rem',
                  color: 'var(--cafe-espresso)',
                  marginTop: 0,
                  borderBottom: '2px solid var(--cafe-terracotta)',
                  paddingBottom: '0.75rem',
                }}
              >
                Bill Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', margin: '1.5rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--cafe-text-muted)' }}>Item Subtotal</span>
                  <span style={{ fontWeight: '600' }}>₹{billSummary.subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--cafe-text-muted)' }}>Statutory GST (5%)</span>
                  <span style={{ fontWeight: '600' }}>₹{billSummary.gst.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--cafe-text-muted)' }}>Takeaway Parcel Packaging</span>
                  <span style={{ fontWeight: '600' }}>₹{billSummary.packagingCharge.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px dashed #dec0b5',
                    paddingTop: '0.85rem',
                    fontSize: '1.25rem',
                  }}
                >
                  <strong style={{ color: 'var(--cafe-espresso)' }}>To Pay</strong>
                  <strong style={{ color: 'var(--cafe-terracotta)' }}>₹{billSummary.totalAmount.toFixed(2)}</strong>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(10, 108, 68, 0.08)',
                  border: '1px solid rgba(10, 108, 68, 0.2)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: 'var(--cafe-leaf)', fontSize: '20px' }}>
                  storefront
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--cafe-leaf)', fontWeight: '500' }}>
                  Immediate Counter Pickup (Ready in 15–20 mins)
                </span>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleProceed}
                disabled={loading}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', fontWeight: 'bold' }}
              >
                Proceed to Takeaway Checkout
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/menu" style={{ color: 'var(--cafe-terracotta)', fontSize: '0.9rem', textDecoration: 'none' }}>
                  ← Add More Dishes
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
