import React from 'react';
import { Link } from 'react-router-dom';

const PaymentDetails = () => {
  return (
    <div className="payment-details-page page-container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--cafe-font-primary)', color: 'var(--cafe-terracotta)', fontSize: '2.25rem' }}>
          Payment & Billing Policy
        </h1>
        <p style={{ color: 'var(--cafe-text-muted)' }}>
          Transparent, cashless, and traditional counter settlement options at Hotel New Moorthi Cafe.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Payment Methods */}
        <div
          style={{
            background: 'var(--cafe-ivory)',
            border: '1px solid #e8dfd3',
            borderRadius: 'var(--surface-radius-card)',
            padding: '2rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '1.4rem', marginTop: 0, color: 'var(--cafe-espresso)' }}>
            Accepted Payment Methods
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.25rem' }}>
            <div style={{ border: '1px solid #e8dfd3', padding: '1.25rem', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--cafe-terracotta)', fontSize: '32px' }}>
                qr_code_scanner
              </span>
              <h3 style={{ margin: '8px 0 4px', fontSize: '1.1rem' }}>UPI & QR Code</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)', margin: 0 }}>
                Instant dynamic UPI QR scan via Google Pay, PhonePe, Paytm, or BHIM at the billing counter.
              </p>
            </div>

            <div style={{ border: '1px solid #e8dfd3', padding: '1.25rem', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--cafe-leaf)', fontSize: '32px' }}>
                payments
              </span>
              <h3 style={{ margin: '8px 0 4px', fontSize: '1.1rem' }}>Cash at Counter</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)', margin: 0 }}>
                Direct physical cash settlement with our cashier when presenting your pickup token number.
              </p>
            </div>

            <div style={{ border: '1px solid #e8dfd3', padding: '1.25rem', borderRadius: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--cafe-espresso)', fontSize: '32px' }}>
                credit_card
              </span>
              <h3 style={{ margin: '8px 0 4px', fontSize: '1.1rem' }}>Card POS Swipe</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)', margin: 0 }}>
                Tap, insert, or swipe any major Visa, Mastercard, or RuPay credit or debit card.
              </p>
            </div>
          </div>
        </div>

        {/* Taxes & Statutory Charges */}
        <div
          style={{
            background: 'var(--cafe-ivory)',
            border: '1px solid #e8dfd3',
            borderRadius: 'var(--surface-radius-card)',
            padding: '2rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '1.4rem', marginTop: 0, color: 'var(--cafe-espresso)' }}>
            Statutory Taxes & Parcel Charges
          </h2>
          <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.8', color: 'var(--cafe-espresso)', marginTop: '1rem' }}>
            <li>
              <strong>GST (Goods and Services Tax):</strong> Standard statutory 5% composition rate applied on food services without input tax credit.
            </li>
            <li>
              <strong>Takeaway Parcel Packaging Charge:</strong> Flat ₹15 per pickup order to cover eco-friendly food-grade banana leaf wrapping, parcel containers, and hot-seal covers.
            </li>
            <li>
              <strong>No Hidden Charges:</strong> No service charges or delivery surge premiums are added.
            </li>
          </ul>
        </div>

        {/* Navigation CTAs */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link to="/menu" className="btn btn-primary">
            Explore Menu & Place Order
          </Link>
          <Link to="/cart" className="btn btn-secondary">
            View My Tray
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
