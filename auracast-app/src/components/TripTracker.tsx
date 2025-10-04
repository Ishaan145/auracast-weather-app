import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LocationIcon, AlertIcon, CalendarIcon, RouteIcon } from './Icons';
import { useToast } from '@/hooks/use-toast';
import { useWeather } from '@/hooks/useWeather';

interface TripAlert {
  id: string;
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  timestamp: Date;
  suggestion?: string;
}

interface TripTrackerProps {
  tripName: string;
  startDate: string;
  endDate: string;
  location: string;
  coords?: [number, number];
  onAlertAction?: (alertId: string, action: string) => void;
}

export const TripTracker: React.FC<TripTrackerProps> = ({
  tripName,
  startDate,
  endDate,
  location,
  coords = [28.7041, 77.1025],
  onAlertAction
}) => {
  const [isActive, setIsActive] = useState(false);
  const [alerts, setAlerts] = useState<TripAlert[]>([]);
  const [progress, setProgress] = useState(0);
  const [lastWeatherCheck, setLastWeatherCheck] = useState<any>(null);
  const { toast } = useToast();
  const { weather, isLoading: weatherLoading } = useWeather(coords[0], coords[1], 3);

  // Real-time weather monitoring with actual data
  useEffect(() => {
    if (!isActive || !weather) return;

    const interval = setInterval(() => {
      // Check for weather changes
      const currentWeather = weather.current;
      
      // Generate alerts based on actual weather conditions
      const alerts: TripAlert[] = [];
      
      // High UV warning
      if (currentWeather.uv > 7) {
        alerts.push({
          id: `uv-${Date.now()}`,
          severity: 'high',
          title: 'High UV Index Warning',
          message: `UV index is ${currentWeather.uv}. Risk of sunburn is very high.`,
          timestamp: new Date(),
          suggestion: 'Apply SPF 30+ sunscreen and seek shade during peak hours'
        });
      }
      
      // High wind warning
      if (currentWeather.wind_kph > 40) {
        alerts.push({
          id: `wind-${Date.now()}`,
          severity: 'medium',
          title: 'Strong Wind Alert',
          message: `Wind speed is ${Math.round(currentWeather.wind_kph)} km/h from ${currentWeather.wind_dir}`,
          timestamp: new Date(),
          suggestion: 'Secure loose items and avoid high-profile vehicles'
        });
      }
      
      // High humidity warning
      if (currentWeather.humidity > 80) {
        alerts.push({
          id: `humidity-${Date.now()}`,
          severity: 'low',
          title: 'High Humidity Notice',
          message: `Humidity at ${currentWeather.humidity}%. Discomfort index elevated.`,
          timestamp: new Date(),
          suggestion: 'Stay hydrated and take breaks in cool areas'
        });
      }
      
      // Rain forecast
      if (weather.forecast?.forecastday[0]?.day?.daily_chance_of_rain > 50) {
        alerts.push({
          id: `rain-${Date.now()}`,
          severity: 'medium',
          title: 'Rain Expected',
          message: `${weather.forecast.forecastday[0].day.daily_chance_of_rain}% chance of rain today`,
          timestamp: new Date(),
          suggestion: 'Carry an umbrella and plan indoor alternatives'
        });
      }

      // Add new alerts if any
      if (alerts.length > 0) {
        setAlerts(prev => [...alerts, ...prev].slice(0, 10));
        
        alerts.forEach(alert => {
          toast({
            title: alert.title,
            description: alert.message,
            variant: alert.severity === 'high' ? 'destructive' : 'default'
          });
        });
      }

      // Update progress based on time
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const now = Date.now();
      const totalDuration = end - start;
      const elapsed = now - start;
      const newProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
      setProgress(newProgress);
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isActive, weather, startDate, endDate]);

  const getRandomWeatherAlert = () => {
    const alerts = [
      'Light rain expected in 2 hours',
      'Temperature dropping by 5°C',
      'Wind speed increasing to 25 km/h',
      'Humidity rising to 75%',
      'Clear skies for next 4 hours',
      'UV index increasing - wear sunscreen'
    ];
    return alerts[Math.floor(Math.random() * alerts.length)];
  };

  const getRandomSuggestion = () => {
    const suggestions = [
      'Consider carrying an umbrella',
      'Wear layered clothing',
      'Plan indoor activities for afternoon',
      'Best time for outdoor activities: morning',
      'Stay hydrated and avoid direct sun'
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted';
    }
  };

  const startTracking = () => {
    setIsActive(true);
    toast({
      title: "Trip tracking started",
      description: `Monitoring weather for ${location}`,
    });
  };

  const stopTracking = () => {
    setIsActive(false);
    setAlerts([]);
    toast({
      title: "Trip tracking stopped",
      description: "Weather monitoring paused",
    });
  };

  return (
    <Card className="glass overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <RouteIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{tripName || 'Trip Tracker'}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <LocationIcon className="w-3 h-3" />
                {location}
              </p>
            </div>
          </div>
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? '🔴 Live' : '⚪ Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Trip Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              {new Date(startDate).toLocaleDateString()}
            </span>
            <span className="font-medium">{Math.round(progress)}%</span>
            <span className="text-muted-foreground">
              {new Date(endDate).toLocaleDateString()}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Control Button */}
        <Button
          onClick={isActive ? stopTracking : startTracking}
          variant={isActive ? 'outline' : 'default'}
          className="w-full"
        >
          {isActive ? 'Stop Tracking' : 'Start Real-Time Tracking'}
        </Button>

        {/* Alerts */}
        {isActive && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <AlertIcon className="w-4 h-4 text-primary" />
              Recent Alerts
            </h4>
            
            <AnimatePresence mode="popLayout">
              {alerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 text-sm text-muted-foreground"
                >
                  Monitoring weather... No alerts yet
                </motion.div>
              ) : (
                alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="font-semibold text-sm">{alert.title}</h5>
                      <Badge variant="outline" className="text-[10px] px-1 py-0 capitalize">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs mb-2">{alert.message}</p>
                    {alert.suggestion && (
                      <p className="text-xs text-muted-foreground italic">
                        💡 {alert.suggestion}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Status */}
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            {isActive 
              ? '🛡️ Your trip is being monitored for weather changes'
              : '⏸️ Start tracking to receive real-time weather alerts'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
