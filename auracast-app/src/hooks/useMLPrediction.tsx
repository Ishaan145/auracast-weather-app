import { useState } from 'react';

// Define the structure of the prediction request
interface PredictionRequest {
  latitude: number;
  longitude: number;
  date: string;
  elevation_m: number;
  dist_to_coast_km: number;
}

// Define the structure of the prediction response
interface PredictionResponse {
  requested_location: any;
  predictions: {
    temperature: {
      probabilities: { [key: string]: number };
      most_likely: string;
    };
    precipitation: {
      probabilities: { [key: string]: number };
      most_likely: string;
    };
  };
}

export const useMLPrediction = () => {
  const [error, setError] = useState<string | null>(null);

  const predict = async (request: PredictionRequest): Promise<PredictionResponse | null> => {
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction from the ML model.');
      }

      const data: PredictionResponse = await response.json();
      setError(null); // Clear any previous errors
      return data;

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      return null;
    }
  };

  return { predict, error };
};