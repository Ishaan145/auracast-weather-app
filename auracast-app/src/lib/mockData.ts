// Mock data based on research documents for AuraCast

export interface WeatherRisk {
  overall: number;
  factors: {
    hot: number;
    cold: number;
    windy: number;
    wet: number;
  };
  insight: string;
  confidence: number;
  trend?: {
    direction: 'increasing' | 'decreasing' | 'stable';
    change: string;
    significance: number;
  };
}

export interface Location {
  name: string;
  lat: number;
  lon: number;
  coords: [number, number];
}

export interface NearbyRisk {
  name: string;
  risk: number;
  coords: [number, number];
  distance: number;
}

export interface TravelWaypoint {
  name: string;
  risk: number;
  coords: [number, number];
  eta?: string;
}

export interface SafetyAlert {
  id: number;
  type: 'Pest' | 'Safety' | 'Weather' | 'Environmental';
  severity: 'Low' | 'Medium' | 'High';
  message: string;
  timestamp: string;
  location?: string;
}

export interface LiveWeather {
  location: string;
  temperature: string;
  condition: string;
  humidity: string;
  wind: string;
  pressure: string;
  visibility: string;
  uv: string;
}

export interface CommunityMessage {
  id: number;
  user: string;
  message: string;
  timestamp: string;
  likes?: number;
}

