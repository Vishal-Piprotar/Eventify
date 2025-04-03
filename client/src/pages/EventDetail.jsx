/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, MapPin, ArrowLeft, Calendar, Share2, Heart, MessageCircle, AlertCircle } from 'lucide-react';
import { getEventById, api } from "../utils/api.js";
import { useAuth } from '../context/AuthContext'; // Add this import
import { useTheme } from '../context/ThemeContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Add auth hook
  const { theme } = useTheme(); // Theme hook, used only when authenticated

  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showAttendees, setShowAttendees] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('not-registered'); // 'not-registered', 'pending', 'confirmed'

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventData = await getEventById(id);
        const attendeesRes = await api.get(`/events/${id}/attendees`);
        const attendeesData = attendeesRes.data;

        setEvent(eventData.data);
        setAttendees(attendeesData.attendees || []);
      } catch (error) {
        setError(error.response?.data?.message || error.message || 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const isEventEnded = event ? new Date(event.endDate) < new Date() : false;
  const isUpcoming = event ? new Date(event.startDate) > new Date() : false;

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const handleRegister = async () => {
    if (!isEventEnded) {
      try {
        setRegistrationStatus('confirmed');
      } catch (error) {
        setError('Failed to register for the event', error);
      }
    }
  };

  const handleLikeToggle = async () => {
    try {
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to update like status', error);
    }
  };

  const handleShare = () => {
    alert('Share functionality would open here');
  };

  if (loading) {
    return (
      <div className={isAuthenticated ? 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900' : 'min-h-screen flex items-center justify-center bg-gray-50'}>
        <div className="text-center">
          <div className={isAuthenticated ? 'w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4' : 'w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'}></div>
          <p className={isAuthenticated ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600'}>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={isAuthenticated ? 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900' : 'min-h-screen flex items-center justify-center bg-gray-50'}>
        <div className={isAuthenticated ? 'max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center' : 'max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center'}>
          <AlertCircle className={isAuthenticated ? 'h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4' : 'h-16 w-16 text-red-500 mx-auto mb-4'} />
          <h2 className={isAuthenticated ? 'text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2' : 'text-2xl font-bold text-gray-800 mb-2'}>Something went wrong</h2>
          <p className={isAuthenticated ? 'text-gray-600 dark:text-gray-400 mb-6' : 'text-gray-600 mb-6'}>{error}</p>
          <button
            onClick={() => navigate('/events')}
            className={isAuthenticated ? 'px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors' : 'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={isAuthenticated ? 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900' : 'min-h-screen flex items-center justify-center bg-gray-50'}>
        <div className={isAuthenticated ? 'max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center' : 'max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center'}>
          <AlertCircle className={isAuthenticated ? 'h-16 w-16 text-orange-500 dark:text-orange-400 mx-auto mb-4' : 'h-16 w-16 text-orange-500 mx-auto mb-4'} />
          <h2 className={isAuthenticated ? 'text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2' : 'text-2xl font-bold text-gray-800 mb-2'}>Event Not Found</h2>
          <p className={isAuthenticated ? 'text-gray-600 dark:text-gray-400 mb-6' : 'text-gray-600 mb-6'}>The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/events')}
            className={isAuthenticated ? 'px-6 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors' : 'px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'}
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  const isFullCapacity = event.capacity && attendees.length >= event.capacity;

  return (
    <div className={isAuthenticated ? 'min-h-screen bg-gray-100 dark:bg-gray-900' : 'min-h-screen bg-gray-100'}>
      {/* Sticky Header */}
      <div className={isAuthenticated ? 'sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md' : 'sticky top-0 z-10 bg-white shadow-md'}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <button
            onClick={() => navigate('/events')}
            className={isAuthenticated ? 'flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors' : 'flex items-center text-gray-700 hover:text-gray-900 transition-colors'}
          >
            <ArrowLeft className="mr-2" size={18} /> Back
          </button>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLikeToggle}
              className={isAuthenticated ? 'flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors' : 'flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors'}
            >
              <Heart 
                className={isLiked ? (isAuthenticated ? 'fill-current text-red-500 dark:text-red-400' : 'fill-current text-red-500') : ''} 
                color={isLiked ? '#ef4444' : 'currentColor'} 
                size={20} 
              />
              <span className="text-sm">{isLiked ? 'Liked' : 'Like'}</span>
            </button>
            
            <button 
              onClick={handleShare}
              className={isAuthenticated ? 'flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors' : 'flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors'}
            >
              <Share2 size={20} />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section with Image */}
      <div className="relative h-96">
        <img
          src={`https://picsum.photos/seed/${id}/1600/900`}
          alt={`${event.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
          <div className="max-w-6xl mx-auto px-4 py-8 w-full">
            <span className={isAuthenticated 
              ? `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  isEventEnded ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' : 
                  isUpcoming ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 
                  'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                }`
              : `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  isEventEnded ? 'bg-red-100 text-red-800' : 
                  isUpcoming ? 'bg-green-100 text-green-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
              {isEventEnded ? 'Past Event' : isUpcoming ? 'Upcoming' : 'Happening Now'}
            </span>
            <h1 className="text-4xl font-bold text-white mb-2">{event.name}</h1>
            <div className="flex items-center space-x-2 text-white/80">
              <Calendar size={16} />
              <span>{formatDate(event.startDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Event Details */}
          <div className="md:w-2/3 space-y-8">
            {/* Event Registration Status Banner */}
            {!isEventEnded && (
              <div className={isAuthenticated 
                ? `p-4 rounded-lg ${
                    registrationStatus === 'confirmed' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' :
                    isFullCapacity ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700' :
                    'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                  }`
                : `p-4 rounded-lg ${
                    registrationStatus === 'confirmed' ? 'bg-green-50 border border-green-200' :
                    isFullCapacity ? 'bg-orange-50 border border-orange-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                <div className="flex items-center">
                  <div className={isAuthenticated 
                    ? `rounded-full p-2 mr-4 ${
                        registrationStatus === 'confirmed' ? 'bg-green-100 dark:bg-green-800/20' :
                        isFullCapacity ? 'bg-orange-100 dark:bg-orange-800/20' :
                        'bg-blue-100 dark:bg-blue-800/20'
                      }`
                    : `rounded-full p-2 mr-4 ${
                        registrationStatus === 'confirmed' ? 'bg-green-100' :
                        isFullCapacity ? 'bg-orange-100' :
                        'bg-blue-100'
                      }`}>
                    {registrationStatus === 'confirmed' ? (
                      <Users className={isAuthenticated ? 'h-6 w-6 text-green-500 dark:text-green-400' : 'h-6 w-6 text-green-500'} />
                    ) : isFullCapacity ? (
                      <AlertCircle className={isAuthenticated ? 'h-6 w-6 text-orange-500 dark:text-orange-400' : 'h-6 w-6 text-orange-500'} />
                    ) : (
                      <Calendar className={isAuthenticated ? 'h-6 w-6 text-blue-500 dark:text-blue-400' : 'h-6 w-6 text-blue-500'} />
                    )}
                  </div>
                  <div>
                    <h3 className={isAuthenticated 
                      ? `font-medium ${
                          registrationStatus === 'confirmed' ? 'text-green-800 dark:text-green-400' :
                          isFullCapacity ? 'text-orange-800 dark:text-orange-400' :
                          'text-blue-800 dark:text-blue-400'
                        }`
                      : `font-medium ${
                          registrationStatus === 'confirmed' ? 'text-green-800' :
                          isFullCapacity ? 'text-orange-800' :
                          'text-blue-800'
                        }`}>
                      {registrationStatus === 'confirmed' ? 'You\'re registered for this event!' :
                       isFullCapacity ? 'This event has reached full capacity.' :
                       'Register to attend this event'}
                    </h3>
                    <p className={isAuthenticated 
                      ? `text-sm ${
                          registrationStatus === 'confirmed' ? 'text-green-600 dark:text-green-400' :
                          isFullCapacity ? 'text-orange-600 dark:text-orange-400' :
                          'text-blue-600 dark:text-blue-400'
                        }`
                      : `text-sm ${
                          registrationStatus === 'confirmed' ? 'text-green-600' :
                          isFullCapacity ? 'text-orange-600' :
                          'text-blue-600'
                        }`}>
                      {registrationStatus === 'confirmed' ? 'We look forward to seeing you there!' :
                       isFullCapacity ? 'Please check back later or join the waitlist.' :
                       'Limited spots available. Reserve your place now.'}
                    </p>
                  </div>
                </div>
                
                {!isEventEnded && registrationStatus !== 'confirmed' && !isFullCapacity && (
                  <button
                    onClick={handleRegister}
                    className={isAuthenticated ? 'mt-4 w-full md:w-auto px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors' : 'mt-4 w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors'}
                  >
                    Register Now
                  </button>
                )}
                
                {registrationStatus === 'confirmed' && (
                  <button className={isAuthenticated ? 'mt-4 w-full md:w-auto px-6 py-3 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 font-medium rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors' : 'mt-4 w-full md:w-auto px-6 py-3 border border-green-300 text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors'}>
                    Add to Calendar
                  </button>
                )}
              </div>
            )}
            
            {/* About Section */}
            <div className={isAuthenticated ? 'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6' : 'bg-white rounded-xl shadow-sm p-6'}>
              <h2 className={isAuthenticated ? 'text-xl font-bold text-gray-800 dark:text-gray-100 mb-4' : 'text-xl font-bold text-gray-800 mb-4'}>About This Event</h2>
              <p className={isAuthenticated ? 'text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line' : 'text-gray-700 leading-relaxed whitespace-pre-line'}>
                {event.description}
              </p>
            </div>
            
            {/* Details Section */}
            <div className={isAuthenticated ? 'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6' : 'bg-white rounded-xl shadow-sm p-6'}>
              <h2 className={isAuthenticated ? 'text-xl font-bold text-gray-800 dark:text-gray-100 mb-4' : 'text-xl font-bold text-gray-800 mb-4'}>Event Details</h2>
              
              <div className="space-y-6">
                {/* Date & Time */}
                <div className="flex items-start space-x-4">
                  <div className={isAuthenticated ? 'bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg' : 'bg-blue-50 p-3 rounded-lg'}>
                    <Clock className={isAuthenticated ? 'text-blue-500 dark:text-blue-400' : 'text-blue-500'} size={22} />
                  </div>
                  <div>
                    <h3 className={isAuthenticated ? 'font-medium text-gray-800 dark:text-gray-100' : 'font-medium text-gray-800'}>Date and Time</h3>
                    <p className={isAuthenticated ? 'text-gray-600 dark:text-gray-400 mt-1' : 'text-gray-600 mt-1'}>
                      {formatDate(event.startDate)} • {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    </p>
                    {isEventEnded ? (
                      <span className={isAuthenticated ? 'inline-block mt-2 text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-2 py-1 rounded' : 'inline-block mt-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded'}>Event has ended</span>
                    ) : isUpcoming ? (
                      <span className={isAuthenticated ? 'inline-block mt-2 text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded' : 'inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded'}>Upcoming event</span>
                    ) : (
                      <span className={isAuthenticated ? 'inline-block mt-2 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded' : 'inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'}>Event in progress</span>
                    )}
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className={isAuthenticated ? 'bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg' : 'bg-emerald-50 p-3 rounded-lg'}>
                    <MapPin className={isAuthenticated ? 'text-emerald-500 dark:text-emerald-400' : 'text-emerald-500'} size={22} />
                  </div>
                  <div>
                    <h3 className={isAuthenticated ? 'font-medium text-gray-800 dark:text-gray-100' : 'font-medium text-gray-800'}>Location</h3>
                    <p className={isAuthenticated ? 'text-gray-600 dark:text-gray-400 mt-1' : 'text-gray-600 mt-1'}>{event.location}</p>
                    <button className={isAuthenticated ? 'text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2' : 'text-sm text-blue-600 hover:text-blue-800 mt-2'}>View on map</button>
                  </div>
                </div>
                
                {/* Attendance */}
                <div className="flex items-start space-x-4">
                  <div className={isAuthenticated ? 'bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg' : 'bg-purple-50 p-3 rounded-lg'}>
                    <Users className={isAuthenticated ? 'text-purple-500 dark:text-purple-400' : 'text-purple-500'} size={22} />
                  </div>
                  <div>
                    <h3 className={isAuthenticated ? 'font-medium text-gray-800 dark:text-gray-100' : 'font-medium text-gray-800'}>Attendance</h3>
                    <p className={isAuthenticated ? 'text-gray-600 dark:text-gray-400 mt-1' : 'text-gray-600 mt-1'}>
                      {attendees.length} {event.capacity ? `out of ${event.capacity}` : ''} people attending
                    </p>
                    
                    <button 
                      onClick={() => setShowAttendees(!showAttendees)}
                      className={isAuthenticated ? 'text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2' : 'text-sm text-blue-600 hover:text-blue-800 mt-2'}
                    >
                      {showAttendees ? 'Hide attendee list' : 'View attendee list'}
                    </button>
                    
                    {showAttendees && (
                      <div className="mt-4 space-y-3">
                        {attendees.length > 0 ? (
                          attendees.map((attendee, index) => (
                            <div key={index} className={isAuthenticated ? 'flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded' : 'flex items-center space-x-3 p-2 bg-gray-50 rounded'}>
                              <div className={isAuthenticated ? 'w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center' : 'w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'}>
                                <span className={isAuthenticated ? 'text-xs text-gray-600 dark:text-gray-300' : 'text-xs text-gray-600'}>{attendee.name?.charAt(0) || "?"}</span>
                              </div>
                              <span className={isAuthenticated ? 'text-sm text-gray-700 dark:text-gray-300' : 'text-sm text-gray-700'}>{attendee.name || "Anonymous"}</span>
                            </div>
                          ))
                        ) : (
                          <p className={isAuthenticated ? 'text-sm text-gray-500 dark:text-gray-400' : 'text-sm text-gray-500'}>No attendees yet. Be the first to register!</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="md:w-1/3 space-y-6">
            {/* Organizer Card */}
            <div className={isAuthenticated ? 'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6' : 'bg-white rounded-xl shadow-sm p-6'}>
              <h2 className={isAuthenticated ? 'text-lg font-bold text-gray-800 dark:text-gray-100 mb-4' : 'text-lg font-bold text-gray-800 mb-4'}>Event Organizer</h2>
              <div className="flex items-center space-x-4">
                <div className={isAuthenticated ? 'w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center' : 'w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'}>
                  <span className={isAuthenticated ? 'text-gray-500 dark:text-gray-300 font-medium' : 'text-gray-500 font-medium'}>O</span>
                </div>
                <div>
                  <h3 className={isAuthenticated ? 'font-medium text-gray-800 dark:text-gray-100' : 'font-medium text-gray-800'}>Organizer Name</h3>
                  <p className={isAuthenticated ? 'text-sm text-gray-500 dark:text-gray-400' : 'text-sm text-gray-500'}>Event Host</p>
                </div>
              </div>
              <button className={isAuthenticated ? 'mt-4 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center' : 'mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center'}>
                <MessageCircle size={16} className="mr-2" />
                Contact Organizer
              </button>
            </div>
            
            {/* Similar Events Card */}
            <div className={isAuthenticated ? 'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6' : 'bg-white rounded-xl shadow-sm p-6'}>
              <h2 className={isAuthenticated ? 'text-lg font-bold text-gray-800 dark:text-gray-100 mb-4' : 'text-lg font-bold text-gray-800 mb-4'}>Similar Events</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-start space-x-3">
                    <div className={isAuthenticated ? 'w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0' : 'w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0'}></div>
                    <div>
                      <h3 className={isAuthenticated ? 'font-medium text-gray-800 dark:text-gray-100 text-sm' : 'font-medium text-gray-800 text-sm'}>Similar Event {num}</h3>
                      <p className={isAuthenticated ? 'text-xs text-gray-500 dark:text-gray-400 mt-1' : 'text-xs text-gray-500 mt-1'}>April {num + 10}, 2025</p>
                    </div>
                  </div>
                ))}
                <button className={isAuthenticated ? 'text-blue-600 dark:text-blue-400 text-sm hover:text-blue-800 dark:hover:text-blue-300' : 'text-blue-600 text-sm hover:text-blue-800'}>View more events</button>
              </div>
            </div>
            
            {/* Share Card */}
            <div className={isAuthenticated ? 'bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6' : 'bg-white rounded-xl shadow-sm p-6'}>
              <h2 className={isAuthenticated ? 'text-lg font-bold text-gray-800 dark:text-gray-100 mb-4' : 'text-lg font-bold text-gray-800 mb-4'}>Share This Event</h2>
              <div className="flex justify-between">
                <button className={isAuthenticated ? 'p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/20 transition-colors' : 'p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors'}>
                  <Share2 size={20} />
                </button>
                <button className={isAuthenticated ? 'p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-800/20 transition-colors' : 'p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors'}>
                  <MessageCircle size={20} />
                </button>
                <button 
                  onClick={handleLikeToggle}
                  className={isAuthenticated ? 'p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/20 transition-colors' : 'p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors'}
                >
                  <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                </button>
                <button className={isAuthenticated ? 'p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/20 transition-colors' : 'p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors'}>
                  <Calendar size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;