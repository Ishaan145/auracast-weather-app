import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SunIcon, CloudRainIcon, WindIcon, SnowIcon, AlertTriangleIcon, TrendingUpIcon, TrendingDownIcon } from './Icons';

interface WeatherInsightsProps {
  data: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    uvIndex: number;
    visibility: number;
    pressure: number;
    dewPoint: number;
  };
  predictions: {
    next1h: { temp: number; conditions: string; probability: number; };
    next6h: { temp: number; conditions: string; probability: number; };
    next24h: { temp: number; conditions: string; probability: number; };
  };
  alerts: Array<{
    type: 'warning' | 'watch' | 'advisory';
    title: string;
    description: string;
    severity: number;
  }>;
}

export const WeatherInsights: React.FC<WeatherInsightsProps> = ({ data, predictions, alerts }) => {
  const getAlertColor = (type: string, severity: number) => {
    if (type === 'warning' || severity > 70) return 'bg-red-500/10 border-red-500/20 text-red-400';
    if (type === 'watch' || severity > 40) return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
    return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
  };

  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-400/20' };
    if (uv <= 5) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (uv <= 7) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-400/20' };
    if (uv <= 10) return { level: 'Very High', color: 'text-red-400', bg: 'bg-red-400/20' };
    return { level: 'Extreme', color: 'text-purple-400', bg: 'bg-purple-400/20' };
  };

  const uvInfo = getUvLevel(data.uvIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Active Weather Alerts */}
      {alerts.length > 0 && (
        <Card className="glass border-amber-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangleIcon className="w-5 h-5" />
              Active Weather Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${getAlertColor(alert.type, alert.severity)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">{alert.title}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {alert.type.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs opacity-90">{alert.description}</p>
                <div className="mt-2">
                  <Progress 
                    value={alert.severity} 
                    className="h-1"
                  />
                  <div className="text-xs mt-1 opacity-70">Severity: {alert.severity}%</div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Detailed Weather Metrics */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Current Conditions & Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-card rounded-lg border text-center"
                >
                  <SunIcon className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{data.temperature}°</div>
                  <div className="text-xs text-muted-foreground">Temperature</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-card rounded-lg border text-center"
                >
                  <CloudRainIcon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{data.humidity}%</div>
                  <div className="text-xs text-muted-foreground">Humidity</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-card rounded-lg border text-center"
                >
                  <WindIcon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{data.windSpeed}</div>
                  <div className="text-xs text-muted-foreground">Wind km/h</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border text-center ${uvInfo.bg}`}
                >
                  <div className="text-2xl font-bold">{data.uvIndex}</div>
                  <div className={`text-xs font-medium ${uvInfo.color}`}>{uvInfo.level}</div>
                  <div className="text-xs text-muted-foreground">UV Index</div>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Visibility</div>
                  <div className="text-lg font-semibold">{data.visibility} km</div>
                  <Progress value={(data.visibility / 20) * 100} className="h-2 mt-2" />
                </div>
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Pressure</div>
                  <div className="text-lg font-semibold">{data.pressure} hPa</div>
                  <Progress value={((data.pressure - 980) / 40) * 100} className="h-2 mt-2" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              {Object.entries(predictions).map(([period, pred]) => (
                <motion.div
                  key={period}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-card rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold capitalize">
                      {period.replace('next', 'Next ').replace('h', ' hours')}
                    </h4>
                    <Badge variant="secondary">{pred.probability}% confidence</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Temperature</div>
                      <div className="text-xl font-bold">{pred.temp}°C</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Conditions</div>
                      <div className="text-sm font-medium">{pred.conditions}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Probability</div>
                      <Progress value={pred.probability} className="h-2 mt-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUpIcon className="w-5 h-5 text-green-400" />
                    <h4 className="font-semibold">Temperature Trend</h4>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Next 24 hours</div>
                  <div className="text-2xl font-bold">+3°C</div>
                  <div className="text-xs text-green-400">Warming trend</div>
                </div>

                <div className="p-4 bg-card rounded-lg border">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDownIcon className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold">Precipitation Trend</h4>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Next 6 hours</div>
                  <div className="text-2xl font-bold">-15%</div>
                  <div className="text-xs text-blue-400">Decreasing chance</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Action Recommendations */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Smart Recommendations
            <Badge variant="outline">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <motion.div
            whileHover={{ x: 4 }}
            className="p-3 bg-primary/5 rounded-lg border border-primary/10"
          >
            <h4 className="font-semibold text-sm">Optimal Event Timing</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Best window: 2:00 PM - 6:00 PM (78% success probability)
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ x: 4 }}
            className="p-3 bg-accent/5 rounded-lg border border-accent/10"
          >
            <h4 className="font-semibold text-sm">Equipment Suggestions</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Bring: Sunscreen (UV {data.uvIndex}), light rain protection, wind-resistant setup
            </p>
          </motion.div>

          <motion.div
            whileHover={{ x: 4 }}
            className="p-3 bg-secondary/5 rounded-lg border border-secondary/10"
          >
            <h4 className="font-semibold text-sm">Backup Plan</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Indoor alternative ready by 4:00 PM if conditions deteriorate
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};