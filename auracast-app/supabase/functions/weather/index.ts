import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fetch current weather from Open-Meteo (free, no API key)
async function fetchCurrentWeather(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,uv_index&timezone=auto`;
  
  console.log('Fetching current weather from Open-Meteo...');
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('✅ Current weather fetched successfully');
  
  return data;
}

// Process NASA data to get predictions for a specific date
function processNASADataForDate(nasaData: any, targetMonth: number, targetDay: number) {
  if (!nasaData?.properties?.parameter) {
    return null;
  }

  const parameters = nasaData.properties.parameter;
  let rainDays = 0;
  let totalDays = 0;
  const tempReadings: number[] = [];
  const maxTempReadings: number[] = [];
  const minTempReadings: number[] = [];
  const windSpeedReadings: number[] = [];
  const humidityReadings: number[] = [];
  const precipReadings: number[] = [];

  // Extract data for the target date across all years
  Object.keys(parameters.T2M || {}).forEach((dateKey) => {
    if (dateKey.length !== 8) return;

    const month = parseInt(dateKey.substring(4, 6));
    const day = parseInt(dateKey.substring(6, 8));

    if (month === targetMonth && day === targetDay) {
      totalDays++;

      const temp = parameters.T2M?.[dateKey];
      const precip = parameters.PRECTOTCORR?.[dateKey];
      const maxTemp = parameters.T2M_MAX?.[dateKey];
      const minTemp = parameters.T2M_MIN?.[dateKey];
      const windSpeed = parameters.WS2M?.[dateKey];
      const humidity = parameters.RH2M?.[dateKey];

      if (temp !== null && temp !== undefined && temp !== -999) tempReadings.push(temp);
      if (maxTemp !== null && maxTemp !== undefined && maxTemp !== -999) maxTempReadings.push(maxTemp);
      if (minTemp !== null && minTemp !== undefined && minTemp !== -999) minTempReadings.push(minTemp);
      if (windSpeed !== null && windSpeed !== undefined && windSpeed !== -999) windSpeedReadings.push(windSpeed);
      if (humidity !== null && humidity !== undefined && humidity !== -999) humidityReadings.push(humidity);
      if (precip !== null && precip !== undefined && precip !== -999) {
        precipReadings.push(precip);
        if (precip > 0.1) rainDays++;
      }
    }
  });

  const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
  const extremeProb = (arr: number[], threshold: number, above: boolean) => {
    if (arr.length === 0) return 0;
    const count = arr.filter(v => above ? v > threshold : v < threshold).length;
    return Math.round((count / arr.length) * 100);
  };

  return {
    rainProbability: totalDays > 0 ? Math.round((rainDays / totalDays) * 100) : 0,
    avgTemperature: avg(tempReadings),
    avgMaxTemperature: avg(maxTempReadings),
    avgMinTemperature: avg(minTempReadings),
    avgWindSpeed: avg(windSpeedReadings),
    avgHumidity: avg(humidityReadings),
    avgPrecipitation: avg(precipReadings),
    extremeConditions: {
      veryHot: extremeProb(maxTempReadings, 35, true),
      veryCold: extremeProb(minTempReadings, 0, false),
      veryWindy: extremeProb(windSpeedReadings, 6.94, true),
      veryWet: extremeProb(precipReadings, 10, true),
    },
    totalYearsAnalyzed: totalDays,
    dataSource: 'NASA POWER API (30-year historical)',
  };
}

// Fetch and process historical data from NASA POWER API
async function fetchNASAHistoricalData(lat: number, lon: number) {
  const endYear = new Date().getFullYear() - 1;
  const startYear = endYear - 30;
  const startDate = `${startYear}0101`;
  const endDate = `${endYear}1231`;
  
  const parameters = 'T2M,PRECTOTCORR,T2M_MAX,T2M_MIN,WS2M,RH2M';
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=${parameters}&community=SB&longitude=${lon}&latitude=${lat}&start=${startDate}&end=${endDate}&format=JSON`;
  
  console.log('📡 Fetching NASA POWER historical data...');
  const response = await fetch(url);
  
  if (!response.ok) {
    console.warn('NASA API failed, continuing without historical data');
    return null;
  }
  
  const data = await response.json();
  console.log('✅ NASA historical data fetched successfully');
  
  return data;
}

