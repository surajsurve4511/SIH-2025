
import React, { useMemo } from 'react';
import { Farmer, WeatherData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { LightBulbIcon } from './icons';

interface PersonalizedSuggestionsProps {
  farmer: Farmer;
  weatherData: WeatherData | null;
}

const PersonalizedSuggestions: React.FC<PersonalizedSuggestionsProps> = ({ farmer, weatherData }) => {
  const { t } = useLanguage();

  const suggestions = useMemo(() => {
    const generatedSuggestions: string[] = [];

    // Suggestion based on weather
    if (weatherData?.forecast.some(day => day.condition.toLowerCase().includes('rain') || day.condition.toLowerCase().includes('showers'))) {
      generatedSuggestions.push(t('dashboard.suggestions.weather', { location: farmer.location }));
    }

    // Suggestion based on plot health
    farmer.farms.forEach(farm => {
      farm.plots.forEach(plot => {
        if (plot.cropInfo?.healthStatus?.toLowerCase().includes('monitoring') || plot.cropInfo?.healthStatus?.toLowerCase().includes('fair')) {
          generatedSuggestions.push(t('dashboard.suggestions.plotHealth', { plotName: `${plot.name} (${farm.name})` }));
        }
      });
    });

    // Suggestion based on lack of recent activity (very basic check)
     farmer.farms.forEach(farm => {
      farm.plots.forEach(plot => {
        const hasRecentLog = plot.dailyLogs?.some(log => new Date(log.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (!hasRecentLog) {
            // Only add one suggestion of this type to avoid clutter
            if(!generatedSuggestions.some(s => s.includes("logged"))) {
                 generatedSuggestions.push(t('dashboard.suggestions.logActivity', { plotName: `${plot.name} (${farm.name})` }));
            }
        }
      });
    });

    return generatedSuggestions.slice(0, 3); // Limit to max 3 suggestions
  }, [farmer, weatherData, t]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-700 mb-3 flex items-center">
        <LightBulbIcon className="w-6 h-6 text-brand-yellow mr-2" />
        {t('dashboard.suggestions.title')}
      </h3>
      <ul className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md border border-neutral-200">
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalizedSuggestions;
