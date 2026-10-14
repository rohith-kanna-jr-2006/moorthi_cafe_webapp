import React, { useState } from 'react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Morning Tiffin', description: 'Breakfast items like idli, dosa, vada', itemCount: 8, status: 'active' },
    { id: 2, name: 'Afternoon Meals & Thali', description: 'Lunch meals, thalis, biryanis', itemCount: 5, status: 'active' },
    { id: 3, name: 'Evening Snacks', description: 'Snacks, bonda, bajji, sundal', itemCount: 6, status: 'active' },
    { id: 4, name: 'Traditional Sweets', description: 'Mysore pak, jilebi, laddu', itemCount: 3, status: 'active' },
    { id: 5, name: 'Kaapi & Beverages', description: 'Filter coffee, tea, juices, buttermilk', itemCount: 2, status: 'active' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, {
      id: Date.now(),
      ...newCategory,
      itemCount: 0,
      status: 'active'
    }]);
    setShowAddForm(false);
  };

  const handleUpdateCategory = (updatedCategory) => {
    setCategories(categories.map(category =>
      category.id === editCategoryId ? { ...category, ...updatedCategory } : category
    ));
    setShowEditForm(false);
    setEditCategoryId(null);
  };

  const handleDeleteCategory = (id) => {
    setDeleteCategoryId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setCategories(categories.filter(category => category.id !== deleteCategoryId));
    setShowDeleteConfirm(false);
    setDeleteCategoryId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteCategoryId(null);
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

            {/* Stats Overview */}
            <div className="category-stats">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Categories</h3>
                  <p className="stat-value">{categories.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Categories</h3>
                  <p className="stat-value">{categories.filter(c => c.status === 'active').length}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Items</h3>
                  <p className="stat-value">{categories.reduce((sum, c) => sum + c.itemCount, 0)}</p>
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
              <div className="categories-grid">
                {categories.map(category => (
                  <div key={category.id} className={`category-card ${category.status === 'active' ? 'category-active' : 'category-inactive'}`}>
                    <div className="category-header">
                      <h3 className="category-name">{category.name}</h3>
                      <span className="category-status-badge {category.status}">
                        {category.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="category-content">
                      <p className="category-description">{category.description}</p>
                      <div className="category-meta">
                        <span className="meta-item">
                          <span className="meta-label">Items:</span>
                          <span className="meta-value">{category.itemCount}</span>
                        </span>
                      </div>
                    </div>
                    <div className="category-actions">
                      <button onClick={() => {
                        setEditCategoryId(category.id);
                        setShowEditForm(true);
                      }} className="btn btn-secondary btn-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCategory(category.id)} className="btn btn-danger btn-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Category Form */}
            {showAddForm && (
              <div className="category-form">
                <h2>Add New Category</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Simulate form submission
                  alert('Category added successfully!');
                  setShowAddForm(false);
                }}>
                  <div className="form-group">
                    <label>Category Name:</label>
                    <input type="text" required placeholder="e.g., Breakfast Specials" />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea required placeholder="Brief description of the category" rows="3" />
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
                  // Simulate form submission
                  alert('Category updated successfully!');
                  setShowEditForm(false);
                  setEditCategoryId(null);
                }}>
                  <div className="form-group">
                    <label>Category Name:</label>
                    <input
                      type="text"
                      defaultValue={categories.find(c => c.id === editCategoryId)?.name || ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      defaultValue={categories.find(c => c.id === editCategoryId)?.description || ''}
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
                    "Are you sure you want to permanently remove "{categories.find(c => c.id === deleteCategoryId)?.name || 'Category'}"? This action cannot be undone."
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