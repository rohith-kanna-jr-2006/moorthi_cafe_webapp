import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AddEditFood = () => {
  const { id } = useParams(); // For edit mode: /admin/edit-food/:id
  const [isEditMode, setIsEditMode] = useState(!!id);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    portion: '',
    prepTimeMinutes: '',
    isVeg: true,
    isAvailable: true,
    tags: '',
    imageUrl: '',
    imagePreview: null
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [descriptionChars, setDescriptionChars] = useState(0);
  const [tagsArray, setTagsArray] = useState([]);

  // Validation errors
  const [formErrors, setFormErrors] = useState({});

  // Load data when component mounts
  useEffect(() => {
    loadCategories();
    if (isEditMode && id) {
      loadFoodData(id);
    }
  }, [isEditMode, id]);

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadFoodData = async (foodId) => {
    try {
      setLoading(true);
      const response = await api.getFoodById(foodId);
      if (response.success && response.data) {
        const food = response.data.food || response.data;
        const categoryId = food.category && typeof food.category === 'object' ? food.category._id : (food.category || '');
        setFormData({
          name: food.name || '',
          description: food.description || '',
          price: food.price !== undefined ? food.price.toString() : '',
          category: categoryId,
          portion: food.portion || '',
          prepTimeMinutes: food.prepTimeMinutes !== undefined ? food.prepTimeMinutes.toString() : '',
          isVeg: food.isVeg !== undefined ? food.isVeg : true,
          isAvailable: food.isAvailable !== undefined ? food.isAvailable : true,
          tags: Array.isArray(food.tags) ? food.tags.join(', ') : '',
          imageUrl: food.imageUrl || '',
          imagePreview: food.imageUrl ? food.imageUrl : null
        });
        setDescriptionChars((food.description || '').length);
        setTagsArray(Array.isArray(food.tags) ? food.tags : []);
      }
    } catch (err) {
      setError('Failed to load food data');
      console.error('Failed to load food data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update character count for description
    if (name === 'description') {
      setDescriptionChars(value.length);
    }

    // Update tags array
    if (name === 'tags') {
      setTagsArray(value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0));
    }

    // Update image preview
    if (name === 'imageUrl' && value) {
      setFormData(prev => ({
        ...prev,
        imagePreview: value
      }));
    } else if (name === 'imageUrl' && !value) {
      setFormData(prev => ({
        ...prev,
        imagePreview: null
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Dish name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }

    if (!formData.price.trim()) {
      errors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum < 0) {
        errors.price = 'Price must be a valid positive number';
      }
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (!formData.portion.trim()) {
      errors.portion = 'Portion size is required';
    }

    if (!formData.prepTimeMinutes.trim()) {
      errors.prepTimeMinutes = 'Preparation time is required';
    } else {
      const prepTime = parseInt(formData.prepTimeMinutes);
      if (isNaN(prepTime) || prepTime < 1) {
        errors.prepTimeMinutes = 'Preparation time must be at least 1 minute';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('moorthi_token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Prepare food data for submission
      const foodData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        portion: formData.portion.trim(),
        prepTimeMinutes: parseInt(formData.prepTimeMinutes),
        isVeg: formData.isVeg,
        isAvailable: formData.isAvailable,
        tags: tagsArray,
        imageUrl: formData.imageUrl || ''
      };

      let response;
      if (isEditMode && id) {
        // Update existing food
        response = await api.updateFood(id, foodData, token);
      } else {
        // Create new food
        response = await api.createFood(foodData, token);
      }

      if (response.success) {
        setSuccessMessage(response.message || 'Operation successful!');
        // Redirect to menu management after success
        setTimeout(() => {
          navigate('/admin/menu-management');
        }, 2000);
      } else {
        throw new Error(response.message || 'Operation failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during the operation');
      console.error('Operation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/menu-management');
  };

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="add-edit-food">
            <div className="page-header">
              <h1>{isEditMode ? 'Edit Food' : 'Add Food'}</h1>
              <div className="header-meta">
                <div className="meta-item">
                  <span className="meta-label">Terminal:</span>
                  <span className="meta-value">CHD-CTR-01</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Unit:</span>
                  <span className="meta-value">Chidambaram Central Counter</span>
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

            {successMessage && (
              <div className="alert alert-success">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="food-form">
              {/* Basic Information */}
              <div className="form-section">
                <h2>Basic Information</h2>

                <div className="form-group">
                  <label htmlFor="name">Dish Name <span className="required-mark">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter dish name"
                    required
                    className={formErrors.name ? 'error-input' : ''}
                  />
                  {formErrors.name && (
                    <span className="error-message">{formErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description <span className="required-mark">*</span></label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter dish description"
                    maxLength="500"
                    required
                    className={formErrors.description ? 'error-input' : ''}
                  />
                  <div className="char-counter">
                    {descriptionChars}/500 characters
                  </div>
                  {formErrors.description && (
                    <span className="error-message">{formErrors.description}</span>
                  )}
                </div>
              </div>

              {/* Classification & Availability */}
              <div className="form-section">
                <h2>Classification & Availability</h2>

                <div className="form-group">
                  <label htmlFor="category">Category <span className="required-mark">*</span></label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={formErrors.category ? 'error-input' : ''}
                  >
                    <option value="">Select category...</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <span className="error-message">{formErrors.category}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="portion">Portion Size <span className="required-mark">*</span></label>
                  <input
                    type="text"
                    id="portion"
                    name="portion"
                    value={formData.portion}
                    onChange={handleChange}
                    placeholder="e.g., 1 Plate, 2 Pcs"
                    required
                    className={formErrors.portion ? 'error-input' : ''}
                  />
                  {formErrors.portion && (
                    <span className="error-message">{formErrors.portion}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isVeg"
                      checked={formData.isVeg}
                      onChange={handleChange}
                    />
                    Vegetarian Dish
                  </label>
                </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleChange}
                      />
                      Available for Ordering
                    </label>
                  </div>
              </div>

              {/* Preparation Details */}
              <div className="form-section">
                <h2>Preparation Details</h2>

                <div className="form-group">
                  <label htmlFor="price">Price (₹) <span className="required-mark">*</span></label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      required
                      className={formErrors.price ? 'error-input' : ''}
                    />
                  </div>
                  {formErrors.price && (
                    <span className="error-message">{formErrors.price}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="prepTimeMinutes">Preparation Time (mins) <span className="required-mark">*</span></label>
                  <input
                    type="number"
                    id="prepTimeMinutes"
                    name="prepTimeMinutes"
                    value={formData.prepTimeMinutes}
                    onChange={handleChange}
                    min="1"
                    placeholder="15"
                    required
                    className={formErrors.prepTimeMinutes ? 'error-input' : ''}
                  />
                  {formErrors.prepTimeMinutes && (
                    <span className="error-message">{formErrors.prepTimeMinutes}</span>
                  )}
                </div>
              </div>

              {/* Tags & Image */}
              <div className="form-section">
                <h2>Tags & Image</h2>

                <div className="form-group">
                  <label htmlFor="tags">Tags (comma-separated)</label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., chef-special, wood-fired, pure-ghee"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrl">Dish Image URL</label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Enter image URL or upload below"
                  />

                  <div className="image-upload-section">
                    <label className="upload-btn">
                      Choose Image File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {formData.imagePreview && (
                      <div className="image-preview">
                        <img src={formData.imagePreview} alt="Dish preview" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              imageUrl: '',
                              imagePreview: null
                            }));
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-footer">
                <div className="action-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEditMode ? 'Update Food' : 'Add Food'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddEditFood;