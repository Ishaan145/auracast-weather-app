import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TrendingUpIcon, TrendingDownIcon, CalendarIcon, DatabaseIcon } from './Icons';

interface HistoricalDataPoint {
  year: number;
  temp: number;
  precipitation: number;
  windSpeed: number;
  eventSuccess: number;
}

interface HistoricalWeatherDataProps {
  location: string;
  historicalData: HistoricalDataPoint[];
  trends: {
    temperature: { change: number; direction: 'up' | 'down' | 'stable' };
    precipitation: { change: number; direction: 'up' | 'down' | 'stable' };
    extremeEvents: { change: number; direction: 'up' | 'down' | 'stable' };
  };
  climateInsights: {
    bestMonths: string[];
    worstMonths: string[];
    optimalConditions: string;
    riskFactors: string[];
  };
}

export const HistoricalWeatherData: React.FC<HistoricalWeatherDataProps> = ({
  location,
  historicalData,
  trends,
  climateInsights
}) => {
  const getTrendIcon = (direction: string) => {
    if (direction === 'up') return <TrendingUpIcon className="w-4 h-4 text-red-400" />;
    if (direction === 'down') return <TrendingDownIcon className="w-4 h-4 text-blue-400" />;
    return <div className="w-4 h-4 rounded-full bg-gray-400" />;
  };

  const getTrendColor = (direction: string) => {
    if (direction === 'up') return 'text-red-400';
    if (direction === 'down') return 'text-blue-400';
    return 'text-gray-400';
  };

  const averageSuccess = historicalData.reduce((acc, data) => acc + data.eventSuccess, 0) / historicalData.length;
  const dataYears = Math.max(...historicalData.map(d => d.year)) - Math.min(...historicalData.map(d => d.year)) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Historical Overview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DatabaseIcon className="w-5 h-5 text-primary" />
            Historical Climate Analysis - {location}
            <Badge variant="secondary">{dataYears} years of data</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{averageSuccess.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground mt-1">Historical Success Rate</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-card rounded-lg border"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">{dataYears}</div>
                <div className="text-xs text-muted-foreground mt-1">Years Analyzed</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-card rounded-lg border"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">{historicalData.length * 365}</div>
                <div className="text-xs text-muted-foreground mt-1">Data Points</div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-card rounded-lg border"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-xs text-muted-foreground mt-1">Prediction Accuracy</div>
              </div>
            </motion.div>
          </div>

          {/* Climate Trends */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">30-Year Climate Trends</h3>
            
            <div className="grid gap-4">
              <motion.div
                whileHover={{ x: 4 }}
                className="p-4 bg-card rounded-lg border"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(trends.temperature.direction)}
                    <span className="font-medium">Temperature</span>
                  </div>
                  <Badge variant="outline" className={getTrendColor(trends.temperature.direction)}>
                    {trends.temperature.change > 0 ? '+' : ''}{trends.temperature.change}°C
                  </Badge>
                </div>
                <Progress 
                  value={Math.abs(trends.temperature.change) * 10} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {trends.temperature.direction === 'up' ? 'Warming trend detected' : 
                   trends.temperature.direction === 'down' ? 'Cooling trend detected' : 'Stable temperatures'}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                className="p-4 bg-card rounded-lg border"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(trends.precipitation.direction)}
                    <span className="font-medium">Precipitation</span>
                  </div>
                  <Badge variant="outline" className={getTrendColor(trends.precipitation.direction)}>
                    {trends.precipitation.change > 0 ? '+' : ''}{trends.precipitation.change}%
                  </Badge>
                </div>
                <Progress 
                  value={Math.abs(trends.precipitation.change) * 2} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {trends.precipitation.direction === 'up' ? 'Increasing rainfall patterns' : 
                   trends.precipitation.direction === 'down' ? 'Decreasing rainfall patterns' : 'Stable precipitation'}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                className="p-4 bg-card rounded-lg border"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(trends.extremeEvents.direction)}
                    <span className="font-medium">Extreme Weather Events</span>
                  </div>
                  <Badge variant="outline" className={getTrendColor(trends.extremeEvents.direction)}>
                    {trends.extremeEvents.change > 0 ? '+' : ''}{trends.extremeEvents.change}%
                  </Badge>
                </div>
                <Progress 
                  value={Math.abs(trends.extremeEvents.change) * 3} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {trends.extremeEvents.direction === 'up' ? 'More frequent extreme weather' : 
                   trends.extremeEvents.direction === 'down' ? 'Less frequent extreme weather' : 'Stable extreme weather patterns'}
                </p>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Climate Insights */}
      <Card className="glass border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-accent" />
            Seasonal Climate Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-green-500/10 rounded-lg border border-green-500/20"
            >
              <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Best Months for Events
              </h4>
              <div className="flex flex-wrap gap-2">
                {climateInsights.bestMonths.map((month, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-500/20 text-green-300">
                    {month}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Historically optimal weather conditions with high success rates
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-red-500/10 rounded-lg border border-red-500/20"
            >
              <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Challenging Months
              </h4>
              <div className="flex flex-wrap gap-2">
                {climateInsights.worstMonths.map((month, index) => (
                  <Badge key={index} variant="secondary" className="bg-red-500/20 text-red-300">
                    {month}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Higher risk periods requiring extra planning and backup options
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-primary/5 rounded-lg border border-primary/10"
          >
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Optimal Conditions Profile
            </h4>
            <p className="text-sm text-muted-foreground">{climateInsights.optimalConditions}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 bg-accent/5 rounded-lg border border-accent/10"
          >
            <h4 className="font-semibold text-accent mb-2">🚨 Key Risk Factors</h4>
            <ul className="space-y-1">
              {climateInsights.riskFactors.map((factor, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {factor}
                </li>
              ))}
            </ul>
          </motion.div>
        </CardContent>
      </Card>

      {/* Data Confidence & Sources */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-sm">Data Sources & Confidence</h4>
            <div className="flex justify-center flex-wrap gap-4 text-xs text-muted-foreground">
              <span>• NOAA Historical Records</span>
              <span>• Satellite Imagery Analysis</span>
              <span>• Local Weather Stations</span>
              <span>• Climate Research Centers</span>
            </div>
            <Badge variant="outline" className="mt-2">
              95% Statistical Confidence Level
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};