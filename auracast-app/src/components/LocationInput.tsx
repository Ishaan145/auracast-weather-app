import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { LocationIcon, SearchIcon } from './Icons';
import { Badge } from './ui/badge';

interface LocationSuggestion {
  name: string;
  coords: [number, number];
  country: string;
  state?: string;
  display_name?: string;
}

interface LocationInputProps {
  value: string;
  onChange: (value: string, coords?: [number, number]) => void;
  placeholder?: string;
  showCoordinates?: boolean;
  onLocationDetect?: () => void;
  isDetecting?: boolean;
  className?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Enter location...",
  showCoordinates = true,
  onLocationDetect,
  isDetecting = false,
  className = ""
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch suggestions from Nominatim (OpenStreetMap) geocoding API
  useEffect(() => {
    if (value.length > 2) {
      const searchLocations = async () => {
        setIsSearching(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=8&addressdetails=1`,
            {
              headers: {
                'Accept': 'application/json',
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            const locations: LocationSuggestion[] = data.map((item: any) => ({
              name: item.address.city || item.address.town || item.address.village || item.address.county || item.name,
              coords: [parseFloat(item.lat), parseFloat(item.lon)] as [number, number],
              country: item.address.country || '',
              state: item.address.state,
              display_name: item.display_name
            }));
            setSuggestions(locations);
            setShowSuggestions(true);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        } finally {
          setIsSearching(false);
        }
      };

      const debounceTimer = setTimeout(searchLocations, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setShowSuggestions(false);
    }
  }, [value]);

  // Extract coordinates from location string
  useEffect(() => {
    const coordMatch = value.match(/\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
    if (coordMatch) {
      setCoordinates([parseFloat(coordMatch[1]), parseFloat(coordMatch[2])]);
    } else {
      setCoordinates(null);
    }
  }, [value]);

  const handleLocationSelect = (location: LocationSuggestion) => {
    const locationString = `${location.name}, ${location.country}${showCoordinates ? ` (${location.coords[0].toFixed(4)}, ${location.coords[1].toFixed(4)})` : ''}`;
    onChange(locationString, location.coords);
    setShowSuggestions(false);
  };

  const handleAutoDetect = async () => {
    if (onLocationDetect) {
      onLocationDetect();
    } else {
      // Fallback geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationString = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
            onChange(locationString, [latitude, longitude]);
          },
          (error) => {
            console.error('Geolocation error:', error);
          }
        );
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <SearchIcon className="w-4 h-4 text-muted-foreground" />
        </div>
        
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-24 font-medium"
          onFocus={() => value.length > 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAutoDetect}
          disabled={isDetecting}
          className="absolute right-1 top-1 bottom-1 text-xs px-2 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          {isDetecting ? (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Detecting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <LocationIcon className="w-3 h-3" />
              <span>Auto</span>
            </div>
          )}
        </Button>
      </div>

      {/* Coordinates display */}
      {coordinates && showCoordinates && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2"
        >
          <Badge variant="secondary" className="text-xs">
            <LocationIcon className="w-3 h-3 mr-1" />
            {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
          </Badge>
        </motion.div>
      )}

      {/* Location suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 z-50 mt-1"
        >
          <Card className="glass">
            <CardContent className="p-2 max-h-60 overflow-y-auto">
              {suggestions.map((location, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <LocationIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{location.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {location.state && `${location.state}, `}{location.country}
                      </div>
                    </div>
                    {showCoordinates && (
                      <div className="text-xs text-muted-foreground font-mono">
                        {location.coords[0].toFixed(2)}, {location.coords[1].toFixed(2)}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default LocationInput;