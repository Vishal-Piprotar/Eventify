/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Filter, RefreshCw, Search } from 'lucide-react';
import EventCard from '../components/EventCard';
import EventCardSkeleton from '../components/EventCardSkeleton.jsx';
import { fetchEvents } from '../utils/api.js';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Events = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay
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

  const handleRefresh = () => {
    fetchEventsData();
  };

  // Filter events based on filter type and search term
  const filteredEvents = events.filter((event) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    
    // Apply date filter
    let passesDateFilter = true;
    if (filter === 'upcoming') passesDateFilter = start > now;
    if (filter === 'past') passesDateFilter = end < now;
    
    // Apply search filter (case insensitive)
    const matchesSearch = searchTerm === '' || 
      (event.name && event.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return passesDateFilter && matchesSearch;
  });

  // Get correct filter button styles
  const getFilterButtonClass = (filterType) => {
    const isActive = filter === filterType;
    const baseClass = "px-4 py-2 text-sm font-medium rounded-md transition-all ";
    
    if (isActive) {
      switch(filterType) {
        case 'all': return baseClass + "bg-blue-600 text-white";
        case 'upcoming': return baseClass + "bg-green-600 text-white";
        case 'past': return baseClass + "bg-gray-600 text-white";
        default: return baseClass + "bg-blue-600 text-white";
      }
    } else {
      return baseClass + "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 md:px-8">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <Calendar size={32} className="text-white" />
              Events
            </h1>
            <p className="text-blue-100 max-w-2xl">
              Discover and join exciting events. Browse upcoming gatherings or check out past events.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {/* Controls Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Controls */}
            <div className="flex flex-wrap gap-2 items-center">
              {/* Filter Tabs */}
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                  <Filter size={16} className="inline mr-1" /> Filter:
                </span>
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => setFilter('all')}
                    className={getFilterButtonClass('all')}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('upcoming')}
                    className={getFilterButtonClass('upcoming')}
                  >
                    Upcoming
                  </button>
                  <button 
                    onClick={() => setFilter('past')}
                    className={getFilterButtonClass('past')}
                  >
                    Past
                  </button>
                </div>
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="inline-flex items-center justify-center p-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Refresh events"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading Skeleton State */}
        {loading && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <EventCardSkeleton key={item} />
              ))}
            </div>
          </>
        )}
        
        {/* Error Message */}
        {!loading && error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center text-red-700 dark:text-red-400 my-6">
            <p>{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              Try again
            </button>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No matching events found' : (
                filter === 'upcoming'
                  ? 'No upcoming events'
                  : filter === 'past'
                  ? 'No past events'
                  : 'No events available'
              )}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {searchTerm 
                ? `We couldn't find any events matching "${searchTerm}". Try adjusting your search.` 
                : 'Check back later or try a different filter to find events.'}
            </p>
          </div>
        )}
        
        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
              {searchTerm && ` matching "${searchTerm}"`}
              {filter !== 'all' && ` (${filter})`}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onClick={() => handleEventClick(event.id)} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Events;