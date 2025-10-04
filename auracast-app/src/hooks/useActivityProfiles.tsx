import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityProfile {
  id: string;
  name: string;
  hot_weight: number;
  cold_weight: number;
  windy_weight: number;
  wet_weight: number;
  description: string | null;
  icon: string | null;
}

export const useActivityProfiles = () => {
  const [profiles, setProfiles] = useState<ActivityProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_profiles')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching activity profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { profiles, isLoading };
};
