const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      max: [50, 'Quantity cannot exceed 50 per item'],
    },
    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    note: String,
  },
  { _id: false }
);

const paymentHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    method: {
      type: String,
      enum: ['COUNTER_CASH', 'UPI', 'CARD'],
    },
    reference: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    source: {
      type: String,
      enum: ['MANUAL_COUNTER', 'ONLINE_GATEWAY'],
      default: 'MANUAL_COUNTER',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    dailyTokenNumber: {
      type: Number,
      required: true,
      index: true,
    },
    businessDate: {
      type: String, // 'YYYY-MM-DD' in Asia/Kolkata
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      validate: [
        (val) => val && val.length > 0,
        'An order must contain at least one food item',
      ],
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    gst: {
      type: Number,
      required: true,
      min: 0,
    },
    packagingCharge: {
      type: Number,
      default: 15.0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    pickupType: {
      type: String,
      enum: ['IMMEDIATE', 'SCHEDULED'],
      default: 'IMMEDIATE',
    },
    pickupAt: {
      type: Date,
      required: true,
    },
    pickupStation: {
      type: String,
      default: 'Chidambaram Central Dining Hall - Express Parcel Counter 2',
    },
    notes: {
      type: String,
      maxlength: [150, 'Kitchen instructions cannot exceed 150 characters'],
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'],
      default: 'PLACED',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING',
    },
    paymentMethod: {
      type: String,
      enum: ['COUNTER_CASH', 'UPI', 'CARD'],
      default: 'UPI',
    },
    idempotencyKey: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
    statusHistory: [statusHistorySchema],
    paymentSettlement: {
      settledAt: Date,
      settledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      method: {
        type: String,
        enum: ['COUNTER_CASH', 'UPI', 'CARD'],
      },
      reference: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      note: {
        type: String,
        trim: true,
        maxlength: 200,
      },
      source: {
        type: String,
        enum: ['MANUAL_COUNTER', 'ONLINE_GATEWAY'],
        default: 'MANUAL_COUNTER',
      },
    },
    paymentHistory: [paymentHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast admin querying
orderSchema.index({ businessDate: 1, status: 1 });
orderSchema.index({ customer: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
