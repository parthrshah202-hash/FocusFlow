from pydantic import BaseModel, Field, ConfigDict
from typing import List, Literal

class Task(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    id: str
    name: str
    deadline: str
    estimated_pomodoros: int = Field(alias="estimatedPomodoros")
    priority: Literal["high", "medium", "low"]
    completed_pomodoros: int = Field(alias="completedPomodoros")
    status: Literal["pending", "in-progress", "done"]

class PlanRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    tasks: List[Task]
    energy_level: Literal["high", "medium", "low"] = Field(alias="energyLevel")
    available_minutes: int = Field(alias="availableMinutes")

class PlanResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    ordered_tasks: List[Task] = Field(alias="orderedTasks")
    reasoning: str
    total_pomodoros: int = Field(alias="totalPomodoros")

class SessionLog(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    task_id: str = Field(alias="taskId")
    task_name: str = Field(alias="taskName")
    estimated_pomodoros: int = Field(alias="estimatedPomodoros")
    actual_pomodoros: int = Field(alias="actualPomodoros")
    reflections: List[str]

class SummaryRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    completed_sessions: List[SessionLog] = Field(alias="completedSessions")

class SummaryResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    
    summary: str
    insights: List[str]
