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
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserProfile, editUserProfile, changePassword, deleteUserAccount } from '../utils/api.js';
import { useTheme } from '../context/ThemeContext';

const AccountSettings = () => {
  const navigate = useNavigate();
  const { updateUser, logout, user } = useAuth(); // Assume user object includes role info
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(window.innerWidth < 768 ? 'menu' : 'general');
  
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [deleteError, setDeleteError] = useState('');

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
        setError(err.message || 'An error occurred while fetching your profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

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
    setError('');
    setSuccess('');
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
        setSuccess('Profile updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating your profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (response.success) {
        setPasswordSuccess(response.message || 'Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        throw new Error(response.error || 'Failed to update password');
      }
    } catch (err) {
      setPasswordError(err.message || 'An error occurred while updating your password');
    }
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
      // Check if user is admin for "all-time permission"
      const forceDelete = user?.role === 'admin'; // Admins can force delete
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

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">General Information</h3>
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-400 px-4 py-3 rounded">
                    {success}
                  </div>
                )}
                <form onSubmit={handleUpdateDetails} className="space-y-6 sm:space-y-0">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture</label>
                    <div className="flex items-center flex-col sm:flex-row">
                      <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 dark:text-blue-400 border mb-4 sm:mb-0">
                        <User size={32} />
                      </div>
                      <div className="sm:ml-5 flex space-x-2">
                        <button
                          type="button"
                          className="bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          className="bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
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
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      />
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
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        );
      case 'password':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Change Password</h3>
            {passwordError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 px-4 py-3 rounded">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-400 px-4 py-3 rounded">
                {passwordSuccess}
              </div>
            )}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
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
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Key size={18} className="mr-2" />
                  Update Password
                </button>
              </div>
            </form>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <input id="emailNotif" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded mt-1" defaultChecked />
                <div className="ml-3 text-sm">
                  <label htmlFor="emailNotif" className="font-medium text-gray-700 dark:text-gray-300">Email Notifications</label>
                  <p className="text-gray-500 dark:text-gray-400">Receive email notifications for event updates and announcements.</p>
                </div>
              </div>
              <div className="flex items-start">
                <input id="pushNotif" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded mt-1" defaultChecked />
                <div className="ml-3 text-sm">
                  <label htmlFor="pushNotif" className="font-medium text-gray-700 dark:text-gray-300">Push Notifications</label>
                  <p className="text-gray-500 dark:text-gray-400">Receive push notifications for upcoming events.</p>
                </div>
              </div>
              <div className="flex items-start">
                <input id="marketingEmails" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded mt-1" />
                <div className="ml-3 text-sm">
                  <label htmlFor="marketingEmails" className="font-medium text-gray-700 dark:text-gray-300">Marketing Emails</label>
                  <p className="text-gray-500 dark:text-gray-400">Receive marketing emails about new features and events.</p>
                </div>
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  <Save size={18} className="mr-2" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Appearance Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme Mode</label>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`relative flex items-center justify-center w-full sm:w-36 h-20 rounded-lg border-2 ${
                      theme === 'light' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Sun size={24} className="text-gray-700 dark:text-gray-300" />
                      <span className="mt-1 font-medium text-sm text-gray-700 dark:text-gray-300">Light</span>
                    </div>
                    {theme === 'light' && (
                      <div className="absolute top-2 right-2 h-3 w-3 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`relative flex items-center justify-center w-full sm:w-36 h-20 rounded-lg border-2 ${
                      theme === 'dark' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Moon size={24} className="text-gray-700 dark:text-gray-300" />
                      <span className="mt-1 font-medium text-sm text-gray-700 dark:text-gray-300">Dark</span>
                    </div>
                    {theme === 'dark' && (
                      <div className="absolute top-2 right-2 h-3 w-3 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                  <button 
                    onClick={() => setTheme('system')}
                    className={`relative flex items-center justify-center w-full sm:w-36 h-20 rounded-lg border-2 ${
                      theme === 'system' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex">
                        <Sun size={20} className="text-gray-700 dark:text-gray-300" />
                        <Moon size={20} className="text-gray-700 dark:text-gray-300 ml-1" />
                      </div>
                      <span className="mt-1 font-medium text-sm text-gray-700 dark:text-gray-300">System</span>
                    </div>
                    {theme === 'system' && (
                      <div className="absolute top-2 right-2 h-3 w-3 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  <Save size={18} className="mr-2" />
                  Save Appearance
                </button>
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Privacy & Security</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <input id="twoFactorAuth" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded mt-1" />
                <div className="ml-3 text-sm">
                  <label htmlFor="twoFactorAuth" className="font-medium text-gray-700 dark:text-gray-300">Two-Factor Authentication</label>
                  <p className="text-gray-500 dark:text-gray-400">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <div className="flex items-start">
                <input id="activityLog" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded mt-1" defaultChecked />
                <div className="ml-3 text-sm">
                  <label htmlFor="activityLog" className="font-medium text-gray-700 dark:text-gray-300">Activity Log</label>
                  <p className="text-gray-500 dark:text-gray-400">Keep track of your account activity.</p>
                </div>
              </div>
              <div className="flex items-start">
                <input id="dataSharing" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded mt-1" defaultChecked />
                <div className="ml-3 text-sm">
                  <label htmlFor="dataSharing" className="font-medium text-gray-700 dark:text-gray-300">Data Sharing</label>
                  <p className="text-gray-500 dark:text-gray-400">Allow us to use your data to improve our services.</p>
                </div>
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  <Shield size={18} className="mr-2" />
                  Update Security Settings
                </button>
              </div>
            </div>
          </div>
        );
      case 'language':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Language Preferences</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Language</label>
                <select id="language" className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" defaultValue="en">
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
                <select id="locale" className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" defaultValue="en-US">
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
              <div className="pt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  <Globe size={18} className="mr-2" />
                  Save Language Settings
                </button>
              </div>
            </div>
          </div>
        );
      case 'danger':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-700 mb-4">
              <div className="flex">
                <Trash2 className="h-5 w-5 text-red-400 dark:text-red-300" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Delete Your Account</h3>
                  <p className="mt-2 text-sm text-red-700 dark:text-red-500">
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                    {user?.role === 'admin' && " As an admin, you can force deletion despite attendee associations."}
                  </p>
                </div>
              </div>
            </div>
            {deleteError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-400 px-4 py-3 rounded">
                {deleteError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="deleteConfirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Type "DELETE" to confirm (must be typed, not pasted)
                </label>
                <input 
                  type="text" 
                  id="deleteConfirm" 
                  placeholder="DELETE" 
                  onPaste={handlePaste}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                />
              </div>
              <div>
                <label htmlFor="deleteReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for leaving (optional)</label>
                <textarea 
                  id="deleteReason" 
                  rows={3} 
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                  placeholder="Please let us know why you're leaving..."
                ></textarea>
              </div>
              <div className="pt-4">
                <button 
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  <Trash2 size={18} className="mr-2" />
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Profile
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className={`w-full md:w-64 bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 border-r border-gray-200 dark:border-gray-700 ${activeTab !== 'menu' ? 'hidden md:block' : ''}`}>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">Account Settings</h2>
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
                    className={`flex items-center w-full px-3 py-2 sm:py-3 text-left rounded-lg text-sm sm:text-base ${
                      activeTab === item.id 
                        ? item.isDanger 
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : item.isDanger 
                          ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon size={18} className="mr-2 sm:mr-3" />
                    <span>{item.label}</span>
                    <ChevronRight size={16} className="ml-auto" />
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 p-4 sm:p-6">
              {activeTab !== 'menu' && (
                <button 
                  onClick={() => setActiveTab('menu')}
                  className="md:hidden flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 text-sm sm:text-base"
                >
                  <ArrowLeft size={18} className="mr-2" />
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