
import React, { useEffect, useRef, useState } from 'react';
import { Farm } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

declare global {
    interface Window {
        google: any;
    }
}

interface MapDrawingModalProps {
  farm: Farm;
  onSave: (polygon: { lat: number, lng: number }[]) => void;
  onClose: () => void;
}

const MapDrawingModal: React.FC<MapDrawingModalProps> = ({ farm, onSave, onClose }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any | null>(null);
  const drawingManager = useRef<any | null>(null);
  const currentPolygon = useRef<any | null>(null);
  const [drawnShape, setDrawnShape] = useState<any | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current && window.google) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: farm.locationCoords || { lat: 34.0522, lng: -118.2437 },
        zoom: 16,
        mapTypeId: 'satellite',
      });

      drawingManager.current = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: {
          fillColor: '#FFC107',
          fillOpacity: 0.5,
          strokeWeight: 2,
          strokeColor: '#FFC107',
          clickable: false,
          editable: true,
          zIndex: 1,
        },
      });

      drawingManager.current.setMap(mapInstance.current);

      window.google.maps.event.addListener(drawingManager.current, 'overlaycomplete', (event: any) => {
        // Clear any previously drawn polygon
        if (currentPolygon.current) {
          currentPolygon.current.setMap(null);
        }
        
        if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
          currentPolygon.current = event.overlay;
          setDrawnShape(currentPolygon.current);
          if (drawingManager.current) {
            drawingManager.current.setDrawingMode(null); // Exit drawing mode
          }
        }
      });
    }
  }, [farm]);

  const handleSave = () => {
    if (drawnShape) {
      const path = drawnShape.getPath();
      const coordinates = path.getArray().map((latLng: any) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));
      onSave(coordinates);
    }
  };
  
  const handleReset = () => {
      if (currentPolygon.current) {
          currentPolygon.current.setMap(null);
          currentPolygon.current = null;
      }
      setDrawnShape(null);
      if (drawingManager.current) {
          drawingManager.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
      }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-neutral-100 border-b border-neutral-200 text-sm text-neutral-700">
        <p><strong>Instructions:</strong> Use the polygon tool <img src="https://maps.gstatic.com/mapfiles/drawing.png" alt="drawing icon" className="inline-block h-4 w-4 mx-1" /> from the top-center of the map. Click on the map to start drawing your plot. Click each corner of the plot, and click on the first point to close the shape. You can edit the points after drawing.</p>
      </div>
      <div ref={mapRef} className="flex-grow bg-neutral-200" style={{ minHeight: '60vh' }} />
      <div className="p-4 flex justify-end space-x-3 border-t border-neutral-200">
        <button
          onClick={handleReset}
          disabled={!drawnShape}
          className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 flex items-center disabled:opacity-50"
        >
          <XCircleIcon className="w-5 h-5 mr-1" />
          Reset Drawing
        </button>
        <button
          onClick={handleSave}
          disabled={!drawnShape}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-md hover:bg-brand-blue/90 flex items-center disabled:opacity-50"
        >
          <CheckCircleIcon className="w-5 h-5 mr-1" />
          Save Plot Boundary
        </button>
      </div>
    </div>
  );
};

export default MapDrawingModal;