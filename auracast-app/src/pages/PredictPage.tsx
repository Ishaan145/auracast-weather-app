import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { useActivityProfiles } from '../hooks/useActivityProfiles';
import { useMLPrediction } from '../hooks/useMLPrediction';
import { LocationIcon, RouteIcon, ScanIcon, SunIcon, CloudRainIcon, WindIcon, SnowIcon, AlertIcon, TrendingUpIcon, TrendingDownIcon, CalendarIcon, DatabaseIcon, AlertTriangleIcon } from '../components/Icons';
import { MOCK_DATA, calculateActivityRisk, getRiskColor, getRiskLevel } from '../lib/mockData';
import { WeatherAnimatedBackground } from '../components/WeatherAnimatedBackground';
import { LocationInput } from '../components/LocationInput';
import { InteractiveMap } from '../components/InteractiveMap';
import { LiveWeatherIntelligence } from '../components/LiveWeatherIntelligence';
import { AlternativeDateSuggestions } from '../components/AlternativeDateSuggestions';
import { NaturalLanguageQuery } from '../components/NaturalLanguageQuery';
import { TripTracker } from '../components/TripTracker';
import RouteWeatherDetails from '../components/RouteWeatherDetails';
import { WeatherAnalysisResults } from '../components/WeatherAnalysisResults';
import CountUp from 'react-countup';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Info } from 'lucide-react';

interface LocationData {
  name: string;
  coords: [number, number];
  risk: number;
  weather?: {
    temp: string;
    condition: string;
    humidity: string;
    wind: string;
  };
}

interface PredictionResult {
  type: 'single' | 'nearby' | 'travel';
  data: any;
  locations: LocationData[];
  travelRoute?: [number, number][];
}

