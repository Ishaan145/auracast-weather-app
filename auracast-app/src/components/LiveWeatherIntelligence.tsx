import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SunIcon, CloudRainIcon, WindIcon } from './Icons';
import CountUp from 'react-countup';
import { useWeather } from '@/hooks/useWeather';

interface LiveWeatherIntelligenceProps {
  location: string;
  coords: [number, number];
}

export const LiveWeatherIntelligence: React.FC<LiveWeatherIntelligenceProps> = ({ location, coords }) => {
  const { weather, isLoading, error } = useWeather(coords[0], coords[1], 1);

  const getUVLevel = (index: number) => {
    if (index <= 2) return { level: 'Low', color: 'text-green-500' };
    if (index <= 5) return { level: 'Moderate', color: 'text-yellow-500' };
    if (index <= 7) return { level: 'High', color: 'text-orange-500' };
    if (index <= 10) return { level: 'Very High', color: 'text-red-500' };
    return { level: 'Extreme', color: 'text-purple-500' };
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Rain')) return <CloudRainIcon className="w-10 h-10 text-blue-400" />;
    if (condition.includes('Cloud')) return <CloudRainIcon className="w-10 h-10 text-gray-400" />;
    return <SunIcon className="w-10 h-10 text-yellow-400" />;
  };

  if (error) {
    return (
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SunIcon className="w-5 h-5 text-primary" />
            Live Weather Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2">Please check your API key configuration</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !weather) {
    return (
      <Card className="glass overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <SunIcon className="w-5 h-5 text-primary" />
            Live Weather Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2 animate-pulse">
            <div className="h-6 w-40 bg-muted/20 rounded"></div>
            <div className="flex items-start justify-between">
              <div className="h-20 w-32 bg-muted/20 rounded"></div>
              <div className="h-16 w-16 bg-muted/20 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted/20 rounded"></div>
              <div className="h-8 w-16 bg-muted/20 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted/20 rounded"></div>
              <div className="h-8 w-24 bg-muted/20 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const uvData = getUVLevel(weather.current.uv);
  const locationName = weather.location.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <SunIcon className="w-5 h-5 text-primary" />
            Live Weather Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Location & Temperature */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{locationName}</h3>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-6xl font-bold text-primary">
                  <CountUp end={Math.round(weather.current.temp_c)} duration={1.5} />°C
                </div>
                <div className="text-lg text-muted-foreground mt-2">{weather.current.condition.text}</div>
              </div>
              <div className="mt-2">
                <img src={`https:${weather.current.condition.icon}`} alt={weather.current.condition.text} className="w-16 h-16" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CloudRainIcon className="w-4 h-4" />
                <span>Humidity</span>
              </div>
              <div className="text-2xl font-bold">
                <CountUp end={weather.current.humidity} duration={1} />%
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <WindIcon className="w-4 h-4" />
                <span>Wind</span>
              </div>
              <div className="text-xl font-bold">{Math.round(weather.current.wind_kph)} km/h {weather.current.wind_dir}</div>
            </div>
          </div>

          {/* UV Index */}
          <div className="p-4 rounded-lg bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">UV Index</span>
              <span className={`text-sm font-bold ${uvData.color}`}>{uvData.level} ({weather.current.uv})</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(weather.current.uv / 11) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-2 rounded-full ${
                  weather.current.uv <= 2 ? 'bg-green-500' :
                  weather.current.uv <= 5 ? 'bg-yellow-500' :
                  weather.current.uv <= 7 ? 'bg-orange-500' :
                  weather.current.uv <= 10 ? 'bg-red-500' : 'bg-purple-500'
                }`}
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-card/50 border border-border/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">Pressure</div>
              <div className="text-2xl font-bold">
                <CountUp end={Math.round(weather.current.pressure_mb)} duration={1} /> hPa
              </div>
            </div>
            <div className="p-4 rounded-lg bg-card/50 border border-border/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">Visibility</div>
              <div className="text-2xl font-bold">
                <CountUp end={Math.round(weather.current.vis_km)} duration={1} /> km
              </div>
            </div>
          </div>

          {/* Air Quality (if available) */}
          {weather.current.air_quality && (
            <div className="p-4 rounded-lg bg-card/50 border border-border/30">
              <div className="text-sm text-muted-foreground mb-2">Air Quality Index</div>
              <div className="text-lg font-bold">
                {weather.current.air_quality['us-epa-index'] === 1 && 'Good'}
                {weather.current.air_quality['us-epa-index'] === 2 && 'Moderate'}
                {weather.current.air_quality['us-epa-index'] === 3 && 'Unhealthy for Sensitive'}
                {weather.current.air_quality['us-epa-index'] === 4 && 'Unhealthy'}
                {weather.current.air_quality['us-epa-index'] === 5 && 'Very Unhealthy'}
                {weather.current.air_quality['us-epa-index'] === 6 && 'Hazardous'}
              </div>
            </div>
          )}

          {/* Historical Predictions from NASA */}
          {weather.historical_prediction && (
            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Historical Analysis (30-year data)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="text-xs text-muted-foreground mb-1">Rain Probability</div>
                  <div className="text-xl font-bold text-blue-400">
                    {weather.historical_prediction.rainProbability}%
                  </div>
                </div>
                
                {weather.historical_prediction.avgTemperature && (
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="text-xs text-muted-foreground mb-1">Avg Temp (Historical)</div>
                    <div className="text-xl font-bold text-orange-400">
                      {weather.historical_prediction.avgTemperature.toFixed(1)}°C
                    </div>
                  </div>
                )}
              </div>

              {/* Extreme Condition Probabilities */}
              {weather.historical_prediction.extremeConditions && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Extreme Condition Likelihood</div>
                  <div className="grid grid-cols-2 gap-2">
                    {weather.historical_prediction.extremeConditions.veryHot > 0 && (
                      <div className="flex items-center justify-between px-3 py-2 rounded bg-red-500/10 border border-red-500/20">
                        <span className="text-xs">Very Hot (&gt;35°C)</span>
                        <span className="text-xs font-bold text-red-400">{weather.historical_prediction.extremeConditions.veryHot}%</span>
                      </div>
                    )}
                    {weather.historical_prediction.extremeConditions.veryCold > 0 && (
                      <div className="flex items-center justify-between px-3 py-2 rounded bg-cyan-500/10 border border-cyan-500/20">
                        <span className="text-xs">Very Cold (&lt;0°C)</span>
                        <span className="text-xs font-bold text-cyan-400">{weather.historical_prediction.extremeConditions.veryCold}%</span>
                      </div>
                    )}
                    {weather.historical_prediction.extremeConditions.veryWindy > 0 && (
                      <div className="flex items-center justify-between px-3 py-2 rounded bg-purple-500/10 border border-purple-500/20">
                        <span className="text-xs">Very Windy</span>
                        <span className="text-xs font-bold text-purple-400">{weather.historical_prediction.extremeConditions.veryWindy}%</span>
                      </div>
                    )}
                    {weather.historical_prediction.extremeConditions.veryWet > 0 && (
                      <div className="flex items-center justify-between px-3 py-2 rounded bg-blue-500/10 border border-blue-500/20">
                        <span className="text-xs">Heavy Rain</span>
                        <span className="text-xs font-bold text-blue-400">{weather.historical_prediction.extremeConditions.veryWet}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground italic">
                Based on {weather.historical_prediction.totalYearsAnalyzed} years of NASA satellite data
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="text-xs text-muted-foreground text-center pt-2">
            Updated {new Date(weather.location.localtime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