// Mock Database
export const MOCK_DATA = {
  // User authentication
  users: {
    "ishaan@auracast.io": { 
      password: "password123", 
      name: "Ishaan Saxena",
      role: "admin"
    },
    "demo@auracast.io": {
      password: "demo123",
      name: "Demo User",
      role: "user"
    }
  },

  // Location database
  locations: {
    "New Delhi, India": { 
      name: "New Delhi, India",
      lat: 28.7041, 
      lon: 77.1025, 
      coords: [77.1025, 28.7041] as [number, number]
    },
    "Chicago, IL": { 
      name: "Chicago, IL",
      lat: 41.8781, 
      lon: -87.6298, 
      coords: [-87.6298, 41.8781] as [number, number]
    },
    "Tokyo, Japan": { 
      name: "Tokyo, Japan",
      lat: 35.6762, 
      lon: 139.6503, 
      coords: [139.6503, 35.6762] as [number, number]
    },
    "Mumbai, India": {
      name: "Mumbai, India",
      lat: 19.0760,
      lon: 72.8777,
      coords: [72.8777, 19.0760] as [number, number]
    },
    "London, UK": {
      name: "London, UK",
      lat: 51.5074,
      lon: -0.1278,
      coords: [-0.1278, 51.5074] as [number, number]
    }
  },

  // Weather risk data with climatological insights
  weatherData: {
    "New Delhi, India": {
      overall: 72,
      factors: { hot: 85, cold: 1, windy: 40, wet: 60 },
      insight: "High risk due to extreme heat probability (85%) and significant monsoon potential (60%). Historical data shows increasing heat trends (+1.3°C/decade). Outdoor activities not recommended during peak hours (11 AM - 4 PM).",
      confidence: 94,
      trend: {
        direction: 'increasing' as const,
        change: '+12% risk increase over past decade',
        significance: 0.95
      },
      nearby: [
        { name: "Gurugram", risk: 75, coords: [77.0266, 28.4595] as [number, number], distance: 32 },
        { name: "Noida", risk: 70, coords: [77.3910, 28.5355] as [number, number], distance: 25 },
        { name: "Faridabad", risk: 78, coords: [77.3178, 28.4089] as [number, number], distance: 29 }
      ]
    },
    "Chicago, IL": {
      overall: 42,
      factors: { hot: 18, cold: 25, windy: 45, wet: 35 },
      insight: "Moderate risk primarily from wind patterns (45%) and precipitation probability (35%). Lake effect creates unique microclimates. Consider covered venues for optimal safety.",
      confidence: 89,
      trend: {
        direction: 'stable' as const,
        change: 'No significant trend change',
        significance: 0.12
      },
      nearby: [
        { name: "Evanston", risk: 45, coords: [-87.6877, 42.0451] as [number, number], distance: 19 },
        { name: "Oak Park", risk: 40, coords: [-87.7887, 41.8851] as [number, number], distance: 16 },
        { name: "Schaumburg", risk: 38, coords: [-88.0834, 42.0334] as [number, number], distance: 42 }
      ]
    },
    "Tokyo, Japan": {
      overall: 55,
      factors: { hot: 32, cold: 8, windy: 45, wet: 70 },
      insight: "High precipitation risk (70%) with significant wind potential (45%). Rainy season patterns show 23% increase in intensity over 30 years. Indoor alternatives strongly recommended.",
      confidence: 91,
      trend: {
        direction: 'increasing' as const,
        change: '+8% precipitation intensity increase',
        significance: 0.87
      },
      nearby: [
        { name: "Yokohama", risk: 58, coords: [139.6380, 35.4437] as [number, number], distance: 28 },
        { name: "Chiba", risk: 52, coords: [140.1230, 35.6047] as [number, number], distance: 35 },
        { name: "Kawasaki", risk: 60, coords: [139.7028, 35.5208] as [number, number], distance: 18 }
      ]
    },
    "Mumbai, India": {
      overall: 78,
      factors: { hot: 45, cold: 2, windy: 35, wet: 90 },
      insight: "Extreme monsoon risk (90%) with moderate heat stress (45%). Coastal location amplifies precipitation patterns. Historical trend shows 15% increase in heavy rainfall events.",
      confidence: 96,
      trend: {
        direction: 'increasing' as const,
        change: '+15% heavy rainfall frequency',
        significance: 0.92
      },
      nearby: [
        { name: "Pune", risk: 65, coords: [73.8567, 18.5204] as [number, number], distance: 149 },
        { name: "Thane", risk: 80, coords: [72.9781, 19.2183] as [number, number], distance: 25 },
        { name: "Navi Mumbai", risk: 76, coords: [73.0297, 19.0330] as [number, number], distance: 22 }
      ]
    },
    "London, UK": {
      overall: 48,
      factors: { hot: 5, cold: 15, windy: 55, wet: 65 },
      insight: "High precipitation probability (65%) with significant wind risk (55%). Atlantic weather systems create variable conditions. Umbrella and windproof equipment essential.",
      confidence: 88,
      trend: {
        direction: 'increasing' as const,
        change: '+5% wind intensity over 20 years',
        significance: 0.76
      },
      nearby: [
        { name: "Windsor", risk: 45, coords: [-0.6068, 51.4816] as [number, number], distance: 34 },
        { name: "Brighton", risk: 52, coords: [-0.1372, 50.8225] as [number, number], distance: 84 },
        { name: "Cambridge", risk: 42, coords: [0.1218, 52.2053] as [number, number], distance: 97 }
      ]
    }
  },

  // Travel route analysis
  travelRoutes: {
    "New Delhi, India to Tokyo, Japan": {
      waypoints: [
        { name: "New Delhi (Start)", risk: 72, coords: [77.1025, 28.7041] as [number, number], eta: "Start" },
        { name: "Lahore, Pakistan", risk: 68, coords: [74.3587, 31.5204] as [number, number], eta: "4 hours" },
        { name: "Islamabad, Pakistan", risk: 55, coords: [73.0479, 33.6844] as [number, number], eta: "6 hours" },
        { name: "Tashkent, Uzbekistan", risk: 45, coords: [69.2401, 41.2995] as [number, number], eta: "12 hours" },
        { name: "Beijing, China", risk: 52, coords: [116.4074, 39.9042] as [number, number], eta: "20 hours" },
        { name: "Tokyo (End)", risk: 55, coords: [139.6503, 35.6762] as [number, number], eta: "26 hours" }
      ],
      totalDistance: "6,247 km",
      estimatedTime: "26 hours driving",
      averageRisk: 58,
      riskFactors: {
        weather: 60,
        seasonal: 45,
        geographical: 55
      }
    }
  },

  // Live weather data
  liveWeather: {
    location: 'New Delhi, India',
    temperature: '34°C',
    condition: 'Hazy Sunshine',
    humidity: '72%',
    wind: '12 km/h NE',
    pressure: '1008 hPa',
    visibility: '6 km',
    uv: 'Very High (9)'
  },

  // Safety alerts with enhanced categorization
  safetyAlerts: [
    {
      id: 1,
      type: 'Pest' as const,
      severity: 'High' as const,
      message: 'Locust swarm activity detected 50km northwest. Agricultural and outdoor events should take preventive measures. Historical probability: 12% for this region during October.',
      timestamp: '2024-09-22T10:30:00Z',
      location: 'Rajasthan Border Region'
    },
    {
      id: 2,
      type: 'Safety' as const,
      severity: 'Medium' as const,
      message: 'Increased snake activity reported in rural areas. Exercise caution during early morning hours (5-8 AM). Seasonal pattern: 34% increase during post-monsoon period.',
      timestamp: '2024-09-22T08:45:00Z',
      location: 'Rural NCR'
    },
    {
      id: 3,
      type: 'Weather' as const,
      severity: 'High' as const,
      message: 'Dust storm probability elevated to 67% for next 48 hours. Air quality expected to deteriorate significantly. Indoor activities recommended.',
      timestamp: '2024-09-22T12:15:00Z',
      location: 'New Delhi'
    }
  ],

  // Community chat with engagement metrics
  communityChat: [
    {
      id: 1,
      user: "Sarah L.",
      message: "The Travel View is a game-changer for my road trip planning! Just analyzed Mumbai to Goa route - saved me from monsoon disaster!",
      timestamp: "2024-09-22T09:30:00Z",
      likes: 24
    },
    {
      id: 2,
      user: "Ishaan Saxena",
      message: "Glad you're finding it useful! We're adding real-time API integration and ML-powered trend analysis soon. Any specific features you'd like to see?",
      timestamp: "2024-09-22T09:45:00Z",
      likes: 18
    },
    {
      id: 3,
      user: "Mike Chen",
      message: "Love the activity-specific risk weighting! As a wedding planner, the precipitation risk analysis is spot-on. Can we get venue-specific microclimates?",
      timestamp: "2024-09-22T10:15:00Z",
      likes: 12
    },
    {
      id: 4,
      user: "Priya Sharma",
      message: "The historical trend analysis is fascinating. Shows how climate change is affecting our local area over 30 years. Very eye-opening!",
      timestamp: "2024-09-22T11:20:00Z",
      likes: 31
    },
    {
      id: 5,
      user: "David Kim",
      message: "As a construction project manager, this saves me thousands in weather contingency planning. The confidence scores are incredibly helpful for risk assessment.",
      timestamp: "2024-09-22T12:05:00Z",
      likes: 19
    },
    {
      id: 6,
      user: "Maria Rodriguez",
      message: "Just planned my hiking expedition for next spring using the activity-specific weights. The temperature extreme analysis for high-altitude activities is perfect!",
      timestamp: "2024-09-22T13:15:00Z",
      likes: 15
    },
    {
      id: 7,
      user: "Alex Thompson",
      message: "The climate change trend integration is brilliant. Shows +2.1°C warming in our region over 30 years - essential for long-term agricultural planning.",
      timestamp: "2024-09-22T14:30:00Z",
      likes: 28
    },
    {
      id: 8,
      user: "Jennifer Park",
      message: "Fishing trip planner here! The wind pattern analysis is incredibly accurate. Saved me from a very rough day on the water last weekend.",
      timestamp: "2024-09-22T15:45:00Z",
      likes: 13
    }
  ],

  // FAQ with enhanced climatological focus
  faq: [
    {
      q: "How is AuraCast different from traditional weather apps?",
      a: "We provide long-term climatological probability, not short-term weather forecasts. We analyze 30+ years of historical data to give you statistical risk assessments for any day of the year, enabling planning up to 6+ months in advance."
    },
    {
      q: "What does 'Activity-Specific' risk mean?",
      a: "Our algorithm weighs weather factors differently based on your activity. High wind is a bigger risk for fishing than hiking, and our scores reflect that. We use mathematical risk weighting systems calibrated for different activity profiles."
    },
    {
      q: "How accurate are your risk assessments?",
      a: "Our confidence scores range from 85-96% based on data completeness and statistical significance. We use minimum 30-year datasets and provide transparency through confidence intervals and trend analysis."
    },
    {
      q: "What is climatological vs meteorological analysis?",
      a: "Meteorology predicts specific weather events 7-10 days ahead. Climatology analyzes historical patterns to determine statistical probabilities for any date. We focus on climatology for long-term planning reliability."
    },
    {
      q: "How do you account for climate change?",
      a: "We integrate trend analysis showing how weather patterns have changed over decades. Our algorithm identifies statistically significant trends and incorporates them into future probability assessments."
    },
    {
      q: "Why use statistical probability vs forecasting?",
      a: "Weather forecasts become unreliable beyond 7-10 days due to chaos theory limitations. Statistical probability based on 30+ years of data provides reliable risk assessment for long-term planning, which is essential for outdoor events planned months in advance."
    },
    {
      q: "How do you handle different climate regions?",
      a: "We use hybrid thresholds combining absolute safety standards with location-specific percentiles. For example, 90°F is normal in Phoenix but extreme in Vermont. Our algorithm automatically adjusts risk scoring based on local climate norms."
    },
    {
      q: "What's the minimum planning horizon?",
      a: "While we can provide analysis for any date, our system excels at long-term planning (3-6+ months ahead) where traditional forecasts fail. For immediate planning (1-7 days), we recommend consulting meteorological forecasts alongside our risk assessment."
    }
  ],

  // Activity profiles for risk weighting
  activityProfiles: {
    hiking: {
      name: "Hiking",
      weights: { hot: 0.9, cold: 0.8, windy: 0.4, wet: 0.7 },
      description: "High sensitivity to temperature extremes and precipitation",
      icon: "SunIcon"
    },
    wedding: {
      name: "Wedding",
      weights: { hot: 0.8, cold: 0.6, windy: 0.8, wet: 1.0 },
      description: "Critical sensitivity to precipitation, high sensitivity to wind", 
      icon: "CloudRainIcon"
    },
    fishing: {
      name: "Fishing",
      weights: { hot: 0.6, cold: 0.5, windy: 0.9, wet: 0.5 },
      description: "Extremely sensitive to wind conditions for casting and boat control",
      icon: "WindIcon"
    },
    construction: {
      name: "Construction", 
      weights: { hot: 0.9, cold: 0.7, windy: 0.8, wet: 0.9 },
      description: "High sensitivity to all conditions for worker safety",
      icon: "AlertIcon"
    },
    festival: {
      name: "Festival",
      weights: { hot: 0.7, cold: 0.5, windy: 0.6, wet: 0.9 },
      description: "Critical precipitation sensitivity, moderate temperature tolerance",
      icon: "SnowIcon"
    }
  }
};

// Helper functions for risk calculations
export const calculateActivityRisk = (
  weatherFactors: { hot: number; cold: number; windy: number; wet: number },
  activityWeights: { hot: number; cold: number; windy: number; wet: number }
): number => {
  const weightedRisks = {
    hot: weatherFactors.hot * activityWeights.hot,
    cold: weatherFactors.cold * activityWeights.cold,
    windy: weatherFactors.windy * activityWeights.windy,
    wet: weatherFactors.wet * activityWeights.wet
  };
  
  const totalWeightedRisk = Object.values(weightedRisks).reduce((sum, risk) => sum + risk, 0);
  const totalWeights = Object.values(activityWeights).reduce((sum, weight) => sum + weight, 0);
  
  return Math.round(totalWeightedRisk / totalWeights);
};

export const getRiskLevel = (risk: number): 'low' | 'medium' | 'high' => {
  if (risk <= 33) return 'low';
  if (risk <= 66) return 'medium';
  return 'high';
};

export const getRiskColor = (risk: number): string => {
  const level = getRiskLevel(risk);
  switch (level) {
    case 'low': return 'bg-gradient-risk-low';
    case 'medium': return 'bg-gradient-risk-medium';
    case 'high': return 'bg-gradient-risk-high';
  }
};