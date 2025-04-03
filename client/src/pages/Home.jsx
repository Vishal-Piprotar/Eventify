/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Shield, 
  Zap, 
  ArrowRight,
  Users,
  Star,
  Video 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Add this import

// FeatureCard for authenticated users with theme support
const AuthFeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
    <div className="flex items-center mb-4">
      <Icon className="text-blue-600 dark:text-blue-400 mr-3" size={28} />
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

// FeatureCard for unauthenticated users (original)
const UnauthFeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1">
    <div className="flex items-center mb-4">
      <Icon className="text-blue-600 mr-3" size={28} />
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

// TestimonialCard for authenticated users with theme support
const AuthTestimonialCard = ({ quote, author, role }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <Star className="text-yellow-400 dark:text-yellow-300 mb-4" size={24} />
    <p className="text-gray-600 dark:text-gray-400 italic mb-4">"{quote}"</p>
    <div className="flex items-center">
      <Users className="text-blue-600 dark:text-blue-400 mr-3" size={20} />
      <div>
        <p className="text-gray-800 dark:text-gray-100 font-semibold">{author}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

// TestimonialCard for unauthenticated users (original)
const UnauthTestimonialCard = ({ quote, author, role }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <Star className="text-yellow-400 mb-4" size={24} />
    <p className="text-gray-600 italic mb-4">"{quote}"</p>
    <div className="flex items-center">
      <Users className="text-blue-600 mr-3" size={20} />
      <div>
        <p className="text-gray-800 font-semibold">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const { theme } = useTheme(); 
  const navigate = useNavigate();

  const features = [
    {
      icon: Rocket,
      title: "Seamless Virtual Events",
      description: "Host engaging webinars and conferences with integrated Zoom and YouTube Live.",
    },
    {
      icon: Shield,
      title: "Secure Attendee Management",
      description: "Protect your data with HTTPS encryption and customizable permissions.",
    },
    {
      icon: Zap,
      title: "Enhanced Networking",
      description: "Boost engagement with tag-based matchmaking and QR code networking.",
    },
  ];

  const testimonials = [
    {
      quote: "Eventify made our virtual conference a breeze with its user-friendly tools!",
      author: "Sarah Johnson",
      role: "Event Organizer",
    },
    {
      quote: "The networking features tripled our attendee interactions.",
      author: "Mike Lee",
      role: "Marketing Director",
    },
  ];

  const handleGetStarted = () => {
    navigate('/events');
  };

  // Use different components based on authentication status
  const FeatureCard = isAuthenticated ? AuthFeatureCard : UnauthFeatureCard;
  const TestimonialCard = isAuthenticated ? AuthTestimonialCard : UnauthTestimonialCard;

  return (
    <div className={isAuthenticated ? 'bg-gray-50 dark:bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'}>
      {/* Hero Section */}
      <section className={isAuthenticated 
        ? 'pt-20 pb-28 px-8 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 text-white' 
        : 'pt-20 pb-28 px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white'}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in flex items-center justify-center">
            {/* <Video className="mr-3" size={48} /> */}
            Eventify: Your Virtual Event Solution
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Create, manage, and engage with unforgettable virtual events—all in one platform.
          </p>
          <button
            onClick={handleGetStarted}
            className={isAuthenticated 
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-100 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-blue-600 dark:focus:ring-offset-blue-900' 
              : 'bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-100 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600'}
          >
            Explore Events
            <ArrowRight className="inline ml-2" size={20} />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className={isAuthenticated ? 'py-16 px-8 bg-gray-50 dark:bg-gray-900' : 'py-16 px-8'}>
        <div className="max-w-6xl mx-auto">
          <h2 className={isAuthenticated ? 'text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12' : 'text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12'}>
            Why Choose Eventify?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={isAuthenticated ? 'py-16 px-8 bg-gray-100 dark:bg-gray-800' : 'py-16 px-8 bg-gray-100'}>
        <div className="max-w-6xl mx-auto">
          <h2 className={isAuthenticated ? 'text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-12' : 'text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12'}>
            Hear From Our Users
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-8">
        <div className={isAuthenticated ? 'max-w-4xl mx-auto text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-8' : 'max-w-4xl mx-auto text-center bg-blue-50 rounded-lg p-8'}>
          <h2 className={isAuthenticated ? 'text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4' : 'text-3xl font-bold text-gray-900 mb-4'}>
            Ready to Host Your Next Virtual Event?
          </h2>
          <p className={isAuthenticated ? 'text-gray-600 dark:text-gray-400 mb-6' : 'text-gray-600 mb-6'}>
            Join event organizers worldwide who trust Eventify for seamless virtual experiences.
          </p>
          <button
            onClick={handleGetStarted}
            className={isAuthenticated 
              ? 'bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2' 
              : 'bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}
          >
            {user ? 'Visit Profile' : 'Request a Demo'}
            <ArrowRight className="inline ml-2" size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className={isAuthenticated ? 'py-8 px-8 bg-gray-800 dark:bg-gray-900 text-white' : 'py-8 px-8 bg-gray-800 text-white'}>
        <div className="max-w-6xl mx-auto text-center">
          <p>© {new Date().getFullYear()} Eventify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;