
import React, { useRef } from 'react';
import { CloudInstance } from '../types';
import { Droplets, Wind, Cloud as CloudIcon, Clock } from 'lucide-react';
import gsap from 'gsap';

interface Props {
  instance: CloudInstance;
}

// Fonction pour calculer le temps restant avant expiration
const getTimeRemaining = (expiresAt: Date) => {
  const now = new Date();
  const diff = new Date(expiresAt).getTime() - now.getTime();
  if (diff <= 0) return { text: 'Expiré', hours: 0, isDanger: true };
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { 
    text: `${hours}h ${mins}min`, 
    hours, 
    isDanger: hours < 1 
  };
};

const CloudInstanceCard: React.FC<Props> = ({ instance }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const timeInfo = getTimeRemaining(instance.expiresAt);
  const isDanger = timeInfo.isDanger;

  const onEnter = () => {
    if (cardRef.current) {
        gsap.to(cardRef.current, { 
            y: -5, 
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            duration: 0.3,
            ease: "power2.out" 
        });
    }
  };

  const onLeave = () => {
    if (cardRef.current) {
        gsap.to(cardRef.current, { 
            y: 0, 
            boxShadow: "none",
            duration: 0.3, 
            ease: "power2.out" 
        });
    }
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`bg-white rounded-2xl p-6 relative overflow-hidden flex flex-col h-full border transition-colors ${
        isDanger ? 'border-rose-100 shadow-sm' : 'border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
             <CloudIcon className="w-3 h-3 text-slate-500" />
             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{instance.type}</span>
          </div>
          <h3 className="font-bold text-xl text-slate-900 leading-tight">{instance.name}</h3>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          instance.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
        }`}>
          {instance.status === 'Active' ? 'Actif' : 'Maintenance'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
             <Droplets className="w-4 h-4 text-sky-500" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Humidité</span>
          </div>
          <p className="text-2xl font-bold text-slate-700">{instance.humidity}%</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
             <Wind className="w-4 h-4 text-indigo-500" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vents</span>
          </div>
          <p className="text-2xl font-bold text-slate-700">{instance.windSpeed} <span className="text-sm text-slate-400 font-normal">km/h</span></p>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 relative z-10">
        <div className="flex justify-between items-center mb-2">
           <div className="flex items-center gap-1.5">
              <Clock className={`w-3 h-3 ${isDanger ? 'text-rose-500' : 'text-sky-500'}`} />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expire dans</span>
           </div>
           <span className={`text-sm font-bold mono ${isDanger ? 'text-rose-500' : 'text-slate-600'}`}>{timeInfo.text}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
                isDanger ? 'bg-rose-500' : 'bg-sky-500'
            }`} 
            style={{ width: `${Math.min(100, Math.max(8, (timeInfo.hours / 24) * 100))}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default CloudInstanceCard;
