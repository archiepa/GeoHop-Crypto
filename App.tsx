
import React, { useState, useEffect, useRef } from 'react';
import { AppView, User, Transaction } from './types';
import { ChatBot } from './components/ChatBot';
import { api } from './services/api';

// --- Icons ---
const IconRadio = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>;
const IconWallet = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V3"/><path d="M9 9a2 2 0 0 1-2-2V5"/><path d="M13 13h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"/><path d="M11 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5"/></svg>;
const IconActivity = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconLogOut = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconPickaxe = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IconQrCode = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>;
const IconArrowUpRight = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>;
const IconArrowDownLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 7 7 17"/><path d="M17 17H7V7"/></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconSignal = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20v-12"/><path d="M22 20v-16"/></svg>;
const IconShield = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

// --- Main App Component ---
function App() {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [peers, setPeers] = useState<User[]>([]);
  
  // Fetch Data Routine
  const refreshData = async () => {
    if (!user) return;
    try {
      // Refresh User data
      const updatedUser = await api.getUser(user.username);
      if (updatedUser) setUser(updatedUser);

      // Refresh transactions
      const txs = await api.getTransactions(user.username);
      setTransactions(txs);

      // Refresh Peers for Dashboard
      if (view === AppView.DASHBOARD) {
        const allUsers = await api.getAllUsers();
        setPeers(allUsers.filter(u => u.id !== user.id && u.role !== 'admin'));
      }
    } catch (e) {
      console.error("Sync Failed", e);
    }
  };

  // Sync Interval
  useEffect(() => {
    if (user && view !== AppView.LANDING) {
      refreshData();
      const interval = setInterval(refreshData, 5000); // Polling for "Cloud Sync"
      return () => clearInterval(interval);
    }
  }, [user, view]);


  const handleLogout = () => {
    setUser(null);
    setTransactions([]);
    setPeers([]);
    setView(AppView.LANDING);
  };

  const handleSendFunds = async (amount: number, recipientId: string) => {
    if (!user) return;
    try {
      await api.sendFunds(user.username, recipientId, amount);
      await refreshData();
      return true;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Transaction failed");
      return false;
    }
  };

  const handleMiningReward = async (amount: number) => {
    if (!user) return;
    try {
      await api.mineReward(user.username, amount);
      // We don't force full refresh here to avoid UI flickering during rapid mining,
      // but we update local state for visuals
      setUser(prev => prev ? ({...prev, balance: prev.balance + amount}) : null);
    } catch (e) {
      console.error("Mining error", e);
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-emerald-500/30 ${user?.role === 'admin' ? 'text-amber-50 bg-slate-950' : 'text-slate-100'}`}>
      {/* Navbar */}
      <nav className={`fixed w-full top-0 z-40 backdrop-blur-md border-b ${user?.role === 'admin' ? 'bg-amber-950/80 border-amber-800' : 'bg-slate-900/80 border-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => !user && setView(AppView.LANDING)}>
              <div className={`p-2 rounded-lg border ${user?.role === 'admin' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/20 text-white'}`}>
                {user?.role === 'admin' ? <IconShield /> : <IconRadio />}
              </div>
              <span className="text-xl font-bold tracking-tighter">
                Geo<span className={user?.role === 'admin' ? 'text-amber-500' : 'text-emerald-400'}>Hop</span>
                {user?.role === 'admin' && <span className="text-xs ml-2 bg-amber-600 text-white px-2 py-0.5 rounded uppercase tracking-widest">Admin</span>}
              </span>
            </div>
            <div>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="hidden md:block text-xs font-mono text-slate-400">
                    ID: {user.nodeId}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <IconLogOut />
                  </button>
                </div>
              ) : (
                view === AppView.LANDING && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setView(AppView.LOGIN)}
                      className="px-4 py-2 text-sm font-semibold text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10 transition-all"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setView(AppView.REGISTER)}
                      className="px-4 py-2 text-sm font-semibold text-slate-900 bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      Sign Up
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        
        {view === AppView.LANDING && <LandingPage onStart={() => setView(AppView.LOGIN)} />}
        
        {(view === AppView.LOGIN || view === AppView.REGISTER) && (
          <AuthPage 
            isRegister={view === AppView.REGISTER} 
            onSuccess={(u) => {
              setUser(u);
              setView(u.role === 'admin' ? AppView.ADMIN : AppView.DASHBOARD);
            }} 
            onSwitch={() => setView(view === AppView.LOGIN ? AppView.REGISTER : AppView.LOGIN)}
            onBack={() => setView(AppView.LANDING)}
          />
        )}
        
        {view === AppView.DASHBOARD && user && (
          <Dashboard 
            user={user} 
            transactions={transactions}
            peers={peers}
            onSend={handleSendFunds}
            onMine={handleMiningReward}
          />
        )}

        {view === AppView.ADMIN && user?.role === 'admin' && (
           <AdminDashboard />
        )}

      </main>

      <ChatBot />
    </div>
  );
}

