import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  // Load initial data
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

  // Stats calculation - using API response fields
  const stats = {
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.isAvailable !== false).length,
    totalItems: categories.reduce((sum, c) => sum + (c.itemCount || 0), 0)
  };

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="category-management">
            <div className="category-management-header">
              <h1>Category Management</h1>
              <div className="category-management-meta">
                <div className="meta-item">
                  <span className="meta-label">Terminal:</span>
                  <span className="meta-value">CHD-CTR-01</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Storefront:</span>
                  <span className="meta-value">Chidambaram Heritage Unit</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-error">
                {error}
                <button onClick={loadCategories} className="btn btn-sm btn-link">
                  Retry
                </button>
              </div>
            )}

            {/* Stats Overview */}
            <div className="category-stats">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Categories</h3>
                  <p className="stat-value">{stats.totalCategories}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Categories</h3>
                  <p className="stat-value">{stats.activeCategories}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Items</h3>
                  <p className="stat-value">{stats.totalItems}</p>
                </div>
              </div>
            </div>

            {/* Add Category Button */}
            <div className="add-category-btn">
              <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                Add New Category
              </button>
            </div>

            {/* Categories List */}
            <div className="categories-list">
              <h2>Category List</h2>
              {loading && !error && (
                <div className="loading-state">
                  Loading categories...
                </div>
              )}

              {!loading && categories.length === 0 && !error && (
                <div className="empty-state">
                  No categories found.
                </div>
              )}

              {!loading && categories.length > 0 && (
                <div className="categories-grid">
                  {categories.map(category => (
                    <div key={category._id} className={`category-card ${category.isAvailable !== false ? 'category-active' : 'category-inactive'}`}>
                      <div className="category-header">
                        <h3 className="category-name">{category.name}</h3>
                        <span className="category-status-badge {category.isAvailable !== false ? 'active' : 'inactive'}">
                          {category.isAvailable !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="category-content">
                        <p className="category-description">{category.description}</p>
                        <div className="category-meta">
                          <span className="meta-item">
                            <span className="meta-label">Items:</span>
                            <span className="meta-value">{category.itemCount || 0}</span>
                          </span>
                        </div>
                      </div>
                      <div className="category-actions">
                        <button onClick={() => {
                          setEditCategoryId(category._id);
                          setShowEditForm(true);
                        }} className="btn btn-secondary btn-sm">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteCategory(category._id)} className="btn btn-danger btn-sm">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Category Form */}
            {showAddForm && (
              <div className="category-form">
                <h2>Add New Category</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();

                  // Basic validation
                  const nameInput = e.target.elements.name;
                  const descInput = e.target.elements.description;

                  if (!nameInput.value.trim()) {
                    alert('Category name is required');
                    nameInput.focus();
                    return;
                  }

                  if (!descInput.value.trim()) {
                    alert('Description is required');
                    descInput.focus();
                    return;
                  }

                  const newCategory = {
                    name: nameInput.value.trim(),
                    description: descInput.value.trim(),
                    isAvailable: true
                  };

                  handleAddCategory(newCategory);
                }}>
                  <div className="form-group">
                    <label>Category Name:</label>
                    <input type="text" name="name" required placeholder="e.g., Breakfast Specials" />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea name="description" required placeholder="Brief description of the category" rows="3" />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Category
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Category Form */}
            {showEditForm && editCategoryId !== null && (
              <div className="category-form">
                <h2>Edit Category</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();

                  // Basic validation
                  const nameInput = e.target.elements.name;
                  const descInput = e.target.elements.description;

                  if (!nameInput.value.trim()) {
                    alert('Category name is required');
                    nameInput.focus();
                    return;
                  }

                  if (!descInput.value.trim()) {
                    alert('Description is required');
                    descInput.focus();
                    return;
                  }

                  const updatedCategory = {
                    name: nameInput.value.trim(),
                    description: descInput.value.trim()
                  };

                  handleUpdateCategory(updatedCategory);
                }}>
                  <div className="form-group">
                    <label>Category Name:</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={categories.find(c => c._id === editCategoryId)?.name || ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      name="description"
                      defaultValue={categories.find(c => c._id === editCategoryId)?.description || ''}
                      required
                      rows="3"
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => {
                      setShowEditForm(false);
                      setEditCategoryId(null);
                    }} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Category
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className="delete-confirm-modal">
                <div className="modal-content">
                  <h2>Remove Category Confirmation</h2>
                  <p>
                    "Are you sure you want to permanently remove "{categories.find(c => c._id === deleteCategoryId)?.name || 'Category'}"? This action cannot be undone."
                  </p>
                  <div className="modal-actions">
                    <button onClick={handleDeleteCancel} className="btn btn-secondary">
                      Keep Category
                    </button>
                    <button onClick={handleDeleteConfirm} className="btn btn-danger">
                      Remove Category
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

export default CategoryManagement;