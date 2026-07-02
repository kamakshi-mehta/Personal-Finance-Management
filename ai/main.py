import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="PFM AI Microservice", version="1.0.0")

# Set up CORS middleware
origins = [
    "http://localhost:3000",
    "http://localhost:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "FastAPI AI Microservice",
        "description": "Personal Finance AI Assistant microservice is running"
    }

@app.get("/api/v1/insights/status")
def insights_status():
    return {
        "status": "Connected",
        "message": "AI Insights engine is operational",
        "available_models": ["finance-gpt-v1", "budget-analyzer-v1"],
        "connection_test": "success"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
