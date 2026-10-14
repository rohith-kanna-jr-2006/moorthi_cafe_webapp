import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddEditFood = () => {
  const [formData, setFormData] = useState({
    dishName: '',
    regionalSubtitle: '',
    heritageDescription: '',
    menuCategory: '',
    portionSize: '',
    basePrice: '',
    gstBracket: '',
    prepDuration: '',
    ecoPackagingFee: '',
    spiceMeterLevel: 3,
    satvikVeg: true,
    gheePreparation: true,
    heritageRecipe: true,
    availableForOrdering: true,
    dishImage: null,
    dishImagePreview: null
  });

  const [validationWarning, setValidationWarning] = useState('');
  const [descriptionChars, setDescriptionChars] = useState(0);

  const menuCategories = [
    'Morning Tiffin',
    'Afternoon Lunch',
    'Evening Tiffin & Snacks',
    'Traditional Sweets',
    'Beverages & Filter Coffee'
  ];

  const gstOptions = [
    '5% (Pure Veg AC/Non-AC)',
    '12% (Standard Packaged)',
    '0% (Nil / Raw Commodity)'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'heritageDescription') {
      setDescriptionChars(value.length);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          dishImage: file,
          dishImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpiceMeterChange = (level) => {
    setFormData(prev => ({ ...prev, spiceMeterLevel: level }));
  };

  const validateForm = () => {
    if (!formData.dishName) {
      setValidationWarning('Dish Name (English) is required');
      return false;
    }
    if (!formData.basePrice) {
      setValidationWarning('Base Price (INR) is required');
      return false;
    }
    if (!formData.menuCategory) {
      setValidationWarning('Menu Category & Slot is required');
      return false;
    }
    setValidationWarning('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Simulate form submission
    console.log('Form submitted:', formData);

    // Show success message
    alert('Dish Published Synchronized to all 4 order counters & customer tablets.');
  };

  const getSpiceMeterDisplay = () => {
    return (
      <div className="spice-meter">
        <span className="spice-meter-label">Spice Level:</span>
        <div className="spice-meter-icons">
          {[1, 2, 3, 4, 5].map(level => (
            <button
              key={level}
              className={`spice-meter-icon ${level <= formData.spiceMeterLevel ? 'active' : ''}`}
              onClick={() => handleSpiceMeterChange(level)}
              aria-label={`Spice level ${level}`}
            >
              {level <= formData.spiceMeterLevel ? 'local_fire_department' : 'local_fire_department_outline'}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="add-edit-food">
            {/* Header */}
            <div className="page-header">
              <h1>Add/Edit Food</h1>
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

            {/* Validation Warning */}
            {validationWarning && (
              <div className="validation-warning">
                ⚠️ {validationWarning}
              </div>
            )}

            <form onSubmit={handleSubmit} className="food-form">
              {/* Dish Nomenclature */}
              <div className="form-section">
                <h2>Dish Nomenclature — General Info</h2>

                <div className="form-group">
                  <label>
                    Dish Name in English <span className="required-mark">*</span>
                  </label>
                  <input
                    type="text"
                    name="dishName"
                    value={formData.dishName}
                    onChange={handleInputChange}
                    placeholder="Heritage & English"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Regional Subtitle (Tamil)</label>
                  <input
                    type="text"
                    name="regionalSubtitle"
                    value={formData.regionalSubtitle}
                    onChange={handleInputChange}
                    placeholder="Optional"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Heritage Culinary Description
                    <span className="char-counter">
                      {descriptionChars}/200
                    </span>
                  </label>
                  <textarea
                    name="heritageDescription"
                    value={formData.heritageDescription}
                    onChange={handleInputChange}
                    placeholder="Crispy paper dosa smeared with house special Chidambaram podi and roasted with golden ghee."
                    maxLength={200}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Menu Category & Slot <span className="required-mark">*</span>
                  </label>
                  <select
                    name="menuCategory"
                    value={formData.menuCategory}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category...</option>
                    {menuCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Portion / Serving Size</label>
                  <input
                    type="text"
                    name="portionSize"
                    value={formData.portionSize}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 Pcs with 3 Chutneys & Sambar"
                  />
                </div>
              </div>

              {/* Financials & Preparation */}
              <div className="form-section">
                <h2>Financials & Preparation — Billing Engine</h2>

                <div className="form-group">
                  <label>
                    Base Price (INR) <span className="required-mark">*</span>
                  </label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      name="basePrice"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>GST Tax Bracket</label>
                  <select
                    name="gstBracket"
                    value={formData.gstBracket}
                    onChange={handleInputChange}
                  >
                    <option value="">Select GST bracket...</option>
                    {gstOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Prep Duration (Mins)</label>
                  <input
                    type="number"
                    name="prepDuration"
                    value={formData.prepDuration}
                    onChange={handleInputChange}
                    placeholder="e.g., 10"
                  />
                </div>

                <div className="form-group">
                  <label>Special Eco Packaging Fee</label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">₹</span>
                    <input
                      type="number"
                      name="ecoPackagingFee"
                      value={formData.ecoPackagingFee}
                      onChange={handleInputChange}
                      placeholder="e.g., 15"
                      step="0.01"
                    />
                  </div>
                  <p className="form-help">"Areca nut palm leaf plates" — prefix ₹</p>
                </div>

                <div className="form-group">
                  <label>Spice Meter Level</label>
                  {getSpiceMeterDisplay()}
                </div>
              </div>

              {/* Quality & Live Counter Status */}
              <div className="form-section">
                <h2>Quality & Live Counter Status — Kitchen Attributes</h2>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="satvikVeg"
                      checked={formData.satvikVeg}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-text">
                      100% Satvik Veg No garlic & onion
                    </span>
                  </label>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="gheePreparation"
                      checked={formData.gheePreparation}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-text">
                      Ghee Preparation A2 Cow Ghee
                    </span>
                  </label>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="heritageRecipe"
                      checked={formData.heritageRecipe}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-text">
                      Heritage Recipe 1952 Classic
                    </span>
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="availableForOrdering"
                      checked={formData.availableForOrdering}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-text">
                      Available for Immediate Ordering
                      <br />
                      <span className="checkbox-help">
                        Turn off if batter is depleted or during counter changeover.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Dish Photography */}
              <div className="form-section">
                <h2>Dish Photography</h2>

                <div className="image-upload-section">
                  <div className="image-upload-area">
                    {formData.dishImagePreview ? (
                      <div className="image-preview">
                        <img
                          src={formData.dishImagePreview}
                          alt="Dish preview"
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            dishImage: null,
                            dishImagePreview: null
                          }))}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="image-upload-placeholder">
                        <span className="upload-icon">📷</span>
                        <p>Drop crisp dish photograph here or browse files from counter device</p>
                        <p className="upload-formats">Supports JPG, PNG, WebP up to 4MB</p>
                        <label className="upload-btn">
                          Choose File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="image-actions">
                    <button type="button" className="action-btn">
                      Crop / Adjust
                    </button>
                    <button type="button" className="action-btn">
                      Change Photo
                    </button>
                    <button type="button" className="action-btn delete">
                      Delete
                    </button>
                  </div>
                  {formData.dishImagePreview && (
                    <div className="image-status">
                      <span className="status-icon">✓</span>
                      <span>High Definition</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Customer App Preview */}
              <div className="form-section">
                <h2>Live Customer App Preview</h2>

                <div className="customer-preview-card">
                  <div className="preview-badge">
                    <span>PURE VEG ★ BESTSELLER</span>
                  </div>
                  <div className="preview-prep-time">
                    <span>⏰ 10 mins</span>
                  </div>
                  <h3 className="preview-title">Ghee Podi Thatte Idli</h3>
                  <p className="preview-subtitle">நெய் பொடி தட்டே இட்லி</p>
                  <div className="preview-price">
                    <span>₹110.00</span>
                    <span className="price-extra">+ ₹15 pack fee</span>
                  </div>
                  <p className="preview-description">
                    "Steamed soft plate idli drenched in aromatic Chidambaram stoneground gun powder and warm pure cow ghee."
                  </p>
                  <div className="preview-serving">
                    2pcs with 3 Chutneys & Sambar
                  </div>
                  <button className="preview-add-btn">ADD</button>
                </div>
              </div>

              {/* KOT Printer Routing */}
              <div className="form-section">
                <h2>KOT Printer Routing</h2>

                <div className="kot-routing">
                  <div className="routing-item">
                    <span className="routing-label">Kitchen Station:</span>
                    <span className="routing-value">Tiffin Master 02</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="form-footer">
                <div className="unsaved-warning">
                  ⚠️ Unsaved Modifications Detected — Last autosaved: Today at 02:44 PM by S. Ramanathan
                </div>

                <div className="action-buttons">
                  <button type="button" className="btn btn-secondary">
                    Cancel & Discard Changes
                  </button>
                  <button type="button" className="btn btn-outline">
                    Save as Inactive Draft
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save & Publish Dish
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