// Map Open-Meteo weather codes to text descriptions
function getWeatherCondition(code: number): { text: string; icon: string } {
  const weatherMap: { [key: number]: { text: string; icon: string } } = {
    0: { text: 'Clear sky', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
    1: { text: 'Mainly clear', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
    2: { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' },
    3: { text: 'Overcast', icon: '//cdn.weatherapi.com/weather/64x64/day/119.png' },
    45: { text: 'Foggy', icon: '//cdn.weatherapi.com/weather/64x64/day/248.png' },
    48: { text: 'Depositing rime fog', icon: '//cdn.weatherapi.com/weather/64x64/day/248.png' },
    51: { text: 'Light drizzle', icon: '//cdn.weatherapi.com/weather/64x64/day/263.png' },
    53: { text: 'Moderate drizzle', icon: '//cdn.weatherapi.com/weather/64x64/day/266.png' },
    55: { text: 'Dense drizzle', icon: '//cdn.weatherapi.com/weather/64x64/day/266.png' },
    61: { text: 'Slight rain', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png' },
    63: { text: 'Moderate rain', icon: '//cdn.weatherapi.com/weather/64x64/day/302.png' },
    65: { text: 'Heavy rain', icon: '//cdn.weatherapi.com/weather/64x64/day/308.png' },
    71: { text: 'Slight snow', icon: '//cdn.weatherapi.com/weather/64x64/day/326.png' },
    73: { text: 'Moderate snow', icon: '//cdn.weatherapi.com/weather/64x64/day/332.png' },
    75: { text: 'Heavy snow', icon: '//cdn.weatherapi.com/weather/64x64/day/338.png' },
    80: { text: 'Slight rain showers', icon: '//cdn.weatherapi.com/weather/64x64/day/353.png' },
    81: { text: 'Moderate rain showers', icon: '//cdn.weatherapi.com/weather/64x64/day/356.png' },
    82: { text: 'Violent rain showers', icon: '//cdn.weatherapi.com/weather/64x64/day/359.png' },
    95: { text: 'Thunderstorm', icon: '//cdn.weatherapi.com/weather/64x64/day/386.png' },
  };
  
  return weatherMap[code] || { text: 'Unknown', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' };
}

// Get location name from coordinates using reverse geocoding
async function getLocationName(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'AuraCast Weather App' }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.address?.city || data.address?.town || data.address?.village || data.display_name?.split(',')[0] || 'Unknown Location';
    }
  } catch (error) {
    console.log('Geocoding failed, using coordinates');
  }
  
  return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, days = 7 } = await req.json();
    
    if (!lat || !lon) {
      return new Response(
        JSON.stringify({ error: 'Latitude and longitude are required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('🌍 Weather request for:', { lat, lon, days });

    // Fetch data in parallel
    const [currentWeather, locationName, nasaData] = await Promise.all([
      fetchCurrentWeather(lat, lon),
      getLocationName(lat, lon),
      fetchNASAHistoricalData(lat, lon).catch(() => null)
    ]);

    const condition = getWeatherCondition(currentWeather.current.weather_code);
    
    // Process NASA data for current date to get historical predictions
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const historicalPrediction = nasaData ? processNASADataForDate(nasaData, currentMonth, currentDay) : null;
    
    console.log('📊 Historical prediction:', historicalPrediction);
    
    // Generate safety alerts based on historical data
    const alerts: any[] = [];
    if (historicalPrediction) {
      if (historicalPrediction.extremeConditions.veryHot > 20) {
        alerts.push({
          headline: 'High Temperature Alert',
          desc: `Historical data shows ${historicalPrediction.extremeConditions.veryHot}% chance of temperatures above 35°C on this date.`,
          severity: 'Moderate',
          urgency: 'Expected',
          areas: locationName,
          category: 'Met',
          certainty: 'Likely',
          event: 'Heat Advisory',
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 86400000).toISOString(),
        });
      }
      if (historicalPrediction.rainProbability > 50) {
        alerts.push({
          headline: 'Rain Likely',
          desc: `Historical data shows ${historicalPrediction.rainProbability}% chance of rain on this date.`,
          severity: 'Minor',
          urgency: 'Expected',
          areas: locationName,
          category: 'Met',
          certainty: 'Likely',
          event: 'Rain Advisory',
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 86400000).toISOString(),
        });
      }
      if (historicalPrediction.extremeConditions.veryWindy > 25) {
        alerts.push({
          headline: 'Wind Advisory',
          desc: `Historical data shows ${historicalPrediction.extremeConditions.veryWindy}% chance of strong winds on this date.`,
          severity: 'Moderate',
          urgency: 'Expected',
          areas: locationName,
          category: 'Met',
          certainty: 'Possible',
          event: 'Wind Advisory',
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 86400000).toISOString(),
        });
      }
    }
    
    // Transform to expected format
    const weatherData = {
      location: {
        name: locationName,
        region: '',
        country: '',
        lat: lat,
        lon: lon,
        localtime: currentWeather.current.time
      },
      current: {
        temp_c: currentWeather.current.temperature_2m,
        temp_f: (currentWeather.current.temperature_2m * 9/5) + 32,
        condition: {
          text: condition.text,
          icon: condition.icon,
          code: currentWeather.current.weather_code
        },
        wind_kph: currentWeather.current.wind_speed_10m,
        wind_dir: getWindDirection(currentWeather.current.wind_direction_10m),
        pressure_mb: currentWeather.current.pressure_msl,
        humidity: currentWeather.current.relative_humidity_2m,
        uv: currentWeather.current.uv_index || 0,
        vis_km: 10, // Default visibility
      },
      historical_prediction: historicalPrediction,
      alerts: {
        alert: alerts
      }
    };

    console.log('✅ Weather data compiled successfully');

    return new Response(
      JSON.stringify(weatherData), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('❌ Error in weather function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : ''
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}
