import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { LandingPage } from './components/landing/LandingPage';

type View = 'landing' | 'login' | 'signup';

function AuthenticatedApp() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('landing');

  // Reset to landing page when user logs out
  useEffect(() => {
    if (!user && !loading) {
      setCurrentView('landing');
    }
  }, [user, loading]);

  console.log('App state:', { user: !!user, loading, currentView });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 mt-4 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentView === 'landing') {
      return (
        <LandingPage
          onNavigateToLogin={() => setCurrentView('login')}
          onNavigateToSignup={() => setCurrentView('signup')}
        />
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 flex items-center justify-center py-12 px-4">
        {currentView === 'login' ? (
          <LoginForm onToggleForm={() => setCurrentView('signup')} />
        ) : (
          <SignupForm onToggleForm={() => setCurrentView('login')} />
        )}
      </div>
    );
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

export default App;
