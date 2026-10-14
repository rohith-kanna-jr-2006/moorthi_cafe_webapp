import React from 'react';

const Gallery = () => {
  // Illustrative data - label as demo data
  const galleryImages = [
    { src: 'https://via.placeholder.com/600x400?text=Dining+Area', alt: 'Dining area' },
    { src: 'https://via.placeholder.com/600x400?text=Food+Preparation', alt: 'Food preparation' },
    { src: 'https://via.placeholder.com/600x400?text=Traditional+Dishes', alt: 'Traditional dishes' },
    { src: 'https://via.placeholder.com/600x400?text=Coffee+Serving', alt: 'Coffee serving' },
    { src: 'https://via.placeholder.com/600x400?text=Banana+Leaf+Serving', alt: 'Banana leaf serving' },
    { src: 'https://via.placeholder.com/600x400?text=Restaurant+Interior', alt: 'Restaurant interior' },
  ];

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="section-title">
            <h2>Our Gallery</h2>
            <p>Glance into the ambiance and dishes of Hotel New Moorthi Cafe</p>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="gallery-item">
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
          <div className="alert alert-info">
            <strong>Note:</strong> Gallery images are illustrative (demo) and not connected to the backend API yet.
          </div>
        </section>
      </div>
    </div>
  );
};

export default Gallery;
