import { useState, useEffect } from 'react';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import Toast from './components/Toast';
import { mockDb } from './utils/mockDb';

export default function App() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('neobrutal_theme') || 'default';
  });

  // Check user session on initial load
  useEffect(() => {
    const currentUser = mockDb.getCurrentUser();
    if (currentUser) {
      Promise.resolve().then(() => {
        setUser(currentUser);
      });
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

  const handleChangeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('neobrutal_theme', newTheme);
  };

  const themeClass = theme === 'default' ? '' : `theme-${theme}`;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClass}`}>
      {user ? (
        <DashboardView 
          user={user} 
          onLogout={handleLogout} 
          showToast={showToast} 
          currentTheme={theme}
          onChangeTheme={handleChangeTheme}
          onUpdateUserSession={setUser}
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
