import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CommunityMessage {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  likes: number;
  created_at: string;
}

export const useCommunityMessages = () => {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('community_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_messages'
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (userId: string, userName: string, message: string) => {
    try {
      const { error } = await supabase
        .from('community_messages')
        .insert({
          user_id: userId,
          user_name: userName,
          message,
          likes: 0
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const likeMessage = async (messageId: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from('community_messages')
        .update({ likes: currentLikes + 1 })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error liking message:', error);
      throw error;
    }
  };

  return { messages, isLoading, sendMessage, likeMessage };
};
