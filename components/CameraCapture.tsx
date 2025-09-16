import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CameraIcon, XCircleIcon } from './icons';
import Modal from './Modal';
import { NotificationType } from '../types';


interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  showNotification: (message: string, type: NotificationType) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ isOpen, onClose, onCapture, showNotification }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    
    const getStream = async (constraints: MediaStreamConstraints) => {
        return navigator.mediaDevices.getUserMedia(constraints);
    };

    try {
        const mediaStream = await getStream({ video: { facingMode: "environment" }, audio: false }).catch(err => {
            console.warn("Environment camera not found or failed, trying default camera.", err);
            // If environment camera fails, try any camera.
            // This is a common issue on laptops/desktops.
            if (err instanceof DOMException && (err.name === "NotFoundError" || err.name === "OverconstrainedError")) {
                return getStream({ video: true, audio: false });
            }
            // Re-throw other errors like permission denied
            throw err;
        });
        
        setStream(mediaStream);
        if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
    } catch (err) {
        console.error("Camera access error:", err);
        let message = "Could not access the camera.";
        if (err instanceof DOMException) {
            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                message = "Camera access was denied. Please allow camera access in your browser settings.";
            } else if (err.name === "NotFoundError") {
                message = "No camera found on this device.";
            } else if (err.name === "NotReadableError") {
                message = "The camera may be in use by another application.";
            }
        }
        setError(message);
        showNotification(message, NotificationType.ERROR);
    }
  }, [showNotification]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    
    // Ensure camera is stopped on component unmount
    return () => {
        stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Capture Photo">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted // Important for autoplay on some browsers
          className={`w-full rounded-md bg-neutral-900 ${error ? 'hidden' : 'block'}`}
        />
         <canvas ref={canvasRef} className="hidden" />
        {error && (
            <div className="w-full h-64 bg-neutral-200 rounded-md flex flex-col items-center justify-center text-center p-4">
                 <XCircleIcon className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-neutral-700 font-semibold">Camera Error</p>
                <p className="text-neutral-500 text-sm">{error}</p>
            </div>
        )}
        <div className="mt-4 flex justify-center">
            <button
                onClick={handleCapture}
                disabled={!!error || !stream}
                className="p-4 bg-brand-blue text-white rounded-full hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:bg-neutral-300 disabled:cursor-not-allowed"
                aria-label="Take Photo"
            >
                <CameraIcon className="w-8 h-8"/>
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default CameraCapture;