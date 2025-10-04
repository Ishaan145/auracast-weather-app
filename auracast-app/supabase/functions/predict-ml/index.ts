import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, date, elevation_m, dist_to_coast_km } = await req.json();

    console.log('Predict ML request:', { latitude, longitude, date, elevation_m, dist_to_coast_km });

    // Call the localhost ML model API
    // NOTE: This will only work when running locally
    const mlResponse = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
        date,
        elevation_m: elevation_m || 200,
        dist_to_coast_km: dist_to_coast_km || 1000,
      }),
    });

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      console.error('ML API error:', mlResponse.status, errorText);
      throw new Error(`ML API returned ${mlResponse.status}: ${errorText}`);
    }

    const mlData = await mlResponse.json();
    console.log('ML prediction received:', mlData);

    return new Response(JSON.stringify(mlData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to get prediction',
        note: 'This endpoint requires the ML model to be running on localhost:8000'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
