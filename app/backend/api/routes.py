from fastapi import APIRouter
from schemas.schema import ConsultationData
from services.preprocess import processor
from services.predict import predictor
from services.consultant import get_physiologist_consultation

router = APIRouter()

@router.post("/predict")
async def analyze_stress(payload: ConsultationData):
    data = payload.dict()
    data = {k: v.lower() if isinstance(v, str) else v for k, v in data.items()} 

    scaled_data = processor.transform(data)
    class_label, prediction_proabilities = predictor.makePrediction(scaled_data)
    print(prediction_proabilities)
    probability = prediction_proabilities[0][0] if class_label == 0 else prediction_proabilities[0][1]
    probability_percentage = float(probability) * 100
    try:
        consultation_content = get_physiologist_consultation(data, class_label, probability_percentage)

    except Exception as e :
        consultation_content = {}


    return {
    "score": int(probability_percentage), # Model confidence as a percentage
    "status": "High Stress / Burnout Risk" if class_label == 1 else "Optimal / Healthy Balance",
    "patientData": {
        "name": data.get("Name", "Guest"),
        "age": data.get("Age"),
        "gender": data.get("Gender"),
        "occupation": data.get("Occupation")
    },
    "consultation": consultation_content 
}
