import React, { useRef, useEffect, useState } from 'react';

interface Recognition {
  name: string;
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WebcamFeedProps {
  onFrame?: (canvas: HTMLCanvasElement) => void;
  recognitions?: Recognition[];
  showOverlay?: boolean;
  className?: string;
}

export const WebcamFeed: React.FC<WebcamFeedProps> = ({
  onFrame,
  recognitions = [],
  showOverlay = true,
  className = ""
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError("");
      }
    } catch (err) {
      setError("Camera access denied or not available");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isStreaming && videoRef.current && canvasRef.current && onFrame) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          onFrame(canvas);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isStreaming, onFrame]);

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-lg"
      />
      
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {showOverlay && recognitions.map((recognition, index) => (
        <div
          key={index}
          className="absolute border-2 border-success bg-success/10 rounded"
          style={{
            left: `${recognition.x}%`,
            top: `${recognition.y}%`,
            width: `${recognition.width}%`,
            height: `${recognition.height}%`,
          }}
        >
          <div className="absolute -top-8 left-0 bg-success text-success-foreground px-2 py-1 rounded text-sm font-medium">
            {recognition.name} ({recognition.id})
          </div>
        </div>
      ))}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
          <div className="text-center">
            <p className="text-destructive font-medium">{error}</p>
            <button
              onClick={startCamera}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry Camera Access
            </button>
          </div>
        </div>
      )}

      {!isStreaming && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};