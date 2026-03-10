import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

# Replace with your actual API Key from Google AI Studio
genai.configure(api_key=os.getenv("LLM_API_KEY"))
model = genai.GenerativeModel(os.getenv("LLM_MODEL"))

def get_physiologist_consultation(data: dict, ml_result: int, probability: float):
    # Professional but accessible labeling
    risk_label = "High Stress/Energy Drain" if ml_result == 1 else "Healthy Balance"
    
    prompt = f"""
    Act as a Senior Wellness Physiologist. Analyze this data for {data['Name']}:
    
    LIFESTYLE DATA:
    - Screen/Digital: {data['Daily_Screen_Hours']}h total, {data['App_Usage_Count']} daily app switches.
    - Work/Load: {data['Daily_Work_Hours']}h work day, {data['Work_Productivity_Score']}/10 efficiency.
    - Recovery: {data['Sleep_Hours']}h sleep, {data['Caffeine_Cups_Per_Day']} coffees, {data['Exercise_Hours_Per_Week']}h exercise.
    - ML Result: {risk_label} ({probability*100:.0f}% confidence).

    TASK:
    Generate a consultation in JSON. 
    TONE: Clinical yet accessible. Avoid heavy jargon (no 'neuroplasticity', 'allostatic'). 
    Use analogies relevant to a {data["Occupation"]}. Be warm but authoritative.

    Structure:
    {{
      "analysis": "2 sentences: explain how their digital habits are affecting their energy/focus.",
      "steps": ["Simple action 1", "Simple action 2", "Simple action 3"],
      "insights": ["One surprising fact about their data", "A positive observation", "A warning sign to watch for"],
      "closing_note": "A supportive final thought."
    }}
    """

    response = model.generate_content(
        prompt,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.3, 
        }
    )
    
    return json.loads(response.text)