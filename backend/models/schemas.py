from pydantic import BaseModel
from typing import List, Optional


class Task(BaseModel):
    id: str
    name: str
    deadline: str
    estimatedPomodoros: int
    priority: str  # "high" | "medium" | "low"
    completedPomodoros: int = 0
    status: str = "pending"  # "pending" | "in-progress" | "done"


class PlanRequest(BaseModel):
    tasks: List[Task]
    energyLevel: str  # "high" | "medium" | "low"
    availableMinutes: int


class PlanResponse(BaseModel):
    orderedTasks: List[Task]
    reasoning: str
    totalPomodoros: int


class SessionLog(BaseModel):
    taskId: str
    taskName: str
    estimatedPomodoros: int
    actualPomodoros: int
    reflections: List[str] = []


class SummaryRequest(BaseModel):
    completedSessions: List[SessionLog]


class SummaryResponse(BaseModel):
    summary: str
    insights: List[str]
