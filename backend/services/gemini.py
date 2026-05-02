import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")


def _call_gemini(prompt: str) -> dict:
    response = model.generate_content(prompt)
    text = response.text.strip()
    # Strip markdown code fences if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text)


def generate_plan(tasks: list, energy_level: str, available_minutes: int) -> dict:
    tasks_json = json.dumps(tasks, indent=2)
    prompt = f"""You are a productivity assistant. Given the following tasks, energy level, and available time,
return a JSON object with exactly these keys:
- orderedTasks: the reordered array of task objects (same fields, same data, just reordered)
- reasoning: a string explaining the ordering decision
- totalPomodoros: a number (total estimated pomodoros in the plan)

Each Pomodoro = 25 minutes. Prioritize by deadline and priority.
Energy level: {energy_level}. Available minutes: {available_minutes}.
Tasks: {tasks_json}

Return ONLY valid JSON. No markdown backticks. No explanation outside the JSON object."""
    return _call_gemini(prompt)


def generate_summary(completed_sessions: list) -> dict:
    sessions_json = json.dumps(completed_sessions, indent=2)
    prompt = f"""You are a productivity coach. Analyze these completed Pomodoro sessions and return a JSON object with exactly these keys:
- summary: a string paragraph summarizing the session
- insights: an array of exactly 3 short, actionable insight strings

Sessions: {sessions_json}

Return ONLY valid JSON. No markdown backticks. No explanation outside the JSON object."""
    return _call_gemini(prompt)
