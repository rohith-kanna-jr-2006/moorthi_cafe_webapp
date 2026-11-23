import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../utils/api';

const AddEditFood = () => {
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(!!id);
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [descriptionChars, setDescriptionChars] = useState(0);
  const [tagsArray, setTagsArray] = useState([]);

  const [formErrors, setFormErrors] = useState({});

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

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'description') {
      setDescriptionChars(value.length);
    }

    if (name === 'tags') {
      setTagsArray(value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0));
    }

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
        response = await api.updateFood(id, foodData, token);
      } else {
        response = await api.createFood(foodData, token);
      }

      if (response.success) {
        setSuccessMessage(response.message || 'Operation successful!');
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

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return '₹' + num.toLocaleString('en-IN');
  };

  return (
    <AdminLayout pageTitle={isEditMode ? 'Edit Food' : 'Add Food'} pageDescription="Add a new South Indian specialty or modify existing counter recipes, spice levels, and live pricing.">
      <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--stitch-tertiary-fixed)', color: 'var(--stitch-on-tertiary-fixed)', padding: '1rem', borderRadius: '0.5rem' }}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span className="font-label-md text-label-md font-semibold">Illustrative Prototype Dish Form</span>
        </div>
      </div>

      <div className="stitch-dashboard-banner" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="stitch-banner-overline">
            <span>Menu Master CMS</span>
            <span>•</span>
            <span>SKU: CHD-TIF-042</span>
          </div>
          <h1 className="stitch-banner-title">{isEditMode ? 'Edit Food' : 'Add Food'}</h1>
          <p className="stitch-banner-desc">Add a new South Indian specialty or modify existing counter recipes, spice levels, and live pricing.
        </p>
        </div>
      </div>

      {successMessage && (
        <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--stitch-secondary-fixed)', color: 'var(--stitch-on-secondary)', padding: '1rem', borderRadius: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--stitch-error)', padding: '1rem', backgroundColor: 'var(--stitch-error-container)', color: 'var(--stitch-on-error)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="food-form">
        <div className="stitch-card-panel" style={{ marginBottom: '1.5rem' }}>
          <div className="stitch-panel-header">
            <div className="stitch-panel-icon-box">
              <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
            </div>
            <div>
              <h2 className="stitch-panel-title">Basic Information</h2>
              <p className="stitch-panel-subtitle">Core dish identification and description</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant font-semibold flex items-center gap-1" for="dish-name">
                Dish Name <span className="text-error">*</span>
              </label>
              <input
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md outline-none focus:bg-surface-container-lowest shadow-inner transition-all"
                id="dish-name"
                name="name"
                placeholder="Enter dish name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {formErrors.name && (
                <span className="error-message" style={{ color: 'var(--stitch-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant font-semibold flex items-center justify-between" for="dish-desc">
                Description
                <span className="text-[11px] text-outline font-normal">Optional</span>
              </label>
              <textarea
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container-lowest shadow-inner transition-all resize-none"
                id="dish-desc"
                name="description"
                placeholder="Describe stoneground spices, preparation style, and heritage aroma..."
                rows="3"
                value={formData.description}
                onChange={handleChange}
              />
              <div className="char-counter" style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--stitch-on-surface-variant)' }}>
                {descriptionChars}/500 chars
              </div>
              {formErrors.description && (
                <span className="error-message" style={{ color: 'var(--stitch-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.description}</span>
              )}
            </div>
          </div>
        </div>

        <div className="stitch-card-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="stitch-panel-header">
              <div className="stitch-panel-icon-box">
                <span className="material-symbols-outlined text-[20px]">category</span>
              </div>
              <div>
                <h2 className="stitch-panel-title">Classification & Availability</h2>
                <p className="stitch-panel-subtitle">Menu categorization and counter availability</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-semibold" for="dish-category">
                  Category <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md outline-none focus:bg-surface-container-lowest shadow-inner pr-10 cursor-pointer"
                    id="dish-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category...</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">expand_more</span>
                </div>
                {formErrors.category && (
                  <span className="error-message" style={{ color: 'var(--stitch-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.category}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-semibold" for="dish-portion">
                  Portion Size <span className="text-error">*</span>
                </label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md outline-none focus:bg-surface-container-lowest shadow-inner transition-all"
                  id="dish-portion"
                  name="portion"
                  value={formData.portion}
                  onChange={handleChange}
                  placeholder="e.g., 1 Plate, 2 Pcs"
                  required
                />
                {formErrors.portion && (
                  <span className="error-message" style={{ color: 'var(--stitch-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.portion}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVeg"
                  name="isVeg"
                  checked={formData.isVeg}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-secondary accent-secondary cursor-pointer"
                />
                <label htmlFor="isVeg" className="font-label-md text-label-md text-on-surface-variant font-semibold">Vegetarian Dish</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-secondary accent-secondary cursor-pointer"
                />
                <label htmlFor="isAvailable" className="font-label-md text-label-md text-on-surface-variant font-semibold">Available for Ordering</label>
              </div>
            </div>
          </div>

          <div className="stitch-card-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="stitch-panel-header">
              <div className="stitch-panel-icon-box">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <div>
                <h2 className="stitch-panel-title">Preparation Details</h2>
                <p className="stitch-panel-subtitle">Pricing and timing for kitchen operations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-semibold flex items-center justify-between" for="base-price">
                  Price (₹) <span className="text-error">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-on-surface font-title-md text-title-md font-bold">₹</span>
                  <input
                    type="number"
                    id="base-price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md font-bold outline-none focus:bg-surface-container-lowest shadow-inner"
                  />
                  {formErrors.price && (
                    <span className="error-message" style={{ color: 'var(--stitch-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.price}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-semibold" for="dish-tax">
                  GST Tax Bracket
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md outline-none focus:bg-surface-container-lowest shadow-inner pr-10 cursor-pointer"
                    id="dish-tax"
                    name="tax"
                    value={formData.tax || '5'}
                    onChange={handleChange}
                  >
                    <option value="5">5% (Pure Veg AC/Non-AC)</option>
                    <option value="12">12% (Standard Packaged)</option>
                    <option value="0">0% (Nil / Raw Commodity)</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-semibold" for="prep-time">
                  Prep Duration (Mins)
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-outline text-[18px]">timer</span>
                  <input
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md outline-none focus:bg-surface-container-lowest shadow-inner"
                    id="prep-time"
                    name="prepTimeMinutes"
                    value={formData.prepTimeMinutes}
                    onChange={handleChange}
                    min="1"
                    placeholder="15"
                    required
                  />
                  {formErrors.prepTimeMinutes && (
                    <span className="error-message" style={{ color: 'var(--stitch-error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{formErrors.prepTimeMinutes}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">Special Eco Packaging Fee</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Areca nut palm leaf plates</span>
                </div>
                <div className="relative w-28">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface font-title-md text-title-md font-bold">₹</span>
                  <input
                    className="w-full pl-7 pr-2.5 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-title-md text-title-md font-bold outline-none text-right shadow-sm"
                    id="pack-fee"
                    name="packFee"
                    type="number"
                    value={formData.packFee || 15}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">Spice Meter Level</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Gunpowder intensity</span>
                </div>
                <div className="flex items-center gap-1.5 bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                  <span className="material-symbols-outlined text-[18px] text-outline opacity-40">local_fire_department</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-bold ml-1">Medium</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stitch-card-panel" style={{ marginBottom: '1.5rem' }}>
            <div className="stitch-panel-header">
              <div className="stitch-panel-icon-box">
                <span className="material-symbols-outlined text-[20px]">local_offer</span>
              </div>
              <div>
                <h2 className="stitch-panel-title">Tags & Image</h2>
                <p className="stitch-panel-subtitle">Search tags and dish photography</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-semibold" for="tags">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., chef-special, wood-fired, pure-ghee"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md outline-none focus:bg-surface-container-lowest shadow-inner transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface-variant font-semibold" for="imageUrl">
                  Dish Image URL
                </label>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL or upload below"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-title-md text-title-md outline-none focus:bg-surface-container-lowest shadow-inner transition-all"
                />

                <div className="image-upload-section">
                  <label className="upload-btn stitch-action-btn secondary" style={{ display: 'inline-flex', width: 'auto' }}>
                    Choose Image File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {formData.imagePreview && (
                    <div className="image-preview" style={{ marginTop: '1rem', position: 'relative', display: 'inline-block' }}>
                      <img src={formData.imagePreview} alt="Dish preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem', boxShadow: 'var(--stitch-shadow-card)' }} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--stitch-error-container)', color: 'var(--stitch-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
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
        </div>

        <div className="stitch-actions-row" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="button"
              className="stitch-action-btn secondary"
              onClick={handleCancel}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="stitch-action-btn primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={{ width: '1rem', height: '1rem', border: '2px solid currentColor', borderRightColor: 'transparent', borderRadius: '50%', animation: 'stitchSpin 1s infinite linear' }}></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">{isEditMode ? 'save' : 'add_circle'}</span>
                  <span>{isEditMode ? 'Update Food' : 'Add Food'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </AdminLayout>
    );
  };

  export default AddEditFood;