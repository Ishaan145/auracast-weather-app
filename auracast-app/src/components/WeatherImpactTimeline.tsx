import { motion } from 'framer-motion';
import { SunIcon, CloudRainIcon, WindIcon, SnowIcon, AlertTriangleIcon } from './Icons';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface TimelineEvent {
  time: string;
  hour: number;
  temp: number;
  condition: string;
  windSpeed: number;
  precipitation: number;
  risk: 'low' | 'medium' | 'high';
}

export const WeatherImpactTimeline = ({ date, location }: { date: string; location: string }) => {
  // Generate 24-hour weather impact timeline
  const generateTimeline = (): TimelineEvent[] => {
    const timeline: TimelineEvent[] = [];
    const baseTemp = 20 + Math.floor(Math.random() * 15);
    
    for (let hour = 0; hour < 24; hour += 3) {
      const tempVariation = Math.sin((hour / 24) * Math.PI * 2) * 8;
      const temp = Math.round(baseTemp + tempVariation);
      const precipChance = Math.random() * 100;
      const windSpeed = 5 + Math.floor(Math.random() * 20);
      
      let condition = 'Clear';
      let risk: 'low' | 'medium' | 'high' = 'low';
      
      if (precipChance > 70) {
        condition = 'Rainy';
        risk = 'high';
      } else if (precipChance > 40) {
        condition = 'Cloudy';
        risk = 'medium';
      } else if (windSpeed > 20) {
        condition = 'Windy';
        risk = 'medium';
      }
      
      timeline.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour,
        temp,
        condition,
        windSpeed,
        precipitation: Math.round(precipChance),
        risk,
      });
    }
    
    return timeline;
  };

  const timeline = generateTimeline();

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Rainy': return CloudRainIcon;
      case 'Windy': return WindIcon;
      case 'Cloudy': return SnowIcon;
      default: return SunIcon;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangleIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">24-Hour Weather Impact Timeline</h3>
          <Badge variant="outline" className="text-xs">Real-Time Simulation</Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Hour-by-hour weather conditions and event risk assessment for your selected date:
        </p>
        
        <div className="relative">
          {/* Timeline */}
          <div className="space-y-4">
            {timeline.map((event, index) => {
              const Icon = getWeatherIcon(event.condition);
              
              return (
                <motion.div
                  key={event.time}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative"
                >
                  {/* Timeline connector */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-[19px] top-10 w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    {/* Time marker */}
                    <div className="flex flex-col items-center w-16 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getRiskColor(event.risk)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold mt-1">{event.time}</span>
                    </div>
                    
                    {/* Event details */}
                    <div className="flex-1 p-4 rounded-lg bg-gradient-to-r from-card to-transparent border border-border/50">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Temperature</p>
                          <p className="font-semibold">{event.temp}°C</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Condition</p>
                          <p className="font-semibold">{event.condition}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Wind</p>
                          <p className="font-semibold">{event.windSpeed} km/h</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Rain Chance</p>
                          <p className="font-semibold">{event.precipitation}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
          <h4 className="font-semibold text-sm mb-2">Event Planning Recommendations</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Optimal event window: 12:00 - 18:00 based on lowest risk periods</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Consider indoor backup for 18:00 onwards due to increased precipitation probability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Wind speed may affect outdoor decorations during afternoon hours</span>
            </li>
          </ul>
        </div>
      </Card>
    </motion.div>
  );
};
