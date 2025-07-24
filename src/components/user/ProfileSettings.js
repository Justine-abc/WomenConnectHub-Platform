// WomenConnect Hub - Profile Settings Component
// Account settings and preferences management

import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { validateAndConvertGoogleDriveLink } from '../../utils/linkUtils';
import { AFRICAN_COUNTRIES, BUSINESS_CATEGORIES, INVESTMENT_RANGES } from '../../utils/constants';

const ProfileSettings = ({ user, onUpdateProfile, onDeleteAccount }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || '',
    profileImage: user?.profileImage || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
    socialMedia: {
      linkedin: user?.socialMedia?.linkedin || '',
      twitter: user?.socialMedia?.twitter || '',
      facebook: user?.socialMedia?.facebook || '',
      instagram: user?.socialMedia?.instagram || ''
    }
  });

  // Business settings (for sellers)
  const [businessForm, setBusinessForm] = useState({
    businessName: user?.businessName || '',
    businessCategory: user?.businessCategory || '',
    businessDescription: user?.businessDescription || '',
    businessEmail: user?.businessEmail || '',
    businessPhone: user?.businessPhone || '',
    businessAddress: user?.businessAddress || '',
    registrationNumber: user?.registrationNumber || '',
    taxId: user?.taxId || ''
  });

  // Investment preferences (for investors)
  const [investmentForm, setInvestmentForm] = useState({
    investmentRange: user?.investmentRange || '',
    preferredCategories: user?.preferredCategories || [],
    preferredCountries: user?.preferredCountries || [],
    investmentType: user?.investmentType || 'individual',
    riskTolerance: user?.riskTolerance || 'medium'
  });

  // Security settings
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: user?.twoFactorEnabled || false
  });

  // Notification preferences
  const [notificationForm, setNotificationForm] = useState({
    emailNotifications: user?.emailNotifications !== false,
    smsNotifications: user?.smsNotifications || false,
    pushNotifications: user?.pushNotifications !== false,
    projectUpdates: user?.projectUpdates !== false,
    investmentAlerts: user?.investmentAlerts !== false,
    marketingEmails: user?.marketingEmails || false,
    weeklyDigest: user?.weeklyDigest !== false
  });

  // Privacy settings
  const [privacyForm, setPrivacyForm] = useState({
    profileVisibility: user?.profileVisibility || 'public',
    showEmail: user?.showEmail || false,
    showPhone: user?.showPhone || false,
    allowDirectContact: user?.allowDirectContact !== false,
    showInvestments: user?.showInvestments !== false,
    analyticsOptOut: user?.analyticsOptOut || false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'business', label: 'Business', icon: '🏢', condition: user?.userType === 'seller' },
    { id: 'investment', label: 'Investment', icon: '💰', condition: user?.userType === 'investor' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🛡️' }
  ].filter(tab => tab.condition !== false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      let updateData = {};

      switch (activeTab) {
        case 'profile':
          updateData = profileForm;
          break;
        case 'business':
          updateData = businessForm;
          break;
        case 'investment':
          updateData = investmentForm;
          break;
        case 'security':
          if (securityForm.newPassword) {
            updateData = {
              currentPassword: securityForm.currentPassword,
              newPassword: securityForm.newPassword,
              twoFactorEnabled: securityForm.twoFactorEnabled
            };
          } else {
            updateData = { twoFactorEnabled: securityForm.twoFactorEnabled };
          }
          break;
        case 'notifications':
          updateData = notificationForm;
          break;
        case 'privacy':
          updateData = privacyForm;
          break;
      }

      await onUpdateProfile(updateData);
      setSuccessMessage('Settings updated successfully!');
      
      // Clear password fields after successful update
      if (activeTab === 'security' && securityForm.newPassword) {
        setSecurityForm(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await onDeleteAccount();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const renderProfileTab = () => (
    <div className="settings-section">
      <h3>Profile Information</h3>
      
      <div className="form-group">
        <label htmlFor="profile-image">Profile Picture (Google Drive Link)</label>
        <input
          type="url"
          id="profile-image"
          value={profileForm.profileImage}
          onChange={(e) => setProfileForm({...profileForm, profileImage: e.target.value})}
          placeholder="https://drive.google.com/file/d/..."
          className="form-input"
        />
        {profileForm.profileImage && (
          <div className="image-preview">
            <img
              src={validateAndConvertGoogleDriveLink(profileForm.profileImage)}
              alt="Profile preview"
              className="profile-preview"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="image-error" style={{ display: 'none' }}>
              ❌ Invalid image link
            </div>
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="required">Full Name</label>
          <input
            type="text"
            id="name"
            value={profileForm.name}
            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="required">Email Address</label>
          <input
            type="email"
            id="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
            className="form-input"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={profileForm.phone}
            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
            placeholder="+234 xxx xxx xxxx"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="whatsapp">WhatsApp Number</label>
          <input
            type="tel"
            id="whatsapp"
            value={profileForm.whatsapp}
            onChange={(e) => setProfileForm({...profileForm, whatsapp: e.target.value})}
            placeholder="+234 xxx xxx xxxx"
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <select
          id="location"
          value={profileForm.location}
          onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
          className="form-select"
        >
          <option value="">Select Country</option>
          {AFRICAN_COUNTRIES.map(country => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={profileForm.bio}
          onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
          placeholder="Tell us about yourself..."
          className="form-textarea"
          rows="4"
          maxLength="500"
        />
        <div className="character-count">{profileForm.bio.length}/500</div>
      </div>

      <div className="form-group">
        <label htmlFor="website">Website</label>
        <input
          type="url"
          id="website"
          value={profileForm.website}
          onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
          placeholder="https://your-website.com"
          className="form-input"
        />
      </div>

      <div className="social-media-section">
        <h4>Social Media</h4>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="linkedin">LinkedIn</label>
            <input
              type="url"
              id="linkedin"
              value={profileForm.socialMedia.linkedin}
              onChange={(e) => setProfileForm({
                ...profileForm, 
                socialMedia: {...profileForm.socialMedia, linkedin: e.target.value}
              })}
              placeholder="https://linkedin.com/in/username"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="twitter">Twitter</label>
            <input
              type="url"
              id="twitter"
              value={profileForm.socialMedia.twitter}
              onChange={(e) => setProfileForm({
                ...profileForm, 
                socialMedia: {...profileForm.socialMedia, twitter: e.target.value}
              })}
              placeholder="https://twitter.com/username"
              className="form-input"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-section">
      <h3>Security Settings</h3>
      
      <div className="security-section">
        <h4>Change Password</h4>
        
        <div className="form-group">
          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            id="current-password"
            value={securityForm.currentPassword}
            onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})}
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={securityForm.newPassword}
              onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              value={securityForm.confirmPassword}
              onChange={(e) => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="security-section">
        <h4>Two-Factor Authentication</h4>
        <div className="toggle-setting">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={securityForm.twoFactorEnabled}
              onChange={(e) => setSecurityForm({...securityForm, twoFactorEnabled: e.target.checked})}
            />
            <span className="toggle-slider"></span>
            Enable Two-Factor Authentication
          </label>
          <p className="setting-description">
            Add an extra layer of security to your account
          </p>
        </div>
      </div>

      <div className="danger-zone">
        <h4>Danger Zone</h4>
        <div className="danger-action">
          <div>
            <strong>Delete Account</strong>
            <p>Permanently delete your account and all associated data</p>
          </div>
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-section">
      <h3>Notification Preferences</h3>
      
      <div className="notification-section">
        <h4>Communication Preferences</h4>
        
        <div className="notification-group">
          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notificationForm.emailNotifications}
                onChange={(e) => setNotificationForm({...notificationForm, emailNotifications: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              Email Notifications
            </label>
            <p className="setting-description">Receive updates via email</p>
          </div>

          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notificationForm.smsNotifications}
                onChange={(e) => setNotificationForm({...notificationForm, smsNotifications: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              SMS Notifications
            </label>
            <p className="setting-description">Receive important updates via SMS</p>
          </div>

          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notificationForm.pushNotifications}
                onChange={(e) => setNotificationForm({...notificationForm, pushNotifications: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              Push Notifications
            </label>
            <p className="setting-description">Receive browser notifications</p>
          </div>
        </div>
      </div>

      <div className="notification-section">
        <h4>Content Preferences</h4>
        
        <div className="notification-group">
          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notificationForm.projectUpdates}
                onChange={(e) => setNotificationForm({...notificationForm, projectUpdates: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              Project Updates
            </label>
            <p className="setting-description">Updates on projects you're following</p>
          </div>

          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notificationForm.investmentAlerts}
                onChange={(e) => setNotificationForm({...notificationForm, investmentAlerts: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              Investment Alerts
            </label>
            <p className="setting-description">New investment opportunities</p>
          </div>

          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notificationForm.weeklyDigest}
                onChange={(e) => setNotificationForm({...notificationForm, weeklyDigest: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              Weekly Digest
            </label>
            <p className="setting-description">Weekly summary of platform activity</p>
          </div>

          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notificationForm.marketingEmails}
                onChange={(e) => setNotificationForm({...notificationForm, marketingEmails: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              Marketing Emails
            </label>
            <p className="setting-description">Updates about new features and events</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="settings-section">
      <h3>Privacy Settings</h3>
      
      <div className="privacy-section">
        <h4>Profile Visibility</h4>
        
        <div className="form-group">
          <label>Who can see your profile?</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                value="public"
                checked={privacyForm.profileVisibility === 'public'}
                onChange={(e) => setPrivacyForm({...privacyForm, profileVisibility: e.target.value})}
              />
              Public - Anyone can see your profile
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="members"
                checked={privacyForm.profileVisibility === 'members'}
                onChange={(e) => setPrivacyForm({...privacyForm, profileVisibility: e.target.value})}
              />
              Members Only - Only registered users
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="private"
                checked={privacyForm.profileVisibility === 'private'}
                onChange={(e) => setPrivacyForm({...privacyForm, profileVisibility: e.target.value})}
              />
              Private - Only you can see your profile
            </label>
          </div>
        </div>
      </div>

      <div className="privacy-section">
        <h4>Contact Information</h4>
        
        <div className="privacy-group">
          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={privacyForm.showEmail}
                onChange={(e) => setPrivacyForm({...privacyForm, showEmail: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              Show Email Address
            </label>
            <p className="setting-description">Allow others to see your email</p>
          </div>

          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={privacyForm.showPhone}
                onChange={(e) => setPrivacyForm({...privacyForm, showPhone: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              Show Phone Number
            </label>
            <p className="setting-description">Allow others to see your phone</p>
          </div>

          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={privacyForm.allowDirectContact}
                onChange={(e) => setPrivacyForm({...privacyForm, allowDirectContact: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              Allow Direct Contact
            </label>
            <p className="setting-description">Let others contact you directly</p>
          </div>
        </div>
      </div>

      <div className="privacy-section">
        <h4>Data & Analytics</h4>
        
        <div className="privacy-group">
          <div className="toggle-setting">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={privacyForm.analyticsOptOut}
                onChange={(e) => setPrivacyForm({...privacyForm, analyticsOptOut: e.target.checked})}
              />
              <span className="toggle-slider"></span>
              Opt out of Analytics
            </label>
            <p className="setting-description">Don't track my usage for analytics</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-settings">
      <div className="settings-header">
        <h2>Account Settings</h2>
        <p>Manage your account preferences and settings</p>
      </div>

      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}

      <div className="settings-container">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span className="nav-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="settings-content">
          <form onSubmit={handleSubmit}>
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'business' && renderBusinessTab()}
            {activeTab === 'investment' && renderInvestmentTab()}
            {activeTab === 'security' && renderSecurityTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'privacy' && renderPrivacyTab()}

            <div className="settings-actions">
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                disabled={activeTab === 'security' && 
                  securityForm.newPassword && 
                  securityForm.newPassword !== securityForm.confirmPassword}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Account"
        size="medium"
      >
        <div className="delete-confirmation">
          <div className="warning-icon">⚠️</div>
          <h3>Are you absolutely sure?</h3>
          <p>
            This action cannot be undone. This will permanently delete your account 
            and remove all your data from our servers.
          </p>
          <div className="confirmation-actions">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
            >
              Yes, Delete Account
            </Button>
          </div>
        </div>
      </Modal>

      <style jsx>{`
        .profile-settings {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .settings-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .settings-header h2 {
          margin: 0 0 0.5rem 0;
          color: #1f2937;
        }

        .settings-header p {
          margin: 0;
          color: #6b7280;
        }

        .success-message {
          background: #dcfce7;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .settings-container {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 2rem;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .settings-sidebar {
          background: #f9fafb;
          padding: 1.5rem 0;
        }

        .settings-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
        }

        .nav-item:hover {
          background: #e5e7eb;
        }

        .nav-item.active {
          background: #2563eb;
          color: #ffffff;
        }

        .nav-icon {
          font-size: 1.25rem;
        }

        .nav-label {
          font-weight: 500;
        }

        .settings-content {
          padding: 2rem;
        }

        .settings-section {
          margin-bottom: 2rem;
        }

        .settings-section h3 {
          margin: 0 0 1.5rem 0;
          color: #1f2937;
          font-size: 1.5rem;
        }

        .settings-section h4 {
          margin: 0 0 1rem 0;
          color: #374151;
          font-size: 1.125rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .form-group label.required:after {
          content: '*';
          color: #dc2626;
          margin-left: 0.25rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .character-count {
          font-size: 0.75rem;
          color: #9ca3af;
          text-align: right;
          margin-top: 0.25rem;
        }

        .image-preview {
          margin-top: 0.5rem;
        }

        .profile-preview {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #e5e7eb;
        }

        .image-error {
          color: #dc2626;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .social-media-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .security-section,
        .notification-section,
        .privacy-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .security-section:last-child,
        .notification-section:last-child,
        .privacy-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .toggle-setting {
          margin-bottom: 1.5rem;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          color: #374151;
        }

        .toggle-slider {
          position: relative;
          width: 44px;
          height: 24px;
          background: #d1d5db;
          border-radius: 12px;
          transition: background 0.2s ease;
        }

        .toggle-slider:before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: #ffffff;
          border-radius: 50%;
          transition: transform 0.2s ease;
        }

        input[type="checkbox"]:checked + .toggle-slider {
          background: #2563eb;
        }

        input[type="checkbox"]:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        input[type="checkbox"] {
          display: none;
        }

        .setting-description {
          margin: 0.25rem 0 0 0;
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: normal;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: normal;
        }

        .danger-zone {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 2rem;
        }

        .danger-zone h4 {
          color: #dc2626;
          margin-bottom: 1rem;
        }

        .danger-action {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .danger-action div {
          flex: 1;
        }

        .danger-action strong {
          display: block;
          color: #dc2626;
          margin-bottom: 0.25rem;
        }

        .danger-action p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .settings-actions {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          display: flex;
          justify-content: flex-end;
        }

        .delete-confirmation {
          text-align: center;
          padding: 1rem;
        }

        .warning-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .delete-confirmation h3 {
          margin: 0 0 1rem 0;
          color: #dc2626;
        }

        .delete-confirmation p {
          margin: 0 0 2rem 0;
          color: #6b7280;
        }

        .confirmation-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .profile-settings {
            padding: 1rem;
          }

          .settings-container {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .settings-sidebar {
            padding: 1rem;
          }

          .settings-nav {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.5rem;
          }

          .nav-item {
            padding: 0.5rem;
            text-align: center;
            flex-direction: column;
            gap: 0.25rem;
          }

          .nav-label {
            font-size: 0.875rem;
          }

          .settings-content {
            padding: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .danger-action {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }

          .confirmation-actions {
            flex-direction: column;
          }
        }

        /* Dark mode */
        @media (prefers-color-scheme: dark) {
          .settings-container {
            background: #1f2937;
          }

          .settings-sidebar {
            background: #374151;
          }

          .nav-item {
            color: #d1d5db;
          }

          .nav-item:hover {
            background: #4b5563;
          }

          .settings-section h3,
          .settings-section h4,
          .form-group label {
            color: #f3f4f6;
          }

          .form-input,
          .form-select,
          .form-textarea {
            background: #374151;
            border-color: #4b5563;
            color: #f3f4f6;
          }

          .setting-description {
            color: #9ca3af;
          }

          .success-message {
            background: #065f46;
            border-color: #059669;
            color: #d1fae5;
          }
        }
      `}</style>
    </div>
  );
};

// Additional helper components for business and investment settings
const renderBusinessTab = () => (
  <div className="settings-section">
    <h3>Business Information</h3>
    
    <div className="form-group">
      <label htmlFor="business-name" className="required">Business Name</label>
      <input
        type="text"
        id="business-name"
        value={businessForm.businessName}
        onChange={(e) => setBusinessForm({...businessForm, businessName: e.target.value})}
        className="form-input"
        required
      />
    </div>

    <div className="form-row">
      <div className="form-group">
        <label htmlFor="business-category">Business Category</label>
        <select
          id="business-category"
          value={businessForm.businessCategory}
          onChange={(e) => setBusinessForm({...businessForm, businessCategory: e.target.value})}
          className="form-select"
        >
          <option value="">Select Category</option>
          {BUSINESS_CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="registration-number">Registration Number</label>
        <input
          type="text"
          id="registration-number"
          value={businessForm.registrationNumber}
          onChange={(e) => setBusinessForm({...businessForm, registrationNumber: e.target.value})}
          placeholder="Business registration number"
          className="form-input"
        />
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="business-description">Business Description</label>
      <textarea
        id="business-description"
        value={businessForm.businessDescription}
        onChange={(e) => setBusinessForm({...businessForm, businessDescription: e.target.value})}
        placeholder="Describe your business..."
        className="form-textarea"
        rows="4"
        maxLength="1000"
      />
      <div className="character-count">{businessForm.businessDescription.length}/1000</div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label htmlFor="business-email">Business Email</label>
        <input
          type="email"
          id="business-email"
          value={businessForm.businessEmail}
          onChange={(e) => setBusinessForm({...businessForm, businessEmail: e.target.value})}
          className="form-input"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="business-phone">Business Phone</label>
        <input
          type="tel"
          id="business-phone"
          value={businessForm.businessPhone}
          onChange={(e) => setBusinessForm({...businessForm, businessPhone: e.target.value})}
          className="form-input"
        />
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="business-address">Business Address</label>
      <textarea
        id="business-address"
        value={businessForm.businessAddress}
        onChange={(e) => setBusinessForm({...businessForm, businessAddress: e.target.value})}
        placeholder="Full business address"
        className="form-textarea"
        rows="3"
      />
    </div>
  </div>
);

const renderInvestmentTab = () => (
  <div className="settings-section">
    <h3>Investment Preferences</h3>
    
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="investment-range">Investment Range</label>
        <select
          id="investment-range"
          value={investmentForm.investmentRange}
          onChange={(e) => setInvestmentForm({...investmentForm, investmentRange: e.target.value})}
          className="form-select"
        >
          <option value="">Select Range</option>
          {INVESTMENT_RANGES.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="investment-type">Investor Type</label>
        <select
          id="investment-type"
          value={investmentForm.investmentType}
          onChange={(e) => setInvestmentForm({...investmentForm, investmentType: e.target.value})}
          className="form-select"
        >
          <option value="individual">Individual Investor</option>
          <option value="organization">Organization</option>
          <option value="fund">Investment Fund</option>
          <option value="government">Government Agency</option>
        </select>
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="preferred-categories">Preferred Categories</label>
      <div className="checkbox-group">
        {BUSINESS_CATEGORIES.map(category => (
          <label key={category.value} className="checkbox-option">
            <input
              type="checkbox"
              checked={investmentForm.preferredCategories.includes(category.value)}
              onChange={(e) => {
                const categories = e.target.checked
                  ? [...investmentForm.preferredCategories, category.value]
                  : investmentForm.preferredCategories.filter(c => c !== category.value);
                setInvestmentForm({...investmentForm, preferredCategories: categories});
              }}
            />
            {category.label}
          </label>
        ))}
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="preferred-countries">Preferred Countries</label>
      <div className="checkbox-group">
        {AFRICAN_COUNTRIES.slice(0, 10).map(country => (
          <label key={country.code} className="checkbox-option">
            <input
              type="checkbox"
              checked={investmentForm.preferredCountries.includes(country.name)}
              onChange={(e) => {
                const countries = e.target.checked
                  ? [...investmentForm.preferredCountries, country.name]
                  : investmentForm.preferredCountries.filter(c => c !== country.name);
                setInvestmentForm({...investmentForm, preferredCountries: countries});
              }}
            />
            {country.name}
          </label>
        ))}
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="risk-tolerance">Risk Tolerance</label>
      <select
        id="risk-tolerance"
        value={investmentForm.riskTolerance}
        onChange={(e) => setInvestmentForm({...investmentForm, riskTolerance: e.target.value})}
        className="form-select"
      >
        <option value="low">Low Risk</option>
        <option value="medium">Medium Risk</option>
        <option value="high">High Risk</option>
        <option value="any">Any Risk Level</option>
      </select>
    </div>
  </div>
);

export default ProfileSettings;