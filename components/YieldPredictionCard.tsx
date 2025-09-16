
import React from 'react';
import { YieldPredictionData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ChartBarIcon, InfoIcon } from './icons';

interface YieldPredictionCardProps {
  yieldPrediction: YieldPredictionData | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="bg-white p-6 rounded-lg shadow border border-neutral-200 animate-pulse">
        <div className="h-5 bg-neutral-200 rounded w-1/2 mb-4"></div>
        <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
                <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
        </div>
        <div className="border-t border-neutral-200 pt-4 mt-4 space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-neutral-200 rounded w-full"></div>
            <div className="h-3 bg-neutral-200 rounded w-full"></div>
            <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
        </div>
    </div>
);


const YieldPredictionCard: React.FC<YieldPredictionCardProps> = ({ yieldPrediction, isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!yieldPrediction) return null;

  const confidenceColor = {
      High: 'bg-brand-green/20 text-brand-green',
      Medium: 'bg-brand-yellow/20 text-brand-yellow-700',
      Low: 'bg-brand-orange/20 text-brand-orange-700',
  }[yieldPrediction.confidence] || 'bg-neutral-200 text-neutral-700';

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-neutral-200 flex flex-col">
      <h3 className="text-lg font-semibold text-neutral-700 mb-2 flex items-center">
        <ChartBarIcon className="w-6 h-6 text-brand-purple mr-2" />
        {t('dashboard.yield.title')}
      </h3>
      <p className="text-sm text-neutral-500 mb-4">{t('dashboard.yield.crop', { cropName: yieldPrediction.cropName })}</p>

      <div className="mb-4">
        <p className="text-sm text-neutral-500">{t('dashboard.yield.predictedYield')}</p>
        <p className="text-3xl font-bold text-brand-purple">
          {yieldPrediction.predictedYield}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-neutral-500 mb-1">{t('dashboard.yield.confidence')}</p>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${confidenceColor}`}>
            {yieldPrediction.confidence}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-neutral-600">{t('dashboard.yield.factors')}</h4>
        <ul className="mt-1 space-y-1">
            {yieldPrediction.factors.map((factor, index) => (
                <li key={index} className="flex items-start text-xs text-neutral-500">
                    <InfoIcon className="w-3 h-3 mr-1.5 mt-0.5 flex-shrink-0"/>
                    <span>{factor}</span>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default YieldPredictionCard;
