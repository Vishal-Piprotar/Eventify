import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you have an auth context
import { 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { fetchMyEvents } from "../utils/api"; // Import the new API function

const MyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMyEvents = async () => {
      try {
        const response = await fetchMyEvents(); // Use the imported API function
        setEvents(response.data.events);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to load events');
        setLoading(false);
      }
    };

    if (user && (user.role === 'Organizer' || user.role === 'Admin')) {
      getMyEvents();
    }
  }, [user]);

  if (!user || (user.role !== 'Organizer' && user.role !== 'Admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 flex items-center gap-2">
          <AlertCircle size={24} />
          <span>You don't have permission to view this page.</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-600 flex items-center gap-2">
          <AlertCircle size={24} />
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Events</h1>
      
      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <FileText className="mx-auto mb-4" size={48} />
          <p>You haven't created any events yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div 
              key={event.id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{event.name}</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <span 
                    className={`px-2 py-1 rounded text-sm ${
                      event.status === 'Scheduled' 
                        ? 'bg-blue-100 text-blue-800' 
                        : event.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span>
                    {new Date(event.startDate).toLocaleDateString()} - 
                    {new Date(event.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={18} />
                  <span>{event.capacity || 'Unlimited'} Capacity</span>
                </div>

                {event.description && (
                  <p className="text-gray-600 mt-2">{event.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;