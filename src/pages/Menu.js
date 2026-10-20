import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { addToCart } from '../utils/cartStorage';

const Menu = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedItemMessage, setAddedItemMessage] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, vegOnly]);

  const fetchInitialData = async () => {
    try {
      const catRes = await api.getCategories();
      if (catRes.success && catRes.data) {
        setCategories(catRes.data.categories || []);
      }
    } catch (err) {
      console.warn('Could not load categories:', err);
    }
  };

  const HERITAGE_FALLBACK_FOODS = [
    {
      _id: 'food-dosa-1',
      name: 'Golden Ghee Roast Masala Dosa',
      nameTamil: 'நெய் ரோஸ்ட் மசாலா தோசை',
      category: { name: 'Morning Tiffin', slug: 'tiffin' },
      description: 'Paper-thin, golden-crisp fermented rice-lentil crepe anointed with aromatic churned desi ghee and spiced potato masala.',
      imageUrl: '/images/menu/dosa.jpg',
      price: 160,
      isVeg: true,
      portion: '1 Large Dosa',
      prepTimeMinutes: 12
    },
    {
      _id: 'food-idli-1',
      name: 'Podi Thatte Idli (2 Pcs)',
      nameTamil: 'பொடி தட்டே இட்லி',
      category: { name: 'Morning Tiffin', slug: 'tiffin' },
      description: 'Plump, pillowy steamed rice cakes drenched in fiery gun powder podi and fragrant wood-pressed sesame oil.',
      imageUrl: '/images/menu/kal-dosa.svg',
      price: 110,
      isVeg: true,
      portion: '2 Pcs',
      prepTimeMinutes: 10
    },
    {
      _id: 'food-kaapi-1',
      name: 'Kumbakonam Degree Filter Kaapi',
      nameTamil: 'கும்பகோணம் டிகிரி பில்டர் காபி',
      category: { name: 'Degree Kaapi & Drinks', slug: 'beverages' },
      description: 'First decoction Chicory-blended brew pulled with rich frothy cow milk in traditional brass davarah-tumbler.',
      imageUrl: '/images/menu/cup-of-onion.svg',
      price: 45,
      isVeg: true,
      portion: '1 Davarah Set (150ml)',
      prepTimeMinutes: 5
    },
    {
      _id: 'food-vada-1',
      name: 'Crispy Medu Vada (2 Pcs)',
      nameTamil: 'மெது வடை',
      category: { name: 'Morning Tiffin', slug: 'tiffin' },
      description: 'Golden-fried spiced lentil fritters with crispy exterior and fluffy interior, served with fresh coconut & tomato chutneys.',
      imageUrl: '/images/menu/roast.svg',
      price: 80,
      isVeg: true,
      portion: '2 Pcs',
      prepTimeMinutes: 8
    },
    {
      _id: 'food-thali-1',
      name: 'South Indian Heritage Thali',
      nameTamil: 'தென் இந்திய பாரம்பரிய சாப்பாடு',
      category: { name: 'Lunch Thalis & Meals', slug: 'meals' },
      description: 'Steaming ponni rice, drumstick sambar, rasam, kootu, poriyal, appalam, curd, and sweet elaneer payasam.',
      imageUrl: '/images/menu/veg-pulao.svg',
      price: 220,
      isVeg: true,
      portion: 'Full Thali (Banana Leaf)',
      prepTimeMinutes: 15
    },
    {
      _id: 'food-chicken-1',
      name: 'Chettinad Pepper Chicken',
      nameTamil: 'செட்டிநாடு மிளகு சிக்கன்',
      category: { name: 'Lunch Thalis & Meals', slug: 'non-veg' },
      description: 'Tender country chicken slow-roasted with black tellicherry peppercorns, curry leaves, and stone-ground spices.',
      imageUrl: '/images/menu/pepper-chicken.jpg',
      price: 250,
      isVeg: false,
      portion: 'Serves 2',
      prepTimeMinutes: 20
    },
    {
      _id: 'food-parotta-1',
      name: 'Madurai Bun Parotta (2 Pcs)',
      nameTamil: 'மதுரை பன் பரோட்டா',
      category: { name: 'Evening Tiffin & Snacks', slug: 'tiffin' },
      description: 'Fluffy, multi-layered spiral bread toasted on cast-iron griddle with desi ghee, served with rich kurma.',
      imageUrl: '/images/menu/parotta.jpg',
      price: 90,
      isVeg: true,
      portion: '2 Pcs',
      prepTimeMinutes: 12
    },
    {
      _id: 'food-biryani-1',
      name: 'Ambur Seeraga Samba Biryani',
      nameTamil: 'ஆம்பூர் சீரக சம்பா பிரியாணி',
      category: { name: 'Lunch Thalis & Meals', slug: 'biryani' },
      description: 'Fragrant short-grain seeraga samba rice simmered with tender mutton cuts, mint, curd, and dried chili paste.',
      imageUrl: '/images/menu/chicken-biryani.jpg',
      price: 320,
      isVeg: false,
      portion: '1 Plate with Dalcha & Raita',
      prepTimeMinutes: 18
    },
    {
      _id: 'food-prawn-1',
      name: 'Coastal Masala Prawn Fry',
      nameTamil: 'கடற்கரை இறால் வறுவல்',
      category: { name: 'Lunch Thalis & Meals', slug: 'seafood' },
      description: 'Fresh catch estuary prawns tossed with freshly pounded ginger, garlic, shallots, and crushed coriander seeds.',
      imageUrl: '/images/menu/prawn-fry.jpg',
      price: 280,
      isVeg: false,
      portion: '1 Plate (12 Pcs)',
      prepTimeMinutes: 15
    },
    {
      _id: 'food-rava-1',
      name: 'Special Onion Rava Masala Dosa',
      nameTamil: 'வெங்காய ரவா மசாலா தோசை',
      category: { name: 'Morning Tiffin', slug: 'tiffin' },
      description: 'Lacy, ultra-crispy semolina crepe studded with crushed black pepper, cumin seeds, ginger, green chilies, and sweet onions.',
      imageUrl: '/images/menu/onion-dosa.svg',
      price: 150,
      isVeg: true,
      portion: '1 Large Dosa',
      prepTimeMinutes: 15
    }
  ];

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { limit: 100 };
      if (selectedCategory !== 'ALL') {
        params.category = selectedCategory;
      }
      if (vegOnly) {
        params.isVeg = true;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      const res = await api.getFoods(params);
      if (res.success && res.data && res.data.foods && res.data.foods.length > 0) {
        setFoods(res.data.foods);
      } else {
        // Fallback to authentic curated dishes when live database seed is pending approval
        let fallback = HERITAGE_FALLBACK_FOODS;
        if (vegOnly) {
          fallback = fallback.filter(f => f.isVeg);
        }
        if (selectedCategory !== 'ALL') {
          fallback = fallback.filter(f => f.category?.slug === selectedCategory || f.category?._id === selectedCategory);
        }
        setFoods(fallback);
      }
    } catch (err) {
      console.warn('API error, using heritage menu items:', err);
      let fallback = HERITAGE_FALLBACK_FOODS;
      if (vegOnly) {
        fallback = fallback.filter(f => f.isVeg);
      }
      setFoods(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFoods();
  };

  const handleAddToCartClick = (food, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(food, 1);
    setAddedItemMessage(`Added "${food.name}" to tray!`);
    setTimeout(() => setAddedItemMessage(''), 2500);
  };

  const filteredFoods = foods.filter((f) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const nameMatch = (f.name || '').toLowerCase().includes(q);
    const tamilMatch = (f.nameTamil || '').toLowerCase().includes(q);
    const descMatch = (f.description || '').toLowerCase().includes(q);
    return nameMatch || tamilMatch || descMatch;
  });

  return (
    <div className="menu-page page-container" style={{ padding: '2.5rem 1rem' }}>
      {/* Heritage Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
        <span
          style={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--cafe-terracotta)',
            fontWeight: 'bold',
          }}
        >
          Traditional Woodfire & Tawa Fare
        </span>
        <h1
          style={{
            fontFamily: 'var(--cafe-font-primary)',
            fontSize: '2.75rem',
            color: 'var(--cafe-espresso)',
            margin: '0.4rem 0 0.8rem',
          }}
        >
          Our Authentic Menu
        </h1>
        <p style={{ color: 'var(--cafe-text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Stone-ground idlis, crispy ghee roasts, authentic tiffin dishes, rich gravies, and aromatic biryanis crafted
          with time-honored recipes.
        </p>
      </div>

      {addedItemMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--cafe-leaf)',
            color: '#ffffff',
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
          <span>{addedItemMessage}</span>
          <Link to="/cart" style={{ color: '#fff', marginLeft: '12px', textDecoration: 'underline' }}>
            View Tray →
          </Link>
        </div>
      )}

      {/* Search and Dietary Filter Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ flex: '1', minWidth: '280px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search stoneground dosas, Podi idli, biryani, kaapi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Search
          </button>
        </form>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            background: vegOnly ? 'rgba(10, 108, 68, 0.12)' : 'var(--cafe-ivory)',
            border: vegOnly ? '2px solid var(--cafe-leaf)' : '1px solid #dec0b5',
            padding: '8px 16px',
            borderRadius: '24px',
            fontWeight: '600',
            color: vegOnly ? 'var(--cafe-leaf)' : 'var(--cafe-espresso)',
          }}
        >
          <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
          <span>🌱 Pure Vegetarian Only</span>
        </label>
      </div>

      {/* Category Pills Scroller */}
      <div
        className="category-pills-bar"
        style={{
          display: 'flex',
          gap: '0.75rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '2.5rem',
          scrollbarWidth: 'thin',
        }}
      >
        <button
          onClick={() => setSelectedCategory('ALL')}
          style={{
            padding: '8px 20px',
            borderRadius: '24px',
            border: selectedCategory === 'ALL' ? '2px solid var(--cafe-terracotta)' : '1px solid #dec0b5',
            background: selectedCategory === 'ALL' ? 'var(--cafe-terracotta)' : 'var(--cafe-ivory)',
            color: selectedCategory === 'ALL' ? '#ffffff' : 'var(--cafe-espresso)',
            fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: '0.95rem',
          }}
        >
          All Dishes
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id || cat.slug}
            onClick={() => setSelectedCategory(cat.slug || cat._id)}
            style={{
              padding: '8px 20px',
              borderRadius: '24px',
              border: selectedCategory === (cat.slug || cat._id) ? '2px solid var(--cafe-terracotta)' : '1px solid #dec0b5',
              background: selectedCategory === (cat.slug || cat._id) ? 'var(--cafe-terracotta)' : 'var(--cafe-ivory)',
              color: selectedCategory === (cat.slug || cat._id) ? '#ffffff' : 'var(--cafe-espresso)',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontSize: '0.95rem',
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Dishes Grid */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--cafe-text-muted)' }}>Preparing authentic dishes from kitchen database...</p>
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
          <button className="btn btn-primary" onClick={fetchFoods} style={{ marginTop: '1rem' }}>
            Retry Loading Menu
          </button>
        </div>
      ) : filteredFoods.length === 0 ? (
        <div
          style={{
            background: 'var(--cafe-ivory)',
            border: '1px solid #e8dfd3',
            borderRadius: 'var(--surface-radius-card)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '56px', color: 'var(--cafe-text-muted)' }}>
            restaurant_menu
          </span>
          <h2 style={{ fontFamily: 'var(--cafe-font-primary)', margin: '1rem 0' }}>No matching dishes found</h2>
          <p style={{ color: 'var(--cafe-text-muted)' }}>Try adjusting your search keywords or category filters.</p>
        </div>
      ) : (
        <div
          className="foods-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '2rem',
          }}
        >
          {filteredFoods.map((food) => (
            <div
              key={food._id}
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
              <Link to={`/item-details?id=${food._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ position: 'relative', height: '190px', background: '#f8f3ed', overflow: 'hidden' }}>
                  {food.imageUrl ? (
                    <img
                      src={food.imageUrl}
                      alt={food.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--cafe-terracotta)',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
                        restaurant
                      </span>
                    </div>
                  )}

                  {/* Dietary Veg/Non-Veg Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#ffffff',
                      padding: '4px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      lineHeight: 0,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        border: `2px solid ${food.isVeg ? '#0a6c44' : '#c05621'}`,
                        padding: '1px',
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
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--cafe-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      fontWeight: 'bold',
                    }}
                  >
                    {food.category?.name || 'Heritage Fare'}
                  </span>

                  <h3
                    style={{
                      fontFamily: 'var(--cafe-font-primary)',
                      fontSize: '1.25rem',
                      color: 'var(--cafe-espresso)',
                      margin: '0.25rem 0',
                    }}
                  >
                    {food.name}
                  </h3>

                  {food.nameTamil && (
                    <div style={{ fontSize: '0.9rem', color: 'var(--cafe-text-muted)', marginBottom: '0.5rem' }}>
                      {food.nameTamil}
                    </div>
                  )}

                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--cafe-text-muted)',
                      lineHeight: '1.4',
                      margin: '0 0 1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {food.description || 'Authentic dish prepared fresh daily with pure ghee and freshly ground aromatic spices.'}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--cafe-terracotta)' }}>
                        ₹{(food.price || 0).toFixed(2)}
                      </span>
                      {Array.isArray(food.variants) && food.variants.length > 0 && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--cafe-leaf)' }}>
                          Variants available
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={(e) => handleAddToCartClick(food, e)}
                      style={{ padding: '6px 16px', fontSize: '0.9rem', fontWeight: 'bold' }}
                    >
                      + Add to Tray
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
