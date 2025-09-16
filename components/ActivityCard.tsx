import React from 'react';
import { Activity, ActivityType } from '../types';
import { CalendarIcon, CameraIcon, LeafIcon, UserIcon, PlotIcon, FarmIcon } from './icons';

interface ActivityCardProps {
  activity: Activity;
  showFarmerName?: boolean;
  showFarmName?: boolean; // New prop
}

const ActivityTypeIcon: React.FC<{type: ActivityType, className?: string}> = ({ type, className}) => {
  const iconClass = className || "w-5 h-5";
  switch (type) {
    case ActivityType.SOWED:
      return <LeafIcon className={`${iconClass} text-brand-green`} />;
    case ActivityType.SPRAYED:
      return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${iconClass} text-brand-orange`}>
                <path d="M3.75 3.144A9.972 9.972 0 0 1 9.92.062c.517.03.99.138 1.432.315.245.098.475.228.69.385l-2.008 2.008A5.95 5.95 0 0 0 9.04 2.5c-.75 0-1.458.136-2.094.39l.001-.002-3.2 1.6A.75.75 0 0 0 3 5.25v.996c0 .068.006.136.016.203L6 9.355V14.5a.75.75 0 0 0 .75.75h5.5a.75.75 0 0 0 .75-.75v-1.556l2.14-2.14a.75.75 0 0 0 .21-.76l-.04-.158a5.25 5.25 0 0 0-4.02-3.882 2.508 2.508 0 0 1-.26-.145A6.05 6.05 0 0 0 9.04 4c-.792 0-1.54.156-2.22.44L3.75 3.144Z" />
                <path d="m4.21 5.29 1.125 2.25A2.5 2.5 0 0 0 7.54 9.25H11.5a.75.75 0 0 1 0 1.5H7.54a2.5 2.5 0 0 0-2.204 1.71l-1.126 2.25A.75.75 0 0 0 4.96 16h10.08a.75.75 0 0 0 .75-.75V8.71l1.524-1.143a.75.75 0 0 0-.272-1.314l-2.432-.81A9.013 9.013 0 0 0 12.04 4c-.792 0-1.54.156-2.22.44L6.75 3.145a.75.75 0 0 0-1.022.214l-1.518 1.93Z" />
              </svg>;
    case ActivityType.IRRIGATED:
      return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${iconClass} text-brand-blue`}>
                <path d="M10 5a1 1 0 0 1 1 1v2.255a.25.25 0 0 0 .09.186l1.363 1.137a1 1 0 0 1-1.114 1.664l-1.363-1.137V14a1 1 0 0 1-2 0V9.245l-1.363 1.137A1 1 0 1 1 5.636 8.719l1.363-1.137A.25.25 0 0 0 7.09 7.39V6a1 1 0 0 1 1-1h2Z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-1.25a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5Z" clipRule="evenodd" />
              </svg>;
    case ActivityType.PHOTO_LOG:
      return <CameraIcon className={`${iconClass} text-brand-purple`} />;
    case ActivityType.FERTILIZED:
       return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${iconClass} text-brand-brown`}>
                <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v1.518A2.5 2.5 0 0 1 12.268 6H13.5a2.5 2.5 0 0 1 0 5h-1.232a2.5 2.5 0 0 1-1.518 1.732V16.5a3 3 0 0 1-6 0v-3.768A2.5 2.5 0 0 1 3.232 11H2.5a2.5 2.5 0 0 1 0-5h1.232A2.5 2.5 0 0 1 5.25 4.268V2.75A.75.75 0 0 1 6 2h4Zm0 2.5H6.5V6.05A3.982 3.982 0 0 0 8 8.633V10.5a.75.75 0 0 1-1.5 0V8.633A3.982 3.982 0 0 0 5 6.05V4.5H4a1 1 0 1 0 0 2h1v1.95A3.982 3.982 0 0 0 6.5 11h.063c.27-.6.763-1.077 1.374-1.385V7.5a.75.75 0 0 1 1.5 0v2.115c.61.308 1.104.785 1.374 1.385H13.5A3.982 3.982 0 0 0 15 8.45V6.5h1a1 1 0 1 0 0-2h-1V6.05A3.982 3.982 0 0 0 13.5 3.5H12v1H10V3.5Z" clipRule="evenodd" />
              </svg>;
    case ActivityType.HARVESTED:
      return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`${iconClass} text-brand-teal`}>
               <path d="M10 5.5a1 1 0 0 0-1 1v2.92l-2.047-2.047a.75.75 0 0 0-1.061 1.06L7.94 10.5H5a1 1 0 0 0 0 2h2.94l-2.048 2.047a.75.75 0 1 0 1.06 1.061L10 13.56V16.5a1 1 0 0 0 2 0v-2.92l2.047 2.047a.75.75 0 0 0 1.061-1.06L13.06 12.5H16a1 1 0 1 0 0-2h-2.94l2.048-2.047a.75.75 0 1 0-1.06-1.061L12 8.44V6.5a1 1 0 0 0-1-1h-1Z" />
             </svg>;
    default:
      return <LeafIcon className={`${iconClass} text-neutral-500`} />;
  }
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, showFarmerName = false, showFarmName = false }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-neutral-200 mb-4 transition-shadow hover:shadow-md">
      <div className="flex items-start space-x-3">
        <ActivityTypeIcon type={activity.type} className="w-6 h-6 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
            <h4 className="text-md font-semibold text-neutral-700">{activity.type}</h4>
            <span className="text-xs text-neutral-500 flex items-center mt-0.5 sm:mt-0">
              <CalendarIcon className="w-3.5 h-3.5 mr-1" />
              {new Date(activity.timestamp).toLocaleString()}
            </span>
          </div>
          
          {showFarmerName && activity.farmerName && (
            <p className="text-sm text-neutral-600 mb-1 flex items-center">
              <UserIcon className="w-4 h-4 mr-1.5 text-neutral-400" /> Farmer: {activity.farmerName}
            </p>
          )}

          {showFarmName && activity.farmName && (
             <p className="text-sm text-neutral-600 mb-1 flex items-center">
              <FarmIcon className="w-4 h-4 mr-1.5 text-neutral-400" /> Farm: {activity.farmName}
            </p>
          )}

          <p className="text-sm text-neutral-600 mb-1 flex items-center">
            <PlotIcon className="w-4 h-4 mr-1.5 text-neutral-400" /> Plot: {activity.plotName}
          </p>
          <p className="text-sm text-neutral-800 bg-neutral-100 p-2 rounded">{activity.details}</p>
          
          {activity.photoUrl && (
            <div className="mt-3">
              {activity.type !== ActivityType.PHOTO_LOG && <p className="text-xs text-neutral-500 mb-1">Associated Image:</p>}
              <img 
                src={activity.photoUrl} 
                alt={activity.type === ActivityType.PHOTO_LOG ? "Activity log image" : "Associated visual"} 
                className="rounded-md max-h-48 w-auto object-cover border border-neutral-300" 
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;