import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { getUserProfile, editUserProfile, createEvent } from "../utils/api.js";
import EventModal from "../components/EventModal.jsx";

// QuickActionCard Component
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

// EventPreview Component
const EventPreview = ({ event, onEventClick }) => {
  const normalizedEvent = {
    id: event.id || event.Id,
    name: event.name || event.Name,
    startDate: event.startDate || event.startDate__c,
    status: event.status || event.Status__c || "Registered",
    registrationStatus: event.Registration_Status__c,
  };
  return (
    <div
      onClick={() => onEventClick(normalizedEvent.id)}
      className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div>
        <h4 className="text-md font-semibold text-gray-800">
          {normalizedEvent.name}
        </h4>
        {normalizedEvent.startDate && (
          <p className="text-sm text-gray-600 flex items-center">
            <Clock className="mr-1" size={14} />
            {new Date(normalizedEvent.startDate).toLocaleDateString()}
          </p>
        )}
        {normalizedEvent.registrationStatus && (
          <p className="text-xs text-gray-500 mt-1">
            Status: {normalizedEvent.registrationStatus}
          </p>
        )}
      </div>
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          normalizedEvent.status === "Scheduled"
            ? "bg-blue-100 text-blue-800"
            : normalizedEvent.status === "In Progress"
            ? "bg-green-100 text-green-800"
            : normalizedEvent.status === "Completed"
            ? "bg-gray-100 text-gray-800"
            : "bg-purple-100 text-purple-800"
        }`}
      >
        {normalizedEvent.status}
      </span>
    </div>
  );
};

// NotificationItem Component (Updated with "success" type)
const NotificationItem = ({ notification, onDismiss }) => (
  <div
    className={`
      p-4 rounded-md mb-2 relative
      ${
        notification.type === "info"
          ? "bg-blue-50 border-blue-200"
          : notification.type === "event"
          ? "bg-purple-50 border-purple-200"
          : notification.type === "warning"
          ? "bg-yellow-50 border-yellow-200"
          : notification.type === "success"
          ? "bg-green-50 border-green-200" // Added success type
          : "bg-red-50 border-red-200"
      }
      border
    `}
  >
    <button
      onClick={() => onDismiss(notification.id)}
      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      aria-label={`Dismiss ${notification.type} notification`}
    >
      ×
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

// LoadingSpinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// FeedbackItem Component
const FeedbackItem = ({ feedback }) => (
  <div className="bg-white p-4 rounded-lg shadow-md mb-3">
    <div className="flex items-center mb-2">
      <p className="font-semibold text-gray-800">{feedback.eventName}</p>
      <div className="ml-auto flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < feedback.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    </div>
    <p className="text-gray-600 text-sm">{feedback.comment}</p>
    <p className="text-xs text-gray-500 mt-2">
      {new Date(feedback.date).toLocaleDateString()}
    </p>
  </div>
);

// Profile Component
const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your subscription renews in 5 days",
      type: "info",
      actionUrl: "/billing",
    },
    {
      id: 2,
      message: "New event scheduled: Team Meeting",
      type: "event",
      actionUrl: "/events/123",
    },
    {
      id: 3,
      message: "Event registration successful!",
      type: "success", // New success notification
      actionUrl: "/events/registration-success",
    },
  ]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState("");
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("registered");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoadingProfile(true);
        const response = await getUserProfile();
        if (response?.success && response.data) {
          setProfileData(response.data);
        } else {
          throw new Error(response?.message || "Unexpected response format");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setError(error.message || "An unexpected error occurred");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleDismissNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const response = await createEvent(eventData);
      setProfileData((prev) => ({
        ...prev,
        eventsCreated: [...(prev.eventsCreated || []), response.data],
      }));
      setIsEventModalOpen(false);
    } catch (error) {
      setError("Failed to create event: " + error.message);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditFormData({
        name: profileData?.userDetails?.Name || "",
        email: profileData?.userDetails?.Email__c || "",
        role: profileData?.userDetails?.Role__c || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await editUserProfile(editFormData);
      if (response.success) {
        setProfileData((prev) => ({
          ...prev,
          userDetails: {
            ...prev.userDetails,
            Name: editFormData.name,
            Email__c: editFormData.email,
            Role__c: editFormData.role,
          },
        }));
        setIsEditing(false);
      } else {
        setError("Failed to update profile");
      }
    } catch (error) {
      setError("Failed to update profile: " + error.message);
    }
  };

  const quickActions = [
    {
      icon: Calendar,
      title: "Events",
      description: "Manage and create your events",
      onClick: () => navigate("/events"),
    },
    {
      icon: Settings,
      title: "Account Settings",
      description: "Manage your profile and preferences",
      onClick: () => navigate("/settings"),
    },
    {
      icon: CreditCard,
      title: "Billing",
      description: "View invoices and payment history",
      onClick: () => navigate("/billing"),
    },
  ];

  if (loadingProfile && !profileData) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const userData = profileData?.userDetails || {};
  const eventsRegistered = profileData?.eventsRegistered || [];
  const eventsCreated = profileData?.eventsCreated || [];
  const feedbacks = profileData?.Feedbacks || [];
  const organizers = profileData?.organizers || [];
  const attendees = profileData?.attendees || [];
  const registeredEvents = eventsRegistered.map((registration) => ({
    ...registration,
    ...registration.Events__r,
    Registration_Status__c: registration.Registration_Status__c,
  }));

  const isAdmin = userData?.Role__c === "Admin";
  const isOrganizer = userData?.Role__c === "Organizer";

  const availableTabs = {
    registered: { label: "Registered Events", visible: true },
    created: { label: "Created Events", visible: isAdmin || isOrganizer },
    feedback: { label: "My Feedback", visible: isAdmin || isOrganizer },
    organizers: { label: "Organizers", visible: isAdmin },
    attendees: { label: "Attendees", visible: isAdmin },
  };

  return (
    <div className="bg-gray-50 min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {userData?.Name || "User"}!
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
              className="relative"
              aria-label="Toggle notifications panel"
            >
              <Bell className="text-gray-600 hover:text-blue-600" size={24} />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotificationsPanel && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-md shadow-xl z-10 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    onClick={() => setShowNotificationsPanel(false)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close notifications panel"
                  >
                    ×
                  </button>
                </div>
                {loadingNotifications ? (
                  <LoadingSpinner />
                ) : notifications.length === 0 ? (
                  <p className="text-gray-500 text-center py-2">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((notification) => (
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          {!isEditing ? (
            <div className="flex flex-col items-center sm:flex-row">
              <div className="bg-blue-100 rounded-full p-3 mb-4 sm:mb-0 sm:mr-6">
                <User className="text-blue-600" size={36} />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {userData?.Name}
                </h2>
                <p className="text-gray-600">Email: {userData?.Email__c}</p>
                <p className="text-gray-600 flex items-center gap-2 justify-center sm:justify-start">
                  Role:{" "}
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      userData?.Role__c === "Admin"
                        ? "bg-red-500 text-white"
                        : userData?.Role__c === "Organizer"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {userData?.Role__c === "Admin"
                      ? "Administrator"
                      : userData?.Role__c === "Organizer"
                      ? "Event Organizer"
                      : "User"}
                  </span>
                </p>
                <p className="text-gray-600">ID: {userData?.Id}</p>
              </div>
              <button
                onClick={handleEditToggle}
                className="mt-4 sm:mt-0 w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={!isAdmin}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="border-b pb-4 mb-4">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <div className="flex items-center mb-2 sm:mb-0">
                  <Calendar className="text-blue-600 mr-3" size={24} />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    My Events
                  </h3>
                </div>
                {(isAdmin || isOrganizer) && (
                  <button
                    onClick={() => setIsEventModalOpen(true)}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    <Plus size={18} className="mr-1" /> Add Event
                  </button>
                )}
              </div>
              <div className="flex flex-wrap border-b gap-2">
                {Object.entries(availableTabs).map(
                  ([key, { label, visible }]) =>
                    visible && (
                      <button
                        key={key}
                        className={`py-2 px-3 text-sm sm:text-base ${
                          activeTab === key
                            ? "border-b-2 border-blue-600 text-blue-600"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab(key)}
                      >
                        {label}
                      </button>
                    )
                )}
              </div>
            </div>
            {activeTab === "registered" && (
              <div className="space-y-4">
                {registeredEvents.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">
                      You haven't registered for any events yet
                    </p>
                    <button
                      onClick={() => navigate("/events")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Browse Events
                    </button>
                  </div>
                ) : (
                  registeredEvents.map((event) => (
                    <EventPreview
                      key={event.Id}
                      event={event}
                      onEventClick={handleEventClick}
                    />
                  ))
                )}
              </div>
            )}
            {activeTab === "created" && (isAdmin || isOrganizer) && (
              <div className="space-y-4">
                {eventsCreated.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">
                      You haven't created any events yet
                    </p>
                    <button
                      onClick={() => setIsEventModalOpen(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Create Your First Event
                    </button>
                  </div>
                ) : (
                  eventsCreated.map((event) => (
                    <EventPreview
                      key={event.Id}
                      event={event}
                      onEventClick={handleEventClick}
                    />
                  ))
                )}
              </div>
            )}
            {activeTab === "feedback" && (isAdmin || isOrganizer) && (
              <div>
                {feedbacks.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600">
                      You haven't provided any feedback yet
                    </p>
                  </div>
                ) : (
                  feedbacks.map((feedback) => (
                    <FeedbackItem key={feedback.Id} feedback={feedback} />
                  ))
                )}
              </div>
            )}
            {activeTab === "organizers" && isAdmin && (
              <div className="space-y-4">
                {organizers.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    No organizers found
                  </p>
                ) : (
                  organizers.map((org) => (
                    <div
                      key={org.Id}
                      className="bg-white p-4 rounded-lg shadow-md"
                    >
                      <p className="font-semibold">{org.Name}</p>
                      <p className="text-gray-600 text-sm">
                        Email: {org.Email__c}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
            {activeTab === "attendees" && isAdmin && (
              <div className="space-y-4">
                {attendees.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">
                    No attendees found
                  </p>
                ) : (
                  attendees.map((att) => (
                    <div
                      key={att.Id}
                      className="bg-white p-4 rounded-lg shadow-md"
                    >
                      <p className="font-semibold">{att.Name}</p>
                      <p className="text-gray-600 text-sm">
                        Email: {att.Email__c}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
            <button
              onClick={() => navigate("/events")}
              className="mt-6 text-blue-600 hover:underline inline-flex items-center"
            >
              View All Events <ExternalLink size={14} className="ml-1" />
            </button>
          </div>

          {/* Notifications Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex items-center mb-4">
              <Bell className="text-blue-600 mr-3" size={24} />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Notifications
              </h3>
            </div>
            {loadingNotifications ? (
              <LoadingSpinner />
            ) : notifications.length === 0 ? (
              <p className="text-gray-600 text-center py-4">
                No new notifications
              </p>
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

        {/* Support Section */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center mb-4 md:mb-0">
            <HelpCircle
              className="text-blue-600 mb-3 md:mb-0 md:mr-4 self-center"
              size={36}
            />
            <div className="text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Need Help?
              </h3>
              <p className="text-gray-600">
                Our support team is ready to assist you
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center md:justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
              onClick={() => navigate("/faq")}
            >
              View FAQ
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => navigate("/support")}
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Event Modal */}
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSubmit={handleCreateEvent}
          loading={false}
        />
      </div>
    </div>
  );
};

export default Profile;