import requests
import pandas as pd
import time

def build_api_url(latitude, longitude, start_date, end_date):
    """
    Constructs the NASA POWER API URL for a given location and date range.
    """
    # --- FIX ---
    # Correcting the base URL based on the user-provided format.
    base_url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    
    # List of desired weather parameters.
    parameters = [
        "T2M_MAX",
        "T2M_MIN",
        "PRECTOTCORR",
        "WS10M",
        "ALLSKY_SFC_SW_DWN",
        "RH2M"
    ]
    
    # Format dates as required by the API
    start_formatted = start_date.replace('-', '')
    end_formatted = end_date.replace('-', '')
    
    # Construct the full URL
    url = (
        f"{base_url}?"
            f"parameters={','.join(parameters)}&"
        f"community=RE&"  # Using RE for broad Renewable Energy met data
        f"longitude={longitude}&"
        f"latitude={latitude}&"
        f"start={start_formatted}&"
        f"end={end_formatted}&"
        f"format=JSON"
    )
    return url

def fetch_and_process_data(latitude, longitude, start_date, end_date):
    """
    Fetches and processes data from NASA POWER for a given location and date range.
    """
    api_request_url = build_api_url(latitude, longitude, start_date, end_date)
    
    try:
        response = requests.get(api_request_url, timeout=60) # Increased timeout for large data pulls
        response.raise_for_status()
        
        content = response.json()
        data_dict = content['properties']['parameter']
        
        df = pd.DataFrame(data_dict)
        
        df = df.reset_index()
        df = df.rename(columns={'index': 'YYYYMMDD'})
        df['date'] = pd.to_datetime(df['YYYYMMDD'], format='%Y%m%d')

        df = df.rename(columns={
            'T2M_MAX': 't_max_c',
            'T2M_MIN': 't_min_c',
            'PRECTOTCORR': 'precip_mm',
            'WS10M': 'wind_speed_ms',
            'ALLSKY_SFC_SW_DWN': 'solar_rad_w_m2',
            'RH2M': 'rh_percent'
        })
        
        df.replace(-999, pd.NA, inplace=True)
        
        final_columns = [
            'date', 't_max_c', 't_min_c', 'precip_mm', 
            'wind_speed_ms', 'solar_rad_w_m2', 'rh_percent'
        ]
        df = df[final_columns]
        
        df['latitude'] = latitude
        df['longitude'] = longitude

        return df

    except requests.exceptions.RequestException as e:
        print(f"  -> Error fetching data: {e}")
        return None
    except KeyError:
        print("  -> Error: Could not parse the data structure from the API response.")
        return None

if __name__ == '__main__':
    """
    locations = [
        (28.57, 77.32, "Noida"),
        (40.71, -74.00, "New_York_City"),
        (34.05, -118.24, "Los_Angeles"),
        (51.50, -0.12, "London"),
        (-33.86, 151.20, "Sydney")
    ]
        """
    # A strategically chosen list of 20 cities for a robust global model
    locations = [
        (40.71, -74.00, "New_York_City"),   # Temperate, Coastal (Existing)
        (34.05, -118.24, "Los_Angeles"),   # Mediterranean (Existing)
        (19.43, -99.13, "Mexico_City"),     # High Altitude, Tropical
        (-23.55, -46.63, "Sao_Paulo"),     # Southern Hemisphere, Humid Subtropical
        (49.28, -123.12, "Vancouver"),     # Oceanic

        (51.50, -0.12, "London"),          # Temperate, Oceanic (Existing)
        (48.85, 2.35, "Paris"),           # Temperate
        (55.75, 37.61, "Moscow"),          # Continental, Large Temp Swing
        (41.90, 12.50, "Rome"),            # Mediterranean

        (28.57, 77.32, "Noida"),           # Humid Subtropical (Existing)
        (35.68, 139.69, "Tokyo"),          # Humid Subtropical, Coastal
        (1.35, 103.81, "Singapore"),       # Tropical Rainforest (Equatorial)
        (39.90, 116.40, "Beijing"),        # Continental
        (25.20, 55.27, "Dubai"),           # Hot Desert

        (30.04, 31.23, "Cairo"),           # Hot Desert
        (-26.20, 28.04, "Johannesburg"),   # Southern Hemisphere, High Altitude
        (4.71, -1.02, "Nairobi"),          # Equatorial, High Altitude

        (-33.86, 151.20, "Sydney"),        # Southern Hemisphere, Temperate (Existing)
        (-36.84, 174.76, "Auckland"),      # Oceanic

        (64.14, -21.94, "Reykjavik")      # Subpolar Oceanic
    ]

    START_DATE = "1990-01-01"
    END_DATE = "2023-12-31"

    all_data = []

    print("Starting data curation process with corrected API endpoint...")
    for lat, lon, name in locations:
        print(f"Fetching data for {name} ({lat}, {lon})...")
        location_df = fetch_and_process_data(lat, lon, START_DATE, END_DATE)
        
        if location_df is not None:
            all_data.append(location_df)
            print(f"  -> Success! Fetched and processed data for {name}.")
        else:
            print(f"  -> Failed to fetch data for {name}.")
        
        # Add a small delay to be polite to the API server
        time.sleep(1)

    if all_data:
        final_dataset = pd.concat(all_data, ignore_index=True)
        
        output_filename = 'nasa_power_curated_dataset.csv'
        final_dataset.to_csv(output_filename, index=False)
        
        print(f"\nDataset curation complete!")
        print(f"Combined data for {len(all_data)} locations saved to '{output_filename}'")
        print(f"Total records: {len(final_dataset)}")
    else:
        print("\nNo data was successfully fetched. Please check the console for errors.")


