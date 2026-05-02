import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

def parse_json_response(text):
    text = text.strip()
    if text.startswith("```"):
        # Remove starting ```json or ```
        if "\n" in text:
            text = text.split("\n", 1)[1]
        else:
            text = text.replace("```json", "").replace("```", "")
        # Remove ending ```
        if text.endswith("```"):
            text = text.rsplit("```", 1)[0]
    return json.loads(text.strip())

def generate_plan(tasks, energy_level, available_minutes, mood_score, preferred_mode):
    if not client:
        return {"error": "Gemini API key not configured"}
    
    tasks_json = json.dumps([t.dict() for t in tasks])
    prompt = f"""You are a precision productivity engine. A user is starting their work session.
Energy level: {energy_level} (high/medium/low)
Mood score: {mood_score} (1-5, where 1=terrible, 5=excellent)
Available minutes: {available_minutes}
Preferred work mode: {preferred_mode}
Tasks: {tasks_json}
Return a JSON object with:
- orderedTasks: the task array reordered by urgency (deadline), priority, and energy fit
- reasoning: a 2-3 sentence plain-English explanation of why tasks are in this order
- totalPomodoros: total estimated pomodoros for the ordered list
- recommendedMode: one of "25/5", "50/10", or "90/15" based on energy and preferred mode
- warningMessage: a short warning string if the user is overloaded (total time > available minutes). Each Pomodoro = 25 minutes. 
Return ONLY valid JSON."""

    response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
    return parse_json_response(response.text)

def generate_summary(completed_sessions, total_distractions, average_mood, focus_score):
    if not client:
        return {"error": "Gemini API key not configured"}
    
    sessions_json = json.dumps([s.dict() for s in completed_sessions])
    prompt = f"""You are a reflective productivity coach. Analyze this user's work session.
Sessions: {sessions_json}
Total distractions logged: {total_distractions}
Average mood across sessions: {average_mood}/5
Calculated focus score: {focus_score}/100
Return a JSON object with:
- summary: a 3-4 sentence paragraph that honestly reflects how the session went
- insights: array of exactly 3 short, specific, actionable strings
- tomorrowSuggestion: one sentence for how to start better tomorrow
- focusRating: one letter grade A/B/C/D/F based on focus score and session quality
Return ONLY valid JSON."""

    response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
    return parse_json_response(response.text)

def generate_coach_reply(message, context):
    if not client:
        return {"error": "Gemini API key not configured"}
    
    tasks_summary = json.dumps([{"name": t.name, "status": t.status} for t in context.tasks])
    prompt = f"""You are FocusFlow Coach — a direct, honest, slightly dry AI productivity assistant. 
Context:
- Active task: {context.currentTask}
- Energy level: {context.energyLevel}
- Focus score so far: {context.focusScore}/100
- Tasks remaining: {tasks_summary}
User message: {message}
Return a JSON object with:
- reply: your response as a string (max 3 sentences, direct and useful)
- action: null, or one of: "reschedule", "skip_task", "take_break"
- actionPayload: if action is not null, include relevant data (e.g., {{ "taskId": "..." }} for the action)
Return ONLY valid JSON."""

    response = client.models.generate_content(model='gemini-2.5-flash', contents=prompt)
    return parse_json_response(response.text)
