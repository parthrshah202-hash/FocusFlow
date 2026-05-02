from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import plan, summary, coach

app = FastAPI(title="FocusFlow V2 API", version="2.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(plan.router, prefix="/api", tags=["Plan"])
app.include_router(summary.router, prefix="/api", tags=["Summary"])
app.include_router(coach.router, prefix="/api", tags=["Coach"])

@app.get("/")
async def health_check():
    return {"status": "ok", "version": "2.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
