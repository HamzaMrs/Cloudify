
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CloudInstance } from '../types';
import { Cloud, Droplets, Wind, Zap, Target, ShieldCheck, X, Navigation, LocateFixed } from 'lucide-react';

interface Props {
  instances: CloudInstance[];
}

const Troposphere: React.FC<Props> = ({ instances }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCloud, setSelectedCloud] = useState<CloudInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.from(".radar-node", {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: "power3.out"
    });
    gsap.to(".radar-sweep", { rotation: 360, duration: 15, repeat: -1, ease: "none" });
  }, [instances]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0c1524] overflow-hidden rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col group/radar">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0ea5e9_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

      <div className="absolute inset-0 flex items-center justify-center opacity-[0.1] pointer-events-none">
        {[1200, 900, 600, 300].map(s => (
          <div key={s} className="absolute border border-sky-400 rounded-full" style={{ width: s, height: s }} />
        ))}
      </div>

      <div className="radar-sweep absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15]">
        <div className="w-[1500px] h-[1500px] bg-gradient-to-tr from-sky-500/40 via-transparent to-transparent rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0%, 50% 0%)' }} />
      </div>

      <div className="relative w-full h-full p-6 md:p-12 flex flex-wrap items-center justify-center gap-6 md:gap-12 overflow-y-auto custom-scrollbar z-20">
        {instances.map((cloud, idx) => (
          <button
            key={cloud.id}
            onClick={() => setSelectedCloud(cloud)}
            className={`radar-node relative bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 transition-all flex flex-col items-center min-w-[140px] md:min-w-[180px] hover:border-sky-500/50 hover:bg-white/10 shadow-xl`}
          >
            <div className="relative mb-3">
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-sky-400 rounded-full shadow-[0_0_10px_#0ea5e9]" />
                <Cloud className="w-10 h-10 md:w-12 md:h-12 text-sky-400" />
            </div>
            <p className="text-[10px] font-black text-white italic tracking-tighter truncate w-full px-2 text-center uppercase">{cloud.name}</p>
          </button>
        ))}
      </div>

      {selectedCloud && (
        <div className="absolute inset-0 z-[100] bg-[#0c1524]/90 backdrop-blur-xl p-8 flex flex-col items-center justify-center animate-in">
          <button onClick={() => setSelectedCloud(null)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-full text-white hover:text-sky-400"><X/></button>
          <div className="max-w-xl w-full text-center space-y-8">
             <div className="w-24 h-24 bg-sky-500/20 rounded-[2rem] flex items-center justify-center mx-auto border border-sky-500/30">
                <Cloud className="w-12 h-12 text-sky-400" />
             </div>
             <div>
                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">{selectedCloud.name}</h3>
                <p className="text-sky-400 font-black uppercase tracking-widest text-[10px]">Identifiant: {selectedCloud.id}</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {[
                  {l:'H2O', v:`${selectedCloud.humidity}%`},
                  {l:'VENT', v:`${selectedCloud.windSpeed}kt`},
                  {l:'SLA', v:'99.9%'},
                  {l:'PRIX', v:`${selectedCloud.creditsPerHour}C$`}
                ].map((item,i)=>(
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl">
                    <p className="text-[9px] font-black text-sky-300 uppercase mb-1 tracking-widest">{item.l}</p>
                    <p className="text-xl font-black text-white mono">{item.v}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Troposphere;
