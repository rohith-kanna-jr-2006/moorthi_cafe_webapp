const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [60, 'Category name cannot exceed 60 characters'],
    },
    nameTamil: {
      type: String,
      trim: true,
      default: '',
      maxlength: [80, 'Tamil category name cannot exceed 80 characters'],
    },
    nameEnglish: {
      type: String,
      trim: true,
      default: '',
      maxlength: [80, 'English category name cannot exceed 80 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: '',
    },
    sourceSectionNumber: {
      type: Number,
      default: 0,
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ slug: 1, isActive: 1 });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
