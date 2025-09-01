import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  name: string;
  entryTime?: string;
  exitTime?: string;
  status: 'present' | 'absent' | 'partial';
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  title?: string;
  showDate?: boolean;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  title = "Today's Attendance",
  showDate = false
}) => {
  const formatTime = (timeString?: string) => {
    if (!timeString) return '--';
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-success text-success-foreground">Present</Badge>;
      case 'partial':
        return <Badge className="bg-warning text-warning-foreground">Partial</Badge>;
      default:
        return <Badge variant="secondary">Absent</Badge>;
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 py-2 text-sm font-medium text-muted-foreground border-b">
            <span>Name</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Entry
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Exit
            </span>
            <span>Status</span>
          </div>

          {/* Records */}
          {records.length > 0 ? (
            records.map((record) => (
              <div
                key={record.id}
                className="grid grid-cols-4 gap-4 py-3 text-sm border-b border-border/50 hover:bg-muted/30 transition-colors rounded"
              >
                <span className="font-medium text-foreground">{record.name}</span>
                <span className="text-muted-foreground">{formatTime(record.entryTime)}</span>
                <span className="text-muted-foreground">{formatTime(record.exitTime)}</span>
                <div>{getStatusBadge(record.status)}</div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No attendance records yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};