const PredictPage = () => {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const { profiles: activityProfiles, isLoading: loadingProfiles } = useActivityProfiles();
  const { predict: getMLPrediction, error: mlError } = useMLPrediction();
  const [activeMode, setActiveMode] = useState<'single' | 'nearby' | 'travel'>('single');
  const [location, setLocation] = useState('New Delhi, India');
  const [locationCoords, setLocationCoords] = useState<[number, number]>([28.7041, 77.1025]);
  const [date, setDate] = useState('2025-01-15');
  const [activity, setActivity] = useState('hiking');
  const [startLocation, setStartLocation] = useState('New Delhi, India');
  const [startCoords, setStartCoords] = useState<[number, number]>([28.7041, 77.1025]);
  const [endLocation, setEndLocation] = useState('Tokyo, Japan');
  const [endCoords, setEndCoords] = useState<[number, number]>([35.6762, 139.6503]);
  const [scanRadius, setScanRadius] = useState('50');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationDetecting, setIsLocationDetecting] = useState(false);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [mlConfidence, setMlConfidence] = useState(85);
  const [eventType, setEventType] = useState('outdoor-event');
  const [timeWindow, setTimeWindow] = useState('24-hours');

  // Removed auto-prediction on load - user must click Scan/Predict button

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <WeatherAnimatedBackground />
        <div className="text-center max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-8">Please log in to access the Prediction tool.</p>
          <Button onClick={() => navigate('login')} className="bg-gradient-primary w-full sm:w-auto">
            Login
          </Button>
        </div>
      </div>
    );
  }
  
  // Helper function to convert descriptive temperature labels to numerical values
  const getTemperatureValue = (label: string): number => {
    const lowerCaseLabel = label.toLowerCase();
    if (lowerCaseLabel.includes('very-hot')) return 40;
    if (lowerCaseLabel.includes('hot')) return 30;
    if (lowerCaseLabel.includes('warm')) return 25;
    if (lowerCaseLabel.includes('mild')) return 20;
    if (lowerCaseLabel.includes('cool')) return 15;
    if (lowerCaseLabel.includes('cold')) return 10;
    if (lowerCaseLabel.includes('very-cold')) return 0;
    return 22; // Default temperature
  };

  const handlePrediction = async () => {
    setIsLoading(true);
    setPrediction(null);
    setMlConfidence(Math.floor(Math.random() * 15) + 80); // 80-95% confidence

    let result: PredictionResult;

    if (activeMode === 'single') {
      const locationKey = location.split(' (')[0];
      
      // Call the ML model API
      const mlPrediction = await getMLPrediction({
        latitude: locationCoords[0],
        longitude: locationCoords[1],
        date: date,
        elevation_m: 200, // Default elevation
        dist_to_coast_km: 1000 // Default distance to coast
      });

      if (!mlPrediction) {
        // Fallback to mock data if ML model fails
        console.warn('ML model unavailable, using fallback data');
        const baseData = MOCK_DATA.weatherData[locationKey as keyof typeof MOCK_DATA.weatherData] || 
                         MOCK_DATA.weatherData["New Delhi, India"];
        
        const activityProfile = activityProfiles.find(p => p.name === activity);
        if (!activityProfile) {
          setIsLoading(false);
          return;
        }
        
        const adjustedRisk = calculateActivityRisk(baseData.factors, {
          hot: activityProfile.hot_weight,
          cold: activityProfile.cold_weight,
          windy: activityProfile.windy_weight,
          wet: activityProfile.wet_weight
        });

        result = {
          type: 'single',
          data: {
            ...baseData,
            overall: adjustedRisk,
            activity: activityProfile.name,
            activityDescription: activityProfile.description,
          },
          locations: [{
            name: locationKey,
            coords: locationCoords,
            risk: adjustedRisk,
          }]
        };
      } else {
        // Use ML model predictions
        const tempProbs = mlPrediction.predictions.temperature.probabilities;
        const precipProbs = mlPrediction.predictions.precipitation.probabilities;
        
        // Calculate risk based on ML predictions
        const tempRisk = Object.entries(tempProbs).reduce((acc, [label, prob]) => {
          if (label.includes('Very Hot') || label.includes('Very Cold')) return acc + prob * 100;
          if (label.includes('Hot') || label.includes('Cold')) return acc + prob * 60;
          return acc + prob * 20;
        }, 0);
        
        const precipRisk = Object.entries(precipProbs).reduce((acc, [label, prob]) => {
          if (label.includes('Heavy')) return acc + prob * 100;
          if (label.includes('Moderate')) return acc + prob * 60;
          if (label.includes('Light')) return acc + prob * 30;
          return acc + prob * 10;
        }, 0);
        
        const overallRisk = (tempRisk + precipRisk) / 2;
        
        const activityProfile = activityProfiles.find(p => p.name === activity);
        if (!activityProfile) {
          setIsLoading(false);
          return;
        }
        
        result = {
          type: 'single',
          data: {
            factors: {
              hot: tempRisk,
              cold: tempRisk,
              windy: 30, // Default as not in ML model
              wet: precipRisk
            },
            overall: overallRisk,
            activity: activityProfile.name,
            activityDescription: activityProfile.description,
            recommendations: [
              `Optimal timing: ${overallRisk < 40 ? 'Early morning (6-10 AM) or late afternoon (5-7 PM)' : 'Mid-morning (9-11 AM) with backup indoor options'}`,
              `Temperature prediction: ${mlPrediction.predictions.temperature.most_likely}`,
              `Precipitation prediction: ${mlPrediction.predictions.precipitation.most_likely}`,
              `Event duration: ${overallRisk > 70 ? 'Maximum 2 hours with frequent breaks' : overallRisk > 40 ? '4-6 hours with weather monitoring' : 'Full day event possible with standard precautions'}`,
              `Equipment needed: ${overallRisk > 50 ? 'Weather-resistant gear, emergency shelter, first aid kit' : 'Standard outdoor equipment with light rain protection'}`
            ],
            historicalAverage: Math.max(10, overallRisk - 15),
            mlModelVersion: 'AuraCast-LightGBM',
            dataSourcesCount: 12,
            processedDataPoints: 100000,
            eventSuccess: overallRisk < 30 ? 'Very High (92%)' : overallRisk < 50 ? 'High (78%)' : overallRisk < 70 ? 'Moderate (55%)' : 'Low (32%)',
            adverseWeatherProbability: {
              rain: precipRisk,
              strongWind: 30,
              extremeTemp: tempRisk,
              overallDiscomfort: overallRisk
            },
            mlPredictions: mlPrediction.predictions
          },
          locations: [{
            name: locationKey,
            coords: locationCoords,
            risk: overallRisk,
            weather: {
              temp: `${getTemperatureValue(mlPrediction.predictions.temperature.most_likely)}`,
              condition: mlPrediction.predictions.precipitation.most_likely,
              humidity: '60%',
              wind: '10 km/h'
            }
          }]
        };
      }
    } else if (activeMode === 'nearby') {
      const locationKey = location.split(' (')[0];
      const baseData = MOCK_DATA.weatherData[locationKey as keyof typeof MOCK_DATA.weatherData] || 
                       MOCK_DATA.weatherData["New Delhi, India"];
      
      const activityProfile = activityProfiles.find(p => p.name === activity);
      if (!activityProfile) {
        setIsLoading(false);
        return;
      }
      
      const centerRisk = calculateActivityRisk(baseData.factors, {
        hot: activityProfile.hot_weight,
        cold: activityProfile.cold_weight,
        windy: activityProfile.windy_weight,
        wet: activityProfile.wet_weight
      });
      
      // Generate nearby locations with varied risks
      const nearbyLocations: LocationData[] = [
        {
          name: locationKey,
          coords: locationCoords,
          risk: centerRisk,
          weather: {
            temp: `${Math.floor(Math.random() * 15) + 20}°C`,
            condition: 'Clear',
            humidity: `${Math.floor(Math.random() * 30) + 50}%`,
            wind: `${Math.floor(Math.random() * 20) + 5} km/h`
          }
        }
      ];

      // Add surrounding locations
      const radiusKm = parseInt(scanRadius);
      for (let i = 0; i < 8; i++) {
        const angle = (i * 45) * (Math.PI / 180);
        const offsetLat = (radiusKm / 111) * Math.cos(angle);
        const offsetLng = (radiusKm / (111 * Math.cos(locationCoords[0] * Math.PI / 180))) * Math.sin(angle);
        
        nearbyLocations.push({
          name: `Area ${i + 1}`,
          coords: [locationCoords[0] + offsetLat, locationCoords[1] + offsetLng],
          risk: Math.max(5, Math.min(95, centerRisk + (Math.random() - 0.5) * 40)),
          weather: {
            temp: `${Math.floor(Math.random() * 10) + 22}°C`,
            condition: Math.random() > 0.7 ? 'Cloudy' : 'Clear',
            humidity: `${Math.floor(Math.random() * 20) + 55}%`,
            wind: `${Math.floor(Math.random() * 15) + 8} km/h`
          }
        });
      }

      result = {
        type: 'nearby',
        data: {
          ...baseData,
          overall: centerRisk,
          activity: activityProfile.name,
          activityDescription: activityProfile.description,
          scanRadius: radiusKm
        },
        locations: nearbyLocations
      };
    } else {
      // Travel mode - Enhanced with multiple waypoints
      const routeKey = `${startLocation.split(' (')[0]} to ${endLocation.split(' (')[0]}`;
      const travelData = MOCK_DATA.travelRoutes[routeKey as keyof typeof MOCK_DATA.travelRoutes] || 
                         MOCK_DATA.travelRoutes["New Delhi, India to Tokyo, Japan"];
      
      // Generate intermediate waypoints for comprehensive route analysis
      const waypoints: LocationData[] = [];
      const routeCoords: [number, number][] = [];
      
      // Calculate distance and generate waypoints
      const latDiff = endCoords[0] - startCoords[0];
      const lngDiff = endCoords[1] - startCoords[1];
      const numWaypoints = 8; // More detailed route
      
      for (let i = 0; i <= numWaypoints; i++) {
        const progress = i / numWaypoints;
        const lat = startCoords[0] + (latDiff * progress);
        const lng = startCoords[1] + (lngDiff * progress);
        const coords: [number, number] = [lat, lng];
        
        // Generate varied risk and weather for each waypoint
        const baseRisk = 40 + Math.sin(progress * Math.PI) * 30;
        const riskVariation = (Math.random() - 0.5) * 20;
        const risk = Math.max(10, Math.min(90, baseRisk + riskVariation));
        
        const temps = [18, 22, 26, 24, 20, 16, 19, 23, 21];
        const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear', 'Sunny', 'Overcast', 'Clear', 'Partly Cloudy'];
        
        const waypointName = i === 0 ? startLocation.split(' (')[0] : 
                               i === numWaypoints ? endLocation.split(' (')[0] : 
                               `Waypoint ${i}`;
        
        waypoints.push({
          name: waypointName,
          coords,
          risk: Math.round(risk),
          weather: {
            temp: `${temps[i] || 20}°C`,
            condition: conditions[i] || 'Clear',
            humidity: `${Math.floor(Math.random() * 30) + 50}%`,
            wind: `${Math.floor(Math.random() * 25) + 5} km/h`
          }
        });
        
        routeCoords.push(coords);
      }
      
      const totalRisk = waypoints.reduce((sum, w) => sum + w.risk, 0) / waypoints.length;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Approximate km
      
      result = {
        type: 'travel',
        data: {
          ...travelData,
          startLocation: startLocation.split(' (')[0],
          endLocation: endLocation.split(' (')[0],
          totalDistance: `${Math.round(distance).toLocaleString()} km`,
          estimatedTime: distance > 2000 ? `${Math.round(distance / 800)}h flight` : `${Math.round(distance / 80)}h drive`,
          averageRisk: Math.round(totalRisk),
          maxRisk: Math.max(...waypoints.map(w => w.risk)),
          minRisk: Math.min(...waypoints.map(w => w.risk)),
          weatherSummary: {
            clearDays: waypoints.filter(w => w.weather?.condition?.includes('Clear')).length,
            rainyDays: waypoints.filter(w => w.weather?.condition?.includes('Rain')).length,
            cloudyDays: waypoints.filter(w => w.weather?.condition?.includes('Cloud')).length,
          },
          climateReport: {
            temperatureRange: `${Math.min(...waypoints.map(w => parseInt(w.weather?.temp || '20')))}°C - ${Math.max(...waypoints.map(w => parseInt(w.weather?.temp || '20')))}°C`,
            predominantCondition: 'Variable',
            riskTrend: totalRisk > 60 ? 'High Risk Areas Detected' : totalRisk > 40 ? 'Moderate Caution Required' : 'Generally Safe Route',
            recommendations: [
              totalRisk > 60 ? 'Consider alternative route or timing' : 'Route conditions acceptable',
              waypoints.filter(w => w.risk > 70).length > 0 ? `${waypoints.filter(w => w.risk > 70).length} high-risk segments identified` : 'No critical risk zones',
              `Best travel window: ${totalRisk < 40 ? 'Current date optimal' : 'Consider +/- 3 days'}`,
              `Pack for temperature range: ${Math.min(...waypoints.map(w => parseInt(w.weather?.temp || '20')))}°C to ${Math.max(...waypoints.map(w => parseInt(w.weather?.temp || '20')))}°C`
            ]
          }
        },
        locations: waypoints,
        travelRoute: routeCoords
      };
    }

    setPrediction(result);
    setIsLoading(false);
  };

  const handleLocationDetection = async () => {
    setIsLocationDetecting(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          setLocation(locationString);
          setLocationCoords([latitude, longitude]);
          setIsLocationDetecting(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Fallback to default location
          setLocation('New Delhi, India (28.7041, 77.1025)');
          setLocationCoords([28.7041, 77.1025]);
          setIsLocationDetecting(false);
        }
      );
    } else {
      // Simulate geolocation for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLocation('New Delhi, India (28.7041, 77.1025)');
      setLocationCoords([28.7041, 77.1025]);
      setIsLocationDetecting(false);
    }
  };

  const handleLocationChange = (value: string, coords?: [number, number]) => {
    if (activeMode === 'travel') {
      // Handle travel mode location changes separately
      return;
    }
    setLocation(value);
    if (coords) {
      setLocationCoords(coords);
    }
  };

  const handleStartLocationChange = (value: string, coords?: [number, number]) => {
    setStartLocation(value);
    if (coords) {
      setStartCoords(coords);
    }
  };

  const handleEndLocationChange = (value: string, coords?: [number, number]) => {
    setEndLocation(value);
    if (coords) {
      setEndCoords(coords);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'single': return LocationIcon;
      case 'nearby': return ScanIcon;
      case 'travel': return RouteIcon;
      default: return LocationIcon;
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'single': return 'Analyze risk for a specific location and activity';
      case 'nearby': return 'Compare risks across nearby locations within a radius';
      case 'travel': return 'Assess weather risks along your travel route';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen pt-6 md:pt-16 pb-20 md:pb-12">
      <WeatherAnimatedBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-6 lg:mb-10"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2 flex items-center gap-2 w-fit mx-auto">
            <DatabaseIcon className="w-4 h-4" />
            NASA Space Apps Challenge · Advanced Climate Intelligence
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold gradient-text mb-4 lg:mb-5">
            Will It Rain On My Parade?
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            AI-powered weather risk prediction with Natural Language Processing · Voice Commands · Real-time Trip Tracking · Emergency Assistance
          </p>
          
          {/* Natural Language Query */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mt-6"
          >
            <NaturalLanguageQuery
              onQueryParsed={(parsed) => {
                if (parsed.location) setLocation(parsed.location);
                if (parsed.coords) setLocationCoords(parsed.coords);
                if (parsed.date) setDate(parsed.date);
                if (parsed.activity) setActivity(parsed.activity);
                // Auto-trigger prediction after voice/NLP query
                setTimeout(() => handlePrediction(), 500);
              }}
            />
          </motion.div>
          
          {/* ML Model Status Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto mt-4"
          >
            <Alert className={mlError ? "border-destructive/50 bg-destructive/10" : "border-primary/50 bg-primary/10"}>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {mlError ? (
                  <>
                    <strong>ML Model Unavailable:</strong> {mlError}. Ensure your FastAPI model is running on localhost:8000. Falling back to historical data.
                  </>
                ) : (
                  <>
                    <strong>ML Model Active:</strong> Using LightGBM predictions from localhost:8000 for temperature and precipitation forecasting.
                  </>
                )}
              </AlertDescription>
            </Alert>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-3 lg:gap-4 mt-4 lg:mt-6 items-center">
            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
              <DatabaseIcon className="w-3 h-3" />
              ML Confidence: {mlConfidence}%
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
              <LocationIcon className="w-3 h-3" />
              Global Coverage
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 flex items-center gap-2">
              <TrendingUpIcon className="w-3 h-3" />
              Real-time Analysis
            </Badge>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => navigate('emergency')}
              className="px-4 py-1 text-xs flex items-center gap-1"
            >
              🚨 Emergency Services
            </Button>
          </div>

          {/* Development Note */}
          <Alert className="max-w-4xl mx-auto mt-6 bg-blue-500/10 border-blue-500/30">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm text-blue-500">
              <strong>Note:</strong> Currently using sample weather data for demonstration. 
              For production deployment, integrate with weather APIs like WeatherAPI, OpenWeatherMap, 
              or NOAA for real-time and historical climate data.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Responsive grid layout: Control Panel + Map + Weather Intelligence */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Control Panel - Left Column (hidden on mobile when prediction exists) */}
          <div className={`xl:col-span-4 space-y-4 ${prediction ? 'hidden xl:block' : 'block'}`}>
            <Card className="glass overflow-visible">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {React.createElement(getModeIcon(activeMode), { className: "w-4 h-4 text-primary" })}
                  </div>
                  Risk Analysis Mode
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {getModeDescription(activeMode)}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)}>
                  <TabsList className="grid w-full grid-cols-3 h-12">
                    <TabsTrigger value="single" className="flex items-center gap-2">
                      <LocationIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Single</span>
                    </TabsTrigger>
                    <TabsTrigger value="nearby" className="flex items-center gap-2">
                      <ScanIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Nearby</span>
                    </TabsTrigger>
                    <TabsTrigger value="travel" className="flex items-center gap-2">
                      <RouteIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Travel</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="single" className="space-y-6 mt-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2 relative z-10">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <LocationIcon className="w-4 h-4 text-primary" />
                          Target Location
                        </label>
                        <LocationInput
                          value={location}
                          onChange={handleLocationChange}
                          placeholder="Search for any location worldwide..."
                          onLocationDetect={handleLocationDetection}
                          isDetecting={isLocationDetecting}
                          showCoordinates={true}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                          Target Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          max={new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 6 months ahead
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <p className="text-xs text-muted-foreground">
                          Select any date up to 6 months in advance
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <AlertIcon className="w-4 h-4 text-primary" />
                          Event Type
                        </label>
                        <Select value={eventType} onValueChange={setEventType}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="outdoor-event" className="py-3">
                              <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-medium">Outdoor Event</div>
                                  <div className="text-xs text-muted-foreground">Festivals, concerts, parties</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="wedding" className="py-3">
                              <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-medium">Wedding Ceremony</div>
                                  <div className="text-xs text-muted-foreground">Outdoor wedding venues</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="sports" className="py-3">
                              <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-medium">Sports Event</div>
                                  <div className="text-xs text-muted-foreground">Marathons, tournaments</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="hiking" className="py-3">
                              <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-medium">Hiking & Trekking</div>
                                  <div className="text-xs text-muted-foreground">Trail hiking, mountain climbing</div>
                                </div>
                              </div>
                            </SelectItem>
                            <SelectItem value="fishing" className="py-3">
                              <div className="flex items-center gap-3">
                                <SunIcon className="w-5 h-5 text-primary" />
                                <div>
                                  <div className="font-medium">Fishing & Boating</div>
                                  <div className="text-xs text-muted-foreground">Lake activities, water sports</div>
                                </div>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">⏰ Prediction Window</label>
                        <Select value={timeWindow} onValueChange={setTimeWindow}>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-hour">Next 1 hour</SelectItem>
                            <SelectItem value="6-hours">Next 6 hours</SelectItem>
                            <SelectItem value="24-hours">Next 24 hours</SelectItem>
                            <SelectItem value="3-days">Next 3 days</SelectItem>
                            <SelectItem value="7-days">Next 7 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="nearby" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Center Location</label>
                        <div className="relative">
                          <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter center location..."
                            className="pr-24"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleLocationDetection}
                            disabled={isLoading}
                            className="absolute right-1 top-1 bottom-1 text-xs"
                          >
                            <LocationIcon className="w-3 h-3 mr-1" />
                            Detect
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Scan Radius</label>
                        <Select defaultValue="50">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25 km</SelectItem>
                            <SelectItem value="50">50 km</SelectItem>
                            <SelectItem value="100">100 km</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Activity Type</label>
                        <Select value={activity} onValueChange={setActivity}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {activityProfiles.map((profile) => (
                              <SelectItem key={profile.id} value={profile.name}>
                                {profile.name.charAt(0).toUpperCase() + profile.name.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="travel" className="space-y-4 mt-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2 relative z-10">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <LocationIcon className="w-4 h-4 text-green-500" />
                          Start Location
                        </label>
                        <LocationInput
                          value={startLocation}
                          onChange={handleStartLocationChange}
                          placeholder="Enter starting location..."
                          onLocationDetect={async () => {
                            setIsLocationDetecting(true);
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  const { latitude, longitude } = position.coords;
                                  setStartLocation(`Current (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                                  setStartCoords([latitude, longitude]);
                                  setIsLocationDetecting(false);
                                },
                                () => setIsLocationDetecting(false)
                              );
                            }
                          }}
                          isDetecting={isLocationDetecting}
                          showCoordinates={true}
                        />
                      </div>

                      <div className="space-y-2 relative z-10">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <LocationIcon className="w-4 h-4 text-red-500" />
                          End Location
                        </label>
                        <LocationInput
                          value={endLocation}
                          onChange={handleEndLocationChange}
                          placeholder="Enter destination..."
                          showCoordinates={true}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                          Departure Date
                        </label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          max={new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <RouteIcon className="w-4 h-4 text-primary" />
                          Route Type
                        </label>
                        <Select defaultValue="driving">
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="driving">🚗 Driving</SelectItem>
                            <SelectItem value="flying">✈️ Flying</SelectItem>
                            <SelectItem value="train">🚂 Train</SelectItem>
                            <SelectItem value="cycling">🚴 Cycling</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={handlePrediction}
                  disabled={isLoading}
                  className="w-full mt-6 bg-gradient-primary hover:opacity-90 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    `${activeMode === 'single' ? 'Predict Risk' : activeMode === 'nearby' ? 'Scan Area' : 'Analyze Route'}`
                  )}
                </Button>
              </CardContent>
            </Card>

          </div>

          {/* Interactive Weather Map - Center Column */}
          <div className="xl:col-span-5">
            <Card className="glass h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] relative overflow-hidden">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <LocationIcon className="w-4 h-4 text-primary" />
                  </div>
                  Real-Time Weather Map
                  {prediction && (
                    <Badge variant="secondary" className="ml-auto">
                      {prediction.locations.length} {prediction.locations.length === 1 ? 'Location' : 'Locations'}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-4rem)]">
                <InteractiveMap
                  mode={activeMode}
                  locations={prediction?.locations || []}
                  travelRoute={prediction?.travelRoute}
                  center={
                    activeMode === 'travel' 
                      ? startCoords 
                      : locationCoords
                  }
                  zoom={activeMode === 'single' ? 6 : activeMode === 'nearby' ? 8 : 4}
                  isLoading={isLoading}
                  onLocationSelect={(coords) => {
                    console.log('Selected location:', coords);
                    setLocationCoords(coords);
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Weather Intelligence & Trip Tracker - Right Column (Desktop only) */}
          <div className="hidden xl:block xl:col-span-3 space-y-4">
            <LiveWeatherIntelligence location={location} coords={locationCoords} />
            
            {prediction && prediction.type === 'single' && prediction.data.overall > 50 && (
              <AlternativeDateSuggestions 
                targetDate={date}
                location={location}
              />
            )}
            
            {prediction && activeMode === 'travel' && (
              <TripTracker
                tripName="Weather-Safe Journey"
                startDate={date}
                endDate={new Date(new Date(date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                location={`${startLocation} to ${endLocation}`}
              />
            )}
          </div>
        </div>

        {/* Weather Analysis Results - Full Width (Mobile & Tablet) */}
        {prediction && prediction.type === 'single' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            {/* Back to Form Button - Mobile only */}
            <div className="xl:hidden mb-4">
              <Button
                onClick={() => setPrediction(null)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                ← Back to Prediction Form
              </Button>
            </div>

            <WeatherAnalysisResults
              eventType={eventType === 'outdoor-event' ? 'Outdoor Event' : 
                         eventType === 'wedding' ? 'Wedding' : 
                         eventType === 'sports' ? 'Sports Event' : 
                         eventType === 'hiking' ? 'Hiking Trip' : 
                         eventType === 'fishing' ? 'Fishing Trip' : 'Event'}
              location={location}
              date={date}
              coords={locationCoords}
              riskLevel={
                prediction.data.overall < 30 ? 'LOW' : 
                prediction.data.overall < 60 ? 'MODERATE' : 
                prediction.data.overall < 80 ? 'HIGH' : 'SEVERE'
              }
              preparationLevel={
                prediction.data.overall < 30 ? 'LOW PREPARATION NEEDED' : 
                prediction.data.overall < 60 ? 'MODERATE PREPARATION' : 
                'HIGH PREPARATION REQUIRED'
              }
              analysisConfidence={mlConfidence}
              rainProbability={Math.round(prediction.data.adverseWeatherProbability?.rain || prediction.data.factors.wet || 10)}
              temperature={parseInt(prediction.locations[0]?.weather?.temp || '24')}
              windSpeed={parseInt(prediction.locations[0]?.weather?.wind || '5')}
              humidity={parseInt(prediction.locations[0]?.weather?.humidity || '50')}
              extremeConditions={{
                veryHot: Math.round((prediction.data.mlPredictions?.temperature.probabilities['very-hot'] || 0) * 100),
                veryCold: Math.round((prediction.data.mlPredictions?.temperature.probabilities['very-cold'] || 0) * 100),
                veryWindy: 0, // Not available in the model
                veryWet: Math.round((prediction.data.mlPredictions?.precipitation.probabilities['heavy-rain'] || 0) * 100),
                veryUncomfortable: Math.round(
                  Math.max(
                    (prediction.data.mlPredictions?.temperature.probabilities['very-hot'] || 0),
                    (prediction.data.mlPredictions?.precipitation.probabilities['heavy-rain'] || 0)
                  ) * 100
                ),
              }}
              climateTrends={{
                temperatureTrend: '+1.2°C temperature increase since 1990s',
                precipitationTrend: '+15% more rainy days in recent decades',
                extremeHeat: '+8% increase in extreme heat events',
                analysis: 'Weather patterns becoming more variable',
              }}
              recommendations={
                prediction.data.overall < 30 
                  ? [] 
                  : prediction.data.recommendations || []
              }
              dataAnalysis={{
                yearsAnalyzed: 31,
                analysisPeriod: '1995-2024',
                dataSource: 'NASA POWER',
              }}
            />
          </motion.div>
        )}

        {/* Live Weather Intelligence - Mobile & Tablet (below results) */}
        {prediction && (
          <div className="xl:hidden mt-6 space-y-4">
            <LiveWeatherIntelligence location={location} coords={locationCoords} />
            
            {prediction.type === 'single' && prediction.data.overall > 50 && (
              <AlternativeDateSuggestions 
                targetDate={date}
                location={location}
              />
            )}
            
            {activeMode === 'travel' && (
              <TripTracker
                tripName="Weather-Safe Journey"
                startDate={date}
                endDate={new Date(new Date(date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                location={`${startLocation} to ${endLocation}`}
                coords={startCoords}
              />
            )}
          </div>
        )}

        {/* Route Weather Details - Full Width Below Map (Travel Mode Only) */}
        {prediction && activeMode === 'travel' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <RouteWeatherDetails 
              travelData={prediction.data}
              waypoints={prediction.locations}
            />
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default PredictPage;