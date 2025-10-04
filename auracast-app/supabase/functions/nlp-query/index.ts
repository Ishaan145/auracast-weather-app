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
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing natural language query:', query);

    const systemPrompt = `You are a weather query parser. Extract location, date, and activity information from natural language queries.
Return ONLY a JSON object with these fields (all optional):
- location: string (city or place name)
- date: string (ISO format YYYY-MM-DD if specific date mentioned, otherwise null)
- activity: string (one of: hiking, fishing, outdoor-event, wedding, sports, or null)
- timeframe: string (one of: daily, weekly, monthly, weekend, or null)
- coords: [number, number] (latitude, longitude if you know the location)

Common location coordinates:
- Manali: [32.2432, 77.1892]
- Goa: [15.2993, 74.1240]
- Delhi/New Delhi: [28.7041, 77.1025]
- Mumbai: [19.0760, 72.8777]
- Bangalore: [12.9716, 77.5946]
- Shimla: [31.1048, 77.1734]
- Nainital: [29.3803, 79.4636]
- Tokyo: [35.6762, 139.6503]
- London: [51.5074, -0.1278]
- New York: [40.7128, -74.0060]

If date is "tomorrow", calculate tomorrow's date from today.
If "next week" or "this week", use timeframe: "weekly".
If "weekend", calculate next Friday's date and set timeframe: "weekend".
If month name mentioned, use that month with current year.

Return ONLY the JSON, no other text.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser query: ${query}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
          responseMimeType: 'application/json'
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again later' }), 
          { 
            status: 429, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted' }), 
          { 
            status: 402, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to process query' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      console.error('No content in Gemini response');
      throw new Error('No response from Gemini API');
    }

    console.log('Gemini response text:', content);

    // Parse the JSON response
    let parsed;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleanContent);
      console.log('Parsed result:', parsed);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', content, parseError);
      // Return a basic fallback
      parsed = { location: null, date: null, activity: null };
    }

    console.log('Parsed query result:', parsed);

    return new Response(
      JSON.stringify(parsed), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in nlp-query function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
