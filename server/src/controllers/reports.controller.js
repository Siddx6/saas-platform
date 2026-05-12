const Report = require('../models/Report.model');
const axios = require('axios');
const DataEntry = require('../models/DataEntry.model');

// GET /api/reports
const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ workspaceId: req.user.workspaceId })
      .sort({ weekStart: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/:id
const getReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      workspaceId: req.user.workspaceId,
    });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    next(err);
  }
};

// POST /api/reports/trigger-now (temp test route)
const triggerReport = async (req, res, next) => {
  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const entries = await DataEntry.find({
      workspaceId: req.user.workspaceId,
    });

    if (entries.length === 0) {
      return res.status(400).json({ message: 'No data found. Upload CSV first.' });
    }

    const rows = entries.map((e) => ({
      date: e.date,
      revenue: e.revenue,
      orders: e.orders,
      product: e.product,
    }));

    const aiRes = await axios.post(
      `${process.env.PYTHON_SERVICE_URL}/generate-report`,
      { data: rows },
      { headers: { 'x-service-secret': process.env.SERVICE_SECRET } }
    );

    const { summary, highlights, warnings, recommendation, growth } = aiRes.data;

    const report = await Report.create({
      workspaceId: req.user.workspaceId,
      weekStart,
      summary,
      highlights,
      warnings,
      recommendation,
      fullText: summary,
      growth,
    });

    res.json({ message: 'Report generated successfully', report });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReports, getReport, triggerReport };