const DataEntry = require('../models/DataEntry.model');
const { getSummaryData } = require('../utils/aggregateData');

// POST /api/data/upload
const uploadData = async (req, res, next) => {
  try {
    const { rows } = req.body;
    if (!rows || !Array.isArray(rows)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    const entries = rows.map((row) => ({
      workspaceId: req.user.workspaceId,
      date:        new Date(row.date),
      revenue:     parseFloat(row.revenue) || 0,
      orders:      parseInt(row.orders) || 0,
      product:     row.product || '',
      category:    row.category || '',
      uploadedBy:  req.user._id,
    }));

    await DataEntry.insertMany(entries);
    res.json({ message: 'Data uploaded successfully', count: entries.length });
  } catch (err) {
    next(err);
  }
};

// GET /api/data/summary
const getSummary = async (req, res, next) => {
  try {
    const { totalRevenue, totalOrders, growth } = await getSummaryData(req.user.workspaceId);

    const recentEntries = await DataEntry.find({ workspaceId: req.user.workspaceId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('uploadedBy', 'name');

    const recentActivity = recentEntries.map((e) => ({
      userName: e.uploadedBy?.name || 'Someone',
      action: `uploaded data for ${new Date(e.date).toLocaleDateString('en-IN')}`,
      time: new Date(e.createdAt).toLocaleString('en-IN'),
    }));

    res.json({ totalRevenue, totalOrders, growth, activeUsers: 1, recentActivity });
  } catch (err) {
    next(err);
  }
};

// GET /api/data/revenue-chart?range=daily|weekly|monthly
const getRevenueChart = async (req, res, next) => {
  try {
    const { range = 'daily' } = req.query;

    const entries = await DataEntry.find({ workspaceId: req.user.workspaceId }).sort({ date: 1 });

    let grouped = {};

    entries.forEach((entry) => {
      const d = new Date(entry.date);
      let key;
      if (range === 'daily') key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      else if (range === 'weekly') key = `Week ${getWeekNumber(d)}`;
      else key = d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

      grouped[key] = (grouped[key] || 0) + entry.revenue;
    });

    const data = Object.entries(grouped).map(([label, revenue]) => ({ label, revenue }));
    res.json(data);
  } catch (err) {
    next(err);
  }
};

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

// GET /api/data/top-products
const getTopProducts = async (req, res, next) => {
  try {
    const entries = await DataEntry.find({
      workspaceId: req.user.workspaceId,
      product: { $ne: '' },
    });

    const productMap = {};
    entries.forEach((e) => {
      productMap[e.product] = (productMap[e.product] || 0) + e.revenue;
    });

    const data = Object.entries(productMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadData, getSummary, getRevenueChart, getTopProducts };