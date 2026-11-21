import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
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

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return '₹' + num.toLocaleString('en-IN');
  };

  return (
    <AdminLayout pageTitle="Food Menu Management" pageDescription="Update dishes, pricing, live counter availability, and kitchen inventory for Chidambaram Heritage dining room and takeaway counters.">
      {/* Prototype Banner */}
      <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--stitch-tertiary-fixed)', color: 'var(--stitch-on-tertiary-fixed)', padding: '1rem', borderRadius: '0.5rem' }}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span className="font-label-md text-label-md font-semibold">Illustrative Prototype Menu Catalog</span>
        </div>
      </div>

      {/* Header */}
      <div className="stitch-dashboard-banner" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="stitch-banner-overline">
            <span>Kitchen Inventory v3.2</span>
            <span>•</span>
            <span>Terminal: CHD-CTR-01</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">info</span>
              Illustrative Prototype Menu Catalog
            </span>
          </div>
          <h1 className="stitch-banner-title">Food Menu Management</h1>
          <p className="stitch-banner-desc">Update dishes, pricing, live counter availability, and kitchen inventory for Chidambaram Heritage dining room and takeaway counters.
        </p>
        </div>
      </div>

      {/* Quick Stats Bar (Bento Metrics) */}
      <div className="stitch-kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar primary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Total Catalog</span>
              <span className="stitch-kpi-value">{dishes.length} Dishes</span>
            </div>
            <div className="stitch-kpi-icon-box primary">
              <span className="material-symbols-outlined text-[22px]">restaurant_menu</span>
            </div>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar secondary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Live Counter Ready</span>
              <span className="stitch-kpi-value">{dishes.filter(d => d.isAvailable).length} Active</span>
            </div>
            <div className="stitch-kpi-icon-box secondary">
              <span className="material-symbols-outlined text-[22px]">check_circle</span>
            </div>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar error"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Sold Out / Paused</span>
              <span className="stitch-kpi-value">{dishes.filter(d => !d.isAvailable).length} Items</span>
            </div>
            <div className="stitch-kpi-icon-box error">
              <span className="material-symbols-outlined text-[22px]">block</span>
            </div>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar tertiary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Avg Prep Time</span>
              <span className="stitch-kpi-value">
                {dishes.length > 0 ? Math.round(dishes.reduce((sum, d) => sum + (d.prepTimeMinutes || 0), 0) / dishes.length) + ' mins' : '0 mins'}
              </span>
            </div>
            <div className="stitch-kpi-icon-box tertiary">
              <span className="material-symbols-outlined text-[22px]">timer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder-on-surface-variant/70 font-body-sm text-body-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              id="menuSearchInput"
              onChange={handleSearchChange}
              placeholder="Search by dish name, code or ingredients..."
              value={searchTerm}
              type="text"
            />
            <button className="hidden absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface" id="searchClearBtn" onClick={() => setSearchTerm('')}>
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
            <div className="flex items-center bg-surface-container-high p-1 rounded-lg shrink-0">
              <button className={`px-3 py-1.5 rounded-md font-label-md text-label-md font-semibold ${!selectedCategory ? 'bg-surface-container-lowest text-on-surface shadow-xs transition-all' : 'text-on-surface-variant hover:text-on-surface transition-all'}`} onClick={() => setSelectedCategory('')}>
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category._id}
                  className={`px-3 py-1.5 rounded-md font-label-md text-label-md font-semibold ${selectedCategory === category.slug ? 'bg-primary text-on-primary font-bold shadow-xs transition-all' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-all'} whitespace-nowrap`}
                  onClick={() => setSelectedCategory(category.slug)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Category Chips Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
          <button className={`category-chip ${!selectedCategory ? 'active' : ''} px-3.5 py-1.5 rounded-full font-label-md text-label-md font-bold ${!selectedCategory ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'} transition-all flex items-center gap-1.5 whitespace-nowrap`} onClick={() => setSelectedCategory('')}>
            <span>All Items</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{dishes.length}</span>
          </button>
          {categories.map(category => (
            <button key={category._id} className={`category-chip ${selectedCategory === category.slug ? 'active' : ''} px-3.5 py-1.5 rounded-full font-label-md text-label-md font-semibold ${selectedCategory === category.slug ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'} transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs`} onClick={() => setSelectedCategory(category.slug)}>
              <span className="material-symbols-outlined text-[16px]" style={{ color: category.slug === 'tiffin' ? 'var(--stitch-primary)' : category.slug === 'meals' ? 'var(--stitch-tertiary)' : category.slug === 'snacks' ? 'var(--stitch-secondary)' : category.slug === 'sweets' ? 'var(--stitch-tertiary-container)' : 'var(--stitch-primary)' }}>{category.slug === 'tiffin' ? 'breakfast_dining' : category.slug === 'meals' ? 'dinner_dining' : category.slug === 'snacks' ? 'bakery_dining' : category.slug === 'sweets' ? 'cookie' : 'coffee'}</span>
              <span>{category.name}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container-high text-[10px] text-on-surface-variant">{dishes.filter(d => d.category?._id === category._id).length}</span>
            </button>
          ))}
        </div>
        </div>
        {/* MAIN CATALOG VIEW */}
        <div className="stitch-card-panel" style={{ overflow: 'hidden' }}>
          {loading && !error && (
            <div className="stitch-card-panel" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ display: 'inline-block', width: '2.5rem', height: '2.5rem', border: '3px solid var(--stitch-surface-container-high)', borderTopColor: 'var(--stitch-primary)', borderRadius: '50%', animation: 'stitchSpin 1s infinite linear' }}></div>
              <p style={{ marginTop: '1rem', color: 'var(--stitch-on-surface-variant)', fontWeight: 600 }}>Loading menu data from database...</p>
            </div>
          )}

          {!loading && error && (
            <div className="stitch-card-panel" style={{ borderLeft: '4px solid var(--stitch-error)', padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--stitch-error)', fontSize: '2rem' }}>error</span>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--stitch-on-surface)', fontSize: '1.25rem' }}>Failed to Load Menu</h3>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--stitch-on-surface-variant)' }}>{error}</p>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="stitch-action-btn primary" onClick={loadMenuData}>
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                  <span>Retry</span>
                </button>
              </div>
            </div>
          )}

          {!loading && !error && filteredDishes.length === 0 && (
            <div className="stitch-card-panel" style={{ textAlign: 'center', padding: '3rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--stitch-on-surface-variant)' }}>
                restaurant_menu
              </span>
              <h3 style={{ marginTop: '1rem', color: 'var(--stitch-on-surface)' }}>No dishes match the current filters.</h3>
            </div>
          )}

          {!loading && !error && filteredDishes.length > 0 && (
            <div className="stitch-table-wrapper">
              <table className="stitch-orders-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Dish</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Prep Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDishes.map(dish => (
                    <tr key={dish._id} style={{ borderBottom: '1px solid var(--stitch-surface-container-high)', transition: 'background-color 0.2s ease' }}>
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="stitch-item-thumb" style={{ backgroundColor: 'var(--stitch-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ color: 'var(--stitch-on-surface-variant)' }}>restaurant</span>
                          </div>
                          <div>
                            <strong style={{ fontSize: '0.875rem', color: 'var(--stitch-on-surface)', display: 'block' }}>{dish.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--stitch-on-surface-variant)' }}>{dish.category?.name || 'Uncategorized'}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                        {dish.category?.name || 'Uncategorized'}
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                        <strong style={{ color: 'var(--stitch-primary)', display: 'block' }}>
                          {formatCurrency(dish.price || 0)}
                        </strong>
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                        {dish.prepTimeMinutes} mins
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                        <span className={`stitch-status-badge ${dish.isAvailable ? 'ready' : 'pending'}`}>
                          {dish.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <Link
                            to={`/admin/edit-food/${dish._id}`}
                            className="stitch-icon-btn"
                            style={{ display: 'inline-flex', width: '2rem', height: '2rem' }}
                            title="Edit Dish"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(dish._id)}
                            className="stitch-icon-btn"
                            style={{ display: 'inline-flex', width: '2rem', height: '2rem', color: 'var(--stitch-error)' }}
                            disabled={loading}
                            title="Delete Dish"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  };

  export default MenuManagement;