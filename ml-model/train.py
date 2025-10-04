import pandas as pd
import numpy as np
import lightgbm as lgb
import joblib
import json
import os

# --- Configuration ---
INPUT_DATASET = 'nasa_power_curated_dataset.csv'
ARTIFACTS_FOLDER = 'lgbm_model_artifacts/'

# --- Geographical Feature Data (Hardcoded for simplicity) ---
GEOGRAPHICAL_DATA = {
    "New_York_City": {"elevation_m": 10, "dist_to_coast_km": 0},
    "Los_Angeles": {"elevation_m": 93, "dist_to_coast_km": 0},
    "Mexico_City": {"elevation_m": 2240, "dist_to_coast_km": 250},
    "Sao_Paulo": {"elevation_m": 760, "dist_to_coast_km": 50},
    "Vancouver": {"elevation_m": 2, "dist_to_coast_km": 0},
    "London": {"elevation_m": 11, "dist_to_coast_km": 0},
    "Paris": {"elevation_m": 35, "dist_to_coast_km": 150},
    "Moscow": {"elevation_m": 156, "dist_to_coast_km": 800},
    "Rome": {"elevation_m": 21, "dist_to_coast_km": 20},
    "Noida": {"elevation_m": 200, "dist_to_coast_km": 1000},
    "Tokyo": {"elevation_m": 40, "dist_to_coast_km": 0},
    "Singapore": {"elevation_m": 15, "dist_to_coast_km": 0},
    "Beijing": {"elevation_m": 44, "dist_to_coast_km": 150},
    "Dubai": {"elevation_m": 5, "dist_to_coast_km": 0},
    "Cairo": {"elevation_m": 23, "dist_to_coast_km": 160},
    "Johannesburg": {"elevation_m": 1753, "dist_to_coast_km": 480},
    "Nairobi": {"elevation_m": 1795, "dist_to_coast_km": 420},
    "Sydney": {"elevation_m": 58, "dist_to_coast_km": 0},
    "Auckland": {"elevation_m": 1, "dist_to_coast_km": 0},
    "Reykjavik": {"elevation_m": 0, "dist_to_coast_km": 0}
}
CITY_MAP = {
    f"{lat}_{lon}": name for (lat, lon, name) in [
    (40.71, -74.00, "New_York_City"), (34.05, -118.24, "Los_Angeles"),
    (19.43, -99.13, "Mexico_City"), (-23.55, -46.63, "Sao_Paulo"),
    (49.28, -123.12, "Vancouver"), (51.50, -0.12, "London"),
    (48.85, 2.35, "Paris"), (55.75, 37.61, "Moscow"),
    (41.90, 12.50, "Rome"), (28.57, 77.32, "Noida"),
    (35.68, 139.69, "Tokyo"), (1.35, 103.81, "Singapore"),
    (39.90, 116.40, "Beijing"), (25.20, 55.27, "Dubai"),
    (30.04, 31.23, "Cairo"), (-26.20, 28.04, "Johannesburg"),
    (4.71, -1.02, "Nairobi"), (-33.86, 151.20, "Sydney"),
    (-36.84, 174.76, "Auckland"), (64.14, -21.94, "Reykjavik")]
}

def prepare_data(filepath):
    """Loads dataset and merges geographical features."""
    df = pd.read_csv(filepath)
    df['date'] = pd.to_datetime(df['date'])
    df['day_of_year'] = df['date'].dt.dayofyear
    df['year'] = df['date'].dt.year
    df['day_of_year_sin'] = np.sin(2 * np.pi * df['day_of_year'] / 366)
    df['day_of_year_cos'] = np.cos(2 * np.pi * df['day_of_year'] / 366)
    df['loc_key'] = df['latitude'].astype(str) + '_' + df['longitude'].astype(str)
    df['city_name'] = df['loc_key'].map(CITY_MAP)
    geo_df = pd.DataFrame.from_dict(GEOGRAPHICAL_DATA, orient='index')
    df = df.merge(geo_df, left_on='city_name', right_index=True, how='left')
    return df

