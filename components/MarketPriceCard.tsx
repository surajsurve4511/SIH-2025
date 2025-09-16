

import React from 'react';
import { MarketData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUpIcon } from './icons';

interface MarketPriceCardProps {
  marketData: MarketData | null;
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
            <div className="h-4 bg-neutral-200 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        </div>
    </div>
);

const MarketPriceCard: React.FC<MarketPriceCardProps> = ({ marketData, isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!marketData) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-neutral-200 flex flex-col">
      <h3 className="text-lg font-semibold text-neutral-700 mb-2 flex items-center">
        <TrendingUpIcon className="w-6 h-6 text-brand-teal mr-2" />
        {t('dashboard.market.title')}
      </h3>
       <p className="text-sm text-neutral-500 mb-4">{t('dashboard.market.crop', { cropName: marketData.cropName })}</p>
      
      <div className="mb-4">
        <p className="text-sm text-neutral-500">{t('dashboard.market.currentPrice')}</p>
        <p className="text-3xl font-bold text-brand-teal">
          ₹{marketData.currentPrice.price.toLocaleString('en-IN')}
          <span className="text-lg font-medium text-neutral-600"> / {t('dashboard.market.priceUnit')}</span>
        </p>
      </div>

      <div className="space-y-3">
         <div>
          <h4 className="text-sm font-semibold text-neutral-600 mb-1">{t('dashboard.market.forecast')}</h4>
          <div className="flex justify-between text-center text-xs">
            {marketData.forecast.map((day, index) => (
              <div key={index} className="flex-1">
                <p className="font-medium text-neutral-500">{day.day}</p>
                <p className="text-neutral-700">{day.trend}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-neutral-600">{t('dashboard.market.summary')}</h4>
            <p className="text-xs text-neutral-500 italic mt-1 bg-neutral-50 p-2 rounded border">
                {marketData.summary}
            </p>
        </div>
      </div>
    </div>
  );
};

export default MarketPriceCard;