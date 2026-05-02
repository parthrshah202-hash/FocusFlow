from fastapi import APIRouter, HTTPException
from models.schemas import PlanRequest, PlanResponse
from services import gemini

router = APIRouter()

@router.post("/plan", response_model=PlanResponse)
async def create_plan(request: PlanRequest):
    try:
        plan_data = gemini.generate_plan(
            request.tasks,
            request.energyLevel,
            request.availableMinutes,
            request.moodScore,
            request.preferredMode
        )
        if "error" in plan_data:
            raise HTTPException(status_code=500, detail=plan_data["error"])
        return PlanResponse(**plan_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
