import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const MenuManagement = () => {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteDishId, setDeleteDishId] = useState(null);

  // Load initial data
  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const categoriesResponse = await api.getCategories();
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data.categories);
      }

      // Fetch foods (with limit 100 to show all items)
      const foodsResponse = await api.getFoods({ limit: 100 });
      if (foodsResponse.success) {
        setDishes(foodsResponse.data.foods);
      }
    } catch (err) {
      setError('Failed to load menu data. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleDelete = (id) => {
    setDeleteDishId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('moorthi_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.deleteFood(deleteDishId, token);

      if (response.success) {
        setDishes(dishes.filter(dish => dish._id !== deleteDishId));
        setShowDeleteConfirm(false);
        setDeleteDishId(null);
      } else {
        throw new Error(response.message || 'Failed to delete dish');
      }
    } catch (err) {
      alert(err.message || 'Error deleting dish');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteDishId(null);
  };

  const handleAddDish = () => {
    setShowAddForm(true);
  };

  const handleAddDishCancel = () => {
    setShowAddForm(false);
  };

  // Filter dishes based on search and category
  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory ||
                           (dish.category && dish.category.slug === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Stats calculation
  const stats = {
    totalDishes: dishes.length,
    liveCounterReady: dishes.filter(dish => dish.isAvailable).length,
    soldOutPaused: dishes.filter(dish => !dish.isAvailable).length,
    avgPrepTime: dishes.length > 0 ?
      Math.round(dishes.reduce((sum, dish) => sum + dish.prepTimeMinutes, 0) / dishes.length) + ' mins' :
      '0 mins'
  };

  const categoryCounts = {};
  categories.forEach(category => {
    categoryCounts[category.name] = dishes.filter(dish =>
      dish.category && dish.category._id === category._id
    ).length;
  });

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
                  <span className="meta-value">Shift A (06:00 - 15:00)</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Manager:</span>
                  <span className="meta-value">S. Ramanathan Counter Manager</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
                <button onClick={loadMenuData} className="btn btn-sm btn-link">
                  Retry
                </button>
              </div>
            )}

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

            {/* Search and Filter */}
            <div className="menu-filter">
              <div className="form-group">
                <label htmlFor="search">Search dishes <span className="required-mark">*</span></label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by name or description..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="category-filter">Filter by category</label>
                <select id="category-filter" value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category.slug}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dish List */}
            <div className="dish-list-section">
              <h2>Dish List ({filteredDishes.length} shown)</h2>
              {loading && !error && (
                <div className="loading-state">
                  Loading menu data...
                </div>
              )}

              {!loading && filteredDishes.length === 0 && !error && (
                <div className="empty-state">
                  No dishes match the current filters.
                </div>
              )}

              {!loading && filteredDishes.length > 0 && (
                <div className="dish-list-grid">
                  {filteredDishes.map(dish => (
                    <div key={dish._id} className={`dish-card ${dish.isAvailable ? 'dish-active' : 'dish-inactive'}`}>
                      <div className="dish-header">
                        <div className="dish-code">{dish._id.substring(0, 8)}</div>
                        <div className="dish-status-badge {dish.isAvailable ? 'active' : 'inactive'}">
                          {dish.isAvailable ? 'Available' : 'Unavailable'}
                        </div>
                      </div>
                      <div className="dish-content">
                        <h3 className="dish-name">{dish.name}</h3>
                        <p className="dish-category">{dish.category?.name || 'Uncategorized'}</p>
                        <p className="dish-price">₹{dish.price.toFixed(2)}</p>
                        <p className="dish-preptime">{dish.prepTimeMinutes} mins</p>
                        <p className="dish-description">{dish.description}</p>
                        <div className="dish-image">
                          {/* In a real app, you would show the dish image here */}
                          <div className="placeholder-image">
                            📷
                          </div>
                        </div>
                      </div>
                      <div className="dish-actions">
                        <Link to={`/admin/edit-food/${dish._id}`} className="btn btn-secondary btn-sm">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(dish._id)}
                          className="btn btn-danger btn-sm"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Food Dish Form */}
            {showAddForm && (
              <div className="add-dish-form">
                <h2>Add New Food Dish</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // In a real app, this would navigate to AddEditFood with create mode
                  alert('Navigate to Add/Edit Food page to create new dish');
                  setShowAddForm(false);
                }}>
                  <div className="form-group">
                    <label>Navigate to Add/Edit Food page</label>
                    <button type="button" onClick={() => {
                      setShowAddForm(false);
                      // In a real app, you would navigate to /admin/add-edit-food for create mode
                      // navigate('/admin/add-edit-food');
                    }} className="btn btn-primary">
                      Add New Dish
                    </button>
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={handleAddDishCancel} className="btn btn-secondary">
                      Cancel
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
                    "Are you sure you want to permanently remove "{dishes.find(d => d._id === deleteDishId)?.name || 'Dish'}" from the menu? This action cannot be undone."
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