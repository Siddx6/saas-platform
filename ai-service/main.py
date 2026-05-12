from dotenv import load_dotenv # type: ignore
load_dotenv()

from fastapi import FastAPI # type: ignore
from routers import report, health
from services.scheduler import start_scheduler

app = FastAPI(title="AI Report Service")

app.include_router(health.router)
app.include_router(report.router)

@app.on_event("startup")
def startup_event():
    start_scheduler()