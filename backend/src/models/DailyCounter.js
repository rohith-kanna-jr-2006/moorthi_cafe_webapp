const mongoose = require('mongoose');

const dailyCounterSchema = new mongoose.Schema(
  {
    businessDate: {
      type: String, // 'YYYY-MM-DD' Asia/Kolkata
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'businessDate must be in YYYY-MM-DD format'],
    },
    counterType: {
      type: String, // 'token' or 'order'
      required: true,
      enum: ['token', 'order'],
      default: 'token',
    },
    sequence: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one sequence per day per type
dailyCounterSchema.index({ businessDate: 1, counterType: 1 }, { unique: true });

const DailyCounter = mongoose.model('DailyCounter', dailyCounterSchema);

module.exports = DailyCounter;
