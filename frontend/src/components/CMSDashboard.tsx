import React, { useState, useEffect } from 'react';
import { PortfolioProject, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, LogOut, Plus, Image as ImageIcon, CheckCircle2, AlertCircle, Lock, KeyRound } from 'lucide-react';

const CATEGORIES: Category[] = [
  "Decoration & Styling",
  "Photography",
  "Videography",
  "Catering",
  "Wedding Planning",
  "Corporate Events",
  "Entertainment",
  "Lighting & Sound",
  "VIP Transportation",
  "Venue Selection",
  "Invitations & Stationery",
  "Gifting & Favors",
  "Make-up",
];

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const CMSDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPasswordError(data.error || 'Failed to change password');
      } else {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowChangePassword(false), 2000);
      }
    } catch {
      setPasswordError('Failed to change password. Please try again.');
    } finally {
      setChangingPassword(false);
    }
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // On mount: verify stored token is still valid before showing dashboard
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetch('/api/auth/verify', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.ok) {
          setIsLoggedIn(true);
          fetchProjects();
        } else {
          localStorage.removeItem('admin_token');
          setLoading(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        setLoading(false);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token);
        setIsLoggedIn(true);
        fetchProjects();
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    setProjects([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl || !title) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description, category, mediaUrl, mediaType }),
      });

      if (response.status === 401) {
        setError('Session expired. Please log in again.');
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error('Upload failed');

      setSuccess('Project uploaded successfully!');
      setTitle('');
      setDescription('');
      setMediaUrl('');
      setMediaType('image');
      setCategory(CATEGORIES[0]);
      fetchProjects();
    } catch {
      setError('Failed to upload project.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        setError('Session expired. Please log in again.');
        handleLogout();
        return;
      }
      if (!response.ok) throw new Error('Delete failed');

      setDeletingId(null);
      fetchProjects();
    } catch {
      setError('Failed to delete project.');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 p-4">
        <div className="max-w-md w-full p-8 rounded-3xl shadow-xl text-center bg-white border border-stone-200">
          <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">Vibha Events CMS</h1>
          <p className="text-stone-500 mb-8">Enter the admin password to manage the portfolio.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900"
              required
            />
            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-4 rounded-xl font-medium hover:bg-stone-800 transition-all"
            >
              Login to Dashboard
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-display font-bold">Portfolio Dashboard</h1>
            <p className="text-stone-500">Manage your real event showcase photos and videos.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowChangePassword(true); setPasswordError(null); setPasswordSuccess(null); }}
              className="p-3 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-stone-600"
              title="Change Password"
            >
              <KeyRound className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-3 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-stone-600"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5" /> Add New Project
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Project Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Grand Wedding Stage"
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                  >
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Media Type</label>
                  <div className="flex gap-4">
                    {(['image', 'video'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setMediaType(type)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${mediaType === type ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-400'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Media URL</label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                    required
                  />
                  <p className="text-[10px] text-stone-400 mt-1">Paste a direct link to an image or video.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe the event setup..."
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none h-24 resize-none"
                  />
                </div>

                {mediaUrl && (
                  <div className="aspect-video rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                    {mediaType === 'image' ? (
                      <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <video src={mediaUrl} className="w-full h-full object-cover" muted />
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-stone-900 text-white py-4 rounded-xl font-medium hover:bg-stone-800 transition-all disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Publish to Portfolio'}
                </button>

                {success && <p className="text-green-600 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {success}</p>}
                {error && <p className="text-red-500 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</p>}
              </form>
            </div>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-xl font-bold">Live Portfolio Items ({projects.length})</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {projects.length === 0 ? (
                  <div className="p-12 text-center text-stone-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No projects uploaded yet.</p>
                  </div>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="p-4 flex items-center gap-4 hover:bg-stone-50 transition-colors">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                        {project.mediaType === 'image' ? (
                          <img src={project.mediaUrl} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <video src={project.mediaUrl} className="w-full h-full object-cover" muted />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-stone-900 truncate">{project.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-bold uppercase rounded-md">{project.category}</span>
                          <span className="text-[10px] text-stone-400">
                            {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeletingId(project.id)}
                        className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showChangePassword && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChangePassword(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white border border-stone-200 p-8 rounded-2xl max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">Change Password</h3>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-100 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none"
                    required
                  />
                </div>
                {passwordError && <p className="text-red-500 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{passwordError}</p>}
                {passwordSuccess && <p className="text-green-600 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{passwordSuccess}</p>}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowChangePassword(false)} className="flex-1 px-4 py-3 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-colors font-medium">
                    Cancel
                  </button>
                  <button type="submit" disabled={changingPassword} className="flex-1 px-4 py-3 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors font-medium disabled:opacity-50">
                    {changingPassword ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-stone-900 border border-stone-800 p-8 rounded-2xl max-w-sm w-full shadow-2xl text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Confirm Deletion</h3>
              <p className="text-stone-400 mb-8">Are you sure you want to permanently delete this project?</p>
              <div className="flex gap-4">
                <button onClick={() => setDeletingId(null)} className="flex-1 px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deletingId)} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
