import React from 'react';
import { Link } from 'react-router-dom';

const FoodCard = ({ _id, id, name, nameTamil, description, imageUrl, image, price, pricePaise, isVeg = true, onAddToCart }) => {
  const displayId = _id || id;
  const displayImage = imageUrl || image;
  const displayPrice = price !== undefined ? (typeof price === 'number' ? `₹${price.toFixed(2)}` : price.startsWith('₹') ? price : `₹${price.replace(/^\$/, '')}`) : '₹0.00';

  return (
    <div
      className="food-card"
      style={{
        background: 'var(--cafe-ivory)',
        border: '1px solid #e8dfd3',
        borderRadius: 'var(--surface-radius-card)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <Link to={`/item-details?id=${displayId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', height: '180px', background: '#f8f3ed', overflow: 'hidden' }}>
          {displayImage ? (
            <img src={displayImage} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cafe-terracotta)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '44px' }}>restaurant</span>
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: '#ffffff',
              padding: '3px',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              lineHeight: 0,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                border: `2px solid ${isVeg ? '#0a6c44' : '#c05621'}`,
                padding: '1px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: isVeg ? '#0a6c44' : '#c05621',
                }}
              />
            </span>
          </div>
        </div>

        <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--cafe-font-primary)', fontSize: '1.15rem', color: 'var(--cafe-espresso)', margin: '0 0 4px' }}>
            {name}
          </h3>
          {nameTamil && (
            <div style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)', marginBottom: '6px' }}>{nameTamil}</div>
          )}
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--cafe-text-muted)',
              margin: '0 0 1rem',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </p>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--cafe-terracotta)' }}>
              {displayPrice}
            </span>
            {onAddToCart ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart({ _id: displayId, name, price: typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, '')), imageUrl: displayImage });
                }}
                style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: 'bold' }}
              >
                + Add
              </button>
            ) : (
              <span style={{ fontSize: '0.85rem', color: 'var(--cafe-terracotta)', fontWeight: 'bold' }}>
                View Dish →
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FoodCard;
