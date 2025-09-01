import React, { useState, useCallback } from 'react';
import { WebcamFeed } from '@/components/WebcamFeed';
import { StatusPanel } from '@/components/StatusPanel';
import { AttendanceTable } from '@/components/AttendanceTable';

// Mock data for demonstration
const mockAttendanceRecords = [
  {
    id: '001',
    name: 'Abhishek Kumar',
    entryTime: '2024-01-15T09:15:00',
    exitTime: undefined,
    status: 'present' as const
  },
  {
    id: '002',
    name: 'Sarah Johnson',
    entryTime: '2024-01-15T09:22:00',
    exitTime: '2024-01-15T17:30:00',
    status: 'present' as const
  },
  {
    id: '003',
    name: 'Michael Chen',
    entryTime: '2024-01-15T09:45:00',
    exitTime: undefined,
    status: 'present' as const
  },
];

const mockRecognitions = [
  {
    name: 'Abhishek Kumar',
    id: 'ID-001',
    x: 25,
    y: 20,
    width: 30,
    height: 40
  }
];

export default function LiveAttendance() {
  const [statusMessage, setStatusMessage] = useState("System ready. Looking for faces...");
  const [statusType, setStatusType] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [attendanceRecords, setAttendanceRecords] = useState(mockAttendanceRecords);
  const [recognitions, setRecognitions] = useState(mockRecognitions);

  const handleFrame = useCallback((canvas: HTMLCanvasElement) => {
    // Here you would send the frame to your backend API
    // For now, we'll simulate recognition events
    
    // Simulate status updates
    const messages = [
      { text: "Scanning for faces...", type: 'info' as const },
      { text: "Face detected! Identifying...", type: 'warning' as const },
      { text: "Welcome, Abhishek!", type: 'success' as const },
      { text: "Please blink to confirm.", type: 'info' as const }
    ];
    
    // Randomly update status (in real app, this would come from API response)
    if (Math.random() < 0.1) { // 10% chance per frame
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setStatusMessage(randomMessage.text);
      setStatusType(randomMessage.type);
    }
  }, []);

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Attendance Monitor</h1>
          <p className="text-muted-foreground mt-1">Real-time face recognition and attendance tracking</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Today</div>
          <div className="text-lg font-semibold text-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Feed */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-card p-6 rounded-xl shadow-elegant">
            <h2 className="text-xl font-semibold text-foreground mb-4">Live Video Feed</h2>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <WebcamFeed
                onFrame={handleFrame}
                recognitions={recognitions}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Panel */}
          <StatusPanel
            message={statusMessage}
            type={statusType}
            enableSpeech={true}
          />

          {/* Quick Stats */}
          <div className="bg-gradient-card p-6 rounded-xl shadow-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">Today's Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-primary">{attendanceRecords.length}</div>
                <div className="text-sm text-muted-foreground">Present</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {attendanceRecords.filter(r => !r.exitTime).length}
                </div>
                <div className="text-sm text-muted-foreground">In Office</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <AttendanceTable records={attendanceRecords} />
    </div>
  );
}