import React from 'react';
import { DailyPlotLog } from '../types';
import { CalendarIcon, PencilIcon, BrainCircuitIcon, CameraIcon } from './icons';

interface DailyLogCardProps {
  log: DailyPlotLog;
}

const DailyLogCard: React.FC<DailyLogCardProps> = ({ log }) => {
  return (
    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-neutral-700 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-neutral-500" />
            Log for {new Date(log.date).toLocaleDateString()}
        </h4>
      </div>

      {log.farmerNotes && (
        <div className="mb-3">
            <h5 className="text-sm font-medium text-neutral-600 flex items-center mb-1">
                <PencilIcon className="w-4 h-4 mr-1.5 text-brand-brown"/>
                Farmer's Notes
            </h5>
            <p className="text-sm text-neutral-800 bg-white p-2 rounded border">{log.farmerNotes}</p>
        </div>
      )}

      {log.aiAnalysis && (
        <div className="mb-3">
            <h5 className="text-sm font-medium text-neutral-600 flex items-center mb-1">
                <BrainCircuitIcon className="w-4 h-4 mr-1.5 text-brand-purple"/>
                AI Analysis
            </h5>
            <div className="space-y-1 text-sm bg-purple-50 p-2 rounded border border-purple-200 text-neutral-700">
                {log.aiAnalysis.summary && <p><strong>Summary:</strong> {log.aiAnalysis.summary}</p>}
                {log.aiAnalysis.health && <p><strong>Health:</strong> {log.aiAnalysis.health}</p>}
                {log.aiAnalysis.growthStage && <p><strong>Growth Stage:</strong> {log.aiAnalysis.growthStage}</p>}
                {log.aiAnalysis.findings?.disease && log.aiAnalysis.findings.disease !== 'None observed' && <p><strong>Disease:</strong> {log.aiAnalysis.findings.disease}</p>}
                {log.aiAnalysis.findings?.pests && log.aiAnalysis.findings.pests !== 'None observed' && <p><strong>Pests:</strong> {log.aiAnalysis.findings.pests}</p>}
                {log.aiAnalysis.findings?.nutrients && log.aiAnalysis.findings.nutrients !== 'None observed' && <p><strong>Nutrients:</strong> {log.aiAnalysis.findings.nutrients}</p>}
                {log.aiAnalysis.error && <p className="text-red-600"><strong>Error:</strong> {log.aiAnalysis.error}</p>}
            </div>
        </div>
      )}
      
      {log.aiAnalysisError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
            <h5 className="text-sm font-medium text-red-700">AI Processing Error</h5>
            <p className="text-sm text-red-600">{log.aiAnalysisError}</p>
          </div>
      )}

      {log.photoUrls && log.photoUrls.length > 0 && (
        <div>
            <h5 className="text-sm font-medium text-neutral-600 flex items-center mb-2">
                <CameraIcon className="w-4 h-4 mr-1.5 text-neutral-500"/>
                Photos ({log.photoUrls.length})
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {log.photoUrls.map((url, index) => (
                    <a href={url} target="_blank" rel="noopener noreferrer" key={index}>
                        <img src={url} alt={`Daily log photo ${index + 1}`} className="w-full h-24 object-cover rounded-md border border-neutral-300 hover:opacity-80 transition-opacity" loading="lazy" />
                    </a>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default DailyLogCard;
