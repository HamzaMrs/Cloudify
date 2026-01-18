
import React from 'react';
import { Cloud, Sparkles } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-4 group cursor-pointer">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-sky-400 via-sky-500 to-purple-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-sky-200 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
           <Cloud className="w-8 h-8 text-white animate-pulse" />
           <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-pink-500 text-[9px] font-black px-2.5 py-1 rounded-full text-white shadow-lg border-2 border-white rotate-12">HQ</div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-black tracking-tighter leading-none text-sky-950 italic">CLOUDIFY</span>
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-purple-400 mt-1.5 opacity-80">Patrimoine Atmosphérique</span>
      </div>
    </div>
  );
};

export default Logo;
