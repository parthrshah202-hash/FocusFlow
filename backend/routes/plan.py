from fastapi import APIRouter
from models.schemas import PlanRequest, PlanResponse
from services.gemini import generate_plan

router = APIRouter()

@router.post("/api/plan", response_model=PlanResponse, response_model_by_alias=True)
async def create_plan(request: PlanRequest):
    plan_response = generate_plan(request.tasks, request.energy_level, request.available_minutes)
    return plan_response
