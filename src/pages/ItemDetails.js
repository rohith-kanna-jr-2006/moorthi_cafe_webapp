import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { addToCart } from '../utils/cartStorage';

const ItemDetails = () => {
  const [searchParams] = useSearchParams();
  const foodId = searchParams.get('id');
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (foodId) {
      loadFood();
    } else {
      setError('No dish selected.');
      setLoading(false);
    }
  }, [foodId]);

  const loadFood = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getFoodById(foodId);
      if (res.success && res.data && res.data.food) {
        const item = res.data.food;
        setFood(item);
        if (Array.isArray(item.variants) && item.variants.length > 0) {
          setSelectedVariant(item.variants[0].name);
        }
      } else {
        setError('Dish not found in menu.');
      }
    } catch (err) {
      setError(err.message || 'Error fetching dish details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!food) return;
    addToCart(food, quantity, selectedVariant);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const currentPrice = () => {
    if (!food) return 0;
    if (selectedVariant && Array.isArray(food.variants)) {
      const v = food.variants.find((vr) => vr.name.toLowerCase() === selectedVariant.toLowerCase());
      if (v) return v.price;
    }
    return food.price || 0;
  };

  return (
    <div className="item-details-page page-container" style={{ padding: '3rem 1rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/menu" style={{ color: 'var(--cafe-terracotta)', textDecoration: 'none', fontWeight: 'bold' }}>
          ← Back to Menu
        </Link>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <p>Loading dish details...</p>
        </div>
      ) : error ? (
        <div
          style={{
            background: 'var(--cafe-ivory)',
            border: '1px solid #e8dfd3',
            borderRadius: 'var(--surface-radius-card)',
            padding: '3rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: 'var(--cafe-terracotta)', fontSize: '1.1rem' }}>{error}</p>
          <Link to="/menu" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Full Menu
          </Link>
        </div>
      ) : (
        <div
          className="item-details-card"
          style={{
            background: 'var(--cafe-ivory)',
            border: '1px solid #e8dfd3',
            borderRadius: 'var(--surface-radius-panel)',
            padding: '2.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '3rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Left: Dish Media */}
          <div>
            {food.imageUrl ? (
              <img
                src={food.imageUrl}
                alt={food.name}
                style={{
                  width: '100%',
                  maxHeight: '440px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  border: '1px solid #e8dfd3',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '360px',
                  borderRadius: '16px',
                  background: '#f2ede7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cafe-terracotta)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '72px' }}>
                  restaurant
                </span>
              </div>
            )}

            <div
              style={{
                marginTop: '1.5rem',
                background: 'rgba(10, 108, 68, 0.08)',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--cafe-leaf)',
                fontSize: '0.9rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                verified
              </span>
              <span>100% Authentic Heritage Recipe • Freshly Prepared</span>
            </div>
          </div>

          {/* Right: Dish Info & Purchasing Options */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  border: `2px solid ${food.isVeg ? '#0a6c44' : '#c05621'}`,
                  padding: '2px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: food.isVeg ? '#0a6c44' : '#c05621',
                  }}
                />
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--cafe-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                {food.category?.name || 'Heritage Special'}
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--cafe-font-primary)',
                fontSize: '2.4rem',
                color: 'var(--cafe-espresso)',
                margin: '0 0 0.5rem',
              }}
            >
              {food.name}
            </h1>

            {food.nameTamil && (
              <h2 style={{ fontSize: '1.3rem', color: 'var(--cafe-text-muted)', margin: '0 0 1.25rem', fontWeight: 'normal' }}>
                {food.nameTamil}
              </h2>
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--cafe-terracotta)' }}>
                ₹{currentPrice().toFixed(2)}
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--cafe-text-muted)' }}>
                + 5% GST & ₹15 Takeaway parcel charge
              </span>
            </div>

            <p style={{ color: 'var(--cafe-espresso)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              {food.description || 'Prepared fresh at Hotel New Moorthi Cafe with traditional stone-ground spices and authentic Chettinad/Tamil culinary heritage.'}
            </p>

            {/* Variants Selector (Bone vs Boneless etc.) */}
            {Array.isArray(food.variants) && food.variants.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--cafe-espresso)' }}>
                  Choose Portion / Variant:
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {food.variants.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => setSelectedVariant(v.name)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '24px',
                        border: selectedVariant === v.name ? '2px solid var(--cafe-terracotta)' : '1px solid #dec0b5',
                        background: selectedVariant === v.name ? 'var(--cafe-terracotta)' : '#fff',
                        color: selectedVariant === v.name ? '#fff' : 'var(--cafe-espresso)',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                      }}
                    >
                      {v.name} — ₹{v.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f8f3ed',
                  borderRadius: '8px',
                  border: '1px solid #e8dfd3',
                  padding: '4px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                >
                  -
                </button>
                <span style={{ padding: '0 16px', fontWeight: 'bold', fontSize: '1.1rem' }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                  }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddToCart}
                style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Add {quantity} to Tray • ₹{(currentPrice() * quantity).toFixed(2)}
              </button>
            </div>

            {addedMessage && (
              <div
                style={{
                  background: 'rgba(10, 108, 68, 0.1)',
                  color: 'var(--cafe-leaf)',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '1rem',
                }}
              >
                <span className="material-symbols-outlined">check_circle</span>
                <span>Added to tray!</span>
                <Link to="/cart" style={{ marginLeft: 'auto', color: 'var(--cafe-leaf)', textDecoration: 'underline' }}>
                  View Tray →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
