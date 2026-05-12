from fastapi import APIRouter # type: ignore

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-report-service"}