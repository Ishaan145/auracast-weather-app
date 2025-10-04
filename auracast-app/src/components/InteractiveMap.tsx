import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { LocationIcon, AlertIcon } from './Icons';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface InteractiveMapProps {
  mode: 'single' | 'nearby' | 'travel';
  locations: LocationData[];
  travelRoute?: [number, number][];
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (coords: [number, number]) => void;
  isLoading?: boolean;
}

// Custom risk-based marker icons
const createRiskIcon = (risk: number, size: 'small' | 'medium' | 'large' = 'medium') => {
  const color = risk > 70 ? '#ef4444' : risk > 40 ? '#f59e0b' : '#22c55e';
  const sizeMap = { small: 20, medium: 30, large: 40 };
  const iconSize = sizeMap[size];
  
  return L.divIcon({
    html: `
      <div style="
        width: ${iconSize}px;
        height: ${iconSize}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${iconSize * 0.3}px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      ">
        ${risk}%
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      </style>
    `,
    className: 'custom-risk-marker',
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  });
};

// Component to handle map clicks
const MapClickHandler: React.FC<{ onLocationSelect?: (coords: [number, number]) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      if (onLocationSelect) {
        onLocationSelect([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
};

// Weather overlay component
const WeatherOverlay: React.FC<{ location: LocationData; position: 'top-right' | 'top-left' }> = ({ location, position }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className={`absolute ${position === 'top-right' ? 'top-4 right-4' : 'top-4 left-4'} z-[1000]`}
  >
    <Card className="glass w-64">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">{location.name}</h3>
          <Badge variant={location.risk > 70 ? 'destructive' : location.risk > 40 ? 'secondary' : 'default'}>
            {location.risk}% Risk
          </Badge>
        </div>
        {location.weather && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Temperature:</span>
              <span className="font-medium">{location.weather.temp}</span>
            </div>
            <div className="flex justify-between">
              <span>Condition:</span>
              <span className="font-medium">{location.weather.condition}</span>
            </div>
            <div className="flex justify-between">
              <span>Humidity:</span>
              <span className="font-medium">{location.weather.humidity}</span>
            </div>
            <div className="flex justify-between">
              <span>Wind:</span>
              <span className="font-medium">{location.weather.wind}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  mode,
  locations,
  travelRoute,
  center = [28.7041, 77.1025],
  zoom = 6,
  onLocationSelect,
  isLoading
}) => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  // Auto-fit bounds based on locations
  useEffect(() => {
    if (mapInstance && locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => loc.coords));
      mapInstance.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [mapInstance, locations]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[2000] flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg font-semibold">Analyzing Climate Data...</p>
              <p className="text-sm text-muted-foreground">Processing 30+ years of weather patterns</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather overlay for selected location */}
      <AnimatePresence>
        {selectedLocation && (
          <WeatherOverlay location={selectedLocation} position="top-right" />
        )}
      </AnimatePresence>

      {/* Map controls */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedLocation(null)}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <LocationIcon className="w-4 h-4 mr-1" />
          Reset View
        </Button>
        
        {mode === 'nearby' && (
          <Card className="glass p-2">
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Low Risk (0-40%)</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Medium Risk (41-70%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>High Risk (71-100%)</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        ref={(mapInstance) => {
          if (mapInstance) {
            setMapInstance(mapInstance);
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Click handler for adding locations */}
        <MapClickHandler onLocationSelect={onLocationSelect} />

        {/* Single location marker */}
        {mode === 'single' && locations.length > 0 && (
          <Marker
            position={locations[0].coords}
            icon={createRiskIcon(locations[0].risk, 'large')}
            eventHandlers={{
              click: () => setSelectedLocation(locations[0])
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold">{locations[0].name}</h3>
                <p className="text-sm text-muted-foreground">Risk Level: {locations[0].risk}%</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Nearby locations with risk circles */}
        {mode === 'nearby' && locations.map((location, index) => (
          <React.Fragment key={index}>
            <Marker
              position={location.coords}
              icon={createRiskIcon(location.risk, 'medium')}
              eventHandlers={{
                click: () => setSelectedLocation(location)
              }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold">{location.name}</h3>
                  <p className="text-sm text-muted-foreground">Risk Level: {location.risk}%</p>
                  {location.weather && (
                    <div className="mt-2 text-xs space-y-1">
                      <div>{location.weather.temp} • {location.weather.condition}</div>
                      <div>Humidity: {location.weather.humidity}</div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
            
            {/* Risk radius circle */}
            <Circle
              center={location.coords}
              radius={location.risk * 500}
              pathOptions={{
                color: location.risk > 70 ? '#ef4444' : location.risk > 40 ? '#f59e0b' : '#22c55e',
                fillColor: location.risk > 70 ? '#ef4444' : location.risk > 40 ? '#f59e0b' : '#22c55e',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </React.Fragment>
        ))}

        {/* Travel route with waypoints */}
        {mode === 'travel' && travelRoute && (
          <>
            <Polyline
              positions={travelRoute}
              pathOptions={{
                color: '#6366f1',
                weight: 4,
                opacity: 0.8,
                dashArray: '10, 10',
              }}
            />
            
            {locations.map((location, index) => (
              <Marker
                key={index}
                position={location.coords}
                icon={createRiskIcon(location.risk, index === 0 || index === locations.length - 1 ? 'large' : 'medium')}
                eventHandlers={{
                  click: () => setSelectedLocation(location)
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {index === 0 ? 'Start Point' : index === locations.length - 1 ? 'Destination' : 'Waypoint'}
                    </p>
                    <p className="text-sm">Risk Level: {location.risk}%</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;