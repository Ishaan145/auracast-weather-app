import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Card } from './ui/card';
import { Thermometer, Droplets, Wind, Cloud, AlertTriangle } from 'lucide-react';

interface RiskData {
  temperature: { level: string; value: number; description: string };
  precipitation: { level: string; value: number; description: string };
  wind: { level: string; value: number; description: string };
  humidity: { level: string; value: number; description: string };
  overall: { level: string; score: number; description: string };
}

interface RiskCube3DProps {
  riskData: RiskData;
  isAnalyzing: boolean;
}

export const RiskCube3D = ({ riskData, isAnalyzing }: RiskCube3DProps) => {
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [selectedFace, setSelectedFace] = useState<string | null>(null);

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'hsl(142 76% 36%)';
      case 'medium':
        return 'hsl(38 92% 50%)';
      case 'high':
        return 'hsl(0 72% 51%)';
      default:
        return 'hsl(217 91% 60%)';
    }
  };

  const faces = [
    {
      id: 'temperature',
      icon: Thermometer,
      title: 'Temperature',
      data: riskData.temperature,
      position: 'front',
    },
    {
      id: 'precipitation',
      icon: Droplets,
      title: 'Precipitation',
      data: riskData.precipitation,
      position: 'right',
    },
    {
      id: 'wind',
      icon: Wind,
      title: 'Wind',
      data: riskData.wind,
      position: 'back',
    },
    {
      id: 'humidity',
      icon: Cloud,
      title: 'Humidity',
      data: riskData.humidity,
      position: 'left',
    },
  ];

  return (
    <div className="relative min-h-[600px] flex items-center justify-center perspective-[2000px]">
      <AnimatePresence mode="wait">
        {isAnalyzing && (
          <motion.div
            key="analyzing"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Rotating cube during analysis */}
            <motion.div
              className="relative w-64 h-64 preserve-3d"
              animate={{
                rotateX: 360,
                rotateY: 360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Cube faces */}
              {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face, i) => (
                <motion.div
                  key={face}
                  className="absolute w-64 h-64 border-2 border-primary/50 bg-card/20 backdrop-blur-sm"
                  style={{
                    transform: {
                      front: 'rotateY(0deg) translateZ(128px)',
                      back: 'rotateY(180deg) translateZ(128px)',
                      right: 'rotateY(90deg) translateZ(128px)',
                      left: 'rotateY(-90deg) translateZ(128px)',
                      top: 'rotateX(90deg) translateZ(128px)',
                      bottom: 'rotateX(-90deg) translateZ(128px)',
                    }[face],
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <motion.div
                      className="w-16 h-16 border-4 border-primary/50 border-t-primary rounded-sm"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </motion.div>
              ))}

              {/* Data streams flowing into cube */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>

            <motion.p
              className="absolute bottom-8 text-primary text-lg font-semibold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Analyzing Weather Data...
            </motion.p>
          </motion.div>
        )}

        {!isAnalyzing && !isUnfolded && (
          <motion.div
            key="cube"
            className="relative w-64 h-64 preserve-3d cursor-pointer"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, rotateY: 360 }}
            transition={{ duration: 1, rotateY: { duration: 2 } }}
            onClick={() => setIsUnfolded(true)}
            whileHover={{ scale: 1.05 }}
          >
            {/* Assembled cube with risk data */}
            {faces.map((face, i) => (
              <motion.div
                key={face.id}
                className="absolute w-64 h-64 border-2 backdrop-blur-sm flex items-center justify-center"
                style={{
                  borderColor: getRiskColor(face.data.level),
                  background: `linear-gradient(135deg, ${getRiskColor(face.data.level)}20, ${getRiskColor(face.data.level)}10)`,
                  transform: {
                    front: 'rotateY(0deg) translateZ(128px)',
                    back: 'rotateY(180deg) translateZ(128px)',
                    right: 'rotateY(90deg) translateZ(128px)',
                    left: 'rotateY(-90deg) translateZ(128px)',
                  }[face.position] || 'rotateY(0deg) translateZ(128px)',
                }}
              >
                <div className="text-center p-4">
                  <face.icon className="w-12 h-12 mx-auto mb-2" style={{ color: getRiskColor(face.data.level) }} />
                  <h3 className="text-lg font-bold mb-1">{face.title}</h3>
                  <p className="text-3xl font-bold" style={{ color: getRiskColor(face.data.level) }}>
                    {face.data.value}%
                  </p>
                  <p className="text-sm mt-2 uppercase font-semibold">{face.data.level}</p>
                </div>
              </motion.div>
            ))}

            {/* Center overall risk */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-32 h-32 rounded-full border-4 flex items-center justify-center backdrop-blur-md"
                style={{
                  borderColor: getRiskColor(riskData.overall.level),
                  background: `${getRiskColor(riskData.overall.level)}30`,
                }}
              >
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-1" style={{ color: getRiskColor(riskData.overall.level) }} />
                  <p className="text-2xl font-bold">{riskData.overall.score}%</p>
                </div>
              </div>
            </motion.div>

            <p className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm text-muted-foreground whitespace-nowrap">
              Click to unfold analysis
            </p>
          </motion.div>
        )}

        {!isAnalyzing && isUnfolded && (
          <motion.div
            key="unfolded"
            className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Unfolded panels */}
            {faces.map((face, i) => (
              <motion.div
                key={face.id}
                initial={{
                  opacity: 0,
                  rotateY: 90,
                  x: i % 2 === 0 ? -100 : 100,
                }}
                animate={{
                  opacity: 1,
                  rotateY: 0,
                  x: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  type: "spring",
                }}
              >
                <Card
                  className="p-6 cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: getRiskColor(face.data.level),
                    boxShadow: `0 0 30px ${getRiskColor(face.data.level)}40`,
                  }}
                  onClick={() => setSelectedFace(selectedFace === face.id ? null : face.id)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <face.icon className="w-8 h-8" style={{ color: getRiskColor(face.data.level) }} />
                    <h3 className="text-xl font-bold">{face.title}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-bold" style={{ color: getRiskColor(face.data.level) }}>
                        {face.data.value}%
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-semibold uppercase"
                        style={{
                          background: `${getRiskColor(face.data.level)}30`,
                          color: getRiskColor(face.data.level),
                        }}
                      >
                        {face.data.level}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{face.data.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Center overall risk card */}
            <motion.div
              className="md:col-span-3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card
                className="p-8"
                style={{
                  borderColor: getRiskColor(riskData.overall.level),
                  boxShadow: `0 0 40px ${getRiskColor(riskData.overall.level)}50`,
                  background: `linear-gradient(135deg, ${getRiskColor(riskData.overall.level)}10, transparent)`,
                }}
              >
                <div className="flex items-center justify-center gap-6">
                  <AlertTriangle className="w-16 h-16" style={{ color: getRiskColor(riskData.overall.level) }} />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Overall Event Risk</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-6xl font-bold" style={{ color: getRiskColor(riskData.overall.level) }}>
                        {riskData.overall.score}%
                      </span>
                      <span
                        className="px-4 py-2 rounded-full text-lg font-semibold uppercase"
                        style={{
                          background: `${getRiskColor(riskData.overall.level)}30`,
                          color: getRiskColor(riskData.overall.level),
                        }}
                      >
                        {riskData.overall.level} Risk
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2">{riskData.overall.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.button
              className="md:col-span-3 mx-auto px-6 py-3 rounded-lg font-semibold border-2 border-primary hover:bg-primary/10 transition-colors"
              onClick={() => setIsUnfolded(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reassemble Cube
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
