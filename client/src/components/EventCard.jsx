import React from 'react';
import { Clock, Users, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext'; // Add this import

const EventCard = ({ event, onClick }) => {
  
  // eslint-disable-next-line no-unused-vars
  const { theme } = useTheme(); // Add theme hook
  const isExpired = new Date(event.endDate) < new Date();
  const isUpcoming = new Date(event.startDate) > new Date();

  // Use a static dummy image URL or generate dynamically
  const dummyImageUrl =
    'https://img.freepik.com/free-photo/back-view-crowd-fans-watching-live-performance-music-concert-night-copy-space_637285-544.jpg?ga=GA1.1.23714335.1741542781&semt=ais_hybrid';

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group relative"
      aria-label={`Event: ${event.name || 'Unnamed Event'}`}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity"
        style={{ backgroundImage: `url(${dummyImageUrl})` }}
      ></div>

      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity"></div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Badges */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {isUpcoming && (
              <span className="bg-green-500 dark:bg-green-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                Upcoming
              </span>
            )}
            {isExpired && (
              <span className="bg-red-500 dark:bg-red-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                Expired
              </span>
            )}
          </div>
          <button
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold text-sm focus:outline-none"
            aria-label="View event details"
          >
            View Details
          </button>
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 line-clamp-1">
          {event.name || 'Unnamed Event'}
        </h3>

        {/* Event Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {event.description || 'No description available.'}
        </p>

        {/* Event Details */}
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p className="flex items-center">
            <Clock className="mr-2" size={16} />
            <span className="font-medium">Scheduled For: </span>
            {new Date(event.startDate).toLocaleDateString()} -{' '}
            {new Date(event.endDate).toLocaleDateString()}
          </p>
          <p className="flex items-center">
            <Users className="mr-2" size={16} />
            Capacity: {event.capacity || 'N/A'}
          </p>
          <p className="flex items-center">
            <Globe className="mr-2" size={16} />
            {event.location || 'Location TBD'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;