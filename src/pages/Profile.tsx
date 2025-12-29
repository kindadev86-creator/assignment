import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContainer';
import Input from '../components/Input';
import Button from '../components/Button';
import { User as UserIcon, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const { showToast } = useToast();

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [profileErrors, setProfileErrors] = useState<{ full_name?: string; email?: string }>({});
  const [passwordErrors, setPasswordErrors] = useState<{ old_password?: string; new_password?: string; confirm_password?: string }>({});
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const validateProfileForm = (): boolean => {
    const errors: { full_name?: string; email?: string } = {};

    if (!profileData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    }

    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = 'Invalid email format';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const errors: { old_password?: string; new_password?: string; confirm_password?: string } = {};

    if (!passwordData.old_password) {
      errors.old_password = 'Current password is required';
    }

    if (!passwordData.new_password) {
      errors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters';
    }

    if (!passwordData.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setLoadingProfile(true);
    try {
      await updateProfile(profileData);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to update profile', 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setLoadingPassword(true);
    try {
      await changePassword(passwordData.old_password, passwordData.new_password);
      showToast('Password changed successfully', 'success');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to change password', 'error');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleProfileCancel = () => {
    setProfileData({
      full_name: user?.full_name || '',
      email: user?.email || ''
    });
    setProfileErrors({});
  };

  const handlePasswordCancel = () => {
    setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    setPasswordErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user?.full_name}</h2>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile Information</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                type="text"
                label="Full Name"
                value={profileData.full_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                error={profileErrors.full_name}
              />

              <Input
                type="email"
                label="Email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                error={profileErrors.email}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" loading={loadingProfile}>
                  Save Changes
                </Button>
                <Button type="button" variant="secondary" onClick={handleProfileCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                label="Current Password"
                value={passwordData.old_password}
                onChange={(e) => setPasswordData(prev => ({ ...prev, old_password: e.target.value }))}
                error={passwordErrors.old_password}
              />

              <Input
                type="password"
                label="New Password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                error={passwordErrors.new_password}
              />

              <Input
                type="password"
                label="Confirm New Password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                error={passwordErrors.confirm_password}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" loading={loadingPassword}>
                  Change Password
                </Button>
                <Button type="button" variant="secondary" onClick={handlePasswordCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
