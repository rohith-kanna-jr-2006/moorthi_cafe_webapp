import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Header */}
      <section
        style={{
          background: 'linear-gradient(135deg, #fef9f3 0%, #f7ede2 100%)',
          padding: '4rem 1rem',
          borderBottom: '1px solid #dec0b5',
          textAlign: 'center',
        }}
      >
        <div className="page-container" style={{ maxWidth: '820px' }}>
          <span
            style={{
              fontSize: '0.85rem',
              color: 'var(--cafe-terracotta)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 'bold',
            }}
          >
            A Multi-Generational Legacy • Chidambaram
          </span>
          <h1
            style={{
              fontFamily: 'var(--cafe-font-primary)',
              fontSize: '3rem',
              color: 'var(--cafe-espresso)',
              margin: '0.5rem 0 1rem',
            }}
          >
            Our Culinary Heritage & the Master Cooks of Tamil Nadu
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--cafe-text-muted)', lineHeight: '1.6' }}>
            Rooted in the temple city of Chidambaram, Hotel New Moorthi Cafe has welcomed generations of travelers,
            scholars, and families to experience pure, unadulterated South Indian hospitality.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section style={{ padding: '4rem 1rem', background: '#fffdf9' }}>
        <div className="page-container" style={{ maxWidth: '960px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--cafe-leaf)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Heirloom Stewardship
              </span>
              <h2 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '2.2rem', color: 'var(--cafe-espresso)', margin: '0.35rem 0 1.25rem' }}>
                Recipes Preserved Across Decades
              </h2>
              <p style={{ color: 'var(--cafe-espresso)', lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '1rem' }}>
                Every sambar masala blend and every biryani masala roast at Hotel New Moorthi Cafe follows exact handwritten ratios.
                We refuse shortcuts: our dals are slow-simmered in heavy brass vessels, our curry leaves are plucked fresh daily at sunrise,
                and our dosas are basted exclusively with authentic churned desi cow ghee.
              </p>
              <p style={{ color: 'var(--cafe-text-muted)', lineHeight: '1.7', fontSize: '0.98rem' }}>
                From our signature Golden Ghee Roast to our multi-course meals served over fresh plantain leaves, dining at Hotel New Moorthi Cafe
                is an enduring tribute to the agrarian abundance of the Cauvery delta.
              </p>
            </div>

            <div>
              <div
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  border: '4px solid #fff',
                }}
              >
                <img
                  src="/images/menu/paneer-butter-masala.jpg"
                  alt="Hotel New Moorthi Cafe Culinary Heritage"
                  style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Day at Moorthi Cafe Timeline */}
      <section style={{ padding: '4rem 1rem', background: 'var(--cafe-cream)', borderTop: '1px solid #dec0b5' }}>
        <div className="page-container" style={{ maxWidth: '880px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--cafe-terracotta)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
            The Daily Rhythm
          </span>
          <h2 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '2.3rem', color: 'var(--cafe-espresso)', margin: '0.35rem 0 2.5rem' }}>
            A Day at Hotel New Moorthi Cafe
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', textAlign: 'left' }}>
            <div style={{ background: '#fffdf9', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e8dfd3' }}>
              <div style={{ color: 'var(--cafe-terracotta)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>
                06:00 AM — The First Decoction & Sizzle
              </div>
              <h3 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '0 0 8px', fontSize: '1.3rem' }}>
                Dawn Filter Kaapi & Soft Steamed Idlis
              </h3>
              <p style={{ color: 'var(--cafe-text-muted)', margin: 0, lineHeight: '1.6' }}>
                The cafe awakes with the sound of brass davarahs pulling frothy chicory-blended coffee. Large copper steamers release clouds of jasmine-scented steam as thatte idlis and crispy golden medu vadas are prepared for the early morning crowd.
              </p>
            </div>

            <div style={{ background: '#fffdf9', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e8dfd3' }}>
              <div style={{ color: 'var(--cafe-leaf)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>
                11:30 AM — The Great Sambar Simmer
              </div>
              <h3 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '0 0 8px', fontSize: '1.3rem' }}>
                Midday Thali & Biryani Pots
              </h3>
              <p style={{ color: 'var(--cafe-text-muted)', margin: 0, lineHeight: '1.6' }}>
                Heavy cauldrons of drumstick sambar, pepper rasam, and fragrant dum biryani reach their peak temperature. Long banquet tables are laid with fresh dark green plantain leaves ready for the bustling lunch feast.
              </p>
            </div>

            <div style={{ background: '#fffdf9', padding: '1.75rem', borderRadius: '16px', border: '1px solid #e8dfd3' }}>
              <div style={{ color: 'var(--cafe-espresso)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>
                04:30 PM — Tiffin & Twilight Conversations
              </div>
              <h3 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '0 0 8px', fontSize: '1.3rem' }}>
                Crisp Parottas, Ghee Roasts & Spicy Salna
              </h3>
              <p style={{ color: 'var(--cafe-text-muted)', margin: 0, lineHeight: '1.6' }}>
                As twilight settles over Chidambaram, the cast iron griddles roar back to life with flaky layered parottas, kothu parotta beats, and piping hot special egg lappa.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <Link to="/menu" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', fontWeight: 'bold' }}>
              Taste Our Heritage — View Menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
