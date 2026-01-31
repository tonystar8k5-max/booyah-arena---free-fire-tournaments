
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import PlayerDashboard from './components/PlayerDashboard';
import TournamentDetails from './components/TournamentDetails';
import WalletPanel from './components/WalletPanel';
import ProfilePage from './components/ProfilePage';
import RulesPage from './components/RulesPage';
import AdminPanel from './components/AdminPanel';
import { User, Tournament, ViewState } from './types';
import { getStoredTournaments, purchaseTournament, getStoredUsers } from './services/storage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('AUTH');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  // Memoized update to prevent lag during state changes
  const handleUpdate = useCallback(() => {
    setTournaments(getStoredTournaments());
    if (user) {
      const allUsers = getStoredUsers();
      const updatedUser = allUsers.find(u => u.uid === user.uid);
      if (updatedUser) setUser(updatedUser);
    }
  }, [user]);

  useEffect(() => {
    setTournaments(getStoredTournaments());
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    if (loggedInUser.isBlocked) {
      alert("Account Blocked. Contact Support.");
      return;
    }
    setUser(loggedInUser);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setView('AUTH');
    setSelectedTournament(null);
  };

  const handleTournamentSelect = (t: Tournament) => {
    setSelectedTournament(t);
    setView('DETAILS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJoinTournament = (id: string) => {
    if (user) {
      const result = purchaseTournament(id, user.uid);
      if (result.success) {
        handleUpdate();
      }
    }
  };

  // Safe view change helper
  const changeView = (newView: ViewState) => {
    if (!user && newView !== 'AUTH') {
      setView('AUTH');
    } else {
      setView(newView);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-orange-500 selection:text-white">
      <Header 
        user={user} 
        currentView={view} 
        onLogout={handleLogout} 
        setView={changeView} 
      />

      <main className="flex-grow pb-24 md:pb-8">
        <div key={view} className="smooth-view h-full">
          {view === 'AUTH' && !user && <AuthForm onLoginSuccess={handleLoginSuccess} />}
          
          {(view === 'DASHBOARD' || (view === 'AUTH' && user)) && user && (
            <PlayerDashboard 
              user={user} 
              tournaments={tournaments} 
              onSelectTournament={handleTournamentSelect} 
            />
          )}

          {view === 'DETAILS' && user && selectedTournament && (
            <TournamentDetails 
              tournament={tournaments.find(t => t.id === selectedTournament.id) || selectedTournament}
              user={user}
              onBack={() => setView('DASHBOARD')}
              onJoin={handleJoinTournament}
            />
          )}

          {view === 'WALLET' && user && (
            <WalletPanel 
              user={user}
              onBack={() => setView('DASHBOARD')}
              onRefreshUser={handleUpdate}
            />
          )}

          {view === 'PROFILE' && user && (
            <ProfilePage 
              user={user}
              tournaments={tournaments}
              onBack={() => setView('DASHBOARD')}
            />
          )}

          {view === 'RULES' && user && (
            <RulesPage 
              onBack={() => setView('DASHBOARD')}
            />
          )}

          {view === 'ADMIN' && user?.isAdmin && (
            <AdminPanel 
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </main>

      {/* Mobile Sticky Navigation - Improved Responsiveness */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 p-2 md:hidden z-40 flex items-center justify-around safe-pb shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
           <MobileNavBtn active={view === 'DASHBOARD'} onClick={() => changeView('DASHBOARD')}>Matches</MobileNavBtn>
           <MobileNavBtn active={view === 'RULES'} onClick={() => changeView('RULES')}>Rules</MobileNavBtn>
           <MobileNavBtn active={view === 'WALLET'} onClick={() => changeView('WALLET')}>Wallet</MobileNavBtn>
           <MobileNavBtn active={view === 'PROFILE'} onClick={() => changeView('PROFILE')}>Profile</MobileNavBtn>
        </div>
      )}
    </div>
  );
};

const MobileNavBtn = ({ children, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 text-[10px] font-black uppercase italic tracking-widest transition-all ${active ? 'text-orange-500 scale-105' : 'text-zinc-600'}`}
  >
    {children}
  </button>
);

export default App;
