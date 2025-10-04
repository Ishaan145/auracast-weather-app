import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { MicIcon } from './Icons';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isListening?: boolean;
  onListeningChange?: (listening: boolean) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  isListening = false,
  onListeningChange
}) => {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);

      if (event.results[current].isFinal) {
        onTranscript(transcriptText);
        toast({
          title: "Voice captured",
          description: `"${transcriptText}"`,
        });
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      onListeningChange?.(false);
      toast({
        title: "Voice input error",
        description: event.error === 'not-allowed' 
          ? 'Microphone permission denied'
          : 'Please try again',
        variant: "destructive"
      });
    };

    recognitionInstance.onend = () => {
      onListeningChange?.(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Voice input not available",
        description: "Please use Chrome, Edge, or Safari browser. Voice input requires HTTPS or localhost and microphone permissions.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      onListeningChange?.(false);
    } else {
      setTranscript('');
      recognition.start();
      onListeningChange?.(true);
      toast({
        title: "Listening...",
        description: "Speak your query naturally",
      });
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={toggleListening}
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        className={`relative ${isListening ? 'animate-pulse' : ''}`}
      >
        <MicIcon className="w-4 h-4" />
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-primary"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </Button>

      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50"
          >
            <Card className="glass min-w-[200px]">
              <CardContent className="p-3">
                <p className="text-sm text-muted-foreground">Listening...</p>
                <p className="text-sm font-medium mt-1">{transcript}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
