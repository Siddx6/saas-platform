import pandas as pd # type: ignore

def analyze(data: list) -> dict:
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df['revenue'] = pd.to_numeric(df['revenue'], errors='coerce').fillna(0)
    df = df.sort_values('date')

    total_revenue = df['revenue'].sum()
    avg_daily = df['revenue'].mean()

    best_row = df.loc[df['revenue'].idxmax()]
    worst_row = df.loc[df['revenue'].idxmin()]

    best_day = best_row['date'].strftime('%A, %d %b')
    worst_day = worst_row['date'].strftime('%A, %d %b')
    best_revenue = round(float(best_row['revenue']), 2)
    worst_revenue = round(float(worst_row['revenue']), 2)

    # Calculate growth — compare first half vs second half
    mid = len(df) // 2
    if mid > 0:
        first_half = df['revenue'].iloc[:mid].sum()
        second_half = df['revenue'].iloc[mid:].sum()
        if first_half > 0:
            growth = round(((second_half - first_half) / first_half) * 100, 1)
        else:
            growth = 0.0
    else:
        growth = 0.0

    # Top product
    top_product = None
    if 'product' in df.columns:
        product_revenue = df.groupby('product')['revenue'].sum()
        if not product_revenue.empty:
            top_product = product_revenue.idxmax()

    return {
        "total_revenue": round(float(total_revenue), 2),
        "avg_daily": round(float(avg_daily), 2),
        "best_day": best_day,
        "best_revenue": best_revenue,
        "worst_day": worst_day,
        "worst_revenue": worst_revenue,
        "growth_pct": growth,
        "top_product": top_product,
        "num_entries": len(df),
    }