import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import EventCard from '../components/EventCard'; // Import the child component
import { fetchEvents } from '../utils/api.js'; // Ensure this file exists and works

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="mr-2" size={32} />
            Events
          </h1>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                filter === 'upcoming'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
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
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && <p className="text-red-600 text-center">{error}</p>}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <p className="text-center text-gray-600">
            {filter === 'upcoming'
              ? 'No upcoming events available.'
              : filter === 'past'
              ? 'No past events available.'
              : 'No events available.'}
          </p>
        )}

        {/* Event List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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