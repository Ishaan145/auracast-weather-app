import pandas as pd
import numpy as np
import joblib
import json
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware # Import the CORS middleware

# --- Configuration ---
# Define the location of your trained model artifacts
ARTIFACTS_FOLDER = 'lgbm_model_artifacts/'
TEMP_MODEL_PATH = os.path.join(ARTIFACTS_FOLDER, 'lgbm_temperature_model.pkl')
PRECIP_MODEL_PATH = os.path.join(ARTIFACTS_FOLDER, 'lgbm_precipitation_model.pkl')
BINS_PATH = os.path.join(ARTIFACTS_FOLDER, 'lgbm_weather_bins.json')

# --- Load All Artifacts at Server Startup ---
# This is a critical performance optimization. Models are loaded once into memory.
models = {}
try:
    print("Loading all model artifacts...")
    # Load the temperature model
    models['temperature'] = joblib.load(TEMP_MODEL_PATH)
    # Load the new precipitation model
    models['precipitation'] = joblib.load(PRECIP_MODEL_PATH)
    # Load the bins definition file for reference
    with open(BINS_PATH, 'r') as f:
        weather_bins = json.load(f)
    print("All artifacts loaded successfully.")
except Exception as e:
    print(f"FATAL ERROR: Could not load all model artifacts. {e}")
    print("Please ensure the 'train_lightgbm_model.py' script has been run successfully.")
    models = {} # Clear models dictionary to indicate failure

# Initialize the FastAPI application
app = FastAPI(
    title="AuraCast Multi-Prediction API",
    description="An API to predict long-range probabilities for both temperature and precipitation."
)

# --- Enable CORS ---
# This will allow your frontend running on localhost:8080 to communicate with your backend.
origins = [
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Define the structure of the incoming API request ---
# This Pydantic model ensures all required fields are present and valid.
class PredictionRequest(BaseModel):
    latitude: float = Field(..., example=28.57, description="Latitude of the location (-90 to 90)")
    longitude: float = Field(..., example=77.32, description="Longitude of the location (-180 to 180)")
    date: str = Field(..., example="2026-07-04", description="Future date in YYYY-MM-DD format")
    elevation_m: int = Field(..., example=200, description="Elevation of the location in meters")
    dist_to_coast_km: int = Field(..., example=1000, description="Distance from the location to the nearest coastline in km")

@app.on_event("startup")
async def startup_event():
    if not models:
        print("WARNING: Application is starting without loaded models. The /predict endpoint will fail.")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AuraCast Prediction API. Go to /docs for the interactive API documentation."}

@app.post("/predict")
def predict_climatology(request: PredictionRequest):
    """
    Accepts a location (lat, lon, elevation, coastal distance) and a future date,
    and returns the predicted historical probabilities for BOTH temperature and precipitation.
    """
    if 'temperature' not in models or 'precipitation' not in models:
        raise HTTPException(status_code=500, detail="One or more models are not loaded. Check server logs.")

    try:
        # --- 1. Feature Engineering ---
        # This block is identical to the training script to ensure consistency.
        target_date = datetime.strptime(request.date, '%Y-%m-%d')
        day_of_year = target_date.timetuple().tm_yday
        year = target_date.year
        day_of_year_sin = np.sin(2 * np.pi * day_of_year / 366)
        day_of_year_cos = np.cos(2 * np.pi * day_of_year / 366)

        # Create a DataFrame from the request data with the exact column order the models expect.
        input_data = {
            'latitude': request.latitude,
            'longitude': request.longitude,
            'year': year,
            'day_of_year_sin': day_of_year_sin,
            'day_of_year_cos': day_of_year_cos,
            'elevation_m': request.elevation_m,
            'dist_to_coast_km': request.dist_to_coast_km
        }
        features_df = pd.DataFrame([input_data])

        # --- 2. Make Predictions with BOTH models ---
        print(f"Predicting for: {request.dict()}")
        temp_probs = models['temperature'].predict_proba(features_df)[0]
        precip_probs = models['precipitation'].predict_proba(features_df)[0]

        # --- 3. Format the Rich, Combined JSON Response ---
        temp_labels = models['temperature'].classes_
        precip_labels = models['precipitation'].classes_

        response = {
            "requested_location": vars(request),
            "predictions": {
                "temperature": {
                    "probabilities": {label: round(float(prob), 4) for label, prob in zip(temp_labels, temp_probs)},
                    "most_likely": temp_labels[np.argmax(temp_probs)]
                },
                "precipitation": {
                    "probabilities": {label: round(float(prob), 4) for label, prob in zip(precip_labels, precip_probs)},
                    "most_likely": precip_labels[np.argmax(precip_probs)]
                }
            }
        }

        print("Prediction successful.")
        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid input: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {e}")