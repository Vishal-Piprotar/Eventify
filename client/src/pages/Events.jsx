/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import EventCard from '../components/EventCard';
import { fetchEvents } from '../utils/api.js';
import { useAuth } from '../context/AuthContext'; // Add this import
import { useTheme } from '../context/ThemeContext';

const Events = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Add auth hook
  const { theme } = useTheme(); // Theme hook, used only when authenticated
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await fetchEvents();
      setEvents(response.data?.events || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Filter events based on the selected filter
  const filteredEvents = events.filter((event) => {
    const now = new Date();
    if (filter === 'upcoming') {
      return new Date(event.startDate) > now;
    } else if (filter === 'past') {
      return new Date(event.endDate) < now;
    }
    return true; // 'all' filter
  });

  return (
    <div className={isAuthenticated ? 'min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8' : 'min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8'}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className={isAuthenticated ? 'text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center' : 'text-2xl sm:text-3xl font-bold text-gray-900 flex items-center'}>
            <Calendar className={isAuthenticated ? 'mr-2 text-blue-600 dark:text-blue-400' : 'mr-2 text-blue-600'} size={24} sm:size={32} />
            Events
          </h1>
          <div className="flex flex-wrap w-full sm:w-auto gap-2 sm:gap-4">
            <button
              className={isAuthenticated 
                ? `px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md flex-grow sm:flex-grow-0 ${
                    filter === 'all'
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`
                : `px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md flex-grow sm:flex-grow-0 ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={isAuthenticated 
                ? `px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md flex-grow sm:flex-grow-0 ${
                    filter === 'upcoming'
                      ? 'bg-green-600 dark:bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`
                : `px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md flex-grow sm:flex-grow-0 ${
                    filter === 'upcoming'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={isAuthenticated 
                ? `px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md flex-grow sm:flex-grow-0 ${
                    filter === 'past'
                      ? 'bg-red-600 dark:bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`
                : `px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md flex-grow sm:flex-grow-0 ${
                    filter === 'past'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              onClick={() => setFilter('past')}
            >
              Past
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-32 sm:h-64">
            <div className={isAuthenticated ? 'animate-spin rounded-full h-10 w-10 sm:h-16 sm:w-16 border-t-4 border-blue-600 dark:border-blue-400' : 'animate-spin rounded-full h-10 w-10 sm:h-16 sm:w-16 border-t-4 border-blue-600'}></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <p className={isAuthenticated ? 'text-red-600 dark:text-red-400 text-center p-4' : 'text-red-600 text-center p-4'}>{error}</p>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="flex justify-center items-center h-32 sm:h-64">
            <p className={isAuthenticated ? 'text-center text-gray-600 dark:text-gray-400 p-4' : 'text-center text-gray-600 p-4'}>
              {filter === 'upcoming'
                ? 'No upcoming events available.'
                : filter === 'past'
                ? 'No past events available.'
                : 'No events available.'}
            </p>
          </div>
        )}

        {/* Event List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;