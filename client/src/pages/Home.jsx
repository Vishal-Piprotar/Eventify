import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Shield, 
  Zap, 
  ArrowRight,
  Users,
  Star,
  Video,
  Calendar,
  ArrowDown,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Enhanced FeatureCard with hover effects and animations
const AuthFeatureCard = ({ icon: Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-blue-50 dark:bg-blue-900/20 transform scale-0 rounded-xl transition-transform duration-300 ${isHovered ? 'scale-100' : ''}`}></div>
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-4">
            <Icon className={`text-blue-600 dark:text-blue-400 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} size={28} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
        <div className={`mt-4 text-blue-600 dark:text-blue-400 font-medium flex items-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <span>Learn more</span>
          <ArrowRight className="ml-2" size={16} />
        </div>
      </div>
    </div>
  );
};

const UnauthFeatureCard = ({ icon: Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-blue-50 transform scale-0 rounded-xl transition-transform duration-300 ${isHovered ? 'scale-100' : ''}`}></div>
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <Icon className={`text-blue-600 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`} size={28} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
        <div className={`mt-4 text-blue-600 font-medium flex items-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <span>Learn more</span>
          <ArrowRight className="ml-2" size={16} />
        </div>
      </div>
    </div>
  );
};

// Enhanced Testimonial Cards with animation
const AuthTestimonialCard = ({ quote, author, role, avatar }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt={author} className="w-12 h-12 rounded-full" />
            ) : (
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="text-yellow-400 dark:text-yellow-300" size={20} fill="currentColor" />
          ))}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 italic mb-6 text-lg">"{quote}"</p>
      <div>
        <p className="text-gray-800 dark:text-gray-100 font-semibold">{author}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{role}</p>
      </div>
    </div>
  );
};

const UnauthTestimonialCard = ({ quote, author, role, avatar }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500">
      <div className="flex justify-between items-start mb-6">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            {avatar ? (
              <img src={avatar} alt={author} className="w-12 h-12 rounded-full" />
            ) : (
              <Users className="text-blue-600" size={24} />
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="text-yellow-400" size={20} fill="currentColor" />
          ))}
        </div>
      </div>
      <p className="text-gray-600 italic mb-6 text-lg">"{quote}"</p>
      <div>
        <p className="text-gray-800 font-semibold">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </div>
  );
};

// Stats Counter Component
const StatsCounter = ({ value, label, icon: Icon, isAuthenticated }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const frameRate = 20;
    const frames = duration / frameRate;
    const increment = value / frames;
    let currentCount = 0;
    
    const updateCount = () => {
      currentCount += increment;
      if (currentCount < value) {
        setCount(Math.floor(currentCount));
        requestAnimationFrame(updateCount);
      } else {
        setCount(value);
      }
    };
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          updateCount();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const element = document.getElementById(`stat-${label}`);
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, [value, label]);
  
  return (
    <div id={`stat-${label}`} className={`p-6 rounded-xl shadow-md text-center ${isAuthenticated ? 'bg-white dark:bg-gray-800' : 'bg-white'}`}>
      <div className="inline-flex p-4 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
        <Icon className={`text-blue-600 dark:text-blue-400`} size={28} />
      </div>
      <h3 className={`text-4xl font-bold mb-2 ${isAuthenticated ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900'}`}>
        {count.toLocaleString()}+
      </h3>
      <p className={`text-gray-600 ${isAuthenticated ? 'dark:text-gray-400' : ''}`}>{label}</p>
    </div>
  );
};

// FAQ Accordion Component
const FAQItem = ({ question, answer, isAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`border-b py-4 ${isAuthenticated ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200'}`}>
      <button 
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className={`text-lg font-semibold ${isAuthenticated ? 'text-gray-800 dark:text-gray-200' : 'text-gray-800'}`}>
          {question}
        </h3>
        <ArrowDown 
          className={`text-blue-600 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''} ${isAuthenticated ? 'dark:text-blue-400' : ''}`} 
          size={20} 
        />
      </button>
      <div className={`mt-2 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className={`text-gray-600 pb-2 ${isAuthenticated ? 'dark:text-gray-400' : ''}`}>
          {answer}
        </p>
      </div>
    </div>
  );
};

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Rocket,
      title: "Seamless Virtual Events",
      description: "Host engaging webinars and conferences with integrated Zoom and YouTube Live streaming capabilities.",
    },
    {
      icon: Shield,
      title: "Secure Attendee Management",
      description: "Protect your data with enterprise-grade security, HTTPS encryption and customizable user permissions.",
    },
    {
      icon: Zap,
      title: "Enhanced Networking",
      description: "Boost engagement with AI-powered matchmaking, interactive breakout rooms, and QR code networking.",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Coordinate across time zones with intelligent scheduling tools and automated reminders.",
    },
    {
      icon: Video,
      title: "Hybrid Event Support",
      description: "Seamlessly blend in-person and virtual experiences with our hybrid event solutions.",
    },
    {
      icon: Users,
      title: "Community Building",
      description: "Create lasting connections with persistent chat rooms and community forums.",
    }
  ];

  const testimonials = [
    {
      quote: "Eventify transformed how we approach virtual conferences. The platform's intuitive design and powerful networking features created engagement levels we'd never seen before!",
      author: "Sarah Johnson",
      role: "Event Director, TechSummit",
      avatar: null,
    },
    {
      quote: "The networking features tripled our attendee interactions and generated 40% more leads than our previous in-person events.",
      author: "Mike Lee",
      role: "Marketing Director, Innovation Corp",
      avatar: null,
    },
    {
      quote: "After switching to Eventify, our post-event surveys showed 92% satisfaction—a 30% improvement over our previous virtual event platform.",
      author: "Emma Rodriguez",
      role: "Customer Experience Manager, EduTech",
      avatar: null,
    },
  ];
  
  const stats = [
    { value: 10000, label: "Events Hosted", icon: Calendar },
    { value: 500000, label: "Attendees Connected", icon: Users },
    { value: 98, label: "Satisfaction Rate", icon: Star },
  ];
  
  const faqs = [
    {
      question: "How does Eventify handle international attendees?",
      answer: "Eventify provides automatic time zone detection, multi-language support, and region-specific payment options to ensure a seamless experience for attendees from anywhere in the world."
    },
    {
      question: "Can I customize the branding for my events?",
      answer: "Absolutely! Eventify offers full white-labeling capabilities, allowing you to customize colors, logos, email templates, and landing pages to match your brand identity."
    },
    {
      question: "What types of events work best on Eventify?",
      answer: "Eventify excels with conferences, webinars, workshops, training sessions, product launches, and networking events. Our platform is highly adaptable to various event formats and sizes."
    },
    {
      question: "How does the networking feature work?",
      answer: "Our AI-powered networking system matches attendees based on interests, goals, and industry. Attendees can also use our virtual business card exchange via QR codes and schedule 1:1 video meetings."
    },
  ];

  const handleGetStarted = () => {
    navigate('/events');
  };

  const FeatureCard = isAuthenticated ? AuthFeatureCard : UnauthFeatureCard;
  const TestimonialCard = isAuthenticated ? AuthTestimonialCard : UnauthTestimonialCard;

  return (
    <div className={`min-h-screen ${isAuthenticated ? 'bg-gray-50 dark:bg-gray-900' : 'bg-gray-50'}`}>
     

      {/* Hero Section */}
      <section className={`pt-24 pb-32 px-8 overflow-hidden ${isAuthenticated ? 'bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-700 dark:to-indigo-900 text-white' : 'bg-gradient-to-br from-blue-600 to-indigo-800 text-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className={`grid md:grid-cols-2 gap-12 items-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
                Reimagine Your Virtual Events
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 dark:text-blue-200">
                Create, manage, and deliver exceptional virtual experiences that engage and inspire your audience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetStarted}
                  className={`px-8 py-3 rounded-lg font-semibold text-lg shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 ${isAuthenticated ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 focus:ring-white dark:focus:ring-gray-300 focus:ring-offset-blue-600 dark:focus:ring-offset-blue-900' : 'bg-white text-blue-600 hover:bg-blue-50 focus:ring-white focus:ring-offset-blue-600'}`}
                >
                  Explore Events
                  <ArrowRight className="inline ml-2" size={20} />
                </button>
                <button
                  className={`px-8 py-3 rounded-lg font-semibold text-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 ${isAuthenticated ? 'border-white dark:border-blue-300 text-white hover:bg-white/10 dark:hover:bg-blue-800/30 focus:ring-white' : 'border-white text-white hover:bg-white/10 focus:ring-white focus:ring-offset-blue-600'}`}
                >
                  Watch Demo
                  <Video className="inline ml-2" size={20} />
                </button>
              </div>
              <div className="flex items-center mt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                  ))}
                </div>
                <p className="ml-4 text-sm text-blue-100">
                  Joined by <strong>10,000+</strong> event organizers
                </p>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-transparent z-10"></div>
              <div className="relative z-0 bg-white dark:bg-gray-800 p-2 rounded-lg transform rotate-2 shadow-2xl">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-blue-600 dark:text-blue-400 font-semibold">TechConnect 2025</h3>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">Live Now</span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="w-1/2 h-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    <div className="w-1/2 h-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Users className="mr-1 text-gray-500 dark:text-gray-400" size={16} />
                      <span className="text-xs text-gray-500 dark:text-gray-400">1,245 attendees</span>
                    </div>
                    <button className="bg-blue-500 dark:bg-blue-600 text-white text-xs px-3 py-1 rounded">Join</button>
                  </div>
                </div>
              </div>
              <div className="absolute right-12 bottom-24 transform -rotate-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-20">
                <div className="flex items-center gap-2">
                  <Check className="text-green-500" size={16} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Registration complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className={`py-8 px-8 border-b ${isAuthenticated ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto">
          <p className={`text-center text-sm font-medium uppercase tracking-wider ${isAuthenticated ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500'} mb-6`}>
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-70">
            {["TechCorp", "Global Events", "EduSummit", "MediaPro", "InnovateX"].map((company) => (
              <div key={company} className={`text-xl font-bold ${isAuthenticated ? 'text-gray-400 dark:text-gray-500' : 'text-gray-400'}`}>
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 px-8 ${isAuthenticated ? 'bg-gray-50 dark:bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 ${isAuthenticated ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900'}`}>
            Powering Events Worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {stats.map((stat) => (
              <StatsCounter 
                key={stat.label} 
                value={stat.value} 
                label={stat.label} 
                icon={stat.icon}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 px-8 ${isAuthenticated ? 'bg-white dark:bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isAuthenticated ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900'}`}>
              Why Event Organizers Choose Eventify
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isAuthenticated ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600'}`}>
              Everything you need to create memorable virtual events that drive engagement and deliver results.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-20 px-8 ${isAuthenticated ? 'bg-gray-50 dark:bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isAuthenticated ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900'}`}>
              Hear From Our Event Organizers
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${isAuthenticated ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600'}`}>
              Join thousands of successful event planners who've transformed their virtual experiences.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className={`py-20 px-8 ${isAuthenticated ? 'bg-white dark:bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-16 ${isAuthenticated ? 'text-gray-900 dark:text-gray-100' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={`py-24 px-8 ${isAuthenticated ? 'bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-700 dark:to-indigo-900 text-white' : 'bg-gradient-to-br from-blue-600 to-indigo-800 text-white'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Transform Your Virtual Events?
          </h2>
          <p className="text-xl mb-10 text-blue-100 dark:text-blue-200 max-w-2xl mx-auto">
            Join thousands of event organizers who trust Eventify to deliver exceptional virtual experiences that engage and inspire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className={`px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 ${isAuthenticated ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 focus:ring-white dark:focus:ring-gray-300 focus:ring-offset-blue-600 dark:focus:ring-offset-blue-900' : 'bg-white text-blue-600 hover:bg-blue-50 focus:ring-white focus:ring-offset-blue-600'}`}
            >
              {user ? 'Visit Dashboard' : 'Start Free Trial'}
              <ArrowRight className="inline ml-2" size={20} />
            </button>
            <button
              className={`px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 ${isAuthenticated ? 'border-white dark:border-blue-300 text-white hover:bg-white/10 dark:hover:bg-blue-800/30 focus:ring-white' : 'border-white text-white hover:bg-white/10 focus:ring-white focus:ring-offset-blue-600'}`}
            >
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-8 ${isAuthenticated ? 'bg-gray-800 dark:bg-gray-900 text-white' : 'bg-gray-800 text-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Eventify</h3>
              <p className={`text-gray-400 ${isAuthenticated ? 'dark:text-gray-300' : ''}`}>
                Creating exceptional virtual event experiences that connect people worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className={`space-y-2 text-gray-400 ${isAuthenticated ? 'dark:text-gray-300' : ''}`}>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className={`space-y-2 text-gray-400 ${isAuthenticated ? 'dark:text-gray-300' : ''}`}>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Webinars</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className={`space-y-2 text-gray-400 ${isAuthenticated ? 'dark:text-gray-300' : ''}`}>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 dark:border-gray-600 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-80">© {new Date().getFullYear()} Eventify. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className={`text-gray-400 hover:text-white transition-colors ${isAuthenticated ? 'dark:text-gray-300' : ''}`}>Terms</a>
              <a href="#" className={`text-gray-400 hover:text-white transition-colors ${isAuthenticated ? 'dark:text-gray-300' : ''}`}>Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;