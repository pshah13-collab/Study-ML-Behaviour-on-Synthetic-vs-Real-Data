# Stress Level Classifier

A full-stack research project exploring machine learning behavior on synthetic vs real stress assessment data.

The repository combines:
- a Next.js frontend for an interactive stress assessment UI
- a FastAPI backend for preprocessing, classification, and consultation generation
- model artifacts, processed datasets, and Jupyter notebooks for data exploration and experimentation

## Project Overview

This project is designed to classify stress and burnout risk from digital behavior, work habits, and lifestyle metrics. The backend predicts a stress risk score, then generates a physiologist-style consultation using an LLM.

## Repository Structure

- `app/frontend/` - Next.js frontend application
- `app/backend/` - FastAPI backend API and ML pipeline
- `data/raw/` - original source datasets
- `data/processed/` - cleaned and transformed datasets
- `Models/` - trained model and preprocessing artifacts
- `notebooks/` - exploratory data analysis, data preparation, labeling, and model development
- `reports/` - project write-ups and findings

## Key Features

- Web-based assessment form for user profile, digital pulse, workload, and lifestyle recovery
- FastAPI endpoint for model inference and consultation generation
- Data preprocessing with saved scaler and feature set alignment
- Model probability output and categorical risk status
- LLM-powered consultation content for personalized feedback

## Backend

### Core files

- `app/backend/main.py` - FastAPI application startup
- `app/backend/api/routes.py` - `/api/predict` endpoint implementation
- `app/backend/schemas/schema.py` - request validation and schema definitions
- `app/backend/services/preprocess.py` - preprocessing pipeline using saved scaler and feature metadata
- `app/backend/services/predict.py` - prediction wrapper for the trained model
- `app/backend/services/consultant.py` - generates consultation text via Google Generative AI

### Expected backend behavior

The backend receives POST data at `/api/predict`, preprocesses it, performs model inference, and returns a JSON response with:
- `score`: stress risk confidence percentage
- `status`: high stress vs healthy balance label
- `patientData`: name, age, gender, occupation
- `consultation`: structured LLM-generated guidance

## Frontend

The frontend is built with Next.js and lives in `app/frontend/`.

### Run frontend

```bash
cd app/frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Useful frontend files

- `app/frontend/app/page.tsx` - homepage and assessment flow
- `app/frontend/app/assessment/page.tsx` - assessment submission logic and API integration
- `app/frontend/components/` - reusable UI components

## Setup

### Backend dependencies

Install Python dependencies for the backend. There is no requirements file in the repository, but the backend currently uses:

- `fastapi`
- `uvicorn`
- `pydantic`
- `pandas`
- `numpy`
- `joblib`
- `google-generativeai`
- `python-dotenv`

Example install command:

```bash
python -m pip install fastapi uvicorn pydantic pandas numpy joblib google-generativeai python-dotenv
```

### Environment variables

The backend uses environment variables for the LLM client configuration. Create a `.env` file in `app/backend/` with:

```env
LLM_API_KEY=your_google_ai_studio_api_key
LLM_MODEL=your_google_model_name
```

### Model artifact paths

`app/backend/services/predict.py` currently loads a model from an absolute path. Update this path to point to the project-local model file inside `Models/` before running the backend.

Similarly, `app/backend/services/preprocess.py` expects `models/scaler.pkl` and `models/features.pkl` available relative to the backend code.

## Running the Backend

From `app/backend/`:

```bash
cd app/backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000/api/predict`.

## Data and Notebooks

- `data/raw/` contains the original survey and Kaggle-style datasets
- `data/processed/` contains cleaned and labeled CSVs used for training and evaluation
- `notebooks/` documents the data understanding, labeling, EDA, and model training workflow

Notable notebooks:
- `01_data_understanding_SUR.ipynb`
- `01_data_understanding_SYN.ipynb`
- `03_BaseLine_LR_Kv2.ipynb`
- `03A_RandomForest_Kv2.ipynb`
- `03C_SVM_Kv2.ipynb`
- `04A_Test_Models_SUR.ipynb`

## Notes

- This project integrates ML and AI-driven consultation, so make sure the model paths and API keys are configured before starting the backend.
- The frontend expects the backend at `http://localhost:8000`, so run the backend first if you want the assessment features to work fully.

## Next Steps

- add a root `requirements.txt` or `pyproject.toml`
- unify model artifact paths for portability
- document training and model export steps in `Models/`
- expand the frontend README with usage and deployment notes
