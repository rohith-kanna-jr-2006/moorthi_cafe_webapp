const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dish name is required'],
      trim: true,
      maxlength: [100, 'Dish name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
      set: (v) => Math.round(v * 100) / 100, // round to 2 decimal places
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    portion: {
      type: String,
      trim: true,
      default: 'Standard Serving',
    },
    prepTimeMinutes: {
      type: Number,
      default: 15,
      min: [1, 'Preparation time must be at least 1 minute'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

foodSchema.index({ name: 'text', description: 'text' });
foodSchema.index({ category: 1, isAvailable: 1 });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
