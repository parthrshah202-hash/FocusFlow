from fastapi import APIRouter, HTTPException
from models.schemas import PlanRequest, PlanResponse
from services import gemini

router = APIRouter()


@router.post("/api/plan", response_model=PlanResponse)
async def generate_plan(request: PlanRequest):
    try:
        result = gemini.generate_plan(
            tasks=[t.model_dump() for t in request.tasks],
            energy_level=request.energyLevel,
            available_minutes=request.availableMinutes,
        )
        return PlanResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
