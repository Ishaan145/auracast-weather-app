import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { EmergencyHelpline } from '../components/EmergencyHelpline';
import { TripTracker } from '../components/TripTracker';
import { AlertIcon, LocationIcon } from '../components/Icons';
import { WeatherAnimatedBackground } from '../components/WeatherAnimatedBackground';
import { Hospital, Pill, ShieldCheck, Fuel, Ambulance, Stethoscope, Building2, UserRound } from 'lucide-react';

const EmergencyServicesPage = () => {
  const [activeTab, setActiveTab] = useState('helpline');
  const [userLocation, setUserLocation] = useState('Delhi, India');
  const [coords, setCoords] = useState<[number, number]>([28.7041, 77.1025]);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords([latitude, longitude]);
          setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.error('Location detection error:', error);
        }
      );
    }
  };

  const safetyTips = [
    {
      category: 'Extreme Heat',
      icon: '🌡️',
      tips: [
        'Stay hydrated - drink water every 20-30 minutes',
        'Avoid outdoor activities during peak hours (11 AM - 4 PM)',
        'Wear light-colored, loose-fitting clothing',
        'Use sunscreen with SPF 30 or higher',
        'Take breaks in shaded or air-conditioned areas'
      ]
    },
    {
      category: 'Heavy Rain & Floods',
      icon: '🌧️',
      tips: [
        'Move to higher ground immediately if flooding occurs',
        'Avoid walking or driving through floodwater',
        'Stay away from electrical equipment and power lines',
        'Keep emergency supplies ready (food, water, flashlight)',
        'Follow official evacuation orders'
      ]
    },
    {
      category: 'Strong Winds',
      icon: '💨',
      tips: [
        'Secure loose objects that could become projectiles',
        'Stay indoors away from windows',
        'Avoid parking under trees or near power lines',
        'Be cautious of falling debris',
        'Listen to weather updates regularly'
      ]
    },
    {
      category: 'Extreme Cold',
      icon: '❄️',
      tips: [
        'Dress in layers with waterproof outer layer',
        'Cover exposed skin to prevent frostbite',
        'Keep moving to maintain body heat',
        'Avoid alcohol and caffeine',
        'Watch for signs of hypothermia'
      ]
    },
    {
      category: 'Thunderstorms',
      icon: '⚡',
      tips: [
        'Seek shelter immediately in a sturdy building',
        'Avoid using electronic devices connected to outlets',
        'Stay away from windows and doors',
        'Do not take shelter under trees',
        'Wait 30 minutes after last thunder before going outside'
      ]
    },
    {
      category: 'Poor Visibility (Fog)',
      icon: '🌫️',
      tips: [
        'Use low-beam headlights, not high beams',
        'Reduce speed and increase following distance',
        'Use windshield wipers and defrosters',
        'Avoid sudden braking or lane changes',
        'Pull over safely if visibility is too poor'
      ]
    }
  ];

  const packingGuide = {
    'Rainy Weather': ['Umbrella', 'Raincoat/Poncho', 'Waterproof bags', 'Extra clothes', 'Waterproof shoes'],
    'Hot Weather': ['Sunscreen', 'Hat/Cap', 'Sunglasses', 'Light clothing', 'Water bottle', 'Cooling towel'],
    'Cold Weather': ['Warm jacket', 'Gloves', 'Scarf', 'Thermal wear', 'Warm socks', 'Lip balm'],
    'Windy Weather': ['Windbreaker', 'Secure bags', 'Hair ties', 'Eye protection', 'Layered clothing'],
    'General Emergency Kit': ['First aid kit', 'Flashlight', 'Power bank', 'Emergency contacts', 'Cash', 'Medications']
  };

  return (
    <div className="min-h-screen pt-6 md:pt-16 pb-20 md:pb-12">
      <WeatherAnimatedBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 lg:mb-12"
        >
          <Badge variant="secondary" className="mb-4 px-4 py-2 flex items-center gap-2 w-fit mx-auto">
            <AlertIcon className="w-4 h-4" />
            Emergency Services & Safety
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4">
            Your Safety Companion
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            24/7 Emergency Helpline · Weather Safety Tips · Real-Time Trip Monitoring
          </p>
        </motion.div>

        {/* Quick Location Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <LocationIcon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Current Location</p>
                    <p className="text-xs text-muted-foreground">{userLocation}</p>
                  </div>
                </div>
                <Button onClick={detectLocation} variant="outline" size="sm">
                  Detect My Location
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-2 bg-background/40 p-1">
            <TabsTrigger 
              value="helpline" 
              className="py-2 md:py-3 text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2 min-h-[3rem] md:min-h-0"
            >
              <span className="text-base md:text-lg">🚨</span>
              <span className="leading-tight text-center">Emergency Helpline</span>
            </TabsTrigger>
            <TabsTrigger 
              value="safety" 
              className="py-2 md:py-3 text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2 min-h-[3rem] md:min-h-0"
            >
              <span className="text-base md:text-lg">🛡️</span>
              <span className="leading-tight text-center">Safety Guide</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tracker" 
              className="py-2 md:py-3 text-xs md:text-sm flex flex-col md:flex-row items-center gap-1 md:gap-2 min-h-[3rem] md:min-h-0"
            >
              <span className="text-base md:text-lg">📍</span>
              <span className="leading-tight text-center">Trip Tracker</span>
            </TabsTrigger>
          </TabsList>

          {/* Emergency Helpline Tab */}
          <TabsContent value="helpline" className="space-y-6">
            {/* Quick Access Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <a
                href={`https://www.google.com/maps/search/hospitals+near+me/@${coords[0]},${coords[1]},15z`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Hospital className="w-10 h-10 relative z-10 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <span className="font-bold text-lg relative z-10">Nearest Hospital</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/pharmacy+near+me/@${coords[0]},${coords[1]},15z`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Pill className="w-10 h-10 relative z-10 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <span className="font-bold text-lg relative z-10">Nearest Pharmacy</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/police+station+near+me/@${coords[0]},${coords[1]},15z`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <ShieldCheck className="w-10 h-10 relative z-10 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <span className="font-bold text-lg relative z-10">Police Station</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/gas+station+near+me/@${coords[0]},${coords[1]},15z`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden h-32 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Fuel className="w-10 h-10 relative z-10 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <span className="font-bold text-lg relative z-10">Gas Station</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <EmergencyHelpline location={userLocation} coords={coords} weatherRisk={45} />
              
              <div className="space-y-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertIcon className="w-5 h-5 text-primary" />
                      When to Call Emergency Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <h4 className="font-semibold text-sm text-red-500 mb-2">🚨 Immediate Danger</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Life-threatening medical emergency</li>
                        <li>• Natural disaster (flood, landslide, storm)</li>
                        <li>• Trapped or stranded in dangerous conditions</li>
                        <li>• Severe injury requiring immediate attention</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <h4 className="font-semibold text-sm text-orange-500 mb-2">⚠️ Urgent Assistance</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Vehicle breakdown in remote area</li>
                        <li>• Lost in unfamiliar location</li>
                        <li>• Running low on essential supplies</li>
                        <li>• Uncertain about weather safety</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <h4 className="font-semibold text-sm text-blue-500 mb-2">ℹ️ Information & Advice</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Tourist helpline for general queries</li>
                        <li>• Non-emergency medical advice</li>
                        <li>• Local weather updates</li>
                        <li>• Travel route information</li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground italic">
                        💡 Tip: Save emergency numbers in your phone before starting your trip
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Facilities Quick Search */}
                <Card className="glass border-red-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-500">
                      🏥 Find Medical Facilities Nearby
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Instantly search for emergency medical facilities in your area using Google Maps
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <a
                        href={`https://www.google.com/maps/search/emergency+hospital+near+me/@${coords[0]},${coords[1]},14z`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group h-auto p-4 flex items-center gap-4 border-2 border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 rounded-xl transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Ambulance className="w-6 h-6 text-red-500" strokeWidth={2.5} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-sm mb-0.5">Emergency Room</div>
                          <div className="text-xs text-muted-foreground">24/7 hospitals</div>
                        </div>
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/urgent+care+near+me/@${coords[0]},${coords[1]},14z`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group h-auto p-4 flex items-center gap-4 border-2 border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500/50 rounded-xl transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Hospital className="w-6 h-6 text-orange-500" strokeWidth={2.5} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-sm mb-0.5">Urgent Care</div>
                          <div className="text-xs text-muted-foreground">Walk-in clinics</div>
                        </div>
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/clinic+near+me/@${coords[0]},${coords[1]},14z`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group h-auto p-4 flex items-center gap-4 border-2 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50 rounded-xl transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Building2 className="w-6 h-6 text-blue-500" strokeWidth={2.5} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-sm mb-0.5">Medical Clinics</div>
                          <div className="text-xs text-muted-foreground">General care</div>
                        </div>
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/doctor+near+me/@${coords[0]},${coords[1]},14z`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group h-auto p-4 flex items-center gap-4 border-2 border-green-500/30 bg-green-500/5 hover:bg-green-500/10 hover:border-green-500/50 rounded-xl transition-all duration-200 hover:shadow-lg"
                      >
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Stethoscope className="w-6 h-6 text-green-500" strokeWidth={2.5} />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-sm mb-0.5">Doctors</div>
                          <div className="text-xs text-muted-foreground">Find physicians</div>
                        </div>
                      </a>
                    </div>

                    <div className="pt-3 border-t border-border/50">
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-primary">ℹ️</span>
                        <p>
                          Opens Google Maps with your current location. Make sure location services are enabled for accurate results.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Safety Guide Tab */}
          <TabsContent value="safety" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Safety Tips by Weather */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {safetyTips.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass h-full">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          {category.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {category.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Packing Guide */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🎒 Smart Packing Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(packingGuide).map(([weather, items]) => (
                      <div key={weather} className="p-4 bg-muted/20 rounded-lg">
                        <h4 className="font-semibold text-sm mb-3">{weather}</h4>
                        <ul className="space-y-2">
                          {items.map((item, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Trip Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <TripTracker
                tripName="Sample Trip"
                startDate={new Date().toISOString().split('T')[0]}
                endDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                location={userLocation}
              />

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📡 How Trip Tracking Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">1️⃣</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Start Tracking</h4>
                        <p className="text-xs text-muted-foreground">
                          Activate real-time monitoring before your trip begins
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">2️⃣</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Continuous Monitoring</h4>
                        <p className="text-xs text-muted-foreground">
                          Weather conditions checked every 30 seconds along your route
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">3️⃣</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Smart Alerts</h4>
                        <p className="text-xs text-muted-foreground">
                          Receive instant notifications about weather changes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">4️⃣</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Actionable Suggestions</h4>
                        <p className="text-xs text-muted-foreground">
                          Get recommendations on timing, routes, and safety measures
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Pro Tip:</strong> Enable location services for accurate tracking and localized weather updates
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="glass bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Stay Safe on Every Journey</h3>
              <p className="text-sm text-muted-foreground mb-4">
                AuraCast combines real-time weather intelligence with emergency response systems to protect you
              </p>
              <Button className="bg-gradient-primary">
                Download Emergency Contacts PDF
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyServicesPage;
