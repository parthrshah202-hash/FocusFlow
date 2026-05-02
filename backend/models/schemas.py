from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class Task(BaseModel):
    id: str
    name: str
    deadline: str
    estimatedPomodoros: int
    priority: str
    completedPomodoros: int
    status: str
    tags: List[str] = []
    notes: Optional[str] = None

class DistractionEntry(BaseModel):
    id: str
    taskId: str
    timestamp: str
    description: str
    type: str  # internal | external

class SessionLogEntry(BaseModel):
    taskId: str
    taskName: str
    estimatedPomodoros: int
    actualPomodoros: int
    reflections: List[str]
    distractions: List[DistractionEntry]
    moodBefore: int
    moodAfter: int
    completedAt: str

class PlanRequest(BaseModel):
    tasks: List[Task]
    energyLevel: str
    availableMinutes: int
    moodScore: int
    preferredMode: str

class PlanResponse(BaseModel):
    orderedTasks: List[Task]
    reasoning: str
    totalPomodoros: int
    recommendedMode: str
    warningMessage: Optional[str] = None

class SummaryRequest(BaseModel):
    completedSessions: List[SessionLogEntry]
    totalDistractions: int
    averageMood: float
    focusScore: float

class SummaryResponse(BaseModel):
    summary: str
    insights: List[str]
    tomorrowSuggestion: str
    focusRating: str

class CoachContext(BaseModel):
    tasks: List[Task]
    sessionLog: List[SessionLogEntry]
    focusScore: float
    energyLevel: str
    currentTask: Optional[str] = None

class CoachRequest(BaseModel):
    message: str
    context: CoachContext

class CoachResponse(BaseModel):
    reply: str
    action: Optional[str] = None
    actionPayload: Optional[Any] = None
