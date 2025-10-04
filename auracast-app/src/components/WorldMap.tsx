import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from 'react-simple-maps';
import { motion } from 'framer-motion';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface LocationData {
  name: string;
  coords: [number, number];
  risk: number;
  weather?: {
    temp: string;
    condition: string;
    humidity: string;
    wind: string;
  };
}

interface WorldMapProps {
  mode: 'single' | 'nearby' | 'travel';
  locations: LocationData[];
  travelRoute?: [number, number][];
  center: [number, number];
  zoom?: number;
  isLoading?: boolean;
  onMarkerClick?: (location: LocationData) => void;
}

const getRiskColor = (risk: number) => {
  if (risk < 30) return '#10b981'; // green
  if (risk < 50) return '#f59e0b'; // orange
  if (risk < 70) return '#f97316'; // orange-red
  return '#ef4444'; // red
};

export const WorldMap: React.FC<WorldMapProps> = ({
  mode,
  locations,
  travelRoute,
  center,
  zoom = 1,
  isLoading = false,
  onMarkerClick
}) => {
  const [position, setPosition] = useState({ coordinates: center, zoom });
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    // Animate to new location when center changes
    const newZoom = mode === 'single' ? 4 : mode === 'nearby' ? 5 : 2;
    setPosition({ coordinates: center, zoom: newZoom });
  }, [center, mode]);

  const handleMarkerClick = (location: LocationData) => {
    setSelectedLocation(location);
    onMarkerClick?.(location);
  };

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-lg overflow-hidden glass">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg font-semibold">Analyzing weather patterns...</p>
          </div>
        </motion.div>
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <ZoomableGroup
          center={position.coordinates}
          zoom={position.zoom}
          onMoveEnd={(position) => setPosition(position)}
          maxZoom={8}
          minZoom={1}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="hsl(var(--muted) / 0.2)"
                  stroke="hsl(var(--border))"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { fill: 'hsl(var(--muted) / 0.3)', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Render travel route line */}
          {mode === 'travel' && travelRoute && travelRoute.length >= 2 && (
            <motion.g
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <Line
                from={travelRoute[0]}
                to={travelRoute[1]}
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="5,5"
                style={{
                  filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))',
                }}
              />
            </motion.g>
          )}

          {/* Render markers */}
          {locations.map((location, index) => (
            <Marker
              key={`${location.name}-${index}`}
              coordinates={location.coords}
              onClick={() => handleMarkerClick(location)}
              style={{ cursor: 'pointer' }}
            >
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {/* Pulsing ring for single location */}
                {mode === 'single' && (
                  <motion.circle
                    r={12}
                    fill="none"
                    stroke={getRiskColor(location.risk)}
                    strokeWidth={2}
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                {/* Main marker circle */}
                <circle
                  r={mode === 'single' ? 8 : mode === 'nearby' ? 6 : 7}
                  fill={getRiskColor(location.risk)}
                  stroke="white"
                  strokeWidth={2}
                  style={{
                    filter: `drop-shadow(0 0 6px ${getRiskColor(location.risk)})`,
                  }}
                />

                {/* Inner circle for better visibility */}
                <circle
                  r={mode === 'single' ? 4 : mode === 'nearby' ? 3 : 3.5}
                  fill="white"
                  opacity={0.8}
                />
              </motion.g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Selected location info overlay */}
      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute top-4 left-4 right-4 md:right-auto md:max-w-sm glass p-4 rounded-lg z-10"
        >
          <button
            onClick={() => setSelectedLocation(null)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center"
          >
            ×
          </button>
          <h3 className="font-bold text-lg mb-2">{selectedLocation.name}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk Level:</span>
              <span className="font-semibold" style={{ color: getRiskColor(selectedLocation.risk) }}>
                {selectedLocation.risk}%
              </span>
            </div>
            {selectedLocation.weather && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature:</span>
                  <span>{selectedLocation.weather.temp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condition:</span>
                  <span>{selectedLocation.weather.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Humidity:</span>
                  <span>{selectedLocation.weather.humidity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wind:</span>
                  <span>{selectedLocation.weather.wind}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Map controls info */}
      <div className="absolute bottom-4 right-4 glass px-3 py-2 rounded-lg text-xs text-muted-foreground">
        <p>Scroll to zoom • Drag to pan</p>
      </div>
    </div>
  );
};
