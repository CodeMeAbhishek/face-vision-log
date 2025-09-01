import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Brain, Download, CalendarIcon, Loader2, CheckCircle, Database } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

// Mock attendance data
const mockAttendanceData = [
  {
    enrollmentId: 'EMP001',
    name: 'Abhishek Kumar',
    date: '2024-01-15',
    entryTime: '09:15:00',
    exitTime: '17:30:00'
  },
  {
    enrollmentId: 'EMP002',
    name: 'Sarah Johnson',
    date: '2024-01-15',
    entryTime: '09:22:00',
    exitTime: '17:45:00'
  },
  {
    enrollmentId: 'EMP003',
    name: 'Michael Chen',
    date: '2024-01-15',
    entryTime: '09:45:00',
    exitTime: '18:00:00'
  },
  {
    enrollmentId: 'EMP001',
    name: 'Abhishek Kumar',
    date: '2024-01-14',
    entryTime: '09:10:00',
    exitTime: '17:25:00'
  },
];

export default function AdminPanel() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isTraining, setIsTraining] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);

  const handleTrainModel = () => {
    setIsTraining(true);
    setTrainingComplete(false);

    // Simulate model training
    setTimeout(() => {
      setIsTraining(false);
      setTrainingComplete(true);
      
      toast({
        title: "Model Training Complete",
        description: "The AI model has been successfully trained with the latest data.",
        className: "bg-success text-success-foreground"
      });

      // Reset success state after 5 seconds
      setTimeout(() => setTrainingComplete(false), 5000);
    }, 3000);
  };

  const handleExportCSV = () => {
    const filteredData = selectedDate 
      ? attendanceData.filter(record => record.date === format(selectedDate, 'yyyy-MM-dd'))
      : attendanceData;

    // Create CSV content
    const csvContent = [
      'Enrollment ID,Name,Date,Entry Time,Exit Time',
      ...filteredData.map(record => 
        `${record.enrollmentId},${record.name},${record.date},${record.entryTime},${record.exitTime}`
      )
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'all'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Attendance data has been exported to CSV file.",
    });
  };

  const filteredAttendance = selectedDate 
    ? attendanceData.filter(record => record.date === format(selectedDate, 'yyyy-MM-dd'))
    : attendanceData;

  return (
    <div className="flex-1 p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">
          Manage system settings and view attendance records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Management */}
        <Card className="shadow-elegant bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Model Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border">
                <h3 className="font-semibold text-foreground mb-2">Current Model Status</h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success text-success-foreground">
                    Active
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last trained: 2 hours ago
                  </span>
                </div>
              </div>

              <Button
                onClick={handleTrainModel}
                disabled={isTraining}
                className="w-full bg-gradient-primary text-white hover:opacity-90"
                size="lg"
              >
                {isTraining ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Training Model...
                  </>
                ) : trainingComplete ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Training Complete
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-5 w-5" />
                    Train New Model
                  </>
                )}
              </Button>

              {isTraining && (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground">
                    Please wait while the AI model is being trained with the latest facial data...
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Attendance Records
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>

            <div className="text-center p-3 bg-background rounded-lg border">
              <div className="text-2xl font-bold text-primary">{filteredAttendance.length}</div>
              <div className="text-sm text-muted-foreground">Records found</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Data Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>
            Attendance Records {selectedDate && `- ${format(selectedDate, "PPP")}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-5 gap-4 py-3 text-sm font-medium text-muted-foreground border-b">
              <span>Enrollment ID</span>
              <span>Name</span>
              <span>Date</span>
              <span>Entry Time</span>
              <span>Exit Time</span>
            </div>

            {/* Records */}
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((record, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-4 py-3 text-sm border-b border-border/50 hover:bg-muted/30 transition-colors rounded"
                >
                  <span className="font-mono text-primary">{record.enrollmentId}</span>
                  <span className="font-medium text-foreground">{record.name}</span>
                  <span className="text-muted-foreground">{record.date}</span>
                  <span className="text-muted-foreground">{record.entryTime}</span>
                  <span className="text-muted-foreground">{record.exitTime}</span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No attendance records found for the selected date</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}