def create_and_assign_bins(df):
    """Calculates percentile bins for temperature AND precipitation."""
    bins_data = {}
    df_binned = df.copy()
    
    # --- Temperature Binning (Unchanged) ---
    temp_bins_all = {}
    def assign_temp_bins_for_group(group):
        bins = {'very_cold': group['t_max_c'].quantile(0.10), 'cold': group['t_max_c'].quantile(0.25),
                'hot': group['t_max_c'].quantile(0.75), 'very_hot': group['t_max_c'].quantile(0.90)}
        loc_key = f"{group.name[0]}_{group.name[1]}"
        temp_bins_all[loc_key] = bins
        def get_bin(temp):
            if temp <= bins['very_cold']: return 'Very Cold'
            if temp <= bins['cold']: return 'Cold'
            if temp >= bins['very_hot']: return 'Very Hot'
            if temp >= bins['hot']: return 'Hot'
            return 'Moderate'
        return group['t_max_c'].apply(get_bin)
    df_binned['temp_bin'] = df_binned.groupby(['latitude', 'longitude'], group_keys=False).apply(assign_temp_bins_for_group)
    bins_data['temperature'] = temp_bins_all
    
    # --- NEW: Precipitation Binning ---
    precip_bins_all = {}
    def assign_precip_bins_for_group(group):
        # To get meaningful bins, we only look at days where it actually rained
        rainy_days = group[group['precip_mm'] > 0.1]
        bins = {'light_rain_thresh': rainy_days['precip_mm'].quantile(0.75) if not rainy_days.empty else 1.0}
        loc_key = f"{group.name[0]}_{group.name[1]}"
        precip_bins_all[loc_key] = bins
        def get_bin(precip):
            if precip < 0.1: return 'No Rain'
            if precip <= bins['light_rain_thresh']: return 'Light Rain'
            return 'Heavy Rain'
        return group['precip_mm'].apply(get_bin)
    df_binned['precip_bin'] = df_binned.groupby(['latitude', 'longitude'], group_keys=False).apply(assign_precip_bins_for_group)
    bins_data['precipitation'] = precip_bins_all
    
    return df_binned, bins_data

def train_models():
    """Main function to train BOTH temperature and precipitation models."""
    if not os.path.exists(ARTIFACTS_FOLDER):
        os.makedirs(ARTIFACTS_FOLDER)
    
    print("Step 1/6: Preparing data...")
    df = prepare_data(INPUT_DATASET)
    
    print("Step 2/6: Creating bins for temp and precip...")
    df_binned, weather_bins = create_and_assign_bins(df)

    features = ['latitude', 'longitude', 'year', 'day_of_year_sin', 'day_of_year_cos', 'elevation_m', 'dist_to_coast_km']
    X = df_binned[features]
    y_temp = df_binned['temp_bin']
    y_precip = df_binned['precip_bin'] # NEW target variable

    print("Step 3/6: Splitting data...")
    split_date = '2019-01-01'
    train_indices = df_binned['date'] < split_date
    test_indices = df_binned['date'] >= split_date
    X_train, X_test = X[train_indices], X[test_indices]
    y_temp_train, y_temp_test = y_temp[train_indices], y_temp[test_indices]
    y_precip_train, y_precip_test = y_precip[train_indices], y_precip[test_indices] # NEW split

    lgbm_params = {'objective': 'multiclass', 'metric': 'multi_logloss', 'n_estimators': 1000,
                   'learning_rate': 0.05, 'feature_fraction': 0.8, 'bagging_fraction': 0.8,
                   'bagging_freq': 1, 'lambda_l1': 0.1, 'lambda_l2': 0.1,
                   'num_leaves': 31, 'verbose': -1, 'n_jobs': -1, 'seed': 42}
    
    # --- Train Temperature Model (Unchanged) ---
    print("\nStep 4/6: Training Temperature Model...")
    temp_model = lgb.LGBMClassifier(**lgbm_params)
    temp_model.fit(X_train, y_temp_train, eval_set=[(X_test, y_temp_test)], callbacks=[lgb.early_stopping(100, verbose=False)])
    accuracy_temp = temp_model.score(X_test, y_temp_test)
    print(f"  -> Temp Model Test Accuracy: {accuracy_temp:.2%}")

    # --- NEW: Train Precipitation Model ---
    print("\nStep 5/6: Training Precipitation Model...")
    precip_model = lgb.LGBMClassifier(**lgbm_params)
    precip_model.fit(X_train, y_precip_train, eval_set=[(X_test, y_precip_test)], callbacks=[lgb.early_stopping(100, verbose=False)])
    accuracy_precip = precip_model.score(X_test, y_precip_test)
    print(f"  -> Precip Model Test Accuracy: {accuracy_precip:.2%}")

    # --- MODIFIED: Save all artifacts ---
    print("\nStep 6/6: Saving all model artifacts...")
    joblib.dump(temp_model, os.path.join(ARTIFACTS_FOLDER, 'lgbm_temperature_model.pkl'))
    joblib.dump(precip_model, os.path.join(ARTIFACTS_FOLDER, 'lgbm_precipitation_model.pkl')) # NEW
    with open(os.path.join(ARTIFACTS_FOLDER, 'lgbm_weather_bins.json'), 'w') as f:
        json.dump(weather_bins, f, indent=4)
        
    print(f"\n--- Training Complete --- \nAll artifacts saved in '{ARTIFACTS_FOLDER}'.")

if __name__ == '__main__':
    train_models()


