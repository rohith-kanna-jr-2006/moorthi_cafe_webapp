import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../utils/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      setError('Failed to load categories. Please check your connection and try again.');
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      const token = localStorage.getItem('moorthi_token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await api.createCategory(newCategory, token);
      if (response.success) {
        setCategories(prev => [...prev, response.data.category]);
        setShowAddForm(false);
      } else {
        throw new Error(response.message || 'Failed to create category');
      }
    } catch (err) {
      alert(err.message || 'Error creating category');
      console.error('Failed to create category:', err);
    }
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      const token = localStorage.getItem('moorthi_token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await api.updateCategory(editCategoryId, updatedCategory, token);
      if (response.success) {
        setCategories(prev => prev.map(category =>
          category._id === editCategoryId ? response.data.category : category
        ));
        setShowEditForm(false);
        setEditCategoryId(null);
      } else {
        throw new Error(response.message || 'Failed to update category');
      }
    } catch (err) {
      alert(err.message || 'Error updating category');
      console.error('Failed to update category:', err);
    }
  };

  const handleDeleteCategory = (id) => {
    setDeleteCategoryId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('moorthi_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await api.deleteCategory(deleteCategoryId, token);
      if (response.success) {
        setCategories(prev => prev.filter(category => category._id !== deleteCategoryId));
        setShowDeleteConfirm(false);
        setDeleteCategoryId(null);
      } else {
        throw new Error(response.message || 'Failed to delete category');
      }
    } catch (err) {
      alert(err.message || 'Error deleting category');
      console.error('Failed to delete category:', err);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteCategoryId(null);
  };

  const stats = {
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.isAvailable !== false).length,
    totalItems: categories.reduce((sum, c) => sum + (c.itemCount || 0), 0)
  };

  return (
    <AdminLayout pageTitle="Menu Category Management" pageDescription="Organize daypart menus, counter service shifts, and display sorting for tiffin dining.">
      <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--stitch-tertiary-fixed)', color: 'var(--stitch-on-tertiary-fixed)', padding: '1rem', borderRadius: '0.5rem' }}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span className="font-label-md text-label-md font-semibold">Illustrative Prototype Categories</span>
        </div>
      </div>

      <div className="stitch-dashboard-banner" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="stitch-banner-overline">
            <span>Catalog Management</span>
            <span>•</span>
            <span>Service Dayparts</span>
          </div>
          <h1 className="stitch-banner-title">Menu Category Management</h1>
          <p className="stitch-banner-desc">Organize daypart menus, counter service shifts, and display sorting for tiffin dining</p>
        </div>
      </div>

      <div className="stitch-kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar secondary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Live Service Categories</span>
              <span className="stitch-kpi-value">{stats.totalCategories}</span>
            </div>
            <div className="stitch-kpi-icon-box secondary">
              <span className="material-symbols-outlined text-[24px]">soup_kitchen</span>
            </div>
          </div>
          <div className="stitch-kpi-footer-bar">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">check_circle</span> Active on Kiosks
            </span>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar primary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Total Linked Dishes</span>
              <span className="stitch-kpi-value">{stats.totalItems} Items</span>
            </div>
            <div className="stitch-kpi-icon-box primary">
              <span className="material-symbols-outlined text-[24px]">restaurant_menu</span>
            </div>
          </div>
          <div className="stitch-kpi-footer-bar">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">restaurant_menu</span> Across {categories.length} groups
            </span>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar tertiary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Current Active Shift</span>
              <span className="stitch-kpi-value">Morning Tiffin</span>
            </div>
            <div className="stitch-kpi-icon-box tertiary">
              <span className="material-symbols-outlined text-[24px]">timelapse</span>
            </div>
          </div>
          <div className="stitch-kpi-footer-bar">
            <span className="text-tertiary font-semibold">Shift Window: until 11:30 AM</span>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar error"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Deactivated / Seasonal</span>
              <span className="stitch-kpi-value">{categories.filter(c => c.isAvailable === false).length}</span>
            </div>
            <div className="stitch-kpi-icon-box" style={{ backgroundColor: 'var(--stitch-surface-container-high)', color: 'var(--stitch-on-surface-variant)' }}>
              <span className="material-symbols-outlined text-[24px]">event_busy</span>
            </div>
          </div>
          <div className="stitch-kpi-footer-bar">
            <span className="text-outline font-semibold">Festival Special Thali</span>
          </div>
        </div>
      </div>

      <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Search categories, timing batches, or dish counts..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <button className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-xs whitespace-nowrap">
              All Categories ({categories.length})
            </button>
            <button className="px-3.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors">
              Tiffin Hours
            </button>
            <button className="px-3.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors">
              All-Day Counters
            </button>
            <button className="px-3.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container font-label-md text-label-md whitespace-nowrap transition-colors">
              Inactive ({categories.filter(c => c.isAvailable === false).length})
            </button>
          </div>
        </div>
      </div>

      <div className="stitch-card-panel" style={{ overflow: 'hidden' }}>
        {loading && !error && (
          <div className="stitch-card-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ display: 'inline-block', width: '2.5rem', height: '2.5rem', border: '3px solid var(--stitch-surface-container-high)', borderTopColor: 'var(--stitch-primary)', borderRadius: '50%', animation: 'stitchSpin 1s infinite linear' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--stitch-on-surface-variant)', fontWeight: 600 }}>Loading category data...</p>
          </div>
        )}

        {!loading && error && (
          <div className="stitch-card-panel" style={{ borderLeft: '4px solid var(--stitch-error)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--stitch-error)', fontSize: '2rem' }}>error</span>
              <div>
                <h3 style={{ margin: 0, color: 'var(--stitch-on-surface)', fontSize: '1.25rem' }}>Failed to Load Categories</h3>
                <p style={{ margin: '0.25rem 0 0', color: 'var(--stitch-on-surface-variant)' }}>{error}</p>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button className="stitch-action-btn primary" onClick={loadCategories}>
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="stitch-card-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--stitch-on-surface-variant)' }}>
              category
            </span>
            <h3 style={{ marginTop: '1rem', color: 'var(--stitch-on-surface)' }}>No categories found.</h3>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <>
            <div className="hidden lg:block">
              <table className="stitch-orders-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Order</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Category Details & Timings</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Operational Daypart</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Assigned Items</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Visibility</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category._id} style={{ borderBottom: '1px solid var(--stitch-surface-container-high)', transition: 'background-color 0.2s ease' }}>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span className="material-symbols-outlined text-outline/60 cursor-grab hover:text-primary transition-colors text-[20px]" title="Drag to reorder">drag_indicator</span>
                        <span className="w-6 h-6 rounded-md bg-surface-container-high flex items-center justify-center font-label-sm text-label-sm font-bold text-on-surface">{index + 1}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0 shadow-xs">
                            <span className="material-symbols-outlined text-[24px]">bakery_dining</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-title-md text-title-md font-bold text-on-surface truncate">{category.name}</span>
                              <span className={`w-2 h-2 rounded-full ${category.isAvailable !== false ? 'bg-secondary' : 'bg-outline'}`}></span>
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
                              {category.startTime && category.endTime ? `${category.startTime} – ${category.endTime}` : 'All Day'}
</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md font-semibold text-on-surface">{category.slug === 'tiffin' ? 'Breakfast Rush' : category.slug === 'meals' ? 'Lunch Service' : category.slug === 'snacks' ? 'Evening Snacks' : category.slug === 'sweets' ? 'Dessert Hour' : 'Beverages'}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{category.isAvailable !== false ? 'Live Now' : 'Paused'} • Counter #{index + 1}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface font-title-md text-title-md font-bold">
                          <span className="material-symbols-outlined text-primary text-[18px]">flatware</span>
                          <span>{category.itemCount || 0} Active Dishes</span>
                        </div>
                      </div>
                    </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          aria-checked={category.isAvailable !== false}
                          className="w-11 h-6 rounded-full bg-secondary transition-colors relative flex items-center p-0.5"
                          role="switch"
                          onClick={() => {}}
                        >
                          <span className="w-5 h-5 rounded-full bg-on-secondary shadow-md transform translate-x-5 transition-transform"></span>
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="stitch-icon-btn" title="Edit Category" onClick={() => { setEditCategoryId(category._id); setShowEditForm(true); }}>
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button className="stitch-action-btn secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }} onClick={() => {}}>
                            <span className="material-symbols-outlined text-[16px]">menu_book</span>
                            <span>Dishes</span>
                          </button>
                          <button className="stitch-icon-btn" title="Deactivate Category" style={{ color: 'var(--stitch-error)' }} onClick={() => handleDeleteCategory(category._id)}>
                            <span className="material-symbols-outlined text-[20px]">pause_circle</span>
                          </button>
                      </div>
                    </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:hidden">
                {categories.map((category, index) => (
                  <div key={category._id} className={`category-item ${category.isAvailable !== false ? 'category-active' : 'category-inactive'}`} style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--stitch-surface-container-lowest)', borderRadius: '0.75rem', boxShadow: 'var(--stitch-shadow-card)', border: '1px solid var(--stitch-outline-variant)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-[24px]">bakery_dining</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-title-md text-title-md font-bold text-on-surface truncate">{category.name}</span>
                          <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${category.isAvailable !== false ? 'bg-secondary text-on-secondary' : 'bg-outline text-on-surface'} font-semibold`}>
                            {category.isAvailable !== false ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
                          {category.startTime && category.endTime ? `${category.startTime} – ${category.endTime}` : 'All Day'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-label-md text-label-md font-semibold text-on-surface">{category.slug === 'tiffin' ? 'Breakfast Rush' : category.slug === 'meals' ? 'Lunch Service' : category.slug === 'snacks' ? 'Evening Snacks' : category.slug === 'sweets' ? 'Dessert Hour' : 'Beverages'}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Counter #{index + 1}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface font-title-md text-title-md font-bold">
                          <span className="material-symbols-outlined text-primary text-[18px]">flatware</span>
                          <span>{category.itemCount || 0} Active Dishes</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { setEditCategoryId(category._id); setShowEditForm(true); }} className="btn btn-secondary btn-sm">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteCategory(category._id)} className="btn btn-danger btn-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              </div>
            </div>
          </div>
        </AdminLayout>
      );
    };

    export default CategoryManagement;