import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import CloudInstanceCard from './components/CloudInstanceCard';
import Troposphere from './components/Troposphere';
import CountUp from './components/CountUp';
import { MOCK_CLOUDS, MOCK_HEALTH, NAV_ITEMS } from './constants';
import { CloudInstance, User, CloudType, EvaporationLog } from './types';
import { 
  Plus, Wallet, Zap, Menu, X, Share2, Trash2, Ghost, Wind,
  Sun, Sparkles, HeartPulse, TrendingUp, Cloud as CloudIcon, Rocket, 
  Map as MapIcon, Droplet, ShieldCheck, Activity
} from 'lucide-react';
import gsap from 'gsap';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [instances, setInstances] = useState<CloudInstance[]>([]);
  const [history, setHistory] = useState<EvaporationLog[]>([]);
  const [userCredits, setUserCredits] = useState(142900.50);
  const [availableClouds, setAvailableClouds] = useState<any[]>([]);
  
  // Auth State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const loginRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        setIsLoggedIn(true);
        // On récupère aussi le username si possible
        const savedUser = localStorage.getItem('username');
        if (savedUser) setUsername(savedUser);
    }
  }, []);

  const fetchMarketplace = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/clouds/nearby?lat=48.8566&lng=2.3522&radius=10000');
      if (res.data.status === 'success') {
        // Filtre les nuages disponibles (supporte les deux formats d'API)
        setAvailableClouds(res.data.clouds.filter((c: any) => 
          c.is_available === true || c.availability === 'available'
        ));
      }
    } catch (err) {
      console.error("Erreur marketplace", err);
    }
  };

  const fetchMyClouds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('http://localhost:3000/auth/my-clouds', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.status === 'success' && Array.isArray(res.data.clouds)) {
        const mappedClouds = res.data.clouds.map((c: any) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          lat: c.location.lat,
          lng: c.location.lng,
          humidity: c.density * 100,
          windSpeed: 5,
          area: c.size_km2,
          status: 'Active',
          rentedAt: new Date(c.rental.start_time),
          expiresAt: new Date(c.rental.end_time),
          ownerId: 'me',
          creditsPerHour: parseFloat(c.price_per_hour)
        }));
        setInstances(mappedClouds);
      }
    } catch (err) {
      console.error("Impossible de récupérer vos nuages", err);
    }
  };

  // Fetch Current User Clouds
  useEffect(() => {
    let interval: any;

    if (isLoggedIn) {
      fetchMyClouds();
      fetchMarketplace();

      // Refresh marketplace every 10 seconds to show/hide rented clouds
      interval = setInterval(fetchMarketplace, 10000);
    } else {
        setInstances([]);
        setAvailableClouds([]);
    }

    return () => {
        if (interval) clearInterval(interval);
    };
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return setApiError("Veuillez remplir tous les champs");
    
    setLoading(true);
    setApiError('');
    setSuccessMessage('');

    try {
      let res;
      let isNewAccount = false;
      try {
        res = await axios.post('http://localhost:3000/auth/login', { username, password });
      } catch (loginErr: any) {
        if (loginErr.response?.status === 401) {
            // Tentative d'inscription si login échoue (UX Silly)
            await axios.post('http://localhost:3000/auth/register', { username, password });
            res = await axios.post('http://localhost:3000/auth/login', { username, password });
            isNewAccount = true;
        } else {
            throw loginErr;
        }
      }

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      
      // Afficher message de succès si nouveau compte
      if (isNewAccount) {
        setSuccessMessage(`Bienvenue ${username} ! Votre compte a été créé avec succès.`);
        setTimeout(() => setSuccessMessage(''), 4000);
      }
      
      // Connexion immédiate, pas d'attente d'animation
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error(err);
      setApiError(err.response?.data?.error || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setInstances([]);
    setUsername('');
    setPassword('');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const rentCloud = async (cloudId: string | number, name: string, price: number, type: string) => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`http://localhost:3000/api/clouds/${cloudId}/rent`, {
            duration_hours: 1
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.status === 'success') {
            // Rafraîchir le hangar ET le marketplace
            await fetchMyClouds();
            await fetchMarketplace();
            setUserCredits(prev => prev - price);
            setActiveTab('fleet');
        }
    } catch (err: any) {
        alert(err.response?.data?.message || "Erreur lors de la location");
    }
  };

  const liquidateCloud = async (id: string | number) => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`http://localhost:3000/api/clouds/${id}/release`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        const cloud = instances.find(i => i.id === id);
        if (cloud) {
            setHistory([{
                id: `log-${Date.now()}`,
                cloudName: cloud.name,
                evaporatedAt: new Date(),
                volumeRecovered: cloud.area * 300,
                creditsRefunded: cloud.creditsPerHour * 0.15
            }, ...history]);
            setUserCredits(prev => prev + (cloud.creditsPerHour * 0.15));
            
            // Rafraîchir le hangar ET le marketplace
            await fetchMyClouds();
            await fetchMarketplace();
        }
    } catch (err) {
        console.error("Erreur libération nuage", err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div ref={loginRef} className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-400 rounded-full blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-400 rounded-full blur-[120px] opacity-20 animate-pulse" style={{animationDelay: '1s'}} />

        <div className="fluffy-glass p-12 rounded-[4rem] w-full max-w-lg relative z-10 text-center funky-shadow-sky border-4 border-white">
          <div className="mb-10">
             <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-purple-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-[-5deg]">
                <CloudIcon className="w-12 h-12 text-white floating" />
             </div>
             <h1 className="text-5xl font-black tracking-tighter text-sky-950 italic">CLOUDIFY</h1>
             <div className="inline-block bg-pink-100 text-pink-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-4 rotate-2">
                Gestionnaire de Patrimoine Céleste
             </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            {apiError && (
              <div className="bg-red-100/80 border-2 border-red-300 backdrop-blur text-red-600 px-4 py-3 rounded-2xl relative mb-4 text-center font-bold">
                {apiError}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-sky-400 tracking-widest ml-6">Matricule Commandant</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/50 border-4 border-sky-50 rounded-3xl px-8 py-5 text-sky-900 focus:border-sky-400 transition-all outline-none font-bold placeholder:text-sky-200" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-sky-400 tracking-widest ml-6">Badge de Vol</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 border-4 border-sky-50 rounded-3xl px-8 py-5 text-sky-900 focus:border-sky-400 transition-all outline-none" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-sky-500 hover:bg-sky-600 text-white font-black py-6 rounded-3xl uppercase tracking-[0.2em] text-sm btn-funky shadow-xl shadow-sky-100 mt-4 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/>
                  INITIALISATION...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" /> OUVRIR LE HANGAR
                </>
              )}
            </button>
            <p className="text-center text-sky-400/60 text-xs font-bold uppercase tracking-widest mt-2">
              Inscription automatique activée
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full overflow-x-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Toast de succès (création de compte) */}
      {successMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top">
          <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold">
            <ShieldCheck className="w-6 h-6" />
            {successMessage}
          </div>
        </div>
      )}

      {/* Modal de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-sky-100 animate-in zoom-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-2xl font-black text-sky-950 mb-2">Quitter le hangar ?</h3>
              <p className="text-sky-600 mb-8">Voulez-vous vraiment vous déconnecter de votre espace aérien ?</p>
              <div className="flex gap-4">
                <button 
                  onClick={cancelLogout}
                  className="flex-1 px-6 py-4 bg-sky-100 text-sky-700 font-bold rounded-2xl hover:bg-sky-200 transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 px-6 py-4 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 transition-all"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 lg:h-32 flex-shrink-0 flex items-center justify-between px-8 lg:px-16 bg-white/30 backdrop-blur-xl sticky top-0 z-[100] border-b-4 border-white">
           <div className="flex items-center gap-6">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-4 bg-white rounded-2xl shadow-xl border-2 border-sky-100 text-sky-500 btn-funky">
                <Menu className="w-6 h-6" />
             </button>
             <div className="hidden sm:block">
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Espace Aérien Privé</p>
                <h1 className="text-2xl lg:text-3xl font-black text-sky-950 italic uppercase tracking-tighter leading-none">
                   {NAV_ITEMS.find(n => n.id === activeTab)?.label}
                </h1>
             </div>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 px-8 py-4 bg-white rounded-[2.5rem] border-4 border-sky-50 shadow-xl funky-shadow-sky relative group cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Droplet className="w-5 h-5 text-sky-500 relative z-10" />
                <span className="text-base lg:text-lg font-black text-sky-950 mono relative z-10">
                  <CountUp value={userCredits} prefix="C$ " decimals={2} />
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3 px-6 py-3 bg-sky-50 rounded-2xl border-2 border-sky-100">
                <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-white font-black text-sm">
                  {(localStorage.getItem('username') || username || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-sky-900 text-sm">{localStorage.getItem('username') || username}</span>
              </div>
              <button onClick={handleLogout} className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border-2 border-rose-100 shadow-lg btn-funky">
                <X className="w-6 h-6" />
              </button>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar relative">
          <div className="max-w-[1400px] mx-auto space-y-12 lg:space-y-16 pb-24">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-12 lg:space-y-16 animate-in">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  <div className="lg:col-span-8 fluffy-glass p-10 lg:p-16 rounded-[4.5rem] relative overflow-hidden group border-4 border-white funky-shadow-sky">
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-sky-100 rounded-full blur-3xl opacity-50" />
                    <div className="relative z-10 max-w-2xl">
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-500 to-purple-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 shadow-lg rotate-[-2deg]">
                        <Activity className="w-4 h-4" /> STATUT ATMOSPHÉRIQUE : STABLE
                      </div>
                      <h2 className="text-3xl lg:text-5xl font-black text-sky-950 italic tracking-tighter mb-10 leading-[0.85] uppercase">
                        VOTRE TÊTE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-500">DANS NOS NUAGES.</span>
                      </h2>
                      <p className="text-sky-700/80 text-lg lg:text-2xl font-bold mb-12 leading-relaxed max-w-lg">
                        Gestionnaire d'actifs vaporeux. Louez votre propre parcelle de ciel et contrôlez le climat avec une précision millimétrée.
                      </p>
                      <button onClick={() => setActiveTab('marketplace')} className="bg-sky-500 text-white font-black px-12 lg:px-14 py-6 lg:py-7 rounded-[2rem] text-xs lg:text-sm uppercase tracking-widest shadow-2xl shadow-sky-200 btn-funky hover:rotate-2 flex items-center gap-4">
                         <Plus className="w-6 h-6" /> CAPTURER UN NUAGE
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                    <div className="fluffy-glass p-12 rounded-[4rem] flex flex-col justify-center text-center border-4 border-white funky-shadow-purple">
                        <p className="text-[11px] font-black uppercase text-purple-400 tracking-[0.3em] mb-4">GARANTIE DE PRÉCIPITATION</p>
                        <p className="text-6xl font-black text-sky-950 italic leading-none">100<span className="text-2xl text-purple-300">%</span></p>
                        <p className="text-[10px] font-bold text-sky-300 mt-4 uppercase">Aucun risque de sécheresse</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-12 rounded-[4rem] flex flex-col justify-center text-center text-white shadow-2xl relative overflow-hidden group btn-funky">
                        <Sun className="w-16 h-16 mx-auto mb-6 floating text-white/90" />
                        <p className="text-[11px] font-black uppercase tracking-widest mb-2 opacity-80">RÉSEAU SATELLITE</p>
                        <p className="text-4xl font-black uppercase italic leading-none">COELUM_MAX</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                  {[
                    {l:'Flotte Active',v:instances.length,i:<CloudIcon/>, c:'text-sky-500', bg:'bg-sky-50', shadow: 'funky-shadow-sky'},
                    {l:'Solde Pilote',v:userCredits,i:<Droplet/>, c:'text-emerald-500', bg:'bg-emerald-50', p:true, shadow: 'funky-shadow-purple'},
                    {l:'Nuages Évaporés',v:history.length,i:<Ghost/>, c:'text-indigo-500', bg:'bg-indigo-50', shadow: 'funky-shadow-pink'},
                    {l:'Captation',v:4,i:<Sparkles/>, c:'text-orange-500', bg:'bg-orange-50', shadow: 'funky-shadow-sky'}
                  ].map((s,i)=>(
                    <div key={i} className={`fluffy-glass p-4 lg:p-6 rounded-2xl lg:rounded-3xl border-2 border-white flex flex-col items-center text-center gap-3 group ${s.shadow} overflow-hidden`}>
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 ${s.bg} ${s.c} rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-all flex-shrink-0`}>{s.i}</div>
                      <div className="min-w-0 w-full">
                        <p className="text-[9px] lg:text-[10px] font-black uppercase text-sky-300 tracking-wider mb-1 truncate">{s.l}</p>
                        <p className="text-base lg:text-xl font-black text-sky-950 italic truncate">
                            <CountUp value={s.v} prefix={s.p ? "" : ""} decimals={s.p ? 0 : 0} suffix={s.p ? " C$" : ""} />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="fluffy-glass p-12 lg:p-16 rounded-[4.5rem] h-80 flex flex-col border-4 border-white funky-shadow-purple">
                   <h3 className="text-sm font-black uppercase tracking-widest text-sky-950 mb-10 flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-500 shadow-inner"><Activity className="w-7 h-7"/></div>
                      BULLETIN D'ACTIVITÉ CÉLESTE
                   </h3>
                   <div className="mono text-[12px] text-sky-400 space-y-3 overflow-y-auto h-full pb-6 custom-scrollbar pr-4">
                      <p><span className="text-emerald-500 font-bold">11:05:22</span> [STATION-EST] Cumulus 'Paris-Ops' stabilisé à 4200m. Humidité 88%.</p>
                      <p><span className="text-sky-500 font-bold">11:08:45</span> [PILOTAGE] Badge de commandant authentifié. Bon vol.</p>
                      <p><span className="text-amber-500 font-bold">11:12:00</span> [CAPTAGE] 250m³ de vapeur condensés dans l'Unité-01.</p>
                      <p><span className="text-purple-500 font-bold">11:15:33</span> [SATELLITE] Dérive de 2° détectée sur la flotte 'NY-Vapor'. Correction appliquée.</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'fleet' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 animate-in">
                {instances.map(inst => (
                  <div key={inst.id} className="relative group">
                    <CloudInstanceCard instance={inst} />
                    <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all z-50 translate-y-2 group-hover:translate-y-0">
                       <button onClick={() => alert("Coordonnées satellite partagées.")} className="w-12 h-12 bg-white rounded-2xl border-4 border-sky-50 text-sky-500 hover:bg-sky-500 hover:text-white transition-all shadow-xl flex items-center justify-center btn-funky"><Share2 className="w-5 h-5"/></button>
                       <button onClick={() => liquidateCloud(inst.id)} className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl border-4 border-rose-100 hover:bg-rose-500 hover:text-white transition-all shadow-xl flex items-center justify-center btn-funky"><Trash2 className="w-5 h-5"/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in">
                {availableClouds.length > 0 ? availableClouds.map((cloud) => (
                  <div key={cloud.id} className="fluffy-glass p-8 rounded-[2.5rem] flex flex-col group border-4 border-white funky-shadow-sky hover:funky-shadow-purple transition-all">
                    {/* Header avec icône et badge */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-[-5deg] transition-all shadow-inner border-2 border-white flex-shrink-0">
                        <CloudIcon className="w-8 h-8 text-sky-400" />
                      </div>
                      <span className="bg-sky-100 text-sky-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase flex-shrink-0">{cloud.type}</span>
                    </div>
                    
                    {/* Nom du nuage */}
                    <h3 className="text-xl font-black italic tracking-tight text-sky-950 uppercase leading-tight mb-4 line-clamp-2">{cloud.name}</h3>
                    
                    {/* Infos techniques */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-sky-50/50 rounded-xl p-3">
                        <p className="text-[9px] font-bold text-sky-400 uppercase">Surface</p>
                        <p className="text-sm font-black text-sky-800">{cloud.size_km2} km²</p>
                      </div>
                      <div className="bg-sky-50/50 rounded-xl p-3">
                        <p className="text-[9px] font-bold text-sky-400 uppercase">Altitude</p>
                        <p className="text-sm font-black text-sky-800">{cloud.altitude_m} m</p>
                      </div>
                      <div className="bg-sky-50/50 rounded-xl p-3">
                        <p className="text-[9px] font-bold text-sky-400 uppercase">Densité</p>
                        <p className="text-sm font-black text-sky-800">{cloud.density}%</p>
                      </div>
                      <div className="bg-sky-50/50 rounded-xl p-3">
                        <p className="text-[9px] font-bold text-sky-400 uppercase">Distance</p>
                        <p className="text-sm font-black text-sky-800">{cloud.distance_km ? `${cloud.distance_km.toFixed(0)} km` : 'N/A'}</p>
                      </div>
                    </div>
                    
                    {/* Footer avec prix et bouton */}
                    <div className="mt-auto pt-6 border-t-2 border-sky-100 flex justify-between items-center gap-4">
                       <div className="min-w-0">
                          <p className="text-[9px] font-black text-sky-300 uppercase tracking-widest mb-1">Prix/heure</p>
                          <p className="text-2xl font-black text-sky-950 mono italic">{cloud.price_per_hour}<span className="text-xs text-sky-300 ml-1">C$</span></p>
                       </div>
                       <button 
                         onClick={() => rentCloud(cloud.id, cloud.name, parseFloat(cloud.price_per_hour), cloud.type)} 
                         className="bg-sky-500 hover:bg-sky-600 text-white font-black px-6 py-4 rounded-xl text-xs uppercase tracking-wider shadow-lg btn-funky flex-shrink-0"
                       >
                         LOUER
                       </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-20 text-center">
                    <Wind className="w-20 h-20 text-sky-200 mx-auto mb-6 animate-bounce" />
                    <p className="text-2xl font-black text-sky-300 italic uppercase">Aucun nuage disponible</p>
                    <p className="text-sky-400 font-bold mt-2">Dégagement atmosphérique total détecté.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'troposphere' && (
              <div className="h-[600px] lg:h-[800px] animate-in">
                <Troposphere instances={instances} />
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-8 animate-in">
                <div className="fluffy-glass p-12 rounded-[4rem] border-4 border-white funky-shadow-pink min-h-[400px]">
                   <h3 className="text-2xl font-black italic tracking-tighter text-sky-950 mb-8 uppercase flex items-center gap-4">
                      <Ghost className="w-8 h-8 text-indigo-400"/> ARCHIVES DES NUAGES ÉVAPORÉS
                   </h3>
                   {history.length === 0 ? (
                     <div className="py-20 text-center">
                        <CloudIcon className="w-16 h-16 text-sky-100 mx-auto mb-4 animate-bounce" />
                        <p className="text-sky-300 font-bold uppercase tracking-widest">Aucune parcelle n'a encore rejoint le paradis céleste.</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        {history.map(h => (
                          <div key={h.id} className="bg-sky-50/50 p-6 rounded-3xl border-2 border-white flex justify-between items-center">
                             <div>
                                <p className="text-lg font-black text-sky-950 uppercase italic">{h.cloudName}</p>
                                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">{h.evaporatedAt.toLocaleTimeString()}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-xl font-black text-indigo-500 italic">+{h.creditsRefunded} C$</p>
                                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Taxes d'évaporation récupérées</p>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in">
                  <div className="fluffy-glass p-12 rounded-[4.5rem] border-4 border-white funky-shadow-purple flex flex-col items-center justify-center text-center">
                     <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-500 mb-8 shadow-inner">
                        <Wallet className="w-12 h-12" />
                     </div>
                     <p className="text-[11px] font-black uppercase text-sky-300 tracking-[0.4em] mb-4">CRÉDITS_DISPONIBLES</p>
                     <p className="text-6xl font-black text-sky-950 italic mono mb-10">
                        <CountUp value={userCredits} prefix="" decimals={2} />
                     </p>
                     <button className="bg-emerald-500 text-white font-black px-12 py-6 rounded-3xl uppercase tracking-widest text-sm shadow-xl btn-funky">
                        ALIMENTER LE COMPTE-GOUTTES
                     </button>
                  </div>
                  <div className="fluffy-glass p-12 rounded-[4.5rem] border-4 border-white funky-shadow-sky overflow-hidden relative">
                     <h3 className="text-xl font-black italic text-sky-950 uppercase mb-8">Journal des Transactions</h3>
                     <div className="space-y-4">
                        {instances.length === 0 && history.length === 0 ? (
                           <div className="text-center py-8">
                              <p className="text-sky-300 font-bold">Aucune transaction</p>
                              <p className="text-sky-200 text-sm mt-2">Louez un nuage pour commencer</p>
                           </div>
                        ) : (
                           <>
                              {instances.map((cloud, i) => (
                                 <div key={`rent-${cloud.id}`} className="flex justify-between items-center py-4 border-b border-sky-50">
                                    <span className="text-sm font-bold text-sky-600">Location - {cloud.name}</span>
                                    <span className="font-black text-rose-400">-{cloud.creditsPerHour} C$</span>
                                 </div>
                              ))}
                              {history.map((log, i) => (
                                 <div key={`evap-${log.id}`} className="flex justify-between items-center py-4 border-b border-sky-50">
                                    <span className="text-sm font-bold text-indigo-400">Remboursement - {log.cloudName}</span>
                                    <span className="font-black text-emerald-400">+{log.creditsRefunded.toFixed(2)} C$</span>
                                 </div>
                              ))}
                           </>
                        )}
                     </div>
                  </div>
               </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
