from pydantic import BaseModel # type: ignore
from typing import List, Optional

class DataRow(BaseModel):
    date: str
    revenue: float
    orders: Optional[int] = 0
    product: Optional[str] = ""

class ReportRequest(BaseModel):
    data: List[DataRow]

class ReportResponse(BaseModel):
    summary: str
    highlights: List[str]
    warnings: List[str]
    recommendation: str
    growth: float