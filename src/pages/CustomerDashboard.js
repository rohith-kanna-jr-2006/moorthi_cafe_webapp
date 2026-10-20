import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('moorthi_token');
      if (!token) {
        navigate('/login?redirect=/dashboard');
        return;
      }

      const [userRes, ordersRes] = await Promise.all([
        api.authMe(token),
        api.getMyOrders(token),
      ]);

      if (userRes.success && userRes.data) {
        setUser(userRes.data.user || userRes.data);
      }
      if (ordersRes.success && ordersRes.data) {
        setOrders(ordersRes.data.orders || []);
      }
    } catch (err) {
      console.warn('Dashboard fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter((o) => ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status));

  const getStatusColor = (status) => {
    switch (status) {
      case 'READY':
        return { bg: '#0a6c44', text: '#ffffff', border: '#0a6c44' };
      case 'PREPARING':
        return { bg: '#c05621', text: '#ffffff', border: '#c05621' };
      case 'CONFIRMED':
        return { bg: '#2b6cb0', text: '#ffffff', border: '#2b6cb0' };
      case 'PLACED':
      default:
        return { bg: '#7b5600', text: '#ffffff', border: '#7b5600' };
    }
  };

  return (
    <div className="site-shell" style={{ minHeight: '85vh', padding: '2.5rem 1rem' }}>
      <div className="page-container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Welcome Header */}
        <header style={{
          backgroundColor: '#FFFCF7',
          border: '1px solid #E8DCCF',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(52,35,29,0.05)',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: '#F7E6D8',
              color: '#C65D35',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified_user</span>
              <span>Verified Diner Account</span>
            </div>
            <h1 style={{ fontFamily: 'Noto Serif, Georgia, serif', color: '#2b1f1d', fontSize: '2.2rem', margin: '0 0 0.35rem' }}>
              Welcome back, {user?.name || 'Valued Diner'}!
            </h1>
            <p style={{ color: '#6c584c', margin: 0, fontSize: '0.95rem' }}>
              Track live kitchen tokens, browse traditional delicacies, or view your past receipts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link
              to="/menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.4rem',
                borderRadius: '8px',
                backgroundColor: '#C65D35',
                color: '#ffffff',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(198,93,53,0.25)',
                transition: 'background-color 0.2s'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>restaurant_menu</span>
              <span>Order Takeaway</span>
            </Link>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          <div style={{
            backgroundColor: '#FFFCF7',
            border: '1px solid #E8DCCF',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(52,35,29,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'rgba(198, 93, 53, 0.12)',
              color: '#C65D35',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>kitchen</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#6c584c', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Active Queue Orders
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2b1f1d', margin: '0.15rem 0' }}>
                {activeOrders.length}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#0a6c44', fontWeight: 600 }}>
                {activeOrders.length > 0 ? '● In-flight at counter' : 'All tokens clear'}
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#FFFCF7',
            border: '1px solid #E8DCCF',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(52,35,29,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'rgba(10, 108, 68, 0.12)',
              color: '#0a6c44',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>receipt_long</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#6c584c', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Lifetime Orders
              </span>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#2b1f1d', margin: '0.15rem 0' }}>
                {orders.length}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#6c584c' }}>
                Chidambaram Patron
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#FFFCF7',
            border: '1px solid #E8DCCF',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(52,35,29,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'rgba(123, 86, 0, 0.12)',
              color: '#7b5600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>storefront</span>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#6c584c', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                Heritage Outlet
              </span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#2b1f1d', margin: '0.15rem 0' }}>
                Chidambaram East Car St
              </div>
              <span style={{ fontSize: '0.85rem', color: '#0a6c44', fontWeight: 600 }}>
                Open today till 10:30 PM
              </span>
            </div>
          </div>

        </div>

        {/* Live Kitchen & Counter Orders */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.5rem', color: '#2b1f1d', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#C65D35' }}>hourglass_top</span>
              <span>Live Kitchen &amp; Counter Queue</span>
            </h2>
            <Link to="/my-orders" style={{ color: '#C65D35', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              View Complete History &rarr;
            </Link>
          </div>

          {activeOrders.length === 0 ? (
            <div style={{
              backgroundColor: '#FFFCF7',
              border: '1px dashed #E8DCCF',
              borderRadius: '14px',
              padding: '3rem 2rem',
              textAlign: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#8a7268', marginBottom: '0.75rem' }}>
                check_circle
              </span>
              <h3 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.25rem', color: '#2b1f1d', margin: '0 0 0.5rem' }}>
                No Pending Pickup Orders
              </h3>
              <p style={{ color: '#6c584c', maxWidth: '480px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
                All your orders have been fulfilled! Ready for fresh hot dosas, podi thatte idlis, or filter coffee?
              </p>
              <Link
                to="/menu"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  backgroundColor: '#C65D35',
                  color: '#ffffff',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span>Browse Tiffin Menu</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeOrders.map((ord) => {
                const badge = getStatusColor(ord.status);
                return (
                  <div
                    key={ord._id}
                    style={{
                      backgroundColor: '#FFFCF7',
                      border: '1px solid #E8DCCF',
                      borderRadius: '14px',
                      padding: '1.5rem',
                      boxShadow: '0 4px 16px rgba(52,35,29,0.06)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.25rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                        <span style={{
                          backgroundColor: '#F7E6D8',
                          color: '#C65D35',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          letterSpacing: '0.05em'
                        }}>
                          Token #{ord.dailyTokenNumber || '—'}
                        </span>
                        <span style={{
                          backgroundColor: badge.bg,
                          color: badge.text,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          {ord.status}
                        </span>
                      </div>
                      
                      <h3 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.15rem', color: '#2b1f1d', margin: '0 0 0.35rem' }}>
                        Order ID: {ord.orderId}
                      </h3>
                      
                      <p style={{ margin: 0, fontSize: '0.88rem', color: '#6c584c' }}>
                        Ready in approx. 15–20 minutes • Settlement: <strong>{ord.payment?.method || 'Counter'}</strong> • Total: <strong>₹{ord.pricing?.finalPayable?.toFixed(2) || '0.00'}</strong>
                      </p>
                    </div>

                    <Link
                      to="/my-orders"
                      style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: '8px',
                        backgroundColor: '#FFF8EE',
                        border: '1px solid #C65D35',
                        color: '#C65D35',
                        fontWeight: 600,
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>track_changes</span>
                      <span>Track Progress</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Nav Action Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          <Link
            to="/menu"
            style={{
              backgroundColor: '#FFFCF7',
              border: '1px solid #E8DCCF',
              borderRadius: '12px',
              padding: '1.25rem',
              textDecoration: 'none',
              color: '#2b1f1d',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(52,35,29,0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#C65D35' }}>
              restaurant
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Browse Delicacies</div>
              <div style={{ fontSize: '0.8rem', color: '#6c584c' }}>View all 96 heritage items</div>
            </div>
          </Link>

          <Link
            to="/my-orders"
            style={{
              backgroundColor: '#FFFCF7',
              border: '1px solid #E8DCCF',
              borderRadius: '12px',
              padding: '1.25rem',
              textDecoration: 'none',
              color: '#2b1f1d',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(52,35,29,0.04)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#0a6c44' }}>
              receipt
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Order History</div>
              <div style={{ fontSize: '0.8rem', color: '#6c584c' }}>Past receipts &amp; bills</div>
            </div>
          </Link>

          <Link
            to="/profile"
            style={{
              backgroundColor: '#FFFCF7',
              border: '1px solid #E8DCCF',
              borderRadius: '12px',
              padding: '1.25rem',
              textDecoration: 'none',
              color: '#2b1f1d',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 2px 8px rgba(52,35,29,0.04)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#7b5600' }}>
              manage_accounts
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Dining Profile</div>
              <div style={{ fontSize: '0.8rem', color: '#6c584c' }}>Contact &amp; credentials</div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;
