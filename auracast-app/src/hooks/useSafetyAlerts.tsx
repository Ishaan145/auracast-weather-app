import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SafetyAlert {
  id: string;
  type: 'Pest' | 'Safety' | 'Weather' | 'Environmental';
  severity: 'Low' | 'Medium' | 'High';
  message: string;
  location: string | null;
  created_at: string;
}

export const useSafetyAlerts = () => {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('safety_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAlerts((data || []) as SafetyAlert[]);
    } catch (error) {
      console.error('Error fetching safety alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { alerts, isLoading };
};
