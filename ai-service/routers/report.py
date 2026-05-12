from fastapi import APIRouter, Header, HTTPException # type: ignore
from models.schemas import ReportRequest, ReportResponse
from services.analyzer import analyze
from services.llm import generate_report
import os

router = APIRouter()

@router.post("/generate-report", response_model=ReportResponse)
async def generate(
    request: ReportRequest,
    x_service_secret: str = Header(None)
):
    # Verify secret so only our Node server can call this
    if x_service_secret != os.getenv("SERVICE_SECRET"):
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not request.data:
        raise HTTPException(status_code=400, detail="No data provided")

    # Analyze the data with pandas
    stats = analyze([row.dict() for row in request.data])

    # Generate report with LLM
    report = await generate_report(stats)

    return report