// --- Sub-components ---

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-12 py-12">
      <div className="space-y-6 max-w-3xl">
        <div className="inline-block px-3 py-1 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 rounded-full mb-4">
          MESH PROTOCOL V2.5 ONLINE
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          Decentralized Finance <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">
            Over The Airwaves
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          GeoHop leverages the Meshtastic LoRa network to process transactions without the internet. 
          Bank where the signal reaches.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-105"
          >
            Access Wallet
          </button>
          <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-all">
            View Protocol Specs
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-4xl py-8 flex justify-center">
         <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur opacity-20 animate-pulse group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-slate-900 rounded-full p-12 border border-slate-800 shadow-2xl">
               <div className="text-emerald-500 w-32 h-32">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl text-left">
        {[
          { title: "Off-Grid Capable", desc: "Transactions gossip across nodes via LoRa 915MHz/433MHz." },
          { title: "Proof of Coverage", desc: "Earn HOP by relaying packets and extending the mesh network." },
          { title: "Encrypted & Secure", desc: "AES-256 encryption on all radio packets ensuring wallet safety." }
        ].map((item, i) => (
          <div key={i} className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-emerald-500/30 transition-colors">
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthPage = ({ isRegister, onSuccess, onSwitch, onBack }: { 
  isRegister: boolean, 
  onSuccess: (u: User) => void, 
  onSwitch: () => void,
  onBack: () => void
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setError('');
    
    try {
      let user;
      if (isRegister) {
        user = await api.register({ username, password });
      } else {
        user = await api.login({ username, password });
      }
      onSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-400 font-mono animate-pulse">
              {isRegister ? 'GENERATING KEYS...' : 'DECRYPTING...'}
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
            <IconRadio />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">{isRegister ? 'Initialize Node' : 'Secure Sign In'}</h2>
        <p className="text-center text-slate-400 mb-8 text-sm">
          {isRegister ? 'Create a new identity on the mesh.' : 'Enter credentials to unlock your wallet.'}
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs text-center font-mono">
            ERROR: {error.toUpperCase()}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">CALLSIGN / USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none font-mono placeholder:text-slate-700"
              placeholder="KK4-TCP"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1">PASSPHRASE</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none font-mono"
              placeholder="••••••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            {isRegister ? 'Generate Identity' : 'Authenticate'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">{isRegister ? 'Already have a node?' : 'New to the network?'} </span>
          <button onClick={onSwitch} className="text-emerald-400 hover:text-emerald-300 font-bold ml-1">
             {isRegister ? 'Sign In' : 'Initialize'}
          </button>
        </div>
        
        <button onClick={onBack} className="w-full mt-4 text-sm text-slate-500 hover:text-slate-300">
          Cancel
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ user, transactions, peers, onSend, onMine }: { 
  user: User; 
  transactions: Transaction[]; 
  peers: User[];
  onSend: (amt: number, to: string) => Promise<boolean | undefined>; 
  onMine: (amt: number) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'send' | 'receive' | 'mine'>('overview');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  
  // Mining state
  const [isMining, setIsMining] = useState(false);
  const [miningLogs, setMiningLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [miningLogs]);

  // Mining simulation loop
  useEffect(() => {
    let interval: number;
    if (isMining) {
      interval = window.setInterval(() => {
        const actions = [
          "Scanning 915MHz spectrum...",
          "Heartbeat received from !f3a2...",
          "Relaying packet (RSS -12dB)...",
          "Syncing mesh ledger...",
          "Verifying Proof of Coverage...",
          "Optimizing routes...",
          "Beacon transmitted."
        ];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const timestamp = new Date().toLocaleTimeString();
        setMiningLogs(prev => [...prev.slice(-15), `[${timestamp}] ${randomAction}`]);

        // Random reward chance (approx every 10-15 seconds)
        if (Math.random() > 0.85) {
          const reward = parseFloat((Math.random() * 0.5).toFixed(4));
          onMine(reward);
          setMiningLogs(prev => [...prev.slice(-15), `[${timestamp}] >>> BLOCK FOUND! Reward: ${reward} HOP <<<`]);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isMining, onMine]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val && recipient) {
      const success = await onSend(val, recipient);
      if (success) {
        setAmount('');
        setRecipient('');
        setActiveTab('overview');
      }
    }
  };

  const handleSendToPeer = (nodeId: string) => {
    setRecipient(nodeId);
    setActiveTab('send');
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <IconWallet />
          </div>
          <p className="text-slate-400 text-sm font-mono mb-1">CURRENT BALANCE</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            {user.balance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} <span className="text-emerald-500">HOP</span>
          </h2>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            SYNCED WITH MESH
          </div>
        </div>

        <div className="flex-1 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Node Status</h3>
            <IconActivity className="text-emerald-500 opacity-50" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
                <p className="text-slate-500 text-xs font-mono">FIRST SEEN</p>
                <p className="text-white font-mono">{new Date(user.joinedAt).toLocaleDateString()}</p>
             </div>
             <div>
                <p className="text-slate-500 text-xs font-mono">PEAK BALANCE</p>
                <p className="text-white font-mono">{user.highestBalance?.toFixed(4) || '0.0000'}</p>
             </div>
             <div>
                <p className="text-slate-500 text-xs font-mono">TOTAL TXs</p>
                <p className="text-white font-mono">{transactions.length}</p>
             </div>
             <div>
                <p className="text-slate-500 text-xs font-mono">NODE TRUST</p>
                <p className="text-white font-mono">{(0.9 + (transactions.length * 0.01)).toFixed(2)}%</p>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-800 flex gap-6 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-white'}`}
        >
          Transactions & Nodes
        </button>
        <button 
          onClick={() => setActiveTab('mine')}
          className={`pb-4 text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'mine' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-white'}`}
        >
          <span className="w-4 h-4"><IconPickaxe /></span> Mine / Relay
        </button>
        <button 
          onClick={() => setActiveTab('send')}
          className={`pb-4 text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'send' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-white'}`}
        >
          <span className="w-4 h-4"><IconArrowUpRight /></span> Send
        </button>
         <button 
          onClick={() => setActiveTab('receive')}
          className={`pb-4 text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'receive' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-white'}`}
        >
          <span className="w-4 h-4"><IconArrowDownLeft /></span> Receive
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-800/50 text-xs font-mono text-slate-400 border-b border-slate-700">
                   <th className="p-4 font-normal">TYPE</th>
                   <th className="p-4 font-normal">ID / PEER</th>
                   <th className="p-4 font-normal">DATE</th>
                   <th className="p-4 font-normal text-right">AMOUNT</th>
                   <th className="p-4 font-normal text-right">STATUS</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-800">
                 {transactions.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-500">No transactions yet. Start mining!</td></tr>
                 ) : transactions.map(tx => (
                   <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                     <td className="p-4">
                       <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                         ${tx.type === 'receive' ? 'bg-emerald-500/10 text-emerald-400' : 
                           tx.type === 'send' ? 'bg-amber-500/10 text-amber-400' : 
                           'bg-blue-500/10 text-blue-400'}`}>
                         {tx.type}
                       </span>
                     </td>
                     <td className="p-4 font-mono text-sm text-slate-300">
                        <div className="flex flex-col">
                          <span>{tx.id}</span>
                          <span className="text-slate-500 text-xs">{tx.peerId || 'NETWORK_REWARD'}</span>
                        </div>
                     </td>
                     <td className="p-4 text-sm text-slate-400">
                       {new Date(tx.timestamp).toLocaleDateString()} <span className="text-xs opacity-50">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                     </td>
                     <td className={`p-4 text-right font-mono font-bold ${tx.type === 'send' ? 'text-slate-200' : 'text-emerald-400'}`}>
                       {tx.type === 'send' ? '-' : '+'}{tx.amount.toFixed(4)}
                     </td>
                     <td className="p-4 text-right">
                        <span className={`text-xs ${tx.status === 'completed' ? 'text-slate-400' : 'text-amber-400 animate-pulse'}`}>
                          {tx.status}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
            </div>
            
            {/* Peer Directory List */}
            <div className="w-full">
              <h3 className="text-sm font-bold text-slate-400 mb-4 font-mono flex items-center gap-2">
                <IconUsers /> NETWORK DIRECTORY <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs">{peers.length} NODES</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {peers.length === 0 ? (
                  <div className="col-span-full py-12 px-6 text-center bg-slate-900 border border-slate-800 border-dashed rounded-xl">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-600">
                      <IconSignal />
                    </div>
                    <p className="text-slate-500 text-sm">No other nodes detected on the network.</p>
                  </div>
                ) : (
                  peers.map((peer) => (
                    <div key={peer.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-emerald-500/30 transition-all hover:bg-slate-800/50 group">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold border border-emerald-500/20">
                              {peer.callsign.substring(0,2)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200 text-sm">{peer.callsign}</h4>
                                <div className="text-[10px] font-mono text-emerald-500/80">{peer.nodeId}</div>
                            </div>
                          </div>
                          <div className="flex h-2 w-2 relative">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                           <div className="flex justify-between text-xs text-slate-500">
                              <span>Signal</span>
                              <span className="text-emerald-400 font-mono">-{(Math.random() * 20 + 90).toFixed(0)} dBm</span>
                           </div>
                           <div className="flex justify-between text-xs text-slate-500">
                              <span>Seen</span>
                              <span className="text-slate-400">{new Date(peer.joinedAt).toLocaleDateString()}</span>
                           </div>
                        </div>

                        <button 
                          onClick={() => handleSendToPeer(peer.nodeId)}
                          className="w-full py-2 bg-slate-800 hover:bg-emerald-600/20 hover:text-emerald-400 text-slate-400 text-xs font-bold rounded border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2"
                        >
                          <IconArrowUpRight className="w-3 h-3" /> Send Funds
                        </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mine' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center text-center justify-center space-y-6">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isMining ? 'bg-emerald-500/10 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : 'bg-slate-800'}`}>
                <div className={`text-emerald-500 transform transition-transform duration-1000 ${isMining ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                   <IconPickaxe />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Proof of Coverage Mining</h3>
                <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
                  Relay packets for nearby nodes to earn HOP rewards. Requires active radio connection.
                </p>
              </div>
              <button 
                onClick={() => setIsMining(!isMining)}
                className={`px-8 py-3 rounded-lg font-bold transition-all shadow-lg ${
                  isMining 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                }`}
              >
                {isMining ? 'Stop Relaying' : 'Start Mining'}
              </button>
            </div>

            <div className="bg-black/40 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-hidden flex flex-col h-[350px]">
              <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2 mb-2">
                <span>TERMINAL_OUTPUT</span>
                <span className={`w-2 h-2 rounded-full ${isMining ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 text-slate-300" ref={logContainerRef}>
                {miningLogs.length === 0 && <span className="text-slate-600">Waiting for command...</span>}
                {miningLogs.map((log, i) => (
                   <div key={i} className={log.includes("BLOCK FOUND") ? "text-emerald-400 font-bold" : ""}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'send' && (
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <IconArrowUpRight /> Send Funds
            </h3>
            <form onSubmit={handleTransfer} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2">RECIPIENT NODE ID</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-500">!</span>
                  <input 
                    type="text" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="8f9a2b..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-4 py-3 font-mono text-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-2">AMOUNT (HOP)</label>
                <input 
                  type="number" 
                  step="0.0001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 font-mono text-white text-lg focus:border-emerald-500 outline-none"
                  required
                />
                <div className="text-right text-xs text-slate-500 mt-2">
                  Available: {user.balance.toFixed(4)} HOP
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/20"
              >
                Sign & Broadcast
              </button>
            </form>
          </div>
        )}

        {activeTab === 'receive' && (
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <IconArrowDownLeft /> Receive Funds
            </h3>
            <p className="text-slate-400 text-sm mb-8">Share your Node ID to receive HOP payments.</p>

            <div className="p-4 bg-white rounded-xl mb-8">
               <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-900">
                  <IconQrCode /> 
                  {/* In a real app, use a QR code library here */}
               </div>
            </div>

            <div className="w-full">
              <label className="block text-xs font-mono text-slate-500 mb-2 text-left">YOUR NODE ID</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 font-mono text-emerald-400 text-center select-all">
                  {user.nodeId}
                </div>
                <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white font-semibold transition-colors">
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState('');

  const load = async () => {
    const all = await api.getAllUsers();
    setUsers(all);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = async (username: string) => {
    const val = parseFloat(editBalance);
    if (!isNaN(val)) {
        await api.adminUpdateBalance(username, val);
        setEditId(null);
        load();
    }
  };

  const handleDelete = async (username: string) => {
      if(window.confirm(`Are you sure you want to purge ${username}?`)) {
          try {
              await api.adminDeleteUser(username);
              load();
          } catch(e) {
              alert(e instanceof Error ? e.message : 'Error');
          }
      }
  }

  return (
    <div className="bg-amber-950/20 p-6 rounded-2xl border border-amber-900/50">
      <h2 className="text-3xl font-bold text-amber-500 mb-6 flex items-center gap-3">
        <IconShield /> NETWORK OVERSEER
      </h2>

      <div className="overflow-x-auto rounded-xl border border-amber-900/30">
        <table className="w-full text-left text-sm text-amber-100">
            <thead className="bg-amber-950/50 uppercase font-mono text-amber-600/80">
                <tr>
                    <th className="p-4">Username</th>
                    <th className="p-4">Node ID</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-right">Balance</th>
                    <th className="p-4 text-center">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-amber-900/30 bg-slate-900/40">
                {users.map(u => (
                    <tr key={u.id} className="hover:bg-amber-900/20">
                        <td className="p-4 font-bold">{u.username}</td>
                        <td className="p-4 font-mono text-xs opacity-70">{u.nodeId}</td>
                        <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-xs uppercase ${u.role === 'admin' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                {u.role}
                            </span>
                        </td>
                        <td className="p-4 text-right font-mono">
                            {editId === u.id ? (
                                <div className="flex justify-end gap-2">
                                    <input 
                                        type="number" 
                                        value={editBalance} 
                                        onChange={e => setEditBalance(e.target.value)}
                                        className="w-24 bg-slate-950 border border-amber-700 px-2 py-1 rounded"
                                    />
                                    <button onClick={() => handleUpdate(u.username)} className="text-green-400">Save</button>
                                    <button onClick={() => setEditId(null)} className="text-slate-500">X</button>
                                </div>
                            ) : (
                                <span onClick={() => { setEditId(u.id); setEditBalance(u.balance.toString()); }} className="cursor-pointer border-b border-dotted border-amber-500/30 hover:text-amber-400">
                                    {u.balance.toFixed(4)}
                                </span>
                            )}
                        </td>
                        <td className="p-4 flex justify-center gap-4">
                            {u.role !== 'admin' && (
                                <button onClick={() => handleDelete(u.username)} className="text-red-500 hover:text-red-400 p-1">
                                    <IconTrash />
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
