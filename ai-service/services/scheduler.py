from apscheduler.schedulers.background import BackgroundScheduler # type: ignore
import httpx # type: ignore
import os

def trigger_reports():
    try:
        response = httpx.post(
            f"{os.getenv('NODE_SERVICE_URL', 'http://localhost:5000')}/api/reports/trigger",
            headers={"x-service-secret": os.getenv("SERVICE_SECRET")},
            timeout=30,
        )
        print(f"Report trigger response: {response.status_code}")
    except Exception as e:
        print(f"Scheduler error: {e}")

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Every Monday at 9AM
    scheduler.add_job(trigger_reports, 'cron', day_of_week='mon', hour=9, minute=0)
    scheduler.start()
    print("Scheduler started")