import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  CreditCard,
  Calendar,
  Bell,
  HelpCircle,
  Clock,
  Plus,
  ExternalLink,
  Star,
} from 'lucide-react';
import { getUserProfile } from '../utils/api.js';

// QuickActionCard component - Added missing Icon prop
const QuickActionCard = ({ icon: Icon, title, description, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer group"
  >
    <div className="flex items-center mb-3">
      <Icon className="text-blue-600 group-hover:text-blue-700 mr-3" size={24} />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const EventPreview = ({ event, onEventClick }) => (
  <div
    onClick={() => onEventClick(event.id || event.Id)}
    className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
  >
    <div>
      <h4 className="text-md font-semibold text-gray-800">{event.name || event.Name}</h4>
      {event.startDate && (
        <p className="text-sm text-gray-600 flex items-center">
          <Clock className="mr-1" size={14} />
          {new Date(event.startDate).toLocaleDateString()}
        </p>
      )}
      {event.Registration_Status__c && (
        <p className="text-xs text-gray-500 mt-1">
          Status: {event.Registration_Status__c}
        </p>
      )}
    </div>
    <span
      className={`px-2 py-1 rounded-full text-xs ${
        event.status === 'Scheduled'
          ? 'bg-blue-100 text-blue-800'
          : event.status === 'In Progress'
          ? 'bg-green-100 text-green-800'
          : event.status === 'Completed'
          ? 'bg-gray-100 text-gray-800'
          : 'bg-purple-100 text-purple-800'
      }`}
    >
      {event.status || 'Registered'}
    </span>
  </div>
);

const NotificationItem = ({ notification, onDismiss }) => (
  <div
    className={`
      p-4 rounded-md mb-2 relative
      ${notification.type === 'info' ? 'bg-blue-50 border-blue-200' :
        notification.type === 'event' ? 'bg-purple-50 border-purple-200' :
        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
        'bg-green-50 border-green-200'}
      border
    `}
  >
    <button
      onClick={() => onDismiss(notification.id)}
      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      aria-label="Dismiss notification"
    >
      &times;
    </button>
    <p className="text-gray-800">{notification.message}</p>
    {notification.actionUrl && (
      <a
        href={notification.actionUrl}
        className="text-blue-600 hover:underline mt-2 inline-flex items-center text-sm"
      >
        View Details <ExternalLink size={14} className="ml-1" />
      </a>
    )}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const FeedbackItem = ({ feedback }) => (
  <div className="bg-white p-4 rounded-lg shadow-md mb-3">
    <div className="flex items-center mb-2">
      <p className="font-semibold text-gray-800">{feedback.eventName}</p>
      <div className="ml-auto flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < feedback.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    </div>
    <p className="text-gray-600 text-sm">{feedback.comment}</p>
    <p className="text-xs text-gray-500 mt-2">{new Date(feedback.date).toLocaleDateString()}</p>
  </div>
);

const Profile = () => {
  // const { user, token } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your subscription renews in 5 days", type: "info", actionUrl: "/billing" },
    { id: 2, message: "New event scheduled: Team Meeting", type: "event", actionUrl: "/events/123" },
  ]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('registered'); // 'registered', 'created', 'feedback'

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoadingProfile(true);
        const response = await getUserProfile();

        console.log("API Response:", response); // Debugging log

        // Validate the response structure
        if (response && response.success && response.data) {
          setProfileData(response.data);
        } else {
          throw new Error(response?.message || 'Unexpected response format');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError(error.message || 'An unexpected error occurred');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleDismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const quickActions = [
    {
      icon: Calendar,
      title: "Events",
      description: "Manage and create your events",
      onClick: () => navigate('/events'),
    },
    {
      icon: Settings,
      title: "Account Settings",
      description: "Manage your profile and preferences",
      onClick: () => navigate('/settings'),
    },
    {
      icon: CreditCard,
      title: "Billing",
      description: "View invoices and payment history",
      onClick: () => navigate('/billing'),
    },
  ];

  if (loadingProfile && !profileData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Extract user details from the profile data structure
  const userData = profileData?.userDetails || {};
  const eventsRegistered = profileData?.eventsRegistered || [];
  const eventsCreated = profileData?.eventsCreated || [];
  const feedbacks = profileData?.Feedbacks || [];

  // Transform events registered to a more usable format
  const registeredEvents = eventsRegistered.map(registration => ({
    ...registration,
    ...registration.Events__r,
    Registration_Status__c: registration.Registration_Status__c,
  }));

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">Welcome back, {userData?.Name || 'User'}!</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="text-gray-600 hover:text-blue-600 cursor-pointer" size={24} />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotificationsPanel && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-xl z-10 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    onClick={() => setShowNotificationsPanel(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-2">No new notifications</p>
                ) : (
                  notifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onDismiss={handleDismissNotification}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 md:mb-8 flex flex-col md:flex-row md:items-center">
          <div className="bg-blue-100 rounded-full p-4 mb-4 md:mb-0 md:mr-6 self-center md:self-auto">
            <User className="text-blue-600" size={48} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 text-center md:text-left">{userData?.Name}</h2>
            <p className="text-gray-600 text-center md:text-left">Email: {userData?.Email__c}</p>
            <p className="text-gray-600 text-center md:text-left">Role: {userData?.Role__c}</p>
            <p className="text-gray-600 text-center md:text-left">ID: {userData?.Id}</p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto">
            <button
              onClick={() => navigate('/settings')}
              className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 mb-6 lg:mb-0">
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Calendar className="text-blue-600 mr-3" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">My Events</h3>
                </div>
                {(userData?.Role__c === 'Admin' || userData?.Role__c === 'Organizer') && (
                  <button
                    onClick={() => navigate('/events/new')}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Plus size={18} className="mr-1" /> Add Event
                  </button>
                )}
              </div>
              <div className="flex border-b">
                <button
                  className={`py-2 px-4 ${activeTab === 'registered' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('registered')}
                >
                  Registered Events
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === 'created' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('created')}
                >
                  Created Events
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === 'feedback' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('feedback')}
                >
                  My Feedback
                </button>
              </div>
            </div>
            {activeTab === 'registered' && (
              <>
                {registeredEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">You haven't registered for any events yet</p>
                    <button
                      onClick={() => navigate('/events')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Browse Events
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registeredEvents.map(event => (
                      <EventPreview
                        key={event.Id}
                        event={event}
                        onEventClick={handleEventClick}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            {activeTab === 'created' && (
              <>
                {eventsCreated.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">You haven't created any events yet</p>
                    {(userData?.Role__c === 'Admin' || userData?.Role__c === 'Organizer') && (
                      <button
                        onClick={() => navigate('/events/new')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Create Your First Event
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventsCreated.map(event => (
                      <EventPreview
                        key={event.Id}
                        event={event}
                        onEventClick={handleEventClick}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            {activeTab === 'feedback' && (
              <>
                {feedbacks.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">You haven't provided any feedback yet</p>
                  </div>
                ) : (
                  <div>
                    {feedbacks.map(feedback => (
                      <FeedbackItem key={feedback.Id} feedback={feedback} />
                    ))}
                  </div>
                )}
              </>
            )}
            <button
              onClick={() => navigate('/profile')}
              className="mt-6 text-blue-600 hover:underline inline-flex items-center"
            >
              View All Events <ExternalLink size={14} className="ml-1" />
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Bell className="text-blue-600 mr-3" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No new notifications</p>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={handleDismissNotification}
                  />
                ))}
                <button
                  onClick={() => setNotifications([])}
                  className="text-blue-600 hover:underline text-sm mt-2"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 bg-blue-50 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
            <HelpCircle className="text-blue-600 mb-3 md:mb-0 md:mr-4 self-center" size={36} />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 text-center md:text-left">Need Help?</h3>
              <p className="text-gray-600 text-center md:text-left">Our support team is ready to assist you</p>
            </div>
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <button
              className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              onClick={() => navigate('/profile')}
            >
              View FAQ
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/profile')}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;