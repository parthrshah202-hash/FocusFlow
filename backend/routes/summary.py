from fastapi import APIRouter, HTTPException
from models.schemas import SummaryRequest, SummaryResponse
from services import gemini

router = APIRouter()


@router.post("/api/summary", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest):
    try:
        result = gemini.generate_summary(
            completed_sessions=[s.model_dump() for s in request.completedSessions]
        )
        return SummaryResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
