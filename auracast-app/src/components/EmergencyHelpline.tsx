import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertIcon } from './Icons';

interface EmergencyContact {
  name: string;
  number: string;
  description: string;
  category: 'medical' | 'disaster' | 'police' | 'weather';
  priority: 'high' | 'medium' | 'low';
}

interface EmergencyHelplineProps {
  location: string;
  coords?: [number, number];
  weatherRisk?: number;
}

export const EmergencyHelpline: React.FC<EmergencyHelplineProps> = ({
  location,
  coords,
  weatherRisk = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Emergency contacts database (in production, this would be API-driven based on location)
  const emergencyContacts: EmergencyContact[] = [
    {
      name: 'National Emergency',
      number: '112',
      description: 'Universal emergency number for all services',
      category: 'medical',
      priority: 'high'
    },
    {
      name: 'Ambulance',
      number: '108',
      description: 'Emergency medical services',
      category: 'medical',
      priority: 'high'
    },
    {
      name: 'Fire Department',
      number: '101',
      description: 'Fire emergency and rescue',
      category: 'disaster',
      priority: 'high'
    },
    {
      name: 'Police',
      number: '100',
      description: 'Law enforcement emergency',
      category: 'police',
      priority: 'high'
    },
    {
      name: 'Disaster Management',
      number: '1078',
      description: 'Natural disaster response',
      category: 'disaster',
      priority: 'medium'
    },
    {
      name: 'Weather Emergency',
      number: '1800-180-1551',
      description: 'National weather alert hotline',
      category: 'weather',
      priority: 'medium'
    },
    {
      name: 'Tourist Helpline',
      number: '1363',
      description: 'Tourism emergency assistance',
      category: 'police',
      priority: 'low'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'disaster': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'police': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'weather': return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20';
      default: return 'bg-muted';
    }
  };

  const getPriorityContacts = () => {
    if (weatherRisk > 70) {
      return emergencyContacts.filter(c => c.priority === 'high' || c.category === 'weather');
    }
    return emergencyContacts.filter(c => c.priority === 'high');
  };

  const displayedContacts = isExpanded ? emergencyContacts : getPriorityContacts();

  return (
    <Card className="glass overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-red-500/5 to-orange-500/5 border-b border-border/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertIcon className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <CardTitle className="text-base">Emergency Helpline</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Quick access to emergency services
              </p>
            </div>
          </div>
          {weatherRisk > 60 && (
            <Badge variant="destructive" className="text-xs">
              High Alert
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {displayedContacts.map((contact, index) => (
            <motion.div
              key={contact.number}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg border ${getCategoryColor(contact.category)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{contact.name}</h4>
                    {contact.priority === 'high' && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        Priority
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {contact.description}
                  </p>
                  <a
                    href={`tel:${contact.number}`}
                    className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
                  >
                    📞 {contact.number}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-2"
        >
          {isExpanded ? 'Show Priority Only' : `Show All (${emergencyContacts.length})`}
        </Button>

        {weatherRisk > 70 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mt-3"
          >
            <p className="text-xs text-red-500 font-medium flex items-center gap-2">
              <AlertIcon className="w-4 h-4" />
              High weather risk detected. Keep emergency numbers handy.
            </p>
          </motion.div>
        )}

        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            📍 Emergency services for: <span className="font-medium">{location}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
