import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Speaker } from 'lucide-react';

interface StatusPanelProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  enableSpeech?: boolean;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({
  message,
  type = 'info',
  enableSpeech = true
}) => {
  useEffect(() => {
    if (enableSpeech && message && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.volume = 0.7;
      
      // Small delay to ensure cancellation is complete
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  }, [message, enableSpeech]);

  const getStatusStyles = () => {
    switch (type) {
      case 'success':
        return 'border-success/20 bg-success/5 text-success';
      case 'warning':
        return 'border-warning/20 bg-warning/5 text-warning';
      case 'error':
        return 'border-destructive/20 bg-destructive/5 text-destructive';
      default:
        return 'border-primary/20 bg-primary/5 text-primary';
    }
  };

  return (
    <Card className={`${getStatusStyles()} transition-all duration-300`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Speaker className="h-5 w-5" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium leading-relaxed">
          {message || "System ready..."}
        </p>
      </CardContent>
    </Card>
  );
};