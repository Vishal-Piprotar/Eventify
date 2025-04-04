import { useState, useEffect } from "react";
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Info, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import { useTheme } from '../context/ThemeContext'; // Assuming ThemeContext exists

const EventModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const { theme } = useTheme(); // Hook to get current theme
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "Scheduled",
    capacity: "",
    location: "Virtual",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate || !formData.endDate) {
      setError("Please fill in all required fields");
      return;
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("End date must be after start date");
      return;
    }
    onSubmit(formData);
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4 transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Create New Event"
    >
      <div
        className={`rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto transition-all duration-300 animate-fade-in ${
          theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'
        }`}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-inherit">
          <h2 className="text-xl sm:text-2xl font-semibold">
            Create New Event
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div
              className={`p-4 rounded-md mb-4 flex items-start ${
                theme === 'dark'
                  ? 'bg-red-900/20 text-red-400 border border-red-700'
                  : 'bg-red-50 text-red-600 border border-red-200'
              }`}
            >
              <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Event Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar size={18} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  required
                  className={`block w-full rounded-md border shadow-sm py-3 pl-10 pr-4 placeholder-gray-400 focus:ring focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Clock size={18} />
                  </div>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className={`block w-full rounded-md border shadow-sm pl-10 py-3 focus:ring focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Clock size={18} />
                  </div>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className={`block w-full rounded-md border shadow-sm pl-10 py-3 focus:ring focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Description
              </label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Info size={18} />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter event details"
                  rows={4}
                  className={`block w-full rounded-md border shadow-sm pl-10 py-3 focus:ring focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Location
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`block w-full rounded-md border shadow-sm pl-10 py-3 focus:ring focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 appearance-none ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value="Virtual">Virtual</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Capacity
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Users size={18} />
                  </div>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Max attendees"
                    min="1"
                    className={`block w-full rounded-md border shadow-sm pl-10 py-3 focus:ring focus:ring-opacity-50 focus:ring-blue-500 focus:border-blue-500 ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-gray-100'
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 rounded-md border transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-md text-white flex items-center justify-center min-w-[140px] transition-colors ${
                  theme === 'dark'
                    ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400'
                    : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6 mr-3 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;