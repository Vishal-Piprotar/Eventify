import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import EventCard from '../components/EventCard';
import { fetchEvents } from '../utils/api.js';

const Events = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="mr-2" size={24} sm:size={32} />
            Events
          </h1>
          <div className="flex flex-wrap w-full sm:w-auto gap-2 sm:gap-4">
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md flex-grow sm:flex-grow-0 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md flex-grow sm:flex-grow-0 ${
                filter === 'upcoming'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md flex-grow sm:flex-grow-0 ${
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
            <div className="animate-spin rounded-full h-10 w-10 sm:h-16 sm:w-16 border-t-4 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && <p className="text-red-600 text-center p-4">{error}</p>}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="flex justify-center items-center h-32 sm:h-64">
            <p className="text-center text-gray-600 p-4">
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