from fastapi import APIRouter, HTTPException
from models.schemas import SummaryRequest, SummaryResponse
from services import gemini

router = APIRouter()

@router.post("/summary", response_model=SummaryResponse)
async def create_summary(request: SummaryRequest):
    try:
        summary_data = gemini.generate_summary(
            request.completedSessions,
            request.totalDistractions,
            request.averageMood,
            request.focusScore
        )
        if "error" in summary_data:
            raise HTTPException(status_code=500, detail=summary_data["error"])
        return SummaryResponse(**summary_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
