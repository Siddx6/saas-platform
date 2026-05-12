const DataEntry = require('../models/DataEntry.model');

const getSummaryData = async (workspaceId) => {
  const entries = await DataEntry.find({ workspaceId });

  const totalRevenue = entries.reduce((sum, e) => sum + e.revenue, 0);
  const totalOrders  = entries.reduce((sum, e) => sum + e.orders, 0);

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recent = sorted.slice(0, 7);
  const older  = sorted.slice(7, 14);

  const recentRevenue = recent.reduce((sum, e) => sum + e.revenue, 0);
  const olderRevenue  = older.reduce((sum, e) => sum + e.revenue, 0);

  const growth = olderRevenue > 0
    ? (((recentRevenue - olderRevenue) / olderRevenue) * 100).toFixed(1)
    : 0;

  return { totalRevenue, totalOrders, growth: Number(growth) };
};

module.exports = { getSummaryData };