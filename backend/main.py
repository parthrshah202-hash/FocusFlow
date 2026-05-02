from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import plan, summary

app = FastAPI(title="FocusFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", # Keeps your local dev working
        "https://focus-flow-jade-ten.vercel.app/" # Temporarily allows Vercel (or any frontend) to connect
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plan.router)
app.include_router(summary.router)

@app.get("/")
async def root():
    return {"status": "ok", "message": "FocusFlow API is running"}