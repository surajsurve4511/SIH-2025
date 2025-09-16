import React from 'react';
import { Farmer } from '../types';
import { UserIcon, LocationIcon, FarmIcon } from './icons';

interface FarmerListItemProps {
  farmer: Farmer;
  isSelected: boolean;
  onSelect: (farmerId: string) => void;
}

const FarmerListItem: React.FC<FarmerListItemProps> = ({ farmer, isSelected, onSelect }) => {
  return (
    <li
      onClick={() => onSelect(farmer.id)}
      className={`
        p-4 border-b border-neutral-200 cursor-pointer transition-colors duration-150 ease-in-out
        ${isSelected ? 'bg-brand-blue/10 border-l-4 border-brand-blue' : 'hover:bg-neutral-100/50'}
      `}
      aria-current={isSelected ? "page" : undefined}
    >
      <div className="flex items-center space-x-3">
        <UserIcon className={`w-8 h-8 ${isSelected ? 'text-brand-blue' : 'text-neutral-500'}`} />
        <div className="flex-1">
          <h3 className={`font-semibold ${isSelected ? 'text-brand-blue' : 'text-neutral-700'}`}>{farmer.name}</h3>
          <p className="text-xs text-neutral-500 flex items-center mt-0.5">
            <LocationIcon className="w-3 h-3 mr-1" />
            {farmer.location}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-600">
            <span className="bg-neutral-200 px-1.5 py-0.5 rounded-full text-neutral-700">
              {farmer.farmingExperience.farmingType}
            </span>
            <span className="bg-brand-green/20 px-1.5 py-0.5 rounded-full text-brand-green flex items-center">
              <FarmIcon className="w-3 h-3 mr-1"/>
              {farmer.farms.length} Farm{farmer.farms.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default FarmerListItem;