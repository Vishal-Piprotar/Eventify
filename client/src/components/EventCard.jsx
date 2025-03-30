import React from 'react';
import { Clock, Users, Globe } from 'lucide-react';

const EventCard = ({ event, onClick }) => {
  const isExpired = new Date(event.endDate) < new Date();
  const isUpcoming = new Date(event.startDate) > new Date();

  // Use a static dummy image URL or generate dynamically
  const dummyImageUrl =
    'https://img.freepik.com/free-photo/back-view-crowd-fans-watching-live-performance-music-concert-night-copy-space_637285-544.jpg?ga=GA1.1.23714335.1741542781&semt=ais_hybrid';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group relative"
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
              <span className="bg-green-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                Upcoming
              </span>
            )}
            {isExpired && (
              <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                Expired
              </span>
            )}
          </div>
          <button
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm focus:outline-none"
            aria-label="View event details"
          >
            View Details
          </button>
        </div>

        {/* Event Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {event.name || 'Unnamed Event'}
        </h3>

        {/* Event Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description || 'No description available.'}
        </p>

        {/* Event Details */}
        <div className="space-y-1 text-sm text-gray-600">
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