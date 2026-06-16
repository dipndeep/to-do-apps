import React, { useState, useEffect } from 'react';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import Toast from './components/Toast';
import { mockDb } from './utils/mockDb';

export default function App() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  // Check user session on initial load
  useEffect(() => {
    const currentUser = mockDb.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    mockDb.logout();
    setUser(null);
    showToast('Anda berhasil keluar dari sistem.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {user ? (
        <DashboardView 
          user={user} 
          onLogout={handleLogout} 
          showToast={showToast} 
        />
      ) : (
        <AuthView 
          onAuthSuccess={handleAuthSuccess} 
          showToast={showToast} 
        />
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
