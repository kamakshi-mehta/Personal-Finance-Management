import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx

# Load environment variables
load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
# Default open-source model: Llama 3 8B Instruct
HF_MODEL = os.getenv("HF_MODEL", "meta-llama/Meta-Llama-3-8B-Instruct")

if HF_API_TOKEN:
    print(f"Hugging Face AI configured using model: {HF_MODEL}")
else:
    print("Warning: HF_API_TOKEN not found. Falling back to internal analytical models.")

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
        "ai_provider_active": "Hugging Face" if HF_API_TOKEN else "Internal Analytics Engine"
    }

@app.post("/api/v1/insights")
async def generate_insights(payload: InsightRequest):
    income = max(payload.income, 1)
    outflow = payload.outflow
    investments = payload.investments
    debt = payload.debt
    strategy = payload.strategy

    # 1. Calculate Financial Health Score (out of 100)
    savings = income - outflow
    savings_rate = (savings / income) * 100
    debt_weight = (debt / (income * 12)) * 100  # Debt compared to annual salary

    score = 100
    if savings_rate < 10:
        score -= 25
    elif savings_rate < 20:
        score -= 15
    elif savings_rate < 30:
        score -= 5

    if debt_weight > 50:
        score -= 25
    elif debt_weight > 30:
        score -= 15
    elif debt_weight > 10:
        score -= 5

    if investments < income * 2:
        score -= 15
    elif investments < income:
        score -= 20

    final_score = max(0, min(100, score))

    health_rating = "Excellent"
    if final_score < 50:
        health_rating = "Critical Needs Improvement"
    elif final_score < 75:
        health_rating = "Fair / Moderate"

    # 2. Predictive Calculations
    # Expense Prediction: outflow + 2% inflation adjustment projection
    projected_expense = outflow * 1.02
    # Savings Prediction: income - projected expense
    projected_savings = max(0, income - projected_expense)

    # Expected interest yield based on selected strategy
    interest_rate = 10.0
    if strategy == "Growth":
        interest_rate = 14.0
    elif strategy == "Safety":
        interest_rate = 7.0

    # 3. Generate Fallback Analytics Data
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
        "investmentRecommendation": f"Consider investing your surplus savings of ₹{max(0, savings):,.0f} into low-cost SIP index funds or secure FDs to build stable monthly yields.",
        "projectedExpense": round(projected_expense, 2),
        "projectedSavings": round(projected_savings, 2),
        "expectedRate": interest_rate,
        "initialInvested": investments
    }

    # 4. Integrate Hugging Face Inference API if token is configured
    if HF_API_TOKEN:
        try:
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
            
            headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
            payload_data = {
                "inputs": prompt,
                "parameters": {"max_new_tokens": 500, "temperature": 0.7}
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"https://api-inference.huggingface.co/models/{HF_MODEL}",
                    headers=headers,
                    json=payload_data
                )
                
                if response.status_code == 200:
                    res_data = response.json()
                    generated_text = ""
                    if isinstance(res_data, list) and len(res_data) > 0:
                        generated_text = res_data[0].get("generated_text", "")
                    elif isinstance(res_data, dict):
                        generated_text = res_data.get("generated_text", "")

                    # Strip prompt if it was echoed back by HF
                    if generated_text.startswith(prompt):
                        generated_text = generated_text[len(prompt):].strip()

                    # Parse response into paragraphs
                    paragraphs = [p.strip() for p in generated_text.split("\n\n") if p.strip()]
                    if len(paragraphs) >= 4:
                        fallback_response["debtAnalysis"] = paragraphs[0]
                        fallback_response["assetAllocation"] = paragraphs[1]
                        fallback_response["budgetRecommendation"] = paragraphs[2]
                        fallback_response["investmentRecommendation"] = paragraphs[3]
                    elif len(generated_text) > 50:
                        fallback_response["budgetRecommendation"] = generated_text[:300] + "..."
        except Exception as e:
            print("Hugging Face API call failed, using rule-based fallback:", e)

    return fallback_response
