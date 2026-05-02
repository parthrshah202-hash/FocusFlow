from fastapi import APIRouter
from models.schemas import SummaryRequest, SummaryResponse
from services.gemini import generate_summary

router = APIRouter()

@router.post("/api/summary", response_model=SummaryResponse, response_model_by_alias=True)
async def create_summary(request: SummaryRequest):
    summary_response = generate_summary(request.completed_sessions)
    return summary_response
