from fastapi import APIRouter, HTTPException
from models.schemas import CoachRequest, CoachResponse
from services import gemini

router = APIRouter()

@router.post("/coach", response_model=CoachResponse)
async def get_coach_reply(request: CoachRequest):
    try:
        coach_data = gemini.generate_coach_reply(
            request.message,
            request.context
        )
        if "error" in coach_data:
            raise HTTPException(status_code=500, detail=coach_data["error"])
        return CoachResponse(**coach_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
