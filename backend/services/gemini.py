import os
import json
import re
from google import genai
from dotenv import load_dotenv
from models.schemas import PlanResponse, SummaryResponse, Task, SessionLog
from typing import List

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", ""))

def _clean(text: str) -> str:
    text = text.strip()
    text = re.sub(r"```json|```", "", text).strip()
    return text

def generate_plan(tasks: List[Task], energy_level: str, available_minutes: int) -> PlanResponse:
    tasks_json = json.dumps([task.model_dump(by_alias=True) for task in tasks])
    prompt = f"""You are a productivity assistant. Given the following tasks, energy level, and available time,
return a JSON object with keys: orderedTasks (reordered task array), reasoning (string), totalPomodoros (number).
Each Pomodoro = 25 minutes. Prioritize by deadline and priority. 
Energy level: {energy_level}. Available minutes: {available_minutes}.
Tasks: {tasks_json}
Return ONLY valid JSON. No explanation outside JSON."""

# Model: gemini-flash-latest — DO NOT CHANGE, tested and working for IN region
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )
    data = json.loads(_clean(response.text))
    return PlanResponse(**data)

def generate_summary(completed_sessions: List[SessionLog]) -> SummaryResponse:
    sessions_json = json.dumps([session.model_dump(by_alias=True) for session in completed_sessions])
    prompt = f"""You are a productivity coach. Analyze these completed Pomodoro sessions and return a JSON object
with keys: summary (string paragraph), insights (array of 3 short strings).
Sessions: {sessions_json}
Return ONLY valid JSON. No explanation outside JSON."""

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )
    data = json.loads(_clean(response.text))
    return SummaryResponse(**data)