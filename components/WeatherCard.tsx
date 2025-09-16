

import React from 'react';
import { WeatherData } from '../types';
import { SunIcon, CloudIcon, RainIcon, StormIcon, WindIcon, DropletIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface WeatherCardProps {
  weatherData: WeatherData | null;
  location: string;
  isLoading: boolean;
}

const WeatherIcon: React.FC<{condition: string, className?: string}> = ({ condition, className }) => {
    const iconClass = className || "w-8 h-8";
    switch(condition.toLowerCase()) {
        case 'sunny':
            return <SunIcon className={`${iconClass} text-yellow-500`} />;
        case 'cloudy':
            return <CloudIcon className={`${iconClass} text-neutral-500`} />;
        case 'partly cloudy':
            // In a real app, we might have a dedicated partly-cloudy icon
            return <CloudIcon className={`${iconClass} text-yellow-500`} />; 
        case 'showers':
        case 'rain':
            return <RainIcon className={`${iconClass} text-blue-500`} />;
        case 'thunderstorm':
            return <StormIcon className={`${iconClass} text-purple-500`} />;
        default:
            return <SunIcon className={`${iconClass} text-neutral-400`} />;
    }
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, location, isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-neutral-200 animate-pulse">
          <div className="h-5 bg-neutral-200 rounded w-3/4 mb-4"></div>
          <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-neutral-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                  <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              </div>
          </div>
           <div className="border-t border-neutral-200 pt-4 mt-4">
            <div className="flex justify-around">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center space-y-2">
                        <div className="h-4 bg-neutral-200 rounded w-8"></div>
                        <div className="w-8 h-8 bg-neutral-200 rounded-full"></div>
                        <div className="h-4 bg-neutral-200 rounded w-12"></div>
                    </div>
                ))}
            </div>
          </div>
      </div>
    );
  }

  if (!weatherData) return null;

  const { current, forecast } = weatherData;

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">{t('dashboard.weatherForecast', { location })}</h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-4">
        <div className="flex items-center">
            <WeatherIcon condition={current.condition} className="w-20 h-20" />
            <div className="ml-4">
                <p className="text-5xl font-bold text-neutral-800">{current.temperature}°C</p>
                <p className="text-neutral-600">{current.condition}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-neutral-600 mt-4 sm:mt-0 sm:border-l sm:pl-6 border-neutral-200">
             <div className="flex items-center">
                <WindIcon className="w-4 h-4 mr-1.5 text-neutral-400"/> Wind: {current.windSpeed} km/h
            </div>
            <div className="flex items-center">
                <DropletIcon className="w-4 h-4 mr-1.5 text-neutral-400"/> Humidity: {current.humidity}%
            </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 pt-4">
        <div className="flex justify-around text-center">
          {forecast.map((day, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <p className="text-sm font-semibold text-neutral-600">{day.day}</p>
              <WeatherIcon condition={day.condition} className="w-8 h-8 my-1" />
              <p className="text-sm text-neutral-800">{day.high}° / {day.low}°</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;