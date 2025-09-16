
import React, { useEffect, useRef, useMemo } from 'react';
import { Farm, Plot } from '../types';

declare global {
    interface Window {
        google: any;
    }
}

interface FarmMapProps {
  farm: Farm;
  plots: Plot[];
  onPlotClick?: (plot: Plot) => void;
}

const FarmMap: React.FC<FarmMapProps> = ({ farm, plots, onPlotClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any | null>(null);
  const polygons = useRef<any[]>([]);
  const infoWindow = useRef<any | null>(null);

  const plotsWithPolygons = useMemo(() => plots.filter(p => p.polygon && p.polygon.length > 0), [plots]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    if (!mapInstance.current) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center: farm.locationCoords || { lat: 34.0522, lng: -118.2437 },
            zoom: 15,
            mapTypeId: 'satellite',
            styles: [ // Subtle custom style
              {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#ffffff' }],
              },
               {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
        });
        infoWindow.current = new window.google.maps.InfoWindow();
    } else {
        // If map already exists, just pan to new farm location
        if (farm.locationCoords) {
            mapInstance.current.panTo(farm.locationCoords);
        }
    }
    
    // Clear existing polygons
    polygons.current.forEach(p => p.setMap(null));
    polygons.current = [];

    // Draw new polygons
    plotsWithPolygons.forEach(plot => {
      const newPolygon = new window.google.maps.Polygon({
        paths: plot.polygon,
        strokeColor: '#FFC107',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FFC107',
        fillOpacity: 0.35,
      });

      newPolygon.setMap(mapInstance.current);

      newPolygon.addListener('click', (e: any) => {
        if (onPlotClick) {
          onPlotClick(plot);
        } else if (infoWindow.current) {
          const contentString = `
            <div style="font-family: sans-serif;">
              <h4 style="font-weight: 600; margin: 0 0 5px 0;">${plot.name}</h4>
              <p style="margin: 0;">Crop: <strong>${plot.crop}</strong></p>
            </div>
          `;
          infoWindow.current.setContent(contentString);
          infoWindow.current.setPosition(e.latLng);
          infoWindow.current.open(mapInstance.current);
        }
      });
      polygons.current.push(newPolygon);
    });

    // Auto-zoom to fit all polygons
    if (mapInstance.current && plotsWithPolygons.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        plotsWithPolygons.forEach(plot => {
            plot.polygon?.forEach(latLng => {
                bounds.extend(latLng);
            });
        });
        mapInstance.current.fitBounds(bounds);
    }


  }, [farm, plotsWithPolygons, onPlotClick]);

  return (
    <div className="w-full h-[60vh] md:h-[70vh] bg-neutral-200 rounded-lg shadow-inner overflow-hidden">
      {plotsWithPolygons.length === 0 && (
        <div className="w-full h-full flex items-center justify-center">
            <p className="text-neutral-500">No plots with map data for this farm. Add a plot and draw it on the map!</p>
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default FarmMap;
