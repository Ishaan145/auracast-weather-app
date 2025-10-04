import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LocationIcon, CalendarIcon, AlertTriangleIcon, TrendingUpIcon, TrendingDownIcon, SunIcon, CloudRainIcon, WindIcon } from './Icons';
import CountUp from 'react-countup';

interface WeatherAnalysisResultsProps {
  eventType: string;
  location: string;
  date: string;
  coords: [number, number];
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  preparationLevel: 'LOW PREPARATION NEEDED' | 'MODERATE PREPARATION' | 'HIGH PREPARATION REQUIRED';
  analysisConfidence: number;
  rainProbability: number;
  temperature: number;
  windSpeed: number;
  humidity: number;
  extremeConditions: {
    veryHot: number;
    veryCold: number;
    veryWindy: number;
    veryWet: number;
    veryUncomfortable: number;
  };
  climateTrends: {
    temperatureTrend: string;
    precipitationTrend: string;
    extremeHeat: string;
    analysis: string;
  };
  recommendations: string[];
  dataAnalysis: {
    yearsAnalyzed: number;
    analysisPeriod: string;
    dataSource: string;
  };
}

export const WeatherAnalysisResults: React.FC<WeatherAnalysisResultsProps> = ({
  eventType,
  location,
  date,
  coords,
  riskLevel,
  preparationLevel,
  analysisConfidence,
  rainProbability,
  temperature,
  windSpeed,
  humidity,
  extremeConditions,
  climateTrends,
  recommendations,
  dataAnalysis,
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'MODERATE': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
      case 'HIGH': return 'bg-orange-500/10 border-orange-500/20 text-orange-400';
      case 'SEVERE': return 'bg-red-500/10 border-red-500/20 text-red-400';
      default: return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  const getRainRiskText = (prob: number) => {
    if (prob <= 20) return 'Low Rain Risk';
    if (prob <= 40) return 'Moderate Rain Risk';
    if (prob <= 70) return 'High Rain Risk';
    return 'Severe Rain Risk';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Weather Analysis Results</h2>
              <p className="text-muted-foreground">for your {eventType}</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                {getRainRiskText(rainProbability)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <LocationIcon className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Current Location ({coords[0].toFixed(4)}, {coords[1].toFixed(4)})</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{formatDate(date)}</span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <span className="text-muted-foreground">🌐 {coords[0].toFixed(4)}, {coords[1].toFixed(4)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Event Risk Assessment */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🛡️ Event Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-card text-center">
              <h4 className="text-sm text-muted-foreground mb-2">Overall Risk Level</h4>
              <div className={`text-2xl font-bold px-4 py-2 rounded-lg inline-block ${getRiskColor(riskLevel)}`}>
                {riskLevel}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on extreme weather probabilities and event type analysis
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-card text-center">
              <h4 className="text-sm text-muted-foreground mb-2">Preparation Level</h4>
              <div className="text-lg font-bold text-primary mb-2">
                {preparationLevel}
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended level of contingency planning
              </p>
            </div>

            <div className="p-4 rounded-lg border bg-card text-center">
              <h4 className="text-sm text-muted-foreground mb-2">Analysis Confidence</h4>
              <div className="text-3xl font-bold text-primary mb-2">
                <CountUp end={analysisConfidence} duration={1.5} suffix="%" />
              </div>
              <p className="text-xs text-muted-foreground">
                Confidence level based on data quality and historical coverage
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Metrics */}
      <Card className="glass">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rain Probability - Circular Gauge */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border text-center"
            >
              <h4 className="text-sm text-muted-foreground mb-3">Rain Probability</h4>
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - rainProbability / 100)}`}
                    className="text-blue-500 transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">
                    <CountUp end={rainProbability} duration={1.5} suffix="%" />
                  </span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {rainProbability <= 20 ? 'No Rain' : 'Rain Chance'}
              </div>
              <div className="text-xs font-medium mt-1">
                <CountUp end={rainProbability} duration={1.5} suffix="%" /> chance of rain
              </div>
            </motion.div>

            {/* Temperature */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl border text-center"
            >
              <h4 className="text-sm text-muted-foreground mb-3">Temperature</h4>
              <SunIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">
                <CountUp end={temperature} duration={1.5} suffix="°C" />
              </div>
              <div className="text-xs text-muted-foreground">Expected temperature</div>
            </motion.div>

            {/* Wind Speed */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border text-center"
            >
              <h4 className="text-sm text-muted-foreground mb-3">Wind Speed</h4>
              <WindIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">
                💨 <CountUp end={windSpeed} duration={1.5} /> km/h
              </div>
              <div className="text-xs text-muted-foreground">Wind Speed</div>
            </motion.div>

            {/* Humidity */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border text-center"
            >
              <h4 className="text-sm text-muted-foreground mb-3">Humidity</h4>
              <CloudRainIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">
                💧 <CountUp end={humidity} duration={1.5} suffix="%" />
              </div>
              <div className="text-xs text-muted-foreground">Humidity</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Extreme Condition Probabilities */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌪️ Extreme Condition Probabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-red-500/5 rounded-lg border border-red-500/20 text-center"
            >
              <div className="text-3xl mb-2">🔥</div>
              <h4 className="text-sm font-semibold mb-1">Very Hot</h4>
              <div className="text-xs text-muted-foreground mb-2">&gt;35°C</div>
              <div className="text-2xl font-bold text-red-400">
                <CountUp end={extremeConditions.veryHot} duration={1.5} suffix="%" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">probability</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20 text-center"
            >
              <div className="text-3xl mb-2">❄️</div>
              <h4 className="text-sm font-semibold mb-1">Very Cold</h4>
              <div className="text-xs text-muted-foreground mb-2">&lt;0°C</div>
              <div className="text-2xl font-bold text-blue-400">
                <CountUp end={extremeConditions.veryCold} duration={1.5} suffix="%" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">probability</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20 text-center"
            >
              <div className="text-3xl mb-2">💨</div>
              <h4 className="text-sm font-semibold mb-1">Very Windy</h4>
              <div className="text-xs text-muted-foreground mb-2">&gt;25 km/h</div>
              <div className="text-2xl font-bold text-cyan-400">
                <CountUp end={extremeConditions.veryWindy} duration={1.5} suffix="%" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">probability</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20 text-center"
            >
              <div className="text-3xl mb-2">🌧️</div>
              <h4 className="text-sm font-semibold mb-1">Very Wet</h4>
              <div className="text-xs text-muted-foreground mb-2">&gt;10mm rain</div>
              <div className="text-2xl font-bold text-blue-400">
                <CountUp end={extremeConditions.veryWet} duration={1.5} suffix="%" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">probability</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/20 text-center"
            >
              <div className="text-3xl mb-2">😫</div>
              <h4 className="text-sm font-semibold mb-1">Very Uncomfortable</h4>
              <div className="text-xs text-muted-foreground mb-2">Heat Index &gt;40°C</div>
              <div className="text-2xl font-bold text-orange-400">
                <CountUp end={extremeConditions.veryUncomfortable} duration={1.5} suffix="%" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">probability</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Climate Trends & Analysis */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Climate Trends & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUpIcon className="w-5 h-5 text-orange-400" />
                <h4 className="font-semibold">🌡️ Temperature Trend</h4>
              </div>
              <p className="text-sm text-muted-foreground">{climateTrends.temperatureTrend}</p>
            </div>

            <div className="p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUpIcon className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold">🌧️ Precipitation Trend</h4>
              </div>
              <p className="text-sm text-muted-foreground">{climateTrends.precipitationTrend}</p>
            </div>

            <div className="p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUpIcon className="w-5 h-5 text-red-400" />
                <h4 className="font-semibold">🔥 Extreme Heat</h4>
              </div>
              <p className="text-sm text-muted-foreground">{climateTrends.extremeHeat}</p>
            </div>

            <div className="p-4 bg-card rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">📊 Analysis</h4>
              </div>
              <p className="text-sm text-muted-foreground">{climateTrends.analysis}</p>
            </div>
          </div>

          <div className="p-3 bg-muted/20 rounded-lg text-center text-sm text-muted-foreground">
            Based on {dataAnalysis.yearsAnalyzed}-year {dataAnalysis.dataSource} climate data analysis
          </div>
        </CardContent>
      </Card>

      {/* Event-Specific Recommendations */}
      <Card className="glass border-green-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📋 Event-Specific Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-card rounded-lg border"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{rec}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20 text-center">
              <p className="text-sm text-green-400">
                ℹ️ No specific recommendations needed. Weather conditions appear favorable!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Analysis Summary */}
      <Card className="glass bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔬 Data Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                <CountUp end={dataAnalysis.yearsAnalyzed} duration={2} />
              </div>
              <div className="text-sm text-muted-foreground">Years Analyzed</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-primary mb-2">
                {dataAnalysis.analysisPeriod}
              </div>
              <div className="text-sm text-muted-foreground">Analysis Period</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-primary mb-2">
                {dataAnalysis.dataSource}
              </div>
              <div className="text-sm text-muted-foreground">Data Source</div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Analysis generated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'numeric', 
              day: 'numeric' 
            })} at {new Date().toLocaleTimeString('en-US')}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
