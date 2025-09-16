
import React from 'react';
import { Plot } from '../types';
import { LeafIcon, PlotIcon, InfoIcon, CalendarIcon, CameraIcon } from './icons';

interface PlotCardProps {
  plot: Plot;
  farmName?: string;
  onAddDailyLog: (plotId: string, farmId: string) => void;
  onViewLogHistory: (plot: Plot) => void;
}

const PlotCard: React.FC<PlotCardProps> = ({ plot, farmName, onAddDailyLog, onViewLogHistory }) => {
  const healthStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'good':
      case 'excellent':
        return 'text-brand-green';
      case 'fair':
      case 'needs monitoring':
        return 'text-brand-yellow';
      case 'poor':
      case 'diseased':
      case 'needs attention':
        return 'text-brand-orange';
      default:
        return 'text-neutral-500';
    }
  };

  const latestLog = plot.dailyLogs && plot.dailyLogs.length > 0 
    ? [...plot.dailyLogs].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] 
    : null;

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-neutral-200 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start mb-2">
          <PlotIcon className="w-7 h-7 text-brand-green mr-3 flex-shrink-0" />
          <div className="flex-grow">
              <h4 className="text-lg font-semibold text-neutral-700">{plot.name}</h4>
              {farmName && <p className="text-xs text-neutral-500 -mt-1">Farm: {farmName}</p>}
          </div>
        </div>
        
        <div className="space-y-1 text-sm mb-3">
          <div className="flex items-center text-neutral-600">
            <LeafIcon className="w-4 h-4 text-brand-green/80 mr-1.5" />
            <span>Crop: <strong>{plot.crop}</strong> {plot.cropInfo?.variety && `(${plot.cropInfo.variety})`}</span>
          </div>
          {plot.soilType && (
            <div className="flex items-center text-neutral-600">
              <InfoIcon className="w-4 h-4 text-brand-brown/70 mr-1.5" />
              <span>Soil: {plot.soilType}</span>
            </div>
          )}
          {plot.cropInfo?.plantingDate && (
            <div className="flex items-center text-neutral-600">
              <CalendarIcon className="w-4 h-4 text-neutral-400 mr-1.5" />
              <span>Planted: {new Date(plot.cropInfo.plantingDate).toLocaleDateString()}</span>
            </div>
          )}
          {plot.cropInfo?.growthStage && (
            <div className="flex items-center text-neutral-600">
              <InfoIcon className="w-4 h-4 text-neutral-400 mr-1.5" />
              <span>Stage: {plot.cropInfo.growthStage}</span>
            </div>
          )}
          {plot.cropInfo?.healthStatus && (
            <div className="flex items-center">
              <InfoIcon className={`w-4 h-4 ${healthStatusColor(plot.cropInfo.healthStatus)} mr-1.5`} />
              <span className={`${healthStatusColor(plot.cropInfo.healthStatus)} font-medium`}>
                Farm Health Rpt: {plot.cropInfo.healthStatus}
              </span>
            </div>
          )}
        </div>

        {latestLog && (
          <div className="mt-2 pt-2 border-t border-neutral-200 text-xs">
            <p className="font-semibold text-neutral-600 mb-1">Latest Daily Log ({new Date(latestLog.date).toLocaleDateString()}):</p>
            {latestLog.aiAnalysis?.summary && (
              <p className="text-neutral-500 italic truncate">"{latestLog.aiAnalysis.summary}"</p>
            )}
             {latestLog.aiAnalysis?.health && (
              <p className="text-neutral-500"><span className="font-medium">AI Health:</span> {latestLog.aiAnalysis.health}</p>
            )}
            {latestLog.farmerNotes && (
              <p className="text-neutral-500 mt-0.5"><span className="font-medium">Farmer Note:</span> {latestLog.farmerNotes}</p>
            )}
          </div>
        )}
         {!latestLog && plot.dailyLogs?.length === 0 && (
          <p className="text-xs text-neutral-400 italic mt-2 pt-2 border-t border-neutral-200">No daily logs yet for this plot.</p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 flex space-x-2">
        <button
          onClick={() => onAddDailyLog(plot.id, plot.farmId)}
          className="flex-1 text-xs px-3 py-1.5 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-1 flex items-center justify-center"
        >
          <CameraIcon className="w-3.5 h-3.5 mr-1.5"/> Add Daily Log
        </button>
        <button
          onClick={() => onViewLogHistory(plot)}
          className="flex-1 text-xs px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 flex items-center justify-center disabled:opacity-50"
          disabled={!plot.dailyLogs || plot.dailyLogs.length === 0}
        >
          <CalendarIcon className="w-3.5 h-3.5 mr-1.5"/> View History ({plot.dailyLogs?.length || 0})
        </button>
      </div>
    </div>
  );
};

export default PlotCard;