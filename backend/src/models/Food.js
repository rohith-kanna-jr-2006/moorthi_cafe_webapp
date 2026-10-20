const mongoose = require('mongoose');
const { computeEffectivePrice, isDiscountCurrentlyActive } = require('../utils/discountCalculator');

const discountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['PERCENTAGE', 'FIXED_AMOUNT'],
    },
    value: {
      type: Number,
      min: [0, 'Discount value cannot be negative'],
    },
    startsAt: {
      type: Date,
      default: null,
    },
    endsAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const foodVariantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Variant name is required (e.g. Bone, Boneless)'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Variant rupee price is required'],
      min: [0, 'Price must be positive'],
    },
    pricePaise: {
      type: Number,
      required: [true, 'Variant paise price is required'],
      min: [0, 'Price in paise must be positive'],
    },
    discount: {
      type: discountSchema,
      default: () => ({ isActive: false, value: 0 }),
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    sku: {
      type: String,
      trim: true,
    },
  },
  { _id: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

foodVariantSchema.virtual('effectivePrice').get(function () {
  const result = computeEffectivePrice(this.price, this.discount);
  return result.effectivePrice;
});

foodVariantSchema.virtual('effectivePricePaise').get(function () {
  const result = computeEffectivePrice(this.price, this.discount);
  return result.effectivePricePaise;
});

foodVariantSchema.virtual('isDiscountActive').get(function () {
  return isDiscountCurrentlyActive(this.discount);
});

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dish name is required'],
      trim: true,
      maxlength: [100, 'Dish name cannot exceed 100 characters'],
    },
    nameTamil: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'Tamil name cannot exceed 120 characters'],
    },
    nameEnglish: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'English name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    // Canonical monetary representation in integer paise (₹1 = 100 paise)
    pricePaise: {
      type: Number,
      min: [0, 'Price must be a positive integer in paise'],
      default: function () {
        return this.price !== undefined ? Math.round(this.price * 100) : 0;
      },
    },
    // Derived/mirrored rupee price for backwards-compatible API contracts
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be a positive number'],
      set: function (v) {
        if (v !== undefined && v !== null) {
          const num = Math.round(v * 100) / 100;
          this.pricePaise = Math.round(num * 100);
          return num;
        }
        return v;
      },
    },
    discount: {
      type: discountSchema,
      default: () => ({ isActive: false, value: 0 }),
    },
    variants: [foodVariantSchema],
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
    imageAlt: {
      type: String,
      trim: true,
      default: '',
    },
    imageSource: {
      type: String,
      trim: true,
      default: '',
    },
    imageLicense: {
      type: String,
      trim: true,
      default: '',
    },
    imageStatus: {
      type: String,
      enum: [
        'VERIFIED_PHOTOGRAPH',
        'AUTHENTIC_ILLUSTRATIVE_ARTWORK',
        'PROPRIETARY_REFERENCE_ILLUSTRATION',
        'VERIFIED_ON_DISK',
        'PENDING_OFFICIAL_PHOTOGRAPHY',
        'VERIFIED_ACTIVE',
      ],
      default: 'PENDING_OFFICIAL_PHOTOGRAPHY',
    },
    imageType: {
      type: String,
      enum: [
        'AUTHENTIC_PHOTOGRAPH',
        'AUTHENTIC_ILLUSTRATIVE_ARTWORK',
        'PROPRIETARY_REFERENCE_ILLUSTRATION',
        'VECTOR_ILLUSTRATION',
      ],
      default: 'AUTHENTIC_PHOTOGRAPH',
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    needsVerification: {
      type: Boolean,
      default: false,
      index: true,
    },
    verificationNotes: {
      type: String,
      trim: true,
      default: '',
    },
    sourceMenuRowKey: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      index: true,
    },
    isLegacyDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

foodSchema.virtual('effectivePrice').get(function () {
  const result = computeEffectivePrice(this.price, this.discount);
  return result.effectivePrice;
});

foodSchema.virtual('effectivePricePaise').get(function () {
  const result = computeEffectivePrice(this.price, this.discount);
  return result.effectivePricePaise;
});

foodSchema.virtual('isDiscountActive').get(function () {
  return isDiscountCurrentlyActive(this.discount);
});

// Bidirectional synchronization guarantee prior to validation
foodSchema.pre('validate', function () {
  if (this.pricePaise !== undefined && (this.price === undefined || this.isModified('pricePaise'))) {
    this.price = Math.round(this.pricePaise) / 100;
  } else if (this.price !== undefined && (this.pricePaise === undefined || this.isModified('price'))) {
    this.pricePaise = Math.round(this.price * 100);
  }

  // Ensure default English name fallback
  if (!this.nameEnglish && this.name) {
    this.nameEnglish = this.name;
  }
  if (!this.name && this.nameEnglish) {
    this.name = this.nameEnglish;
  }
});

foodSchema.index({ name: 'text', nameEnglish: 'text', nameTamil: 'text', description: 'text' });
foodSchema.index({ category: 1, isAvailable: 1, isPublished: 1 });
foodSchema.index({ isPublished: 1, isAvailable: 1, isArchived: 1 });

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
