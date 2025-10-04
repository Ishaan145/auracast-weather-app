import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { VoiceInput } from './VoiceInput';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ParsedQuery {
  location?: string;
  date?: string;
  activity?: string;
  timeframe?: string;
  coords?: [number, number];
}

interface NaturalLanguageQueryProps {
  onQueryParsed: (query: ParsedQuery) => void;
  placeholder?: string;
}

export const NaturalLanguageQuery: React.FC<NaturalLanguageQueryProps> = ({
  onQueryParsed,
  placeholder = "Ask naturally: 'Will it rain in Manali next weekend?' or 'Is Goa too hot in May?'"
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Simple NLP parser - in production, this would use a proper NLP service
  const parseNaturalLanguage = (text: string): ParsedQuery => {
    const parsed: ParsedQuery = {};
    const lowerText = text.toLowerCase();

    // Extract location patterns
    const locationPatterns = [
      /in ([a-z\s]+?)(?:\s+(?:next|this|on|during)|$)/i,
      /at ([a-z\s]+?)(?:\s+(?:next|this|on|during)|$)/i,
      /to ([a-z\s]+?)(?:\s+(?:next|this|on|during)|$)/i
    ];

    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        parsed.location = match[1].trim();
        break;
      }
    }

    // Extract date/time patterns
    if (lowerText.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      parsed.date = tomorrow.toISOString().split('T')[0];
      parsed.timeframe = 'daily';
    } else if (lowerText.includes('next week') || lowerText.includes('this week')) {
      parsed.timeframe = 'weekly';
    } else if (lowerText.includes('next month') || lowerText.includes('this month')) {
      parsed.timeframe = 'monthly';
    } else if (lowerText.includes('weekend')) {
      const friday = new Date();
      const day = friday.getDay();
      const daysUntilFriday = (5 - day + 7) % 7;
      friday.setDate(friday.getDate() + daysUntilFriday);
      parsed.date = friday.toISOString().split('T')[0];
      parsed.timeframe = 'weekend';
    }

    // Extract specific months
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                    'july', 'august', 'september', 'october', 'november', 'december'];
    months.forEach((month, index) => {
      if (lowerText.includes(month)) {
        const date = new Date();
        date.setMonth(index);
        parsed.date = date.toISOString().split('T')[0];
      }
    });

    // Extract activity patterns
    const activities = {
      'hiking': ['hike', 'hiking', 'trek', 'trekking'],
      'fishing': ['fish', 'fishing'],
      'outdoor-event': ['concert', 'festival', 'event', 'party'],
      'wedding': ['wedding', 'marriage'],
      'sports': ['sport', 'sports', 'game', 'match']
    };

    for (const [key, keywords] of Object.entries(activities)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        parsed.activity = key;
        break;
      }
    }

    // Map common locations to coordinates (simplified)
    const locationCoords: { [key: string]: [number, number] } = {
      'manali': [32.2432, 77.1892],
      'goa': [15.2993, 74.1240],
      'delhi': [28.7041, 77.1025],
      'mumbai': [19.0760, 72.8777],
      'bangalore': [12.9716, 77.5946],
      'shimla': [31.1048, 77.1734],
      'nainital': [29.3803, 79.4636]
    };

    if (parsed.location) {
      const locationKey = parsed.location.toLowerCase();
      for (const [key, coords] of Object.entries(locationCoords)) {
        if (locationKey.includes(key)) {
          parsed.coords = coords;
          break;
        }
      }
    }

    return parsed;
  };

  const handleSubmit = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty query",
        description: "Please enter or speak your question",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Use AI-powered NLP for better understanding
      const { data, error } = await supabase.functions.invoke('nlp-query', {
        body: { query: query.trim() }
      });

      if (error) {
        console.error('NLP query error:', error);
        // Fallback to basic parsing
        const parsed = parseNaturalLanguage(query);
        if (!parsed.location && !parsed.date) {
          toast({
            title: "Could not understand",
            description: "Please try rephrasing with a location and date",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
        onQueryParsed(parsed);
        setIsProcessing(false);
        return;
      }

      const parsed = data as ParsedQuery;
      
      if (!parsed.location && !parsed.date) {
        toast({
          title: "Could not understand",
          description: "Please try rephrasing with a location and date",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      toast({
        title: "Query understood! 🎯",
        description: `Location: ${parsed.location || 'Not specified'}, Timeframe: ${parsed.timeframe || 'Not specified'}`,
      });

      onQueryParsed(parsed);
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: "Processing failed",
        description: "Please try again or use manual input",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setQuery(transcript);
    // Auto-submit after voice input
    setTimeout(() => {
      handleSubmit();
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <div className="flex-1 relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pr-24"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            isListening={isListening}
            onListeningChange={setIsListening}
          />
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={!query.trim() || isListening || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                AI
              </>
            ) : (
              'Ask'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
