-- Create FAQ table
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for FAQs (public read, admin write)
CREATE POLICY "Anyone can view FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage FAQs" ON public.faqs FOR ALL USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert FAQ data
INSERT INTO public.faqs (question, answer, order_index) VALUES
  ('How is AuraCast different from traditional weather apps?', 'We provide long-term climatological probability, not short-term weather forecasts. We analyze 30+ years of historical data to give you statistical risk assessments for any day of the year, enabling planning up to 6+ months in advance.', 1),
  ('What does ''Activity-Specific'' risk mean?', 'Our algorithm weighs weather factors differently based on your activity. High wind is a bigger risk for fishing than hiking, and our scores reflect that. We use mathematical risk weighting systems calibrated for different activity profiles.', 2),
  ('How accurate are your risk assessments?', 'Our confidence scores range from 85-96% based on data completeness and statistical significance. We use minimum 30-year datasets and provide transparency through confidence intervals and trend analysis.', 3),
  ('What is climatological vs meteorological analysis?', 'Meteorology predicts specific weather events 7-10 days ahead. Climatology analyzes historical patterns to determine statistical probabilities for any date. We focus on climatology for long-term planning reliability.', 4),
  ('How do you account for climate change?', 'We integrate trend analysis showing how weather patterns have changed over decades. Our algorithm identifies statistically significant trends and incorporates them into future probability assessments.', 5),
  ('Why use statistical probability vs forecasting?', 'Weather forecasts become unreliable beyond 7-10 days due to chaos theory limitations. Statistical probability based on 30+ years of data provides reliable risk assessment for long-term planning, which is essential for outdoor events planned months in advance.', 6),
  ('How do you handle different climate regions?', 'We use hybrid thresholds combining absolute safety standards with location-specific percentiles. For example, 90°F is normal in Phoenix but extreme in Vermont. Our algorithm automatically adjusts risk scoring based on local climate norms.', 7),
  ('What''s the minimum planning horizon?', 'While we can provide analysis for any date, our system excels at long-term planning (3-6+ months ahead) where traditional forecasts fail. For immediate planning (1-7 days), we recommend consulting meteorological forecasts alongside our risk assessment.', 8);

-- Enable realtime for community_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_messages;