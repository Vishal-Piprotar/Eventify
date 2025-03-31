import React, { useState } from 'react';
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

const AccountSettings = () => {
    const navigate =useNavigate();
  // Set initial tab based on screen size: 'menu' for mobile, 'general' for tablet/desktop
  const [activeTab, setActiveTab] = useState(window.innerWidth < 768 ? 'menu' : 'general');
  const [theme, setTheme] = useState('light');
  
  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">General Information</h3>
            <div className="space-y-6 sm:space-y-0">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <div className="flex items-center flex-col sm:flex-row">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 border mb-4 sm:mb-0">
                    <User size={32} />
                  </div>
                  <div className="sm:ml-5 flex space-x-2">
                    <button className="bg-white py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Change
                    </button>
                    <button className="bg-white py-2 px-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" id="firstName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" defaultValue="Vishal" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" id="lastName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" defaultValue="Piprotar" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" defaultValue="vishal2@shrinesoft.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" id="phone" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              
              <div className="pt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      case 'password':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" id="currentPassword" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" id="newPassword" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" id="confirmPassword" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                  <Key size={18} className="mr-2" />
                  Update Password
                </button>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <input id="emailNotif" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1" defaultChecked />
                <div className="ml-3 text-sm">
                  <label htmlFor="emailNotif" className="font-medium text-gray-700">Email Notifications</label>
                  <p className="text-gray-500">Receive email notifications for event updates and announcements.</p>
                </div>
              </div>
              <div className="flex items-start">
                <input id="pushNotif" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1" defaultChecked />
                <div className="ml-3 text-sm">
                  <label htmlFor="pushNotif" className="font-medium text-gray-700">Push Notifications</label>
                  <p className="text-gray-500">Receive push notifications for upcoming events.</p>
                </div>
              </div>
              <div className="flex items-start">
                <input id="marketingEmails" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1" />
                <div className="ml-3 text-sm">
                  <label htmlFor="marketingEmails" className="font-medium text-gray-700">Marketing Emails</label>
                  <p className="text-gray-500">Receive marketing emails about new features and events.</p>
                </div>
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Theme Mode</label>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button onClick={() => handleThemeChange('light')} className={`relative flex items-center justify-center w-full sm:w-36 h-20 rounded-lg border-2 ${theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex flex-col items-center">
                      <Sun size={24} className="text-gray-700" />
                      <span className="mt-1 font-medium text-sm">Light</span>
                    </div>
                    {theme === 'light' && <div className="absolute top-2 right-2 h-3 w-3 bg-blue-500 rounded-full"></div>}
                  </button>
                  <button onClick={() => handleThemeChange('dark')} className={`relative flex items-center justify-center w-full sm:w-36 h-20 rounded-lg border-2 ${theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex flex-col items-center">
                      <Moon size={24} className="text-gray-700" />
                      <span className="mt-1 font-medium text-sm">Dark</span>
                    </div>
                    {theme === 'dark' && <div className="absolute top-2 right-2 h-3 w-3 bg-blue-500 rounded-full"></div>}
                  </button>
                  <button onClick={() => handleThemeChange('system')} className={`relative flex items-center justify-center w-full sm:w-36 h-20 rounded-lg border-2 ${theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex flex-col items-center">
                      <div className="flex">
                        <Sun size={20} className="text-gray-700" />
                        <Moon size={20} className="text-gray-700 ml-1" />
                      </div>
                      <span className="mt-1 font-medium text-sm">System</span>
                    </div>
                    {theme === 'system' && <div className="absolute top-2 right-2 h-3 w-3 bg-blue-500 rounded-full"></div>}
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Security</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <input id="twoFactorAuth" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1" />
                <div className="ml-3 text-sm">
                  <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">Two-Factor Authentication</label>
                  <p className="text-gray-500">Add an extra layer of security to your account.</p>
                </div>
              </div>
              <div className="flex items-start">
                <input id="activityLog" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1" defaultChecked />
                <div className="ml-3 text-sm">
                  <label htmlFor="activityLog" className="font-medium text-gray-700">Activity Log</label>
                  <p className="text-gray-500">Keep track of your account activity.</p>
                </div>
              </div>
              <div className="flex items-start">
                <input id="dataSharing" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-1" defaultChecked />
                <div className="ml-3 text-sm">
                  <label htmlFor="dataSharing" className="font-medium text-gray-700">Data Sharing</label>
                  <p className="text-gray-500">Allow us to use your data to improve our services.</p>
                </div>
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Language Preferences</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">Display Language</label>
                <select id="language" className="mt-1 block w-full border-gray-300 rounded-md py-2 px-3" defaultValue="en">
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
                <label htmlFor="locale" className="block text-sm font-medium text-gray-700">Regional Format</label>
                <select id="locale" className="mt-1 block w-full border-gray-300 rounded-md py-2 px-3" defaultValue="en-US">
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
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
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
            <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
            <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
              <div className="flex">
                <Trash2 className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Delete Your Account</h3>
                  <p className="mt-2 text-sm text-red-700">
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="deleteConfirm" className="block text-sm font-medium text-gray-700">Type "DELETE" to confirm</label>
                <input type="text" id="deleteConfirm" placeholder="DELETE" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
              </div>
              <div>
                <label htmlFor="deleteReason" className="block text-sm font-medium text-gray-700">Reason for leaving (optional)</label>
                <textarea id="deleteReason" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="Please let us know why you're leaving..."></textarea>
              </div>
              <div className="pt-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
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
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center text-blue-600 hover:text-blue-800 text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Profile
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className={`w-full md:w-64 bg-gray-50 p-4 sm:p-6 border-r border-gray-200 ${activeTab !== 'menu' ? 'hidden md:block' : ''}`}>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Account Settings</h2>
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
                          ? 'bg-red-50 text-red-600' 
                          : 'bg-blue-50 text-blue-600'
                        : item.isDanger 
                          ? 'text-red-500 hover:bg-red-50' 
                          : 'text-gray-700 hover:bg-gray-100'
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
                  className="md:hidden flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm sm:text-base"
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