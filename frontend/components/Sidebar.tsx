
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] lg:hidden animate-in fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-[280px] lg:w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col h-full z-[300] transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <Logo />
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="px-6 mb-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Principal</div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeTab === item.id 
                  ? 'bg-sky-50 text-sky-600 shadow-sm border border-sky-100' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`${activeTab === item.id ? 'text-sky-500' : 'text-slate-400'}`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 bg-sky-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                   <LocateFixed className="w-4 h-4 text-sky-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Station</p>
                  <p className="text-xs font-bold text-slate-900">Centre_Alpha_01</p>
                </div>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
