import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { WebcamFeed } from '@/components/WebcamFeed';
import { UserPlus, Camera, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function RegisterUser() {
  const [enrollmentId, setEnrollmentId] = useState('');
  const [name, setName] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartCapture = () => {
    if (!enrollmentId.trim() || !name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both Enrollment ID and Name before starting capture.",
        variant: "destructive"
      });
      return;
    }

    setIsCapturing(true);
    setCaptureProgress(0);
    setIsRegistrationComplete(false);

    // Simulate image capture progress
    const interval = setInterval(() => {
      setCaptureProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(true);
          
          // Simulate processing time
          setTimeout(() => {
            setIsLoading(false);
            setIsCapturing(false);
            setIsRegistrationComplete(true);
            
            toast({
              title: "Registration Successful",
              description: `${name} has been successfully registered with ID ${enrollmentId}.`,
              className: "bg-success text-success-foreground"
            });
          }, 2000);
          
          return 100;
        }
        return prev + 2; // Increment by 2% every 100ms (5 seconds total)
      });
    }, 100);
  };

  const handleNewRegistration = () => {
    setEnrollmentId('');
    setName('');
    setCaptureProgress(0);
    setIsRegistrationComplete(false);
  };

  const handleFrame = (canvas: HTMLCanvasElement) => {
    // Here you would send frames to your backend API
    // The backend would process and store the facial data
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Register New User</h1>
          <p className="text-muted-foreground mt-2">
            Add a new person to the attendance system
          </p>
        </div>

        <Card className="shadow-elegant bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="enrollmentId">Enrollment ID</Label>
                <Input
                  id="enrollmentId"
                  placeholder="Enter unique ID (e.g., EMP001)"
                  value={enrollmentId}
                  onChange={(e) => setEnrollmentId(e.target.value)}
                  className="focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:ring-primary"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleStartCapture}
                disabled={!enrollmentId.trim() || !name.trim() || isLoading}
                className="w-full bg-gradient-primary text-white hover:opacity-90 transition-all duration-200"
                size="lg"
              >
                <Camera className="mr-2 h-5 w-5" />
                Start Image Capture
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Success Card */}
        {isRegistrationComplete && (
          <Card className="border-success/20 bg-success/5 shadow-card">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-success mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-success">Registration Complete!</h3>
                  <p className="text-muted-foreground mt-2">
                    <strong>{name}</strong> has been successfully registered with ID <strong>{enrollmentId}</strong>.
                  </p>
                </div>
                <Button
                  onClick={handleNewRegistration}
                  variant="outline"
                  className="border-success text-success hover:bg-success hover:text-success-foreground"
                >
                  Register Another User
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Capture Modal */}
        <Dialog open={isCapturing} onOpenChange={setIsCapturing}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Capturing Images for {name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <WebcamFeed
                  onFrame={handleFrame}
                  showOverlay={false}
                  className="w-full h-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {isLoading ? 'Processing images...' : `Capturing image ${Math.floor(captureProgress * 0.6)}/60...`}
                  </span>
                  <span className="font-medium">{Math.round(captureProgress)}%</span>
                </div>
                <Progress value={captureProgress} className="h-2" />
              </div>

              {isLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Processing and storing facial data...</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}