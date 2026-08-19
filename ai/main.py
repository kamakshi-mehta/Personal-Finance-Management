import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Initialize Gemini if key exists
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    print("Gemini AI API configured successfully.")
else:
    print("Warning: GEMINI_API_KEY not found. Falling back to internal analytical models.")

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

class InsightRequest(BaseModel):
    income: float
    outflow: float
    investments: float
    debt: float
    strategy: str

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "FastAPI AI Microservice",
        "description": "Personal Finance AI Assistant microservice is running",
        "ai_provider_active": "Gemini" if GEMINI_API_KEY else "Internal Analytics Engine"
    }

@app.post("/api/v1/insights")
async def generate_insights(payload: InsightRequest):
    income = max(payload.income, 1)
    outflow = payload.outflow
    investments = payload.investments
    debt = payload.debt
    strategy = payload.strategy

    # 1. Calculate Financial Health Score (out of 100)
    # Savings Rate: higher is better (income - outflow) / income
    savings = income - outflow
    savings_rate = (savings / income) * 100

    # Debt-to-Asset ratio or Debt weight
    debt_weight = (debt / (income * 12)) * 100  # Debt compared to annual salary

    score = 100
    # Deduct for low savings rate
    if savings_rate < 10:
      score -= 25
    elif savings_rate < 20:
      score -= 15
    elif savings_rate < 30:
      score -= 5

    # Deduct for high debt-to-income
    if debt_weight > 50:
      score -= 25
    elif debt_weight > 30:
      score -= 15
    elif debt_weight > 10:
      score -= 5

    # Deduct for low investments
    if investments < income * 2:
      score -= 15
    elif investments < income:
      score -= 20

    # Clamp score
    final_score = max(0, min(100, score))

    # 2. Generate Fallback Analytics Data
    health_rating = "Excellent"
    if final_score < 50:
        health_rating = "Critical Needs Improvement"
    elif final_score < 75:
        health_rating = "Fair / Moderate"

    debt_insights = ""
    if debt > 0:
        debt_insights = f"You have an outstanding debt liability of ₹{debt:,.2f}. Focus on accelerating debt paydown."
    else:
        debt_insights = "Excellent! You are completely debt-free. Your cash reserves can go straight into compounding assets."

    allocation_insights = ""
    if strategy == "Growth":
        allocation_insights = "Growth strategy: Allocate 70% in Equities/Stocks, 20% in Mutual Funds, and 10% in Fixed Deposits."
    elif strategy == "Safety":
        allocation_insights = "Safety strategy: Prioritize FDs (70%), Debt Funds (20%), and hold minimal Equity (10%)."
    else:
        allocation_insights = "Balanced strategy: Keep 50% in index mutual funds, 30% in FDs, and 20% in equity shares."

    fallback_response = {
        "healthScore": final_score,
        "healthRating": health_rating,
        "savingsRate": round(savings_rate, 1),
        "debtAnalysis": debt_insights,
        "assetAllocation": allocation_insights,
        "budgetRecommendation": f"Maintain your monthly expenses below ₹{income * 0.5:,.0f} (50% of your earnings) to sustain a healthy savings rate of at least 30%.",
        "investmentRecommendation": f"Consider investing your surplus savings of ₹{max(0, savings):,.0f} into low-cost SIP index funds or secure FDs to build stable monthly yields."
    }

    # 3. Augment with Gemini AI if Key is Configured
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"""
            You are a professional, user-friendly personal finance advisor. 
            Analyze the following monthly financial snapshot of a middle-class user:
            - Monthly Income: ₹{income:,.2f}
            - Monthly Outflow (Expenses + EMIs): ₹{outflow:,.2f}
            - Total Investments: ₹{investments:,.2f}
            - Total Outstanding Debt: ₹{debt:,.2f}
            - Selected Investment Strategy: {strategy}
            - Calculated Financial Health Score: {final_score}/100

            Provide short, actionable, friendly insights (in plain text, no markdown headers or bullet formatting):
            1. An analysis of their debt and liability risk.
            2. A clear asset allocation recommendation aligned with their {strategy} strategy.
            3. A specific budget tip to maintain low outflows.
            4. A recommended investment action (educational advice only).

            Keep your entire response concise, positive, human-like, and direct. Do not mention API constraints.
            """
            response = model.generate_content(prompt)
            if response.text:
                # Parse or split generated text into clean sections
                paragraphs = [p.strip() for p in response.text.split("\n\n") if p.strip()]
                
                # Replace recommendations with AI-generated text if successful
                if len(paragraphs) >= 4:
                    fallback_response["debtAnalysis"] = paragraphs[0]
                    fallback_response["assetAllocation"] = paragraphs[1]
                    fallback_response["budgetRecommendation"] = paragraphs[2]
                    fallback_response["investmentRecommendation"] = paragraphs[3]
                else:
                    # Fallback text combination
                    fallback_response["budgetRecommendation"] = response.text[:300] + "..."
        except Exception as e:
            print("Gemini API call failed, using rule-based fallback:", e)

    return fallback_response
