from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routes.plan import router as plan_router
from routes.summary import router as summary_router

app = FastAPI(title="FocusFlow API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plan_router)
app.include_router(summary_router)


@app.get("/")
def root():
    return {"status": "ok", "message": "FocusFlow backend running"}
