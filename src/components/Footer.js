import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#294B38',
      color: '#FFF8EE',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      borderTop: '4px solid #C65D35',
      marginTop: 'auto'
    }}>
      <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Top 3-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          
          {/* Col 1: Brand & Heritage */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <span className="material-symbols-outlined" style={{ color: '#F7E6D8', fontSize: '28px' }}>
                restaurant
              </span>
              <span style={{ fontFamily: 'Noto Serif, Georgia, serif', fontWeight: 700, fontSize: '1.4rem', color: '#FFFFFF' }}>
                Hotel New Moorthi Cafe
              </span>
            </div>
            <p style={{ color: '#E9EFE7', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Authentic South Indian culinary legacy serving traditional stone-ground idlis, cast-iron roasted dosas, rich gravies, and frothy Kumbakonam degree kaapi since 1978.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              fontSize: '0.8rem',
              color: '#FFFCF7'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9ff5c1' }}></span>
              <span>100% Satvik Pure Vegetarian Kitchen</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '1.25rem', borderBottom: '2px solid rgba(198, 93, 53, 0.6)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Quick Navigation
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
              <Link to="/" style={{ color: '#E9EFE7', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
              <Link to="/about" style={{ color: '#E9EFE7', textDecoration: 'none', transition: 'color 0.2s' }}>Our Story</Link>
              <Link to="/menu" style={{ color: '#E9EFE7', textDecoration: 'none', transition: 'color 0.2s' }}>Food Menu</Link>
              <Link to="/cart" style={{ color: '#E9EFE7', textDecoration: 'none', transition: 'color 0.2s' }}>Dining Tray</Link>
              <Link to="/gallery" style={{ color: '#E9EFE7', textDecoration: 'none', transition: 'color 0.2s' }}>Gallery</Link>
              <Link to="/dashboard" style={{ color: '#E9EFE7', textDecoration: 'none', transition: 'color 0.2s' }}>My Dashboard</Link>
              <Link to="/contact" style={{ color: '#E9EFE7', textDecoration: 'none', transition: 'color 0.2s' }}>Contact Us</Link>
              <Link to="/my-orders" style={{ color: '#E9EFE7', textDecoration: 'none', transition: 'color 0.2s' }}>Order Tracking</Link>
            </div>
          </div>

          {/* Col 3: Heritage Location & Hours */}
          <div>
            <h4 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '1.25rem', borderBottom: '2px solid rgba(198, 93, 53, 0.6)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Visit &amp; Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#E9EFE7' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#F7E6D8', shrink: 0 }}>location_on</span>
                <span>14 East Car Street, Opp. Natarajar Temple East Gopuram, Chidambaram, Tamil Nadu 608001</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#F7E6D8' }}>schedule</span>
                <span>Open Everyday: 06:00 AM – 10:30 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#F7E6D8' }}>call</span>
                <span>+91 4144 222 345 / +91 94432 10890</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & GST Notice */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#E9EFE7'
        }}>
          <div>
            &copy; {new Date().getFullYear()} Hotel New Moorthi Cafe. All rights reserved. Prices strictly in Indian Currency (₹).
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <Link to="/contact" style={{ color: '#E9EFE7', textDecoration: 'none' }}>Banquet Catering</Link>
            <span>•</span>
            <Link to="/menu" style={{ color: '#E9EFE7', textDecoration: 'none' }}>Live Counter Ordering</Link>
            <span>•</span>
            <Link to="/admin/login" style={{ color: '#E9EFE7', textDecoration: 'none', opacity: 0.8 }}>Admin Console</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
