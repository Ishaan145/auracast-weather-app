import { motion } from 'framer-motion';
import { Building2, Target, TrendingUp, Users, Shield, Globe } from 'lucide-react';
import { WeatherAnimatedBackground } from '../components/WeatherAnimatedBackground';

const AboutPage = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <WeatherAnimatedBackground />
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              About AuraCast
            </h1>
            <p className="text-xl text-muted-foreground mt-6 leading-relaxed">
              Revolutionizing outdoor planning through climatological risk assessment. 
              We transform 30+ years of climate data into actionable probability insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To empower planners worldwide by making complex climatological data accessible and actionable. 
                We bridge the gap between scientific climate analysis and practical decision-making, enabling 
                confident long-term planning through statistical probability assessment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A world where outdoor planning is no longer constrained by weather uncertainty. 
                We envision making climate intelligence accessible to everyone, from individual event 
                planners to large organizations, fostering climate awareness and adaptation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Innovation */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Core Innovation</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From Meteorological Prediction to Climatological Probability Assessment
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card p-6 space-y-4"
            >
              <Shield className="w-10 h-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-center">Statistical Confidence</h3>
              <p className="text-muted-foreground text-center text-sm">
                30+ year datasets with 85-96% confidence scores and statistical significance testing
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card p-6 space-y-4"
            >
              <Building2 className="w-10 h-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-center">Activity-Specific Weighting</h3>
              <p className="text-muted-foreground text-center text-sm">
                Mathematical risk models tailored to hiking, weddings, construction, and more
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="card p-6 space-y-4"
            >
              <Globe className="w-10 h-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-center">Climate Intelligence</h3>
              <p className="text-muted-foreground text-center text-sm">
                Trend analysis showing how climate patterns have evolved over decades
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground">
              Passionate innovators working to democratize climate intelligence
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                <img
                  src="https://avatars.githubusercontent.com/u/67556325?v=4"
                  alt="Ishaan Saxena"
                  className="w-full h-full rounded-full object-cover bg-background"
                />
              </div>
              <h3 className="text-2xl font-bold">Ishaan Saxena</h3>
              <p className="text-primary font-semibold mb-4">Founder & Team Leader</p>
              <p className="text-muted-foreground leading-relaxed">
                Computer Science enthusiast with a passion for climate technology and data science. 
                Leading the development of AuraCast to revolutionize how we approach weather risk 
                assessment for outdoor planning. Committed to making climate intelligence accessible 
                to everyone.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-muted-foreground">
              Transforming outdoor planning through data-driven insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-primary">30+</div>
              <div className="text-muted-foreground">Years of Climate Data</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-primary">96%</div>
              <div className="text-muted-foreground">Confidence Accuracy</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-primary">6+</div>
              <div className="text-muted-foreground">Months Planning Horizon</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-4xl font-bold text-primary">5</div>
              <div className="text-muted-foreground">Activity Profiles</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Technical Excellence</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Built on modern architecture with robust statistical methodologies and 
              user-centric design principles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-6 space-y-4"
            >
              <h3 className="text-xl font-semibold">Statistical Methodology</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Historical frequency analysis with 30+ year datasets</li>
                <li>• Hybrid threshold modeling (absolute + percentile)</li>
                <li>• Mathematical activity-specific risk weighting</li>
                <li>• Climate change trend integration</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-6 space-y-4"
            >
              <h3 className="text-xl font-semibold">Platform Architecture</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• React + TypeScript for robust frontend</li>
                <li>• Supabase for scalable backend services</li>
                <li>• Real-time data processing and visualization</li>
                <li>• Responsive design with accessibility focus</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;