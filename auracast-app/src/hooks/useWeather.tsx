import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_dir: string;
    pressure_mb: number;
    humidity: number;
    uv: number;
    vis_km: number;
    air_quality?: {
      pm2_5: number;
      pm10: number;
      'us-epa-index': number;
    };
  };
  historical_prediction?: {
    rainProbability: number;
    avgTemperature: number | null;
    avgMaxTemperature: number | null;
    avgMinTemperature: number | null;
    avgWindSpeed: number | null;
    avgHumidity: number | null;
    avgPrecipitation: number | null;
    extremeConditions: {
      veryHot: number;
      veryCold: number;
      veryWindy: number;
      veryWet: number;
    };
    totalYearsAnalyzed: number;
    dataSource: string;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avgtemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
        daily_chance_of_rain: number;
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
        };
        chance_of_rain: number;
        wind_kph: number;
      }>;
    }>;
  };
  alerts?: {
    alert: Array<{
      headline: string;
      severity: string;
      event: string;
      desc: string;
    }>;
  };
}

export function useWeather(lat: number | null, lon: number | null, days: number = 7) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) {
      console.log('useWeather: No coordinates provided', { lat, lon });
      setWeather(null);
      setIsLoading(false);
      return;
    }

    const fetchWeather = async () => {
      console.log('useWeather: Fetching weather for', { lat, lon, days });
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: functionError } = await supabase.functions.invoke('weather', {
          body: { lat, lon, days }
        });

        console.log('useWeather: Response received', { data, functionError });

        if (functionError) {
          console.error('Weather function error:', functionError);
          setError(functionError.message || 'Failed to fetch weather data');
          setIsLoading(false);
          return;
        }

        if (data?.error) {
          console.error('Weather API error:', data.error);
          setError(data.error);
          setIsLoading(false);
          return;
        }

        if (data) {
          console.log('useWeather: Setting weather data', data);
          setWeather(data);
        } else {
          console.warn('useWeather: No data received');
          setError('No weather data received');
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon, days]);

  return { weather, isLoading, error };
}
