const cron = require('node-cron');
const axios = require('axios');
const Workspace = require('../models/Workspace.model');
const DataEntry = require('../models/DataEntry.model');
const Report = require('../models/Report.model');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User.model');

// Runs every Monday at 9AM
cron.schedule('0 9 * * 1', async () => {
  console.log('Running weekly report job...');

  try {
    const workspaces = await Workspace.find();

    for (const workspace of workspaces) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);

      const entries = await DataEntry.find({
        workspaceId: workspace._id,
        date: { $gte: weekStart },
      });

      if (entries.length === 0) continue;

      const rows = entries.map((e) => ({
        date: e.date,
        revenue: e.revenue,
        orders: e.orders,
        product: e.product,
      }));

      // Call Python AI service
      const aiRes = await axios.post(
        `${process.env.PYTHON_SERVICE_URL}/generate-report`,
        { data: rows },
        { headers: { 'x-service-secret': process.env.SERVICE_SECRET } }
      );

      const { summary, highlights, warnings, recommendation, growth } = aiRes.data;

      const report = await Report.create({
        workspaceId: workspace._id,
        weekStart,
        summary,
        highlights,
        warnings,
        recommendation,
        fullText: summary,
        growth,
      });

      // Send report emails to all members
      const members = await User.find({
        workspaceId: workspace._id,
        'notifications.weeklyReport': true,
      });

      for (const member of members) {
        await sendEmail({
          to: member.email,
          subject: `Your weekly business report — ${workspace.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Weekly Report for ${workspace.name}</h2>
              <p>${summary}</p>
              <h3>Highlights</h3>
              <ul>${highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
              ${warnings.length ? `<h3>Watch Out</h3><ul>${warnings.map((w) => `<li>${w}</li>`).join('')}</ul>` : ''}
              <h3>Recommendation</h3>
              <p>${recommendation}</p>
              <a href="${process.env.CLIENT_URL}/reports/${report._id}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;margin-top:16px;">
                View Full Report
              </a>
            </div>
          `,
        });
      }
    }

    console.log('Weekly report job completed');
  } catch (err) {
    console.error('Weekly report job failed:', err.message);
  }
});