def build_prompt(stats: dict) -> str:
    return f"""
You are a business analyst. Based on these weekly stats, generate a business report.

Total Revenue: ₹{stats['total_revenue']:,.2f}
Average Daily: ₹{stats['avg_daily']:,.2f}
Best Day: {stats['best_day']} (₹{stats['best_revenue']:,.2f})
Worst Day: {stats['worst_day']} (₹{stats['worst_revenue']:,.2f})
Growth: {stats['growth_pct']}%
Top Product: {stats['top_product'] or 'N/A'}

Return only a JSON object with keys: summary, highlights, warnings, recommendation, growth.
"""