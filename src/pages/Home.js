import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import api from '../utils/api';
import { addToCart } from '../utils/cartStorage';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([
    {
      _id: 'featured-1',
      name: 'Golden Ghee Roast Masala Dosa',
      nameTamil: 'நெய் ரோஸ்ட் மசாலா தோசை',
      description: 'Paper-thin, golden-crisp fermented rice-lentil crepe anointed with aromatic churned desi ghee and stuffed with spiced potato masala.',
      imageUrl: '/images/menu/dosa.jpg',
      price: 160,
      isVeg: true,
    },
    {
      _id: 'featured-2',
      name: 'Podi Thatte Idli (2 Pcs)',
      nameTamil: 'பொடி தட்டே இட்லி',
      description: 'Plump, pillowy steamed rice cakes drenched in fiery gun powder podi and fragrant wood-pressed sesame oil.',
      imageUrl: '/images/menu/kal-dosa.svg',
      price: 110,
      isVeg: true,
    },
    {
      _id: 'featured-3',
      name: 'Kumbakonam Degree Filter Kaapi',
      nameTamil: 'கும்பகோணம் டிகிரி பில்டர் காபி',
      description: 'First decoction Chicory-blended brew pulled with rich frothy cow milk in traditional brass davarah-tumbler.',
      imageUrl: '/images/menu/cup-of-onion.svg',
      price: 45,
      isVeg: true,
    },
    {
      _id: 'featured-4',
      name: 'Crispy Medu Vada (2 Pcs)',
      nameTamil: 'மெது வடை',
      description: 'Golden-fried spiced lentil fritters with crispy exterior and fluffy interior, served with coconut & tomato chutneys.',
      imageUrl: '/images/menu/roast.svg',
      price: 80,
      isVeg: true,
    },
    {
      _id: 'featured-5',
      name: 'South Indian Heritage Thali',
      nameTamil: 'தென் இந்திய பாரம்பரிய சாப்பாடு',
      description: 'Steaming ponni rice, drumstick sambar, rasam, kootu, poriyal, appalam, curd, and sweet elaneer payasam.',
      imageUrl: '/images/menu/veg-pulao.svg',
      price: 220,
      isVeg: true,
    },
    {
      _id: 'featured-6',
      name: 'Chettinad Pepper Chicken',
      nameTamil: 'செட்டிநாடு மிளகு சிக்கன்',
      description: 'Tender chicken slow-roasted with black tellicherry peppercorns, curry leaves, and stone-ground spices.',
      imageUrl: '/images/menu/pepper-chicken.jpg',
      price: 250,
      isVeg: false,
    },
  ]);

  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    // Attempt to load fresh items from backend
    api.getFoods({ limit: 6 })
      .then((res) => {
        if (res.success && Array.isArray(res.data.foods) && res.data.foods.length > 0) {
          setFeaturedItems(res.data.foods.slice(0, 6));
        }
      })
      .catch(() => {
        // Fallback to pre-configured authentic Indian Rupee dishes
      });
  }, []);

  const handleAddToCart = (food) => {
    addToCart(food, 1);
    setToastMessage(`Added "${food.name}" to your tray!`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <div className="home-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--cafe-leaf)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold',
          }}
        >
          <span className="material-symbols-outlined">check_circle</span>
          <span>{toastMessage}</span>
          <Link to="/cart" style={{ color: '#fff', marginLeft: '12px', textDecoration: 'underline' }}>
            View Tray →
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #fef9f3 0%, #fbf3ea 100%)',
          padding: '4rem 1rem 5rem',
          borderBottom: '1px solid #dec0b5',
        }}
      >
        <div className="page-container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(192, 86, 33, 0.1)',
                color: 'var(--cafe-terracotta)',
                padding: '6px 16px',
                borderRadius: '24px',
                fontSize: '0.88rem',
                fontWeight: 'bold',
                marginBottom: '1.25rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                storefront
              </span>
              <span>Heritage Counter Dining • Chidambaram, Tamil Nadu</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--cafe-font-primary)',
                fontSize: '3.2rem',
                lineHeight: '1.15',
                color: 'var(--cafe-espresso)',
                margin: '0 0 1.25rem',
              }}
            >
              Authentic Heritage Flavors of South India
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--cafe-text-muted)', lineHeight: '1.6', margin: '0 0 2rem' }}>
              Celebrating century-old recipes, stone-ground batter, pure golden desi ghee, and piping-hot degree filter kaapi served fresh daily.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/menu" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', fontWeight: 'bold' }}>
                Explore Menu & Order
              </Link>
              <Link to="/about" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', fontWeight: 'bold' }}>
                Our Heritage Story
              </Link>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem', borderTop: '1px solid #dec0b5', paddingTop: '1.5rem' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '1.6rem', color: 'var(--cafe-terracotta)', fontFamily: 'var(--cafe-font-primary)' }}>
                  100%
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)' }}>Desi Ghee & Fresh Spices</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1.6rem', color: 'var(--cafe-leaf)', fontFamily: 'var(--cafe-font-primary)' }}>
                  15 Mins
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)' }}>Average Counter Prep</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1.6rem', color: 'var(--cafe-espresso)', fontFamily: 'var(--cafe-font-primary)' }}>
                  ₹45 onwards
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)' }}>Authentic South Fare</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(192, 86, 33, 0.15)',
                border: '4px solid #fff',
              }}
            >
              <img
                src="/images/menu/dosa.jpg"
                alt="Golden Ghee Roast Masala Dosa"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '20px',
                background: '#ffffff',
                padding: '14px 20px',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid #dec0b5',
              }}
            >
              <span className="material-symbols-outlined" style={{ color: 'var(--cafe-leaf)', fontSize: '28px' }}>
                verified
              </span>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--cafe-espresso)' }}>
                  Fresh Counter Sizzle
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--cafe-text-muted)' }}>
                  Crispy Dosas • Filter Kaapi • Parotta
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Delicacies Section */}
      <section style={{ padding: '4.5rem 1rem', background: '#fffdf9' }}>
        <div className="page-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--cafe-terracotta)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>
                From Our Tiffin Hearth
              </span>
              <h2 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '2.4rem', color: 'var(--cafe-espresso)', margin: '0.35rem 0' }}>
                Featured Tiffin Delicacies
              </h2>
              <p style={{ color: 'var(--cafe-text-muted)', margin: 0, maxWidth: '600px' }}>
                Crafted following century-old proportion guidelines, slow-fermented at room temperature and toasted over heavy cast-iron tawas.
              </p>
            </div>
            <Link to="/menu" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold' }}>
              View All 96 Dishes →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {featuredItems.map((item) => (
              <FoodCard key={item._id || item.id} {...item} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* The Four Sacred Pillars Section */}
      <section style={{ padding: '4.5rem 1rem', background: 'var(--cafe-cream)', borderTop: '1px solid #dec0b5' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--cafe-terracotta)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 'bold' }}>
            Our Heritage Philosophy
          </span>
          <h2 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '2.4rem', color: 'var(--cafe-espresso)', margin: '0.4rem 0 2.5rem' }}>
            Crafted with Uncompromised Integrity
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            <div style={{ background: '#fffdf9', padding: '2rem', borderRadius: '16px', border: '1px solid #e8dfd3', boxShadow: 'var(--shadow-card)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--cafe-terracotta)' }}>
                blender
              </span>
              <h3 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '1rem 0 0.5rem', fontSize: '1.25rem' }}>
                Stone-Ground Batters
              </h3>
              <p style={{ color: 'var(--cafe-text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                Traditional granite wet-grinding keeps rice and urad dal cool, preserving active yeast cultures for unbeatable fluffiness.
              </p>
            </div>

            <div style={{ background: '#fffdf9', padding: '2rem', borderRadius: '16px', border: '1px solid #e8dfd3', boxShadow: 'var(--shadow-card)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--cafe-leaf)' }}>
                eco
              </span>
              <h3 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '1rem 0 0.5rem', fontSize: '1.25rem' }}>
                Farm-Fresh Plantain Leaves
              </h3>
              <p style={{ color: 'var(--cafe-text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                Every meal and takeaway parcel is touched by pure steamed banana leaves, imparting rich polyphenols and iconic fragrance.
              </p>
            </div>

            <div style={{ background: '#fffdf9', padding: '2rem', borderRadius: '16px', border: '1px solid #e8dfd3', boxShadow: 'var(--shadow-card)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--cafe-terracotta)' }}>
                coffee
              </span>
              <h3 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '1rem 0 0.5rem', fontSize: '1.25rem' }}>
                First-Decoction Kaapi
              </h3>
              <p style={{ color: 'var(--cafe-text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                High-grown plantation Arabica slow-dripped through brass gravity filters, poured frothy from half a meter high into davarahs.
              </p>
            </div>

            <div style={{ background: '#fffdf9', padding: '2rem', borderRadius: '16px', border: '1px solid #e8dfd3', boxShadow: 'var(--shadow-card)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--cafe-espresso)' }}>
                security
              </span>
              <h3 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '1rem 0 0.5rem', fontSize: '1.25rem' }}>
                Zero Chemical Additives
              </h3>
              <p style={{ color: 'var(--cafe-text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                No artificial food coloring, zero synthetic preservatives, and only cold-pressed sesame oil and pure desi churned cow butter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
