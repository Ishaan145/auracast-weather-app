import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { SunIcon, CloudRainIcon, WindIcon, SnowIcon, AlertIcon, TrendingUpIcon, TrendingDownIcon } from './Icons';
import CountUp from 'react-countup';

interface RiskData {
  overall: number;
  factors: {
    hot: number;
    cold: number;
    windy: number;
    wet: number;
  };
  confidence: number;
  activity?: string;
  activityDescription?: string;
  insight: string;
  trend?: {
    change: string;
    significance: number;
    direction: 'up' | 'down' | 'stable';
  };
  recommendations?: string[];
  historicalAverage?: number;
}

interface RiskAnalyzerProps {
  data: RiskData;
  isVisible: boolean;
}

const getRiskLevel = (risk: number) => {
  if (risk >= 80) return 'Critical';
  if (risk >= 60) return 'High';
  if (risk >= 40) return 'Moderate';
  if (risk >= 20) return 'Low';
  return 'Minimal';
};

const getRiskColor = (risk: number) => {
  if (risk >= 80) return 'from-red-600 to-red-700';
  if (risk >= 60) return 'from-orange-500 to-red-500';
  if (risk >= 40) return 'from-yellow-500 to-orange-500';
  if (risk >= 20) return 'from-green-500 to-yellow-500';
  return 'from-green-600 to-green-500';
};

const getRiskBgColor = (risk: number) => {
  if (risk >= 80) return 'bg-red-500/10 border-red-500/20';
  if (risk >= 60) return 'bg-orange-500/10 border-orange-500/20';
  if (risk >= 40) return 'bg-yellow-500/10 border-yellow-500/20';
  if (risk >= 20) return 'bg-green-500/10 border-green-500/20';
  return 'bg-green-600/10 border-green-600/20';
};

const weatherIcons = {
  hot: SunIcon,
  cold: SnowIcon,
  windy: WindIcon,
  wet: CloudRainIcon
};

const weatherLabels = {
  hot: 'Heat Risk',
  cold: 'Cold Risk',
  windy: 'Wind Risk',
  wet: 'Precipitation Risk'
};

export const RiskAnalyzer: React.FC<RiskAnalyzerProps> = ({ data, isVisible }) => {
  if (!isVisible) return null;

  const riskLevel = getRiskLevel(data.overall);
  const riskColor = getRiskColor(data.overall);
  const riskBgColor = getRiskBgColor(data.overall);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Overall Risk Card */}
      <Card className="glass overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Risk Assessment</span>
            <Badge variant="secondary" className="font-semibold">
              <CountUp end={data.confidence} duration={1} />% Confidence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Risk Display */}
          <div className={`relative p-8 rounded-xl bg-gradient-to-br ${riskColor} text-white text-center overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative z-10"
            >
              <h3 className="text-lg font-bold mb-3 opacity-90">Overall Risk Level</h3>
              <div className="text-6xl font-extrabold mb-2">
                <CountUp end={data.overall} duration={2} />%
              </div>
              <p className="text-lg font-semibold opacity-90 capitalize">
                {riskLevel} Risk
              </p>
              
              {data.historicalAverage && (
                <div className="mt-4 text-sm opacity-80">
                  <span>Historical Avg: {data.historicalAverage}%</span>
                  <span className={`ml-2 ${data.overall > data.historicalAverage ? 'text-red-200' : 'text-green-200'}`}>
                    ({data.overall > data.historicalAverage ? '+' : ''}{(data.overall - data.historicalAverage).toFixed(1)}%)
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Activity Optimization */}
          {data.activity && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className={`p-4 rounded-xl border ${riskBgColor} text-center`}
            >
              <h4 className="font-semibold text-sm text-muted-foreground mb-1">Optimized for</h4>
              <p className="font-bold text-lg">{data.activity}</p>
              {data.activityDescription && (
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {data.activityDescription}
                </p>
              )}
            </motion.div>
          )}

          {/* Factor Breakdown */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground">Risk Factors Breakdown</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(data.factors).map(([factor, value], index) => {
                const Icon = weatherIcons[factor as keyof typeof weatherIcons];
                const label = weatherLabels[factor as keyof typeof weatherLabels];
                
                return (
                  <motion.div
                    key={factor}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    className="bg-card rounded-xl p-4 border border-border/20 hover:border-border/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{label}</div>
                        <div className="text-xs text-muted-foreground">
                          {value >= 70 ? 'High Impact' : value >= 40 ? 'Moderate' : 'Low Impact'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          <CountUp end={value} duration={1.5} delay={0.5 + index * 0.1} />%
                        </span>
                        <Badge 
                          variant={value >= 70 ? 'destructive' : value >= 40 ? 'secondary' : 'default'}
                          className="text-xs"
                        >
                          {value >= 70 ? 'High' : value >= 40 ? 'Med' : 'Low'}
                        </Badge>
                      </div>
                      <Progress 
                        value={value} 
                        className="h-2" 
                        style={{
                          ['--progress-background' as any]: value >= 70 ? '#ef4444' : value >= 40 ? '#f59e0b' : '#22c55e'
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Climate Trend */}
          {data.trend && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="p-4 bg-muted/10 rounded-xl border border-border/20"
            >
              <div className="flex items-center gap-2 mb-3">
                {data.trend.direction === 'up' ? (
                  <TrendingUpIcon className="w-5 h-5 text-red-500" />
                ) : data.trend.direction === 'down' ? (
                  <TrendingDownIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                )}
                <h4 className="font-semibold text-sm">Climate Trend Analysis</h4>
                <Badge variant="outline" className="text-xs">
                  <CountUp end={Math.round(data.trend.significance * 100)} duration={1} delay={0.8} />% significance
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {data.trend.change}
              </p>
            </motion.div>
          )}

          {/* AI Insight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="p-4 border border-border/20 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  AI-Generated Insight
                  <Badge variant="outline" className="text-xs">GPT-4</Badge>
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {data.insight}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Recommendations */}
          {data.recommendations && data.recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="space-y-3"
            >
              <h4 className="font-semibold text-sm text-muted-foreground">Recommendations</h4>
              <div className="space-y-2">
                {data.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                    className="flex items-start gap-2 p-3 bg-accent/10 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RiskAnalyzer;