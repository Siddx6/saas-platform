import os
import json
from groq import AsyncGroq # type: ignore

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_report(stats: dict) -> dict:
    prompt = f"""
You are a business analyst. Based on the following weekly sales statistics, generate a concise business report.

Statistics:
- Total Revenue: ₹{stats['total_revenue']:,.2f}
- Average Daily Revenue: ₹{stats['avg_daily']:,.2f}
- Best Day: {stats['best_day']} (₹{stats['best_revenue']:,.2f})
- Worst Day: {stats['worst_day']} (₹{stats['worst_revenue']:,.2f})
- Growth: {stats['growth_pct']}%
- Top Product: {stats['top_product'] or 'N/A'}
- Data Points: {stats['num_entries']}

Respond ONLY with a valid JSON object in this exact format, no extra text, no markdown:
{{
  "summary": "2-3 sentence overview of the week",
  "highlights": ["highlight 1", "highlight 2", "highlight 3"],
  "warnings": ["warning 1"],
  "recommendation": "1-2 sentence actionable recommendation",
  "growth": {stats['growth_pct']}
}}
"""

    try:
        response = await client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7,
        )

        content = response.choices[0].message.content.strip()

        # Remove markdown code blocks if present
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]

        result = json.loads(content)
        return result

    except Exception as e:
        print(f"LLM error: {e}")
        # Fallback report if LLM fails
        return {
            "summary": f"This week your business generated ₹{stats['total_revenue']:,.2f} in total revenue with an average of ₹{stats['avg_daily']:,.2f} per day.",
            "highlights": [
                f"Best performing day was {stats['best_day']} with ₹{stats['best_revenue']:,.2f}",
                f"Total of {stats['num_entries']} data entries recorded this week",
                f"Overall growth rate of {stats['growth_pct']}%",
            ],
            "warnings": [f"Worst day was {stats['worst_day']} with only ₹{stats['worst_revenue']:,.2f}"] if stats['worst_revenue'] < stats['avg_daily'] * 0.5 else [],
            "recommendation": "Focus on replicating the strategies used on your best performing day across the rest of the week.",
            "growth": stats['growth_pct'],
        }