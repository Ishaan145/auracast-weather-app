import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from '../hooks/useRouter';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const { login, register, user, isLoading: authLoading } = useAuth();
  const { navigate } = useRouter();
  
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: 'ishaan@auracast.io',
    password: 'password123'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect authenticated users away from this page
  useEffect(() => {
    if (!authLoading && user) {
      navigate('predict');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegister) {
        const success = await register(formData.name, formData.email, formData.password);
        if (success) {
          navigate('predict');
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        const success = await login(formData.email, formData.password);
        if (success) {
          navigate('predict');
        } else {
          setError('Invalid email or password.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 pb-24 md:pb-12">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid lg:grid-cols-2 gap-0 bg-card rounded-2xl shadow-2xl overflow-hidden border border-border"
        >
          {/* Left Panel - Form */}
          <div className="p-8 lg:p-12 space-y-8">
            {/* Logo and Header */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AuraCast
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">
                {isRegister ? 'Create Your Account' : 'Welcome Back'}
              </h1>
              <p className="text-muted-foreground">
                {isRegister 
                  ? 'Join the climatological revolution and start planning smarter'
                  : 'Sign in to access your personalized weather risk assessments'
                }
              </p>
            </div>

            {/* Demo Credentials Notice */}
            {!isRegister && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary/10 border border-primary/20 rounded-lg p-4"
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary">Demo Credentials</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use the pre-filled credentials for instant access to the platform
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      required={isRegister}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full h-11 pl-10 pr-4 bg-card text-foreground placeholder:text-muted-foreground border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                     className="w-full h-11 pl-10 pr-4 bg-card text-foreground placeholder:text-muted-foreground border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                     className="w-full h-11 pl-10 pr-10 bg-card text-foreground placeholder:text-muted-foreground border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading 
                  ? (isRegister ? 'Creating Account...' : 'Signing In...') 
                  : (isRegister ? 'Create Account' : 'Sign In')
                }
              </motion.button>
            </form>

            {/* Toggle Form Type */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isRegister 
                  ? 'Already have an account? Sign in instead' 
                  : "Don't have an account? Create one here"
                }
              </button>
            </div>
          </div>

          {/* Right Panel - NASA Space Theme */}
          <div className="hidden lg:block bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#16213e] text-white p-12 relative overflow-hidden">
            {/* Cosmic Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-primary rounded-full -translate-x-16 -translate-y-16 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-secondary rounded-full translate-x-24 translate-y-24 blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30"></div>
            </div>
            
            {/* Stars */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.7 + 0.3,
                }}
              />
            ))}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  {isRegister ? 'Start Your Journey' : 'Welcome Back'}
                </h2>
                <p className="text-white/90 text-lg leading-relaxed">
                  {isRegister 
                    ? 'Join thousands of planners who trust AuraCast for reliable, long-term weather risk assessment based on decades of climate data.'
                    : 'Continue planning with confidence using our climatological risk assessment platform powered by 30+ years of historical data.'
                  }
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Statistical Confidence</h3>
                    <p className="text-white/80 text-sm">85-96% accuracy with 30+ year datasets</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Activity-Specific Analysis</h3>
                    <p className="text-white/80 text-sm">Risk weighting tailored to your event type</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Long-term Planning</h3>
                    <p className="text-white/80 text-sm">Reliable assessments up to 6+ months ahead</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/20">
                <p className="text-white/70 text-sm">
                  "AuraCast revolutionized our event planning process. The statistical approach gives us 
                  confidence to plan major outdoor events months in advance."
                </p>
                <p className="text-white font-semibold text-sm mt-2">— Sarah L., Event Planner</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;