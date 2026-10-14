import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MenuManagement = () => {
  const [dishes, setDishes] = useState([
    {
      id: 1,
      code: 'DSH-001',
      name: 'Golden Ghee Roast Masala Dosa',
      category: 'Tiffin',
      price: '₹160.00',
      prepTime: '8‑10 mins',
      stock: 'In Counter Stock',
      description: 'Fermented lentil crepe roasted in A2 Cow Ghee, spiced potato mash filling.',
      image: 'https://via.placeholder.com/300x200?text=Golden+Ghee+Roast+Masala+Dosa',
      status: 'active'
    },
    {
      id: 2,
      code: 'DSH-002',
      name: 'Podi Thatte Idli (Plate of 2)',
      category: 'Tiffin',
      price: '₹110.00',
      prepTime: '6‑8 mins',
      stock: 'In Counter Stock',
      description: 'Thick steamed rice cakes topped with heritage Malgudi gun powder podi.',
      image: 'https://via.placeholder.com/300x200?text=Podi+Thatte+Idli',
      status: 'active'
    },
    {
      id: 3,
      code: 'DSH-003',
      name: 'South Indian Raja Thali',
      category: 'Meals',
      price: '₹280.00',
      prepTime: '12‑15 mins',
      stock: 'In Counter Stock',
      description: '14-item royal noon spread with heirloom kootu, rasam, and payasam.',
      image: 'https://via.placeholder.com/300x200?text=South+Indian+Raja+Thali',
      status: 'active'
    },
    {
      id: 4,
      code: 'DSH-004',
      name: 'Chettinad Mushroom Biryani',
      category: 'Meals',
      price: '₹220.00',
      prepTime: '10‑12 mins',
      stock: 'In Counter Stock',
      description: 'Seeraga samba rice cooked in stone-ground Chettinad masala spices.',
      image: 'https://via.placeholder.com/300x200?text=Chettinad+Mushroom+Biryani',
      status: 'active'
    },
    {
      id: 5,
      code: 'DSH-005',
      name: 'Kumbakonam Degree Filter Kaapi',
      category: 'Beverage',
      price: '₹45.00',
      prepTime: '3‑5 mins',
      stock: 'In Counter Stock',
      description: '80:20 Plantation A chicory decoction with frothy farm buffalo milk.',
      image: 'https://via.placeholder.com/300x200?text=Kumbakonam+Degree+Filter+Kaapi',
      status: 'active'
    },
    {
      id: 6,
      code: 'DSH-006',
      name: 'Melt-in-Mouth Ghee Mysore Pak (250g)',
      category: 'Sweets',
      price: '₹190.00',
      stock: 'Sold Out / Disabled',
      description: 'Slow cooked besan flour, sugar, cardamom and pure churned cow ghee.',
      image: 'https://via.placeholder.com/300x200?text=Melt-in-Mouth+Ghee+Mysore+Pak',
      status: 'inactive'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteDishId, setDeleteDishId] = useState(null);

  const categories = [
    'Morning Tiffin',
    'Afternoon Meals & Thali',
    'Evening Snacks',
    'Traditional Sweets',
    'Kaapi & Beverages'
  ];

  const handleDelete = (id) => {
    setDeleteDishId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setDishes(dishes.filter(dish => dish.id !== deleteDishId));
    setShowDeleteConfirm(false);
    setDeleteDishId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteDishId(null);
  };

  const handleAddDish = (newDish) => {
    setDishes([...dishes, {
      id: Date.now(),
      code: `DSH-${String(dishes.length + 1).padStart(3, '0')}`,
      ...newDish,
      status: 'active'
    }]);
    setShowAddForm(false);
  };

  const stats = {
    totalDishes: dishes.length,
    liveCounterReady: dishes.filter(dish => dish.status === 'active').length,
    soldOutPaused: dishes.filter(dish => dish.status === 'inactive').length,
    avgPrepTime: '9.5 Mins' // This would be calculated from actual data
  };

  const categoryCounts = {
    'Morning Tiffin': dishes.filter(dish => dish.category === 'Morning Tiffin').length,
    'Afternoon Meals & Thali': dishes.filter(dish => dish.category === 'Afternoon Meals & Thali').length,
    'Evening Snacks': dishes.filter(dish => dish.category === 'Evening Snacks').length,
    'Traditional Sweets': dishes.filter(dish => dish.category === 'Traditional Sweets').length,
    'Kaapi & Beverages': dishes.filter(dish => dish.category === 'Kaapi & Beverages').length
  };

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="menu-management">
            <div className="menu-management-header">
              <h1>Menu Management</h1>
              <div className="menu-management-meta">
                <div className="meta-item">
                  <span className="meta-label">Terminal ID:</span>
                  <span className="meta-value">CHD-CTR-01</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Storefront:</span>
                  <span className="meta-value">Chidambaram Heritage Unit</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Schedule:</span>
                  <span className="meta-value">scheduleToday | Shift A (06:00 - 15:00)</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Manager:</span>
                  <span className="meta-value">S. Ramanathan Counter Manager</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Kitchen Inventory:</span>
                  <span className="meta-value">v3.2 Terminal: CHD-CTR-01 info Illustrative Prototype Menu Catalog</span>
                </div>
              </div>
            </div>

            {/* Menu Overview */}
            <div className="menu-overview">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Total Dishes</h3>
                  <p className="overview-value">{stats.totalDishes}</p>
                </div>
                <div className="overview-card">
                  <h3>Live Counter Ready</h3>
                  <p className="overview-value">{stats.liveCounterReady}</p>
                </div>
                <div className="overview-card">
                  <h3>Sold Out / Paused</h3>
                  <p className="overview-value">{stats.soldOutPaused}</p>
                </div>
                <div className="overview-card">
                  <h3>Average Prep Time</h3>
                  <p className="overview-value">{stats.avgPrepTime}</p>
                </div>
              </div>

              <div className="categories-overview">
                <h3>Categories</h3>
                <div className="categories-grid">
                  {Object.entries(categoryCounts).map(([category, count]) => (
                    <div key={category} className="category-card">
                      <h4>{category}</h4>
                      <p className="category-count">{count} items</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dish List */}
            <div className="dish-list-section">
              <h2>Dish List</h2>
              <div className="dish-list-grid">
                {dishes.map(dish => (
                  <div key={dish.id} className={`dish-card ${dish.status === 'active' ? 'dish-active' : 'dish-inactive'}`}>
                    <div className="dish-header">
                      <div className="dish-code">{dish.code}</div>
                      <div className="dish-status-badge {dish.status}">
                        {dish.status === 'active' ? 'In Counter Stock' : 'Sold Out / Disabled'}
                      </div>
                    </div>
                    <div className="dish-content">
                      <h3 className="dish-name">{dish.name}</h3>
                      <p className="dish-category">{dish.category}</p>
                      <p className="dish-price">{dish.price}</p>
                      <p className="dish-preptime">{dish.prepTime}</p>
                      <p className="dish-description">{dish.description}</p>
                      <div className="dish-image">
                        <img src={dish.image} alt={dish.name} />
                      </div>
                    </div>
                    <div className="dish-actions">
                      <Link to={`/admin/edit-food/${dish.id}`} className="btn btn-secondary btn-sm">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(dish.id)} className="btn btn-danger btn-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Food Dish Form */}
            {showAddForm && (
              <div className="add-dish-form">
                <h2>Add New Food Dish</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // In a real app, this would submit to backend
                  alert('New dish added successfully!');
                  setShowAddForm(false);
                }}>
                  <div className="form-group">
                    <label>Dish Name: (Heritage & English)</label>
                    <input type="text" required />
                  </div>
                  <div className="form-group">
                    <label>Category:</label>
                    <select required>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Dish Code / SKU:</label>
                    <input type="text" required />
                  </div>
                  <div className="form-group">
                    <label>Selling Price (₹ INR):</label>
                    <input type="number" step="0.01" required />
                  </div>
                  <div className="form-group">
                    <label>Est. Prep Time (Mins):</label>
                    <input type="number" required />
                  </div>
                  <div className="form-group">
                    <label>Culinary Description:</label>
                    <textarea required>Crispy paper dosa smeared with house special Chidambaram podi and roasted with golden ghee.</textarea>
                  </div>
                  <div className="form-group">
                    <label>Dish Imagery:</label>
                    <input type="file" accept="image/*" />
                    <p className="form-help">Click to upload food photo (recommended 800x800 JPG/PNG)</p>
                  </div>
                  <div className="form-group certifications">
                    <label>
                      <input type="checkbox" checked /> 100% Pure Vegetarian Certified
                    </label>
                    <label>
                      <input type="checkbox" checked /> Include 5% Restaurant GST
                    </label>
                    <label>
                      <input type="checkbox" /> Mark as Counter Signature Special
                    </label>
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save to Kitchen Catalog
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Remove Dish Confirmation */}
            {showDeleteConfirm && (
              <div className="delete-confirm-modal">
                <div className="modal-content">
                  <h2>Remove Dish Confirmation</h2>
                  <p>
                    "Are you sure you want to permanently remove "{dishes.find(d => d.id === deleteDishId)?.name || 'Dish'}" from the active counter terminals? This action cannot be undone."
                  </p>
                  <div className="modal-actions">
                    <button onClick={handleDeleteCancel} className="btn btn-secondary">
                      Keep Dish
                    </button>
                    <button onClick={handleDeleteConfirm} className="btn btn-danger">
                      Remove Dish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MenuManagement;