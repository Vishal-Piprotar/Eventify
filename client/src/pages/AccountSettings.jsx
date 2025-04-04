/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Key, 
  Bell, 
  Moon, 
  Sun, 
  Trash2, 
  Globe, 
  Shield, 
  Save,
  ChevronRight,
  ArrowLeft,
  Check,
  AlertCircle,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserProfile, editUserProfile, changePassword, deleteUserAccount } from '../utils/api.js';
import { useTheme } from '../context/ThemeContext';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { updateUser, logout, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('menu'); // Start with menu on mobile
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    id: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ type: '', message: '', section: '' });
  const [deleteError, setDeleteError] = useState('');

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: '', message: '', section: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        if (response?.success && response.data) {
          const userDetails = response.data.userDetails || {};
          const [firstName = '', lastName = ''] = (userDetails.Name || '').split(' ');
          setFormData({
            firstName,
            lastName,
            email: userDetails.Email__c || '',
            phone: userDetails.Phone__c || '',
            id: userDetails.Id || '',
          });
        } else {
          throw new Error(response?.message || 'Failed to fetch profile data');
        }
      } catch (err) {
        setNotification({ 
          type: 'error', 
          message: err.message || 'An error occurred while fetching your profile', 
          section: 'general' 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // Detect screen size on mount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // If we're on desktop and showing the menu, automatically show general
        if (activeTab === 'menu') {
          setActiveTab('general');
        }
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '', section: '' });
    try {
      const apiData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone || null,
      };
      const response = await editUserProfile(apiData);
      if (response.success) {
        updateUser({
          id: formData.id,
          name: apiData.name,
          email: formData.email,
          phone: formData.phone,
        });
        setNotification({ 
          type: 'success', 
          message: 'Profile updated successfully!', 
          section: 'general' 
        });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setNotification({ 
        type: 'error', 
        message: err.message || 'An error occurred while updating your profile', 
        section: 'general' 
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '', section: '' });
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setNotification({ 
        type: 'error', 
        message: 'All fields are required', 
        section: 'password' 
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({ 
        type: 'error', 
        message: 'New password and confirmation do not match', 
        section: 'password' 
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setNotification({ 
        type: 'error', 
        message: 'New password must be at least 6 characters long', 
        section: 'password' 
      });
      return;
    }
    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.success) {
        setNotification({ 
          type: 'success', 
          message: response.message || 'Password updated successfully!', 
          section: 'password' 
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        throw new Error(response.error || 'Failed to update password');
      }
    } catch (err) {
      setNotification({ 
        type: 'error', 
        message: err.message || 'An error occurred while updating your password', 
        section: 'password' 
      });
    }
  };

  const handleUpdateNotifications = (e) => {
    e.preventDefault();
    setNotification({ 
      type: 'success', 
      message: 'Notification preferences saved successfully!', 
      section: 'notifications' 
    });
  };




  const handlePaste = (e) => {
    e.preventDefault();
    setDeleteError('Please type "DELETE" manually instead of pasting');
    return false;
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    const confirmInput = document.getElementById('deleteConfirm').value;
    if (confirmInput !== "DELETE") {
      setDeleteError("Please type 'DELETE' exactly as shown to confirm.");
      return;
    }
    try {
      const forceDelete = user?.role === 'admin';
      const res = await deleteUserAccount({ force: forceDelete });
      if (res.success) {
        alert(res.message || "Account deleted successfully.");
        logout();
        navigate("/");
      } else {
        throw new Error(res.message || "Failed to delete account due to attendee association.");
      }
    } catch (err) {
      setDeleteError(err.message || "Your attempt to delete this account could not be completed because it is associated with attendee records. Admins can force deletion.");
    }
  };

  // Notification component
  const NotificationMessage = ({ type, message, onClose }) => {
    if (!message) return null;
    
    return (
      <div className={`flex items-center justify-between mb-4 p-3 rounded-md ${
        type === 'success' 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-400' 
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400'
      }`}>
        <div className="flex items-center">
          {type === 'success' ? (
            <Check size={16} className="mr-2 text-green-500 dark:text-green-400" />
          ) : (
            <AlertCircle size={16} className="mr-2 text-red-500 dark:text-red-400" />
          )}
          <span className="text-sm">{message}</span>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  const menuItems = [
    { id: 'general', icon: User, label: 'General' },
    { id: 'password', icon: Key, label: 'Password' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'appearance', icon: theme === 'light' ? Sun : Moon, label: 'Appearance' },
    { id: 'privacy', icon: Shield, label: 'Privacy & Security' },
    { id: 'language', icon: Globe, label: 'Language' },
    { id: 'danger', icon: Trash2, label: 'Delete Account', isDanger: true },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">General Information</h3>
            {notification.section === 'general' && (
              <NotificationMessage 
                type={notification.type} 
                message={notification.message} 
                onClose={() => setNotification({ type: '', message: '', section: '' })}
              />
            )}
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <form onSubmit={handleUpdateDetails} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
                  <div className="flex items-center mt-2">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 border">
                      <User size={24} />
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        type="button"
                        className="bg-white dark:bg-gray-700 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        className="bg-white dark:bg-gray-700 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        );
      case 'password':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Change Password</h3>
            {notification.section === 'password' && (
              <NotificationMessage 
                type={notification.type} 
                message={notification.message} 
                onClose={() => setNotification({ type: '', message: '', section: '' })}
              />
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="block w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Key size={16} className="mr-2" />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Notification Preferences</h3>
            {notification.section === 'notifications' && (
              <NotificationMessage 
                type={notification.type} 
                message={notification.message} 
                onClose={() => setNotification({ type: '', message: '', section: '' })}
              />
            )}
            <form onSubmit={handleUpdateNotifications} className="space-y-5">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="emailNotif" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500" defaultChecked />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="emailNotif" className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive email notifications for event updates and announcements.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="pushNotif" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500" defaultChecked />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="pushNotif" className="font-medium text-gray-700 dark:text-gray-300">Push Notifications</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive push notifications for upcoming events.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="marketingEmails" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="marketingEmails" className="font-medium text-gray-700 dark:text-gray-300">Marketing Emails</label>
                      <p className="text-gray-500 dark:text-gray-400">Receive marketing emails about new features and events.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Bell size={16} className="mr-2" />
                  Save Preferences
                </button>
              </div>
            </form>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Appearance Settings</h3>
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`relative flex flex-col items-center justify-center p-3 h-24 rounded-lg border-2 ${
                      theme === 'light' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Sun size={24} className="text-gray-700 dark:text-gray-300 mb-2" />
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Light</span>
                    {theme === 'light' && (
                      <div className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`relative flex flex-col items-center justify-center p-3 h-24 rounded-lg border-2 ${
                      theme === 'dark' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Moon size={24} className="text-gray-700 dark:text-gray-300 mb-2" />
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Dark</span>
                    {theme === 'dark' && (
                      <div className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                  <button 
                    onClick={() => setTheme('system')}
                    className={`relative flex flex-col items-center justify-center p-3 h-24 rounded-lg border-2 ${
                      theme === 'system' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <div className="flex mb-2">
                      <Sun size={18} className="text-gray-700 dark:text-gray-300" />
                      <Moon size={18} className="text-gray-700 dark:text-gray-300 ml-1" />
                    </div>
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">System</span>
                    {theme === 'system' && (
                      <div className="absolute top-2 right-2 h-2 w-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setNotification({ 
                    type: 'success', 
                    message: 'Appearance settings saved successfully!', 
                    section: 'appearance' 
                  })}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save size={16} className="mr-2" />
                  Save Appearance
                </button>
              </div>
            </div>
            {notification.section === 'appearance' && (
              <NotificationMessage 
                type={notification.type} 
                message={notification.message} 
                onClose={() => setNotification({ type: '', message: '', section: '' })}
              />
            )}
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Privacy & Security</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <input id="twoFactorAuth" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded mt-0.5" />
                <div className="ml-2 text-sm">
                  <label htmlFor="twoFactorAuth" className="font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</label>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <div className="flex items-start">
                <input id="activityLog" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded mt-0.5" defaultChecked />
                <div className="ml-2 text-sm">
                  <label htmlFor="activityLog" className="font-medium text-gray-700 dark:text-gray-300">Activity Log</label>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Keep track of your account activity.</p>
                </div>
              </div>
              <div className="flex items-start">
                <input id="dataSharing" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded mt-0.5" defaultChecked />
                <div className="ml-2 text-sm">
                  <label htmlFor="dataSharing" className="font-medium text-gray-700 dark:text-gray-300">Data Sharing</label>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Allow us to use your data to improve our services.</p>
                </div>
              </div>
              <div className="pt-2">
                <button className="w-full sm:w-auto inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  <Shield size={14} className="mr-1" />
                  Update Security Settings
                </button>
              </div>
            </div>
          </div>
        );
      case 'language':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Language Preferences</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Language</label>
                <select id="language" className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md py-1.5 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" defaultValue="en">
                  <option value="en">English (US)</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="hi">हिन्दी</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                </select>
              </div>
              <div>
                <label htmlFor="locale" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Regional Format</label>
                <select id="locale" className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md py-1.5 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" defaultValue="en-US">
                  <option value="en-US">United States</option>
                  <option value="en-GB">United Kingdom</option>
                  <option value="fr-FR">France</option>
                  <option value="es-ES">Spain</option>
                  <option value="de-DE">Germany</option>
                  <option value="hi-IN">India</option>
                  <option value="ja-JP">Japan</option>
                  <option value="zh-CN">China</option>
                </select>
              </div>
              <div className="pt-2">
                <button className="w-full sm:w-auto inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  <Globe size={14} className="mr-1" />
                  Save Language Settings
                </button>
              </div>
            </div>
          </div>
        );
      case 'danger':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-700">
              <div className="flex">
                <Trash2 className="h-4 w-4 text-red-400 dark:text-red-300" />
                <div className="ml-2">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Delete Your Account</h3>
                  <p className="mt-1 text-xs text-red-700 dark:text-red-500">
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                    {user?.role === 'admin' && " As an admin, you can force deletion despite attendee associations."}
                  </p>
                </div>
              </div>
            </div>
            {deleteError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 px-3 py-2 rounded text-sm">
                {deleteError}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label htmlFor="deleteConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type "DELETE" to confirm
                </label>
                <input 
                  type="text" 
                  id="deleteConfirm" 
                  placeholder="DELETE" 
                  onPaste={handlePaste}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1.5 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" 
                />
              </div>
              <div>
                <label htmlFor="deleteReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for leaving (optional)</label>
                <textarea 
                  id="deleteReason" 
                  rows={3} 
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-1.5 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm" 
                  placeholder="Please let us know why you're leaving..."
                ></textarea>
              </div>
              <div className="pt-2">
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full sm:w-auto inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    
    <div className="min-h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 py-10">
      <div className="container mx-auto p-3 sm:p-4 max-w-3xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="hidden lg:block lg:p-4 lg:border-b lg:border-gray-200 lg:dark:border-gray-700">
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Profile
              </button>
            </div>
          {/* Header: Shown only when on menu */}
          {activeTab === 'menu' && (
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Profile
              </button>
            </div>
          )}
          <div className="flex flex-col md:flex-row">
            {/* Sidebar: Full-screen on mobile when activeTab is 'menu' */}
            <div className={`w-full md:w-60 bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${activeTab === 'menu' ? 'block' : 'hidden md:block'}`}>
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Account Settings</h2>
              <nav className="space-y-1">
                {[
                  { id: 'general', icon: User, label: 'General' },
                  { id: 'password', icon: Key, label: 'Password' },
                  { id: 'notifications', icon: Bell, label: 'Notifications' },
                  { id: 'appearance', icon: theme === 'light' ? Sun : Moon, label: 'Appearance' },
                  { id: 'privacy', icon: Shield, label: 'Privacy & Security' },
                  { id: 'language', icon: Globe, label: 'Language' },
                  { id: 'danger', icon: Trash2, label: 'Delete Account', isDanger: true },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full px-2 py-1.5 text-left rounded-md text-sm ${
                      activeTab === item.id 
                        ? item.isDanger 
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : item.isDanger 
                          ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon size={16} className="mr-2" />
                    <span>{item.label}</span>
                    <ChevronRight size={14} className="ml-auto" />
                  </button>
                ))}
              </nav>
            </div>
            {/* Content Area */}
            <div className="flex-1 p-3 sm:p-4">
              {activeTab !== 'menu' && (
                <button 
                  onClick={() => setActiveTab('menu')}
                  className="md:hidden flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-3 text-sm"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to Settings
                </button>
              )}
              {activeTab !== 'menu' && renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;