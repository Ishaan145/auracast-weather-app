-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  lat DECIMAL(10, 7) NOT NULL,
  lon DECIMAL(10, 7) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create weather_data table
CREATE TABLE public.weather_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  overall_risk INTEGER NOT NULL,
  hot_factor INTEGER NOT NULL,
  cold_factor INTEGER NOT NULL,
  windy_factor INTEGER NOT NULL,
  wet_factor INTEGER NOT NULL,
  insight TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  trend_direction TEXT CHECK (trend_direction IN ('increasing', 'decreasing', 'stable')),
  trend_change TEXT,
  trend_significance DECIMAL(3, 2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create nearby_risks table
CREATE TABLE public.nearby_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weather_data_id UUID REFERENCES public.weather_data(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  risk INTEGER NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lon DECIMAL(10, 7) NOT NULL,
  distance INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create travel_routes table
CREATE TABLE public.travel_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  route_name TEXT NOT NULL,
  total_distance TEXT,
  estimated_time TEXT,
  average_risk INTEGER,
  weather_risk INTEGER,
  seasonal_risk INTEGER,
  geographical_risk INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create travel_waypoints table
CREATE TABLE public.travel_waypoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES public.travel_routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  risk INTEGER NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lon DECIMAL(10, 7) NOT NULL,
  eta TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create safety_alerts table
CREATE TABLE public.safety_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('Pest', 'Safety', 'Weather', 'Environmental')),
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
  message TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create community_messages table
CREATE TABLE public.community_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create activity_profiles table
CREATE TABLE public.activity_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  hot_weight DECIMAL(3, 2) NOT NULL,
  cold_weight DECIMAL(3, 2) NOT NULL,
  windy_weight DECIMAL(3, 2) NOT NULL,
  wet_weight DECIMAL(3, 2) NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nearby_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_waypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for locations (public read, admin write)
CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert locations" ON public.locations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for weather_data (public read, admin write)
CREATE POLICY "Anyone can view weather data" ON public.weather_data FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert weather data" ON public.weather_data FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update weather data" ON public.weather_data FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for nearby_risks (public read)
CREATE POLICY "Anyone can view nearby risks" ON public.nearby_risks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert nearby risks" ON public.nearby_risks FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for travel_routes (user-specific)
CREATE POLICY "Users can view own routes" ON public.travel_routes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own routes" ON public.travel_routes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own routes" ON public.travel_routes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own routes" ON public.travel_routes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for travel_waypoints (through route ownership)
CREATE POLICY "Users can view waypoints of own routes" ON public.travel_waypoints FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.travel_routes WHERE id = route_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert waypoints for own routes" ON public.travel_waypoints FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.travel_routes WHERE id = route_id AND user_id = auth.uid()));
CREATE POLICY "Users can update waypoints of own routes" ON public.travel_waypoints FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.travel_routes WHERE id = route_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete waypoints of own routes" ON public.travel_waypoints FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.travel_routes WHERE id = route_id AND user_id = auth.uid()));

-- RLS Policies for safety_alerts (public read, admin write)
CREATE POLICY "Anyone can view safety alerts" ON public.safety_alerts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert alerts" ON public.safety_alerts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for community_messages (public read, user write own)
CREATE POLICY "Anyone can view community messages" ON public.community_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert messages" ON public.community_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own messages" ON public.community_messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON public.community_messages FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for activity_profiles (public read, admin write)
CREATE POLICY "Anyone can view activity profiles" ON public.activity_profiles FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage activity profiles" ON public.activity_profiles FOR ALL USING (auth.uid() IS NOT NULL);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    'user'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weather_data_updated_at BEFORE UPDATE ON public.weather_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_travel_routes_updated_at BEFORE UPDATE ON public.travel_routes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();