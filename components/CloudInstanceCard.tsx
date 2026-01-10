
import React, { useRef } from 'react';
import { CloudInstance } from '../types';
import { calculateLifeExpectancy } from '../services/cloudCalculator';
import { Droplets, Wind, AlertTriangle, Cloud as CloudIcon, Shield, Zap, Sparkle } from 'lucide-react';
import gsap from 'gsap';

interface Props {
  instance: CloudInstance;
}

const CloudInstanceCard: React.FC<Props> = ({ instance }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const timeLeft = calculateLifeExpectancy(instance.humidity, instance.area, instance.windSpeed);
  const isDanger = timeLeft < 25;

  const onEnter = () => {
    gsap.to(cardRef.current, { 
      y: -12, 
      scale: 1.03,
      rotate: 1,
      duration: 0.5, 
      ease: "back.out(1.7)" 
    });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, { 
      y: 0, 
      scale: 1,
      rotate: 0,
      duration: 0.5, 
      ease: "power2.inOut" 
    });
  };

  return (
    <div 
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`fluffy-glass rounded-[3.5rem] p-10 relative overflow-hidden flex flex-col h-full border-4 ${
        isDanger ? 'border-pink-200' : 'border-white'
      }`}
    >
      {/* Funky Background element */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-3xl ${
        instance.type.includes('Nimbus') ? 'bg-purple-600' : 'bg-sky-500'
      }`} />

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-sky-50 px-3 py-1 rounded-full">
             <CloudIcon className="w-4 h-4 text-sky-500" />
             <span className="text-[9px] font-black text-sky-400 uppercase tracking-widest">{instance.type}</span>
          </div>
          <h3 className="font-black text-3xl text-sky-950 italic uppercase tracking-tighter leading-none">{instance.name}</h3>
        </div>
        <div className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-sm border-2 ${
          instance.status === 'Active' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-amber-50 text-amber-500 border-amber-100'
        }`}>
          {instance.status === 'Active' ? 'EN_VOL' : 'DÉRIVE'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
        <div className="bg-sky-50/50 p-6 rounded-3xl border-2 border-white text-center group/stat">
          <Droplets className="w-5 h-5 text-sky-400 mx-auto mb-2 group-hover/stat:scale-125 transition-transform" />
          <p className="text-3xl font-black text-sky-950 italic leading-none">{instance.humidity}%</p>
          <p className="text-[8px] font-black text-sky-300 uppercase tracking-widest mt-2">Humidité</p>
        </div>
        <div className="bg-purple-50/50 p-6 rounded-3xl border-2 border-white text-center group/stat">
          <Wind className="w-5 h-5 text-purple-400 mx-auto mb-2 group-hover/stat:scale-125 transition-transform" />
          <p className="text-3xl font-black text-sky-950 italic leading-none">{instance.windSpeed}kt</p>
          <p className="text-[8px] font-black text-purple-300 uppercase tracking-widest mt-2">Vents</p>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-sky-50/50 relative z-10">
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-2">
              <Zap className={`w-4 h-4 ${isDanger ? 'text-pink-500' : 'text-amber-400'}`} />
              <span className="text-[9px] font-black text-sky-300 uppercase tracking-widest">Évaporation</span>
           </div>
           <span className={`text-xl font-black italic mono ${isDanger ? 'text-pink-500 animate-pulse' : 'text-sky-500'}`}>{timeLeft}m</span>
        </div>
        <div className="h-6 w-full bg-slate-100 rounded-2xl overflow-hidden p-1.5 border border-white shadow-inner">
          <div 
            className={`h-full rounded-xl transition-all duration-1000 ${
                isDanger ? 'bg-gradient-to-r from-pink-400 to-rose-500' : 'bg-gradient-to-r from-sky-400 to-purple-500'
            }`} 
            style={{ width: `${Math.min(100, Math.max(8, (timeLeft / 200) * 100))}%` }} 
          />
        </div>
      </div>

      {/* Decorative "Sticker" for funky feel */}
      <div className="absolute bottom-4 right-4 rotate-[-15deg] opacity-20 pointer-events-none group-hover:opacity-60 transition-opacity">
         <Sparkle className="w-12 h-12 text-purple-400" />
      </div>
    </div>
  );
};

export default CloudInstanceCard;
