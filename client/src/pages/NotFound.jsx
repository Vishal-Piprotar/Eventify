import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar,
  ArrowRight, 
  Search,
  Home,
  AlertTriangle
} from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleBrowseEvents = () => {
    navigate('/events');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <AlertTriangle className="mx-auto mb-6" size={48} />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            404
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Oops! The event you're looking for doesn't exist.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-8 -mt-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <Calendar className="mx-auto text-blue-600 mb-6" size={40} />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The event you're looking for may have ended or doesn't exist in our calendar. Let's get you back on track to find amazing events!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <Home className="mr-2" size={20} />
              Go to Homepage
            </button>
            <button
              onClick={handleBrowseEvents}
              className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <Search className="mr-2" size={20} />
              Browse Events
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Suggestions Section */}
      <section className="py-8 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Looking for something specific?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <h4 className="font-semibold text-gray-800 mb-2">Upcoming Events</h4>
              <p className="text-gray-600 text-sm">Check out our latest virtual events and webinars</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <h4 className="font-semibold text-gray-800 mb-2">Help Center</h4>
              <p className="text-gray-600 text-sm">Find answers to common questions about Eventify</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
              <h4 className="font-semibold text-gray-800 mb-2">Contact Support</h4>
              <p className="text-gray-600 text-sm">Reach out to our team for personalized assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 bg-gray-800 text-white mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>© {new Date().getFullYear()} Eventify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;