import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useRouter } from '../hooks/useRouter';
import { useAuth } from '../hooks/useAuth';
import { SunIcon, CloudRainIcon, WindIcon, AlertIcon, ChartIcon, CalendarIcon } from '../components/Icons';
import { WeatherAnimatedBackground } from '../components/WeatherAnimatedBackground';
import { AssemblingHeroText } from '../components/AssemblingHeroText';
import { LiveWeatherIntelligence } from '../components/LiveWeatherIntelligence';
import { SafetyAlertsPanel } from '../components/SafetyAlertsPanel';
import { MOCK_DATA } from '../lib/mockData';
import CountUp from 'react-countup';

const Index = () => {
  const { navigate } = useRouter();
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState('New Delhi, India');
  const [userCoords, setUserCoords] = useState<[number, number]>([28.7041, 77.1025]);

  // Simulate getting user's location
  useEffect(() => {
    // In a real app, you would use geolocation API here
    // For now, using default location
    setUserLocation('New Delhi, India');
    setUserCoords([28.7041, 77.1025]);
  }, []);

  const features = [
    {
      icon: ChartIcon,
      title: 'Statistical Analysis',
      description: 'Analyze 30+ years of climate data',
      stat: '30+',
      statLabel: 'Years Data'
    },
    {
      icon: CalendarIcon,
      title: 'Long-term Planning',
      description: 'Plan up to 6+ months in advance',
      stat: '6+',
      statLabel: 'Months Ahead'
    },
    {
      icon: AlertIcon,
      title: 'Activity-Specific Risk',
      description: 'Customized risk weighting for your activity',
      stat: '94%',
      statLabel: 'Confidence'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Provide Your Plan',
      description: 'Enter your desired location, date, and activity type. Use your current location or search anywhere in the world.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      title: 'AI-Powered Analysis',
      description: 'Our engine analyzes 30+ years of historical weather data, applying location-specific thresholds and activity weightings.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '03',
      title: 'Receive Actionable Insights',
      description: 'Get a clear risk probability score, factor breakdown, and AI-generated insights to make the best decision.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen">
      <WeatherAnimatedBackground />
      
      {/* Hero Section with 3D Assembling Text */}
      <div className="relative pt-20 md:pt-24 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-6"
            >
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                NASA Space Apps Challenge · Climatological Risk Assessment
              </Badge>
            </motion.div>

            <AssemblingHeroText
              title="AuraCast"
              subtitle="Plan with Probability, Not Prediction"
            />

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Analyzes 30+ years of climate data for statistical weather risk assessments
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.2, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate(user ? 'predict' : 'register')}
                  className="relative overflow-hidden px-8 py-4 text-lg font-semibold group"
                >
                  <span className="relative z-10">{user ? 'Start Predicting' : 'Get Started Free'}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('about')}
                  className="px-8 py-4 text-lg font-semibold border-2"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats with 3D effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.4, ease: "easeOut" }}
              className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto"
              style={{ perspective: '1000px' }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{
                    rotateY: 10,
                    scale: 1.1,
                    transition: { duration: 0.3 },
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    <CountUp end={parseInt(feature.stat.replace(/\D/g, ''))} duration={2} delay={2.6} />
                    {feature.stat.replace(/\d/g, '')}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {feature.statLabel}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Live Weather & Alerts Section - Now with dynamic location-based data */}
      <div className="py-20 bg-gradient-to-b from-background/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* Live Weather Intelligence - Dynamic */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <LiveWeatherIntelligence location={userLocation} coords={userCoords} />
            </motion.div>

            {/* Safety Alerts - Dynamic and Location-based */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <SafetyAlertsPanel location={userLocation} coords={userCoords} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Revolutionizing Weather Risk Assessment
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Move beyond 7-day forecasts. Our climatological approach provides statistical probability analysis for confident long-term planning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  whileHover={{
                    rotateY: 5,
                    rotateX: 5,
                    scale: 1.05,
                    transition: { duration: 0.3 },
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <Card className="glass h-full border-primary/20">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-primary flex items-center justify-center"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works in 3 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforming decades of climate data into your personal planning tool
            </p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
                style={{ perspective: '1000px' }}
              >
                <motion.div
                  className="flex-1"
                  whileHover={{ x: index % 2 === 0 ? 10 : -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white font-bold text-xl mb-6`}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {step.number}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
                
                <motion.div
                  className="flex-1"
                  whileHover={{
                    rotateY: index % 2 === 0 ? 10 : -10,
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className={`w-full h-64 rounded-2xl bg-gradient-to-r ${step.color} opacity-20 flex items-center justify-center relative overflow-hidden`}>
                    <motion.div
                      className="text-6xl font-bold text-white/30"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {step.number}
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Services CTA Section */}
      <div className="py-20 bg-gradient-to-b from-background to-red-500/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
          >
            <Card className="glass border-red-500/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left side - Info */}
                  <div className="p-8 lg:p-12 bg-gradient-to-br from-red-500/10 to-orange-500/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <AlertIcon className="w-6 h-6 text-red-500" />
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        Safety First
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      Emergency Services & Safety
                    </h3>
                    
                    <p className="text-muted-foreground mb-6">
                      Access 24/7 emergency contacts, weather safety guides, and real-time trip tracking to protect yourself during extreme weather conditions.
                    </p>
                    
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-red-500 text-xs">✓</span>
                        </div>
                        <span>Emergency helpline numbers by category</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-red-500 text-xs">✓</span>
                        </div>
                        <span>Weather safety tips for all conditions</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-red-500 text-xs">✓</span>
                        </div>
                        <span>Real-time trip tracking and alerts</span>
                      </li>
                      <li className="flex items-center gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-red-500 text-xs">✓</span>
                        </div>
                        <span>Smart packing guides for any weather</span>
                      </li>
                    </ul>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="lg"
                        onClick={() => navigate('emergency')}
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        🚨 Access Emergency Services
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Right side - Visual */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-background to-red-500/5">
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="p-4 bg-card/50 rounded-lg border border-border/50"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">🏥</span>
                          <span className="font-semibold text-sm">Medical Emergency</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Instant access to ambulance and medical services
                        </p>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="p-4 bg-card/50 rounded-lg border border-border/50"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">🌪️</span>
                          <span className="font-semibold text-sm">Weather Alerts</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Real-time monitoring with actionable suggestions
                        </p>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="p-4 bg-card/50 rounded-lg border border-border/50"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">🚨</span>
                          <span className="font-semibold text-sm">Disaster Response</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Quick contact with disaster management teams
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* CTA Section with 3D Effect */}
      <div className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              className="relative"
              whileHover={{
                rotateX: 2,
                scale: 1.02,
              }}
              transition={{ duration: 0.3 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.div
                className="absolute inset-0 opacity-30 -z-10 rounded-3xl"
                style={{
                  background: 'radial-gradient(circle at center, hsl(217 91% 60% / 0.6), transparent 70%)',
                  filter: 'blur(60px)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Plan with Confidence?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Join thousands of planners who trust AuraCast for their outdoor events.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    onClick={() => navigate(user ? 'predict' : 'register')}
                    className="relative overflow-hidden px-8 py-4 text-lg font-semibold group"
                  >
                    <span className="relative z-10">{user ? 'Start Analyzing' : 'Sign Up Free'}</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent"
                      animate={{
                        x: ['-100%', '100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('community')}
                    className="px-8 py-4 text-lg font-semibold border-2"
                  >
                    Join Community
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
