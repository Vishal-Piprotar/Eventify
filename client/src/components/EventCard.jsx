/* eslint-disable no-unused-vars */
import React from 'react';
import { Clock, Users, MapPin, Calendar, Star, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Common dummy image URL
const DUMMY_IMAGE_URL = 'https://cdn.prod.website-files.com/66e5292bfdb35c76b373b99c/66e5292bfdb35c76b373bb1a_img_sundays_0002.webp';

const EventCard = ({ event, onClick }) => {
  const { theme } = useTheme();
  
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  
  const isUpcoming = start > now;
  const isExpired = end < now;
  const isOngoing = !isUpcoming && !isExpired;
  
  // Calculate days remaining for upcoming events
  const getDaysRemaining = () => {
    if (!isUpcoming) return null;
    const diffTime = Math.abs(start - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const daysRemaining = getDaysRemaining();
  
  // Format dates in a consistent way
  const formatEventDate = (date) => {
    return date.toLocaleDateString(undefined, { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Format time in 12-hour format
  const formatEventTime = (date) => {
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Status badge configuration
  const getStatusConfig = () => {
    if (isUpcoming) {
      return { 
        label: daysRemaining === 1 ? 'Tomorrow' : daysRemaining === 0 ? 'Today' : `In ${daysRemaining} days`,
        bgColor: 'bg-green-500',
        textColor: 'text-white'
      };
    } else if (isOngoing) {
      return { 
        label: 'Happening now', 
        bgColor: 'bg-yellow-500',
        textColor: 'text-white'
      };
    } else {
      return { 
        label: 'Ended', 
        bgColor: 'bg-gray-500',
        textColor: 'text-white'
      };
    }
  };
  
  const statusConfig = getStatusConfig();
  
  // Use event.imageUrl if provided, otherwise use the common dummy image
  const imageUrl = event.imageUrl || DUMMY_IMAGE_URL;

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={event.name || 'Event Image'} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Fallback to gradient if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback Gradient (hidden by default, shown if image fails) */}
        <div 
          className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6 absolute inset-0 hidden"
        >
          <Calendar size={42} className="text-white/70" />
        </div>
        
        {/* Featured Badge (if applicable) */}
        {event.featured && (
          <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 text-xs font-medium flex items-center justify-center">
            <Star size={12} className="mr-1 fill-current" /> Featured Event
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`${statusConfig.bgColor} ${statusConfig.textColor} text-xs font-medium px-2.5 py-1 rounded-full shadow-sm`}>
            {statusConfig.label}
          </span>
        </div>
        
        {/* Category Pill (if applicable) */}
        {event.category && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/70 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
              {event.category}
            </span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {event.name || 'Unnamed Event'}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 flex-grow">
          {event.description || 'No description available.'}
        </p>
        
        {/* Details Section */}
        <div className="space-y-2 border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
          {/* Date & Time */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-700 dark:text-gray-300">
              <Clock size={15} className="mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <span>{formatEventDate(start)}</span>
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {formatEventTime(start)}
            </span>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
            <MapPin size={15} className="mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span className="truncate">{event.location || 'Location TBD'}</span>
          </div>
          
          {/* Capacity / Attendees */}
          {event.capacity && (
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <Users size={15} className="mr-2 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <div className="flex items-center">
                <span>{event.attendees ? `${event.attendees}/${event.capacity}` : event.capacity} attendees</span>
                
                {/* Progress bar for capacity */}
                {event.attendees && (
                  <div className="ml-2 w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 dark:bg-blue-400" 
                      style={{ width: `${Math.min(100, (event.attendees / event.capacity) * 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Call To Action */}
        <button 
          className="mt-4 w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-md transition-all flex items-center justify-center group-hover:shadow-md"
          onClick={(e) => {
            e.stopPropagation(); // Prevent double event firing
            onClick();
          }}
        >
          View Details <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default EventCard;