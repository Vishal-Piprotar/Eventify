import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, X } from 'lucide-react';
import {
  getEventById,
  registerAttendee,
  cancelAttendeeRegistration,
} from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DUMMY_IMAGE_URL =
  'https://cdn.prod.website-files.com/66e5292bfdb35c76b373b99c/66e5292bfdb35c76b373bb1a_img_sundays_0002.webp';

// Skeleton Component
const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div
    className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${width} ${height} ${className}`}
  />
);

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attendeeId, setAttendeeId] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getEventById(id);
        setEvent(res.data);

        const local = JSON.parse(localStorage.getItem('registeredEvents') || '{}');
        if (local[id] && local[id].email === user?.email) {
          setMessage(`You're already registered with ${local[id].email}`);
          setAttendeeId(local[id].attendeeId);
          setIsRegistered(true);
        }
      } catch (err) {
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setFormData({ name: user.name || '', email: user.email || '' });
    }

    fetchDetails();
  }, [id, user]);

  const handleRegister = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill out all fields');
      return;
    }

    if (isRegistered) {
      setMessage(`You're already registered with ${formData.email}`);
      return;
    }

    try {
      const res = await registerAttendee({
        name: formData.name,
        email: formData.email,
        eventId: id,
      });

      const attendeeId = res.data?.id;
      const local = JSON.parse(localStorage.getItem('registeredEvents') || '{}');
      local[id] = { email: formData.email, attendeeId };
      localStorage.setItem('registeredEvents', JSON.stringify(local));

      setMessage(`You're now registered with ${formData.email}`);
      setAttendeeId(attendeeId);
      setIsRegistered(true);
    } catch (err) {
      setMessage(err?.message || 'Registration failed');
    }
  };

  const handleCancel = async () => {
    try {
      if (!attendeeId) {
        setMessage('No attendee ID found');
        return;
      }

      await cancelAttendeeRegistration(attendeeId);

      const local = JSON.parse(localStorage.getItem('registeredEvents') || '{}');
      delete local[id];
      localStorage.setItem('registeredEvents', JSON.stringify(local));

      setMessage('Registration cancelled successfully');
      setIsRegistered(false);
      setAttendeeId('');
    } catch (err) {
      setMessage(err?.message || 'Cancellation failed');
    }
  };

  const handleShare = async () => {
    if (!event) return;

    const shareData = {
      title: event.name,
      text: `${event.description.slice(0, 100)}... Join me at ${event.location} on ${new Date(
        event.startDate
      ).toLocaleDateString()}!`,
      url: window.location.href || `https://example.com/events/${id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setMessage('Event shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          setMessage('Failed to share event.');
        }
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleFallbackShare = (platform) => {
    const shareData = {
      title: event.name,
      text: `${event.description.slice(0, 100)}... Join me at ${event.location} on ${new Date(
        event.startDate
      ).toLocaleDateString()}!`,
      url: window.location.href || `https://example.com/events/${id}`,
    };

    let shareUrl;
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        )}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareData.url
        )}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `${shareData.title} ${shareData.text}`
        )}&url=${encodeURIComponent(shareData.url)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(
          shareData.title
        )}&body=${encodeURIComponent(`${shareData.text}\n${shareData.url}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        setMessage('Link copied to clipboard!');
        setShowShareModal(false);
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
    setShowShareModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Back Button Skeleton */}
          <div className="flex items-center mb-4">
            <Skeleton width="w-20" height="h-6" />
          </div>
          {/* Image Skeleton */}
          <Skeleton height="h-64" className="rounded-lg mb-4" />
          {/* Title and Share Button Skeleton */}
          <div className="flex justify-between items-center mb-2">
            <Skeleton width="w-3/4" height="h-8" />
            <Skeleton width="w-10" height="h-10" className="rounded-full" />
          </div>
          {/* Description Skeleton */}
          <Skeleton height="h-16" className="mb-6" />
          {/* Details Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <Skeleton width="w-5" height="h-5" className="mr-2 rounded-full" />
              <Skeleton width="w-32" height="h-4" />
            </div>
            <div className="flex items-center">
              <Skeleton width="w-5" height="h-5" className="mr-2 rounded-full" />
              <Skeleton width="w-40" height="h-4" />
            </div>
            <div className="flex items-center">
              <Skeleton width="w-5" height="h-5" className="mr-2 rounded-full" />
              <Skeleton width="w-28" height="h-4" />
            </div>
            <div className="flex items-center">
              <Skeleton width="w-5" height="h-5" className="mr-2 rounded-full" />
              <Skeleton width="w-36" height="h-4" />
            </div>
          </div>
          {/* Registration Form Skeleton */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
            <Skeleton width="w-1/3" height="h-6" className="mb-4" />
            <Skeleton height="h-10" className="mb-4" />
            <Skeleton height="h-10" className="mb-4" />
            <div className="flex gap-4">
              <Skeleton width="w-32" height="h-10" />
              <Skeleton width="w-32" height="h-10" />
            </div>
          </div>
          {/* Similar Events Skeleton */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <Skeleton width="w-1/3" height="h-6" className="mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-start space-x-3">
                  <Skeleton
                    width="w-16"
                    height="h-16"
                    className="rounded-lg flex-shrink-0"
                  />
                  <div className="space-y-2">
                    <Skeleton width="w-32" height="h-4" />
                    <Skeleton width="w-24" height="h-3" />
                  </div>
                </div>
              ))}
              <Skeleton width="w-28" height="h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 dark:text-blue-400 mt-4"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-gray-600 dark:text-gray-400">Event not found</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 dark:text-blue-400 mt-4"
          >
            <ArrowLeft size={18} className="mr-2" /> Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 mb-4"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>

        <img
          src={event.imageUrl || DUMMY_IMAGE_URL}
          alt={event.name}
          className="rounded-lg w-full h-64 object-cover mb-4"
          onError={(e) => {
            e.target.src = DUMMY_IMAGE_URL;
          }}
        />

        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {event.name}
          </h1>
          <button
            onClick={handleShare}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            aria-label="Share event"
          >
            <Share2 size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{event.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Calendar size={20} className="mr-2" />
            <span>{new Date(event.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Clock size={20} className="mr-2" />
            <span>
              {new Date(event.startDate).toLocaleTimeString()} -{' '}
              {new Date(event.endDate).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <MapPin size={20} className="mr-2" />
            <span>{event.location || 'TBD'}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Users size={20} className="mr-2" />
            <span>Attendee Info Available After Registration</span>
          </div>
        </div>

        {message && (
          <p className="text-green-600 dark:text-green-400 font-medium mb-4">
            {message}
          </p>
        )}

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
            Register for this event
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Your Name"
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Your Email"
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <div className="flex gap-4">
              <button
                onClick={handleRegister}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Register Now
              </button>
              {isRegistered && user?.email === formData.email && (
                <button
                  onClick={handleCancel}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Cancel Registration
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Similar Events Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
            Similar Events
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-start space-x-3">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0"></div>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                    Similar Event {num}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    April {num + 10}, 2025
                  </p>
                </div>
              </div>
            ))}
            <button className="text-blue-600 dark:text-blue-400 text-sm hover:text-blue-800 dark:hover:text-blue-300">
              View more events
            </button>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Share Event
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-600 dark:text-gray-300"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleFallbackShare('whatsapp')}
                  className="flex flex-col items-center text-gray-800 dark:text-gray-200"
                  aria-label="Share on WhatsApp"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                    className="w-8 h-8 mb-1"
                  />
                  WhatsApp
                </button>
                <button
                  onClick={() => handleFallbackShare('facebook')}
                  className="flex flex-col items-center text-gray-800 dark:text-gray-200"
                  aria-label="Share on Facebook"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                    alt="Facebook"
                    className="w-8 h-8 mb-1"
                  />
                  Facebook
                </button>
                <button
                  onClick={() => handleFallbackShare('twitter')}
                  className="flex flex-col items-center text-gray-800 dark:text-gray-200"
                  aria-label="Share on Twitter"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg"
                    alt="Twitter"
                    className="w-8 h-8 mb-1"
                  />
                  Twitter
                </button>
                <button
                  onClick={() => handleFallbackShare('email')}
                  className="flex flex-col items-center text-gray-800 dark:text-gray-200"
                  aria-label="Share via Email"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg"
                    alt="Email"
                    className="w-8 h-8 mb-1"
                  />
                  Email
                </button>
                <button
                  onClick={() => handleFallbackShare('copy')}
                  className="flex flex-col items-center text-gray-800 dark:text-gray-200"
                  aria-label="Copy link"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Copyleft.svg"
                    alt="Copy"
                    className="w-8 h-8 mb-1"
                  />
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;