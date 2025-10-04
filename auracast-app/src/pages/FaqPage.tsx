import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useFaqs } from '../hooks/useFaqs';
import { useState } from 'react';
import { WeatherAnimatedBackground } from '../components/WeatherAnimatedBackground';

const FaqPage = () => {
  const { faqs, isLoading } = useFaqs();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

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
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground mt-6 leading-relaxed">
              Everything you need to know about climatological risk assessment and AuraCast's approach
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading FAQs...</p>
              </div>
            ) : faqs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <h3 className="text-lg font-semibold pr-4">{item.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      openItems.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: openItems.includes(index) ? 'auto' : 0,
                    opacity: openItems.includes(index) ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Understanding Climatological Analysis</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Key concepts that power AuraCast's probability assessment methodology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-6 space-y-4"
            >
              <h3 className="text-xl font-semibold">Statistical Methodology</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Historical Frequency Analysis:</strong><br />
                  P(Condition) = Number of past days meeting condition / Total days in sample
                </p>
                <p>
                  <strong className="text-foreground">Data Windowing:</strong><br />
                  Target date ± 7 days across 30-40 years (minimum 420 data points)
                </p>
                <p>
                  <strong className="text-foreground">Confidence Scoring:</strong><br />
                  95% confidence intervals with statistical significance testing
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-6 space-y-4"
            >
              <h3 className="text-xl font-semibold">Activity Risk Weighting</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Hiking Example:</strong><br />
                  Temperature extremes (0.9), Precipitation (0.7), Wind (0.4)
                </p>
                <p>
                  <strong className="text-foreground">Wedding Example:</strong><br />
                  Precipitation (1.0), Wind (0.8), Temperature (0.8)
                </p>
                <p>
                  <strong className="text-foreground">Calculation:</strong><br />
                  Risk Score = Σ(Condition Probability × Activity Weight) / Conditions
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Climate Change Impact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Climate Change Integration</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              How we account for changing climate patterns in our risk assessments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card p-6 text-center space-y-4"
            >
              <div className="text-3xl font-bold text-primary">+1.2°F</div>
              <h3 className="text-lg font-semibold">Decadal Trends</h3>
              <p className="text-muted-foreground text-sm">
                Per decade temperature increases detected through linear regression analysis
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="card p-6 text-center space-y-4"
            >
              <div className="text-3xl font-bold text-primary">p&lt;0.05</div>
              <h3 className="text-lg font-semibold">Statistical Significance</h3>
              <p className="text-muted-foreground text-sm">
                Trend validity testing ensures only meaningful climate changes are included
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="card p-6 text-center space-y-4"
            >
              <div className="text-3xl font-bold text-primary">30 Years</div>
              <h3 className="text-lg font-semibold">Baseline Period</h3>
              <p className="text-muted-foreground text-sm">
                Minimum dataset required for reliable climatological analysis
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-8">
              Join our community to connect with other users and get answers from our team
            </p>
            <motion.a
              href="#community"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <span>Join Community Chat</span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;