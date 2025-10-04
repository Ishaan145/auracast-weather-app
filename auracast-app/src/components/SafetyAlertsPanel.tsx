import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertTriangleIcon } from './Icons';
import { useWeather } from '@/hooks/useWeather';

interface SafetyAlert {
  type: 'pest' | 'safety' | 'weather' | 'health';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  region: string;
}

interface SafetyAlertsPanelProps {
  location: string;
  coords: [number, number];
}

export const SafetyAlertsPanel: React.FC<SafetyAlertsPanelProps> = ({ location, coords }) => {
  const { weather, isLoading } = useWeather(coords[0], coords[1], 1);
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);

  useEffect(() => {
    if (!weather) return;

    // Generate location-specific alerts based on weather data and coordinates
    const generateLocationAlerts = async () => {
      const locationName = weather.location.name;
      const lat = coords[0];
      const newAlerts: SafetyAlert[] = [];

      // Add weather API alerts if available
      if (weather.alerts?.alert && weather.alerts.alert.length > 0) {
        weather.alerts.alert.forEach(alert => {
          newAlerts.push({
            type: 'weather',
            title: alert.headline,
            description: alert.desc,
            severity: alert.severity === 'Extreme' ? 'high' : alert.severity === 'Severe' ? 'medium' : 'low',
            region: locationName
          });
        });
      }

      // Temperature-based alerts
      if (weather.current.temp_c > 35) {
        newAlerts.push({
          type: 'health',
          title: 'Extreme Heat Warning',
          description: `Temperature is ${Math.round(weather.current.temp_c)}°C. Stay hydrated and avoid prolonged sun exposure between 11 AM - 4 PM.`,
          severity: 'high',
          region: locationName
        });
      }

      // UV Index alerts
      if (weather.current.uv >= 8) {
        newAlerts.push({
          type: 'safety',
          title: 'High UV Radiation',
          description: `UV Index: ${weather.current.uv}. Apply SPF 30+ sunscreen every 2 hours. Seek shade during peak hours.`,
          severity: weather.current.uv >= 11 ? 'high' : 'medium',
          region: locationName
        });
      }

      // Air quality alerts
      if (weather.current.air_quality && weather.current.air_quality['us-epa-index'] >= 3) {
        newAlerts.push({
          type: 'health',
          title: 'Poor Air Quality',
          description: 'Air quality is unhealthy for sensitive groups. Limit outdoor activities if you have respiratory conditions.',
          severity: weather.current.air_quality['us-epa-index'] >= 4 ? 'high' : 'medium',
          region: locationName
        });
      }

      // Tropical regions (near equator) - mosquito alerts
      if (Math.abs(lat) < 23.5 && weather.current.humidity > 70) {
        newAlerts.push({
          type: 'pest',
          title: 'Mosquito Activity Alert',
          description: `High humidity (${weather.current.humidity}%) creates ideal breeding conditions. Use repellent during dawn and dusk.`,
          severity: 'medium',
          region: locationName
        });
      }

      // Cold weather alerts
      if (weather.current.temp_c < 5) {
        newAlerts.push({
          type: 'weather',
          title: 'Cold Weather Advisory',
          description: `Temperature is ${Math.round(weather.current.temp_c)}°C. Dress in layers and protect exposed skin.`,
          severity: weather.current.temp_c < 0 ? 'high' : 'medium',
          region: locationName
        });
      }

      // Wind alerts
      if (weather.current.wind_kph > 40) {
        newAlerts.push({
          type: 'safety',
          title: 'High Wind Warning',
          description: `Wind speeds reaching ${Math.round(weather.current.wind_kph)} km/h. Secure loose objects and avoid outdoor activities.`,
          severity: weather.current.wind_kph > 60 ? 'high' : 'medium',
          region: locationName
        });
      }

      // If no alerts, add a general safety tip
      if (newAlerts.length === 0) {
        newAlerts.push({
          type: 'safety',
          title: 'Weather Conditions Normal',
          description: `Current conditions in ${locationName} are favorable. Temperature: ${Math.round(weather.current.temp_c)}°C, ${weather.current.condition.text}.`,
          severity: 'low',
          region: locationName
        });
      }

      setAlerts(newAlerts);
    };

    generateLocationAlerts();
  }, [weather, coords, location]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'high': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-muted/10 border-border text-muted-foreground';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-500 hover:bg-blue-600';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'high': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-muted';
    }
  };

  const getAlertIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'pest': return '🦟';
      case 'safety': return '⚠️';
      case 'weather': return '🌩️';
      case 'health': return '🏥';
      default: return '⚠️';
    }
  };

  if (isLoading || !weather) {
    return (
      <Card className="glass overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="w-5 h-5 text-amber-500" />
            Field Health & Safety Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4 animate-pulse">
          <div className="p-4 rounded-lg bg-muted/10 border border-border/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-muted/20 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-muted/20 rounded"></div>
                <div className="h-3 w-full bg-muted/20 rounded"></div>
                <div className="h-3 w-24 bg-muted/20 rounded"></div>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/10 border border-border/30">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-muted/20 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-muted/20 rounded"></div>
                <div className="h-3 w-full bg-muted/20 rounded"></div>
                <div className="h-3 w-20 bg-muted/20 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="w-5 h-5 text-amber-500" />
            Field Health & Safety Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {alerts.map((alert, index) => (
              <motion.div
                key={`${alert.type}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm leading-tight">{alert.title}</h4>
                      <Badge className={`${getSeverityBadgeColor(alert.severity)} text-white text-xs px-2 py-0.5 capitalize flex-shrink-0`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs opacity-70 pt-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{alert.region}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangleIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No active alerts for this location</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/30">
            Alerts updated every 15 minutes • Based on real-time monitoring
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
