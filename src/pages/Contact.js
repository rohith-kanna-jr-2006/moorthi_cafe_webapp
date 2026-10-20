import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    emailAddress: '',
    dateOfInterest: '',
    serviceRequired: 'dine-in',
    guestMessage: '',
    privacyConsent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        fullName: '',
        contactNumber: '',
        emailAddress: '',
        dateOfInterest: '',
        serviceRequired: 'dine-in',
        guestMessage: '',
        privacyConsent: false
      });
      setTimeout(() => setSubmitted(false), 6000);
    }, 600);
  };

  return (
    <div className="site-shell" style={{ width: '100%', overflowX: 'hidden' }}>
      <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.25rem' }}>
        
        {/* Hero Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--cafe-spice, #F7E6D8)',
            color: 'var(--cafe-terracotta, #C65D35)',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            <span>🏛️</span>
            <span>Chidambaram Heritage Hospitality</span>
          </div>
          <h1 style={{
            fontFamily: 'Noto Serif, Georgia, serif',
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 700,
            color: 'var(--cafe-dark, #2b1f1d)',
            marginBottom: '0.75rem'
          }}>
            Contact Hotel New Moorthi Cafe
          </h1>
          <p style={{
            color: '#6c584c',
            fontSize: '1.05rem',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Reach out for banquet bookings, traditional tiffin catering, or visit our heritage dining hall in the temple town of Chidambaram.
          </p>
        </div>

        {/* 4 Contact Pillar Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem'
        }}>
          {/* Pillar 1 */}
          <div style={{
            backgroundColor: '#FFFCF7',
            border: '1px solid #E8DCCF',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(52,35,29,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>📍</div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9f3e07', fontWeight: 700 }}>
                Dining Hall
              </span>
              <h3 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.2rem', margin: '0.25rem 0 0.5rem', color: '#2b1f1d' }}>
                Heritage Dining
              </h3>
              <p style={{ color: '#6c584c', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                14 East Car Street, Opp. Natarajar Temple East Gopuram, Chidambaram, Tamil Nadu 608001
              </p>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f0e6dc', fontSize: '0.85rem', color: '#0a6c44', fontWeight: 600 }}>
              ✓ Central Temple District
            </div>
          </div>

          {/* Pillar 2 */}
          <div style={{
            backgroundColor: '#FFFCF7',
            border: '1px solid #E8DCCF',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(52,35,29,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>📞</div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9f3e07', fontWeight: 700 }}>
                Direct Phone
              </span>
              <h3 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.2rem', margin: '0.25rem 0 0.5rem', color: '#2b1f1d' }}>
                Counter Desk
              </h3>
              <p style={{ color: '#6c584c', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                +91 4144 222 345<br />
                +91 94432 10890 (Catering Desk)
              </p>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f0e6dc', fontSize: '0.85rem', color: '#0a6c44', fontWeight: 600 }}>
              ✓ Instant Table &amp; Takeaway Info
            </div>
          </div>

          {/* Pillar 3 */}
          <div style={{
            backgroundColor: '#FFFCF7',
            border: '1px solid #E8DCCF',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(52,35,29,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>✉️</div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9f3e07', fontWeight: 700 }}>
                Electronic Desk
              </span>
              <h3 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.2rem', margin: '0.25rem 0 0.5rem', color: '#2b1f1d' }}>
                Email Inquiries
              </h3>
              <p style={{ color: '#6c584c', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                contact@hotelnewmoorthicafe.com<br />
                catering@hotelnewmoorthicafe.com
              </p>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f0e6dc', fontSize: '0.85rem', color: '#0a6c44', fontWeight: 600 }}>
              ✓ Responses within 4 hours
            </div>
          </div>

          {/* Pillar 4 */}
          <div style={{
            backgroundColor: '#FFFCF7',
            border: '1px solid #E8DCCF',
            borderRadius: '14px',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(52,35,29,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>⏰</div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9f3e07', fontWeight: 700 }}>
                Daily Service
              </span>
              <h3 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.2rem', margin: '0.25rem 0 0.5rem', color: '#2b1f1d' }}>
                Service Timings
              </h3>
              <p style={{ color: '#6c584c', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                Morning Tiffin: 06:00 AM – 11:30 AM<br />
                Lunch Thali: 11:30 AM – 03:30 PM<br />
                Evening Kaapi &amp; Snacks: 04:30 PM – 10:30 PM
              </p>
            </div>
            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f0e6dc', fontSize: '0.85rem', color: '#0a6c44', fontWeight: 600 }}>
              ✓ Open All 7 Days
            </div>
          </div>
        </div>

        {/* 2-Column Section: Catering Highlights & Inquiries Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
          marginBottom: '3rem'
        }}>
          {/* Left Column: Catering & Billing Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{
              backgroundColor: '#F7E6D8',
              border: '1px solid #E8DCCF',
              borderRadius: '14px',
              padding: '1.75rem',
              boxShadow: '0 4px 16px rgba(52,35,29,0.05)'
            }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C65D35', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                Regional Hospitality
              </span>
              <h2 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.5rem', color: '#2b1f1d', margin: '0 0 0.75rem' }}>
                Catering &amp; Traditional Feasts
              </h2>
              <p style={{ color: '#6c584c', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                We cater family celebrations, temple ceremonies, and wedding tiffin receptions with authentic banana-leaf service, live ghee dosa counters, and fresh Kumbakonam degree kaapi stations.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#FFFCF7', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E8DCCF' }}>
                  <span style={{ color: '#0a6c44', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: '#2b1f1d', fontWeight: 500 }}>Traditional Banana Leaf Feasts (50 - 1500 Guests)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#FFFCF7', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E8DCCF' }}>
                  <span style={{ color: '#0a6c44', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: '#2b1f1d', fontWeight: 500 }}>Steaming Idli &amp; Crispy Medu Vada Morning Tiffin Packs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#FFFCF7', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #E8DCCF' }}>
                  <span style={{ color: '#0a6c44', fontSize: '1.2rem', fontWeight: 'bold' }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: '#2b1f1d', fontWeight: 500 }}>Live Brass Filter Coffee Brew Counters</span>
                </div>
              </div>
            </div>

            {/* Currency Transparency Card */}
            <div style={{
              backgroundColor: '#FFFCF7',
              border: '1px solid #E8DCCF',
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              boxShadow: '0 4px 16px rgba(52,35,29,0.05)'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(10, 108, 68, 0.1)',
                color: '#0a6c44',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
                flexShrink: 0
              }}>
                ₹
              </div>
              <div>
                <h4 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.1rem', margin: '0 0 0.35rem', color: '#2b1f1d' }}>
                  Billing Transparency
                </h4>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#6c584c', lineHeight: 1.5 }}>
                  All quotes and counter bills are itemized strictly in Indian Rupees (₹), inclusive of standard 5% GST and explicit eco-friendly packaging charges.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Inquiries Form */}
          <div style={{
            backgroundColor: '#FFFCF7',
            border: '1px solid #E8DCCF',
            borderRadius: '14px',
            padding: '2rem 1.5rem',
            boxShadow: '0 4px 16px rgba(52,35,29,0.07)'
          }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C65D35', fontWeight: 700, display: 'block' }}>
                Online Assistance
              </span>
              <h2 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.5rem', color: '#2b1f1d', margin: '0.35rem 0 0.5rem' }}>
                Guest Inquiry &amp; Table Reservations
              </h2>
              <p style={{ color: '#6c584c', fontSize: '0.9rem', margin: 0 }}>
                Please share your details below. Our reservation desk will reach out promptly.
              </p>
            </div>

            {submitted && (
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(10, 108, 68, 0.12)',
                border: '1px solid #0a6c44',
                borderRadius: '8px',
                color: '#0a6c44',
                fontSize: '0.92rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>✓</span>
                <span>Thank you! Your inquiry has been recorded. Our team will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label htmlFor="fullName" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2b1f1d', marginBottom: '0.35rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Sundaram Natarajan"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #E8DCCF',
                      backgroundColor: '#FFF8EE',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="contactNumber" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2b1f1d', marginBottom: '0.35rem' }}>
                    Contact Number *
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', fontSize: '0.85rem', color: '#6c584c', fontWeight: 600 }}>+91</span>
                    <input
                      type="tel"
                      id="contactNumber"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      required
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '0.75rem 0.75rem 0.75rem 2.75rem',
                        borderRadius: '8px',
                        border: '1px solid #E8DCCF',
                        backgroundColor: '#FFF8EE',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label htmlFor="emailAddress" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2b1f1d', marginBottom: '0.35rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="sundaram@example.com"
                    required
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #E8DCCF',
                      backgroundColor: '#FFF8EE',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="dateOfInterest" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2b1f1d', marginBottom: '0.35rem' }}>
                    Date of Visit / Service
                  </label>
                  <input
                    type="date"
                    id="dateOfInterest"
                    name="dateOfInterest"
                    value={formData.dateOfInterest}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #E8DCCF',
                      backgroundColor: '#FFF8EE',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="serviceRequired" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2b1f1d', marginBottom: '0.35rem' }}>
                  Requirement Type *
                </label>
                <select
                  id="serviceRequired"
                  name="serviceRequired"
                  value={formData.serviceRequired}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E8DCCF',
                    backgroundColor: '#FFF8EE',
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="dine-in">Dine-in / Family Table Inquiry</option>
                  <option value="catering">Traditional Catering &amp; Banana Leaf Feasts</option>
                  <option value="bulk-order">Large Tiffin Takeaway / Parcel Order</option>
                  <option value="feedback">Guest Experience &amp; Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="guestMessage" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2b1f1d', marginBottom: '0.35rem' }}>
                  Message &amp; Special Arrangements
                </label>
                <textarea
                  id="guestMessage"
                  name="guestMessage"
                  rows={4}
                  value={formData.guestMessage}
                  onChange={handleChange}
                  placeholder="Number of guests, food preferences, special occasions, or customized requests..."
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #E8DCCF',
                    backgroundColor: '#FFF8EE',
                    fontSize: '0.95rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="privacyConsent"
                  name="privacyConsent"
                  checked={formData.privacyConsent}
                  onChange={handleChange}
                  required
                  style={{ marginTop: '0.2rem', accentColor: '#C65D35' }}
                />
                <label htmlFor="privacyConsent" style={{ fontSize: '0.82rem', color: '#6c584c', lineHeight: 1.4 }}>
                  I agree to be contacted by Hotel New Moorthi Cafe regarding my dining or catering inquiry.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '0.85rem 1.75rem',
                  borderRadius: '8px',
                  backgroundColor: '#C65D35',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(198,93,53,0.3)',
                  transition: 'background-color 0.2s',
                  alignSelf: 'flex-start'
                }}
              >
                {isSubmitting ? 'Sending Request...' : 'Submit Inquiry →'}
              </button>

            </form>
          </div>

        </div>

        {/* Map / Directions banner */}
        <div style={{
          backgroundColor: '#FFFCF7',
          border: '1px solid #E8DCCF',
          borderRadius: '14px',
          padding: '1.5rem',
          boxShadow: '0 4px 16px rgba(52,35,29,0.05)',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9f3e07', fontWeight: 700 }}>
              Visitor Directions
            </span>
            <h3 style={{ fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.25rem', margin: '0.25rem 0 0.25rem', color: '#2b1f1d' }}>
              How to Reach Hotel New Moorthi Cafe
            </h3>
            <p style={{ margin: 0, color: '#6c584c', fontSize: '0.9rem' }}>
              Located right opposite the historic Natarajar Temple East Gopuram. 2 km from Chidambaram Railway Station.
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=Chidambaram+Natarajar+Temple"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: '#FFF8EE',
              border: '1px solid #C65D35',
              color: '#C65D35',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>Open in Google Maps ↗</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default Contact;
