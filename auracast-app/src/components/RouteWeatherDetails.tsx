import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CloudRainIcon, SunIcon, WindIcon, MapPinIcon, AlertTriangleIcon, TrendingUpIcon } from './Icons';
import { Thermometer, CheckCircle } from 'lucide-react';
import CountUp from 'react-countup';

interface RouteWeatherDetailsProps {
  travelData: any;
  waypoints: Array<{
    name: string;
    coords: [number, number];
    risk: number;
    weather?: {
      temp: string;
      condition: string;
      humidity: string;
      wind: string;
    };
  }>;
}

const RouteWeatherDetails: React.FC<RouteWeatherDetailsProps> = ({ travelData, waypoints }) => {
  const getRiskColor = (risk: number) => {
    if (risk <= 33) return 'text-green-500';
    if (risk <= 66) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBg = (risk: number) => {
    if (risk <= 33) return 'bg-green-500/10 border-green-500/20';
    if (risk <= 66) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-4">
      {/* Route Overview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-primary" />
            Route Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {travelData.totalDistance}
              </div>
              <div className="text-xs text-muted-foreground">Total Distance</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {travelData.estimatedTime}
              </div>
              <div className="text-xs text-muted-foreground">Est. Time</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className={`text-2xl font-bold ${getRiskColor(travelData.averageRisk)}`}>
                <CountUp end={travelData.averageRisk} duration={1.5} />%
              </div>
              <div className="text-xs text-muted-foreground">Avg Risk</div>
            </div>
            <div className="text-center p-3 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-500">
                <CountUp end={travelData.maxRisk} duration={1.5} />%
              </div>
              <div className="text-xs text-muted-foreground">Max Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Climate Report */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            Climate Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold">Temperature Range</span>
              </div>
              <div className="text-xl font-bold">{travelData.climateReport?.temperatureRange}</div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CloudRainIcon className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold">Conditions</span>
              </div>
              <div className="text-xl font-bold">{travelData.climateReport?.predominantCondition}</div>
            </div>
          </div>

          {/* Weather Summary */}
          {travelData.weatherSummary && (
            <div className="p-4 bg-muted/10 rounded-lg">
              <h4 className="font-semibold text-sm mb-3">Weather Distribution</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/10 mx-auto mb-2">
                    <SunIcon className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="text-lg font-bold">{travelData.weatherSummary.clearDays}</div>
                  <div className="text-xs text-muted-foreground">Clear</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 mx-auto mb-2">
                    <CloudRainIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-lg font-bold">{travelData.weatherSummary.rainyDays}</div>
                  <div className="text-xs text-muted-foreground">Rainy</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500/10 mx-auto mb-2">
                    <CloudRainIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-lg font-bold">{travelData.weatherSummary.cloudyDays}</div>
                  <div className="text-xs text-muted-foreground">Cloudy</div>
                </div>
              </div>
            </div>
          )}

          {/* Risk Trend */}
          <div className={`p-4 rounded-lg border ${
            travelData.averageRisk > 60 ? 'bg-red-500/10 border-red-500/20' :
            travelData.averageRisk > 40 ? 'bg-yellow-500/10 border-yellow-500/20' :
            'bg-green-500/10 border-green-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className={`w-4 h-4 ${getRiskColor(travelData.averageRisk)}`} />
              <span className="text-sm font-semibold">Risk Assessment</span>
            </div>
            <div className="font-bold mb-2">{travelData.climateReport?.riskTrend}</div>
            <Progress value={travelData.averageRisk} className="h-2" />
          </div>

          {/* Recommendations */}
          {travelData.climateReport?.recommendations && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Travel Recommendations
              </h4>
              {travelData.climateReport.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 text-sm p-2 bg-muted/10 rounded-lg">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-muted-foreground">{rec}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Waypoint Details */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-primary" />
            Route Waypoints ({waypoints.length} locations)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {waypoints.map((waypoint, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-lg border ${getRiskBg(waypoint.risk)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0 ? 'bg-green-500 text-white' :
                      idx === waypoints.length - 1 ? 'bg-red-500 text-white' :
                      'bg-primary/20 text-primary'
                    }`}>
                      {idx === 0 ? '🚀' : idx === waypoints.length - 1 ? '🏁' : idx}
                    </div>
                    <div>
                      <div className="font-semibold">{waypoint.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {waypoint.coords[0].toFixed(4)}, {waypoint.coords[1].toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <Badge variant={waypoint.risk > 66 ? 'destructive' : waypoint.risk > 33 ? 'secondary' : 'default'}>
                    {waypoint.risk}% Risk
                  </Badge>
                </div>

                {waypoint.weather && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-orange-500" />
                      <span>{waypoint.weather.temp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SunIcon className="w-3 h-3 text-yellow-500" />
                      <span>{waypoint.weather.condition}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CloudRainIcon className="w-3 h-3 text-blue-500" />
                      <span>{waypoint.weather.humidity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <WindIcon className="w-3 h-3 text-cyan-500" />
                      <span>{waypoint.weather.wind}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteWeatherDetails;
