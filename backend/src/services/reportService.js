const Order = require('../models/Order');
const { getKolkataBusinessDate } = require('../utils/dateTime');

/**
 * Aggregates operational metrics for the Admin Dashboard (matches Stitch Screen 3c35b1470df44029a6007025731266dd)
 */
async function getTodayDashboardMetrics(businessDate = getKolkataBusinessDate()) {
  const matchToday = { businessDate };

  // 1. Revenue & Payment Breakdown (excluding CANCELLED)
  const revenueAgg = await Order.aggregate([
    { $match: { ...matchToday, status: { $ne: 'CANCELLED' } } },
    {
      $group: {
        _id: '$paymentMethod',
        totalRevenue: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 },
      },
    },
  ]);

  let totalRevenue = 0;
  let upiRevenue = 0;
  let cashRevenue = 0;
  let cardRevenue = 0;

  for (const item of revenueAgg) {
    totalRevenue += item.totalRevenue;
    if (item._id === 'UPI') upiRevenue = item.totalRevenue;
    if (item._id === 'COUNTER_CASH') cashRevenue = item.totalRevenue;
    if (item._id === 'CARD') cardRevenue = item.totalRevenue;
  }

  // 2. Status Counts
  const statusAgg = await Order.aggregate([
    { $match: matchToday },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const statusCounts = {
    PLACED: 0,
    CONFIRMED: 0,
    PREPARING: 0,
    READY: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    total: 0,
  };

  for (const item of statusAgg) {
    if (statusCounts[item._id] !== undefined) {
      statusCounts[item._id] = item.count;
    }
    statusCounts.total += item.count;
  }

  // 3. Active Tokens Queue (PLACED, CONFIRMED, PREPARING, READY)
  const activeOrders = await Order.find({
    businessDate,
    status: { $in: ['PLACED', 'CONFIRMED', 'PREPARING', 'READY'] },
  })
    .sort({ dailyTokenNumber: 1 })
    .select('dailyTokenNumber orderId status');

  const activeTokens = activeOrders.map((o) => o.dailyTokenNumber);
  const activeTokensQueue = {
    count: activeTokens.length,
    lowestToken: activeTokens.length > 0 ? Math.min(...activeTokens) : null,
    highestToken: activeTokens.length > 0 ? Math.max(...activeTokens) : null,
    tokens: activeTokens,
  };

  return {
    businessDate,
    revenue: {
      total: Math.round(totalRevenue * 100) / 100,
      upi: Math.round(upiRevenue * 100) / 100,
      cash: Math.round(cashRevenue * 100) / 100,
      card: Math.round(cardRevenue * 100) / 100,
    },
    orders: statusCounts,
    activeTokensQueue,
  };
}

/**
 * Aggregates daily sales across a date range
 */
async function getDailySalesReport(fromDate, toDate) {
  const match = {
    status: { $ne: 'CANCELLED' },
  };

  if (fromDate && toDate) {
    match.businessDate = { $gte: fromDate, $lte: toDate };
  } else if (fromDate) {
    match.businessDate = { $gte: fromDate };
  } else if (toDate) {
    match.businessDate = { $lte: toDate };
  }

  const dailyReport = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$businessDate',
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$totalAmount' },
        subtotalSales: { $sum: '$subtotal' },
        gstCollected: { $sum: '$gst' },
        packagingFees: { $sum: '$packagingCharge' },
        avgOrderValue: { $avg: '$totalAmount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Best-selling items overall in range
  const bestSellers = await Order.aggregate([
    { $match: match },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.name',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$items.lineTotal' },
      },
    },
    { $sort: { totalQuantity: -1 } },
    { $limit: 10 },
  ]);

  return {
    dateRange: { from: fromDate || 'all', to: toDate || 'all' },
    dailyReport: dailyReport.map((d) => ({
      date: d._id,
      orders: d.totalOrders,
      sales: Math.round(d.totalSales * 100) / 100,
      gst: Math.round(d.gstCollected * 100) / 100,
      avgOrderValue: Math.round(d.avgOrderValue * 100) / 100,
    })),
    bestSellers: bestSellers.map((b) => ({
      name: b._id,
      quantitySold: b.totalQuantity,
      revenueGenerated: Math.round(b.totalRevenue * 100) / 100,
    })),
  };
}

module.exports = {
  getTodayDashboardMetrics,
  getDailySalesReport,
};
