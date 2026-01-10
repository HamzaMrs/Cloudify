
import React from 'react';
import { NAV_ITEMS } from '../constants';
import Logo from './Logo';
import { X, ChevronRight, Zap, LocateFixed } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-sky-950/30 backdrop-blur-md z-[200] lg:hidden animate-in fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-[300px] lg:w-96 bg-white border-r-4 border-white flex flex-col h-full z-[300] transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) lg:translate-x-0 lg:static flex-shrink-0 shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-12 lg:p-14 flex items-center justify-between">
          <Logo />
          <button onClick={onClose} className="lg:hidden p-3 bg-sky-50 rounded-2xl text-sky-400 btn-funky"><X className="w-6 h-6" /></button>
        </div>
        
        <nav className="flex-1 px-8 space-y-3 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-5 px-8 py-5 rounded-[2.5rem] transition-all relative group ${
                activeTab === item.id 
                  ? 'bg-sky-500 text-white shadow-xl shadow-sky-100 rotate-[-1deg]' 
                  : 'text-sky-400 hover:text-sky-600 hover:bg-sky-50/80'
              }`}
            >
              <div className={`transition-all duration-500 ${activeTab === item.id ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span className="font-black text-[11px] uppercase tracking-[0.2em]">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute -right-2 w-2 h-8 bg-sky-300 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-10 mt-auto">
          <div className="bg-gradient-to-br from-purple-50 to-sky-50 p-8 rounded-[3rem] border-4 border-white text-center shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400" />
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-sky-950 tracking-[0.3em] mb-2 flex items-center justify-center gap-2">
                   <LocateFixed className="w-3 h-3 text-sky-500" /> STATION_CENTRE_01
                </p>
                <p className="text-[9px] font-bold text-sky-400 uppercase tracking-widest italic">SYSTÈME ATMOS CONNECTÉ</p>
             </div>
             <div className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
