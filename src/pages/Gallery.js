import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GALLERY_PHOTOS = [
  {
    id: 1,
    title: 'Golden Ghee Roast Masala Dosa',
    category: 'TIFFIN',
    src: '/images/menu/dosa.jpg',
    description: 'Crisp cast-iron roasted fermented rice crepe with potato masala and fresh coconut chutney.',
  },
  {
    id: 2,
    title: 'Heritage Layered Parotta',
    category: 'TIFFIN',
    src: '/images/menu/parotta.jpg',
    description: 'Flaky, hand-stretched multi-layered parotta paired with aromatic spiced salna.',
  },
  {
    id: 3,
    title: 'Chettinad Pepper Chicken',
    category: 'NON_VEG',
    src: '/images/menu/pepper-chicken.jpg',
    description: 'Slow-roasted chicken with cracked black peppercorns and aromatic curry leaves.',
  },
  {
    id: 4,
    title: 'Paneer Butter Masala',
    category: 'GRAVIES',
    src: '/images/menu/paneer-butter-masala.jpg',
    description: 'Fresh artisanal cottage cheese cubes in rich cashew-tomato velvet gravy.',
  },
  {
    id: 5,
    title: 'Coastal Crispy Prawn Fry',
    category: 'SEAFOOD',
    src: '/images/menu/prawn-fry.jpg',
    description: 'Fresh sea prawns marinated in stone-ground red masala and pan-fried to crisp perfection.',
  },
  {
    id: 6,
    title: 'Crispy Chilli Chicken',
    category: 'NON_VEG',
    src: '/images/menu/chilli-chicken.jpg',
    description: 'Wok-tossed chicken chunks with green chillies, shallots, and spicy garlic reduction.',
  },
  {
    id: 7,
    title: 'Gobi Manchurian Fry',
    category: 'GRAVIES',
    src: '/images/menu/gobi-manchurian.jpg',
    description: 'Crunchy cauliflower florets tossed with ginger, coriander, and sweet-spicy glaze.',
  },
  {
    id: 8,
    title: 'Traditional Tandoori & Tikka',
    category: 'NON_VEG',
    src: '/images/menu/chicken-tikka.jpg',
    description: 'Clay-oven charred tender spiced boneless chicken skewers.',
  },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const filtered = activeCategory === 'ALL'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  return (
    <div className="gallery-page page-container" style={{ padding: '3rem 1rem' }}>
      <header style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
        <span
          style={{
            fontSize: '0.85rem',
            color: 'var(--cafe-terracotta)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontWeight: 'bold',
          }}
        >
          Visual Feast • Chidambaram
        </span>
        <h1
          style={{
            fontFamily: 'var(--cafe-font-primary)',
            fontSize: '2.8rem',
            color: 'var(--cafe-espresso)',
            margin: '0.4rem 0 0.8rem',
          }}
        >
          Culinary Craft & Ambience Gallery
        </h1>
        <p style={{ color: 'var(--cafe-text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Glimpses into our tawa roasts, sizzling clay-oven grills, stone-ground curries, and time-honored hospitality.
        </p>
      </header>

      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {[
          { id: 'ALL', label: 'All Photographs' },
          { id: 'TIFFIN', label: 'Tiffin & Dosas' },
          { id: 'NON_VEG', label: 'Special Non-Veg' },
          { id: 'GRAVIES', label: 'Rich Gravies' },
          { id: 'SEAFOOD', label: 'Coastal Seafood' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            style={{
              padding: '8px 20px',
              borderRadius: '24px',
              border: activeCategory === tab.id ? '2px solid var(--cafe-terracotta)' : '1px solid #dec0b5',
              background: activeCategory === tab.id ? 'var(--cafe-terracotta)' : 'var(--cafe-ivory)',
              color: activeCategory === tab.id ? '#fff' : 'var(--cafe-espresso)',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
        }}
      >
        {filtered.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            style={{
              background: '#fffdf9',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid #e8dfd3',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
          >
            <div style={{ height: '220px', overflow: 'hidden' }}>
              <img
                src={photo.src}
                alt={photo.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '1.15rem', margin: '0 0 6px', color: 'var(--cafe-espresso)' }}>
                {photo.title}
              </h3>
              <p style={{ color: 'var(--cafe-text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: '1.5' }}>
                {photo.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(29, 27, 24, 0.85)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              maxWidth: '680px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
            />
            <div style={{ padding: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '0 0 8px', color: 'var(--cafe-espresso)' }}>
                {selectedPhoto.title}
              </h2>
              <p style={{ color: 'var(--cafe-text-muted)', margin: '0 0 1.5rem', lineHeight: '1.6' }}>
                {selectedPhoto.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/menu" className="btn btn-primary" onClick={() => setSelectedPhoto(null)}>
                  Order This Dish Now
                </Link>
                <button className="btn btn-secondary" onClick={() => setSelectedPhoto(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
