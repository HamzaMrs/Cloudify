
import React, { useState } from 'react';
import { CloudInstance } from '../types';
import { Cloud, Droplets, Wind, MapPin, Maximize } from 'lucide-react';

interface Props {
  instances: CloudInstance[];
}

const Troposphere: React.FC<Props> = ({ instances }) => {
  const [hoveredCloud, setHoveredCloud] = useState<CloudInstance | null>(null);

  // Fonction pour formater les coordonnées
  const formatCoords = (lat: number, lng: number) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'O';
    return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`;
  };

  // Couleurs selon le type
  const getCloudColor = (type: string) => {
    const colors: Record<string, string> = {
      'cumulus': '#38bdf8',
      'stratus': '#94a3b8',
      'nimbus': '#818cf8',
      'cirrus': '#c084fc',
      'storm': '#fbbf24',
      'fog': '#9ca3af',
      'rain': '#3b82f6',
    };
    return colors[type.toLowerCase()] || '#38bdf8';
  };

  // Positionner les nuages sur le radar (répartition en cercle)
  const getCloudPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 30 + (index % 3) * 15; // Varie entre 30% et 60% du rayon
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle)
    };
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Vue Satellite</h2>
            <p className="text-emerald-400 text-sm font-medium">{instances.length} nuage{instances.length !== 1 ? 's' : ''} en orbite</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Radar View */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        {/* Cercles concentriques du radar */}
        <div className="relative w-full max-w-[500px] aspect-square">
          {/* Cercles */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-slate-600/40"
              style={{
                width: `${i * 25}%`,
                height: `${i * 25}%`,
                top: `${50 - i * 12.5}%`,
                left: `${50 - i * 12.5}%`,
              }}
            />
          ))}

          {/* Lignes de croisement */}
          <div className="absolute top-0 left-1/2 w-px h-full bg-slate-600/30" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-600/30" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/2 left-1/2 w-[70%] h-px bg-slate-600/20 origin-left rotate-45 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-[70%] h-px bg-slate-600/20 origin-left -rotate-45 -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Centre du radar */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />

          {/* Message si vide */}
          {instances.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-slate-500 font-medium">Aucun nuage détecté</p>
              <p className="text-slate-600 text-sm">Louez des nuages pour les voir ici</p>
            </div>
          )}

          {/* Points des nuages */}
          {instances.map((cloud, index) => {
            const pos = getCloudPosition(index, instances.length);
            const color = getCloudColor(cloud.type);
            const isHovered = hoveredCloud?.id === cloud.id;
            return (
              <div
                key={cloud.id}
                className="absolute cursor-pointer z-10 group"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseEnter={() => setHoveredCloud(cloud)}
                onMouseLeave={() => setHoveredCloud(null)}
              >
                {/* Point principal */}
                <div 
                  className="w-4 h-4 rounded-full shadow-lg transition-transform group-hover:scale-150"
                  style={{ 
                    backgroundColor: color,
                    boxShadow: `0 0 20px ${color}80`
                  }}
                />
                {/* Pulse animation */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: color }}
                />
                {/* Label */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-bold text-white bg-slate-800/80 px-2 py-1 rounded">
                    {cloud.name}
                  </span>
                </div>

                {/* Tooltip au survol - attaché au point */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 pointer-events-none">
                    <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-2xl w-[220px]">
                      <h4 className="font-bold text-white mb-3 pb-2 border-b border-slate-700 text-center">
                        {cloud.name}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-slate-400 text-sm">
                            <Droplets className="w-4 h-4 text-sky-400" />
                            Humidité
                          </span>
                          <span className="text-white font-bold">{cloud.humidity}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-slate-400 text-sm">
                            <Wind className="w-4 h-4 text-indigo-400" />
                            Vent
                          </span>
                          <span className="text-white font-bold">{cloud.windSpeed} km/h</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-slate-400 text-sm">
                            <MapPin className="w-4 h-4 text-rose-400" />
                            Position
                          </span>
                          <span className="text-white font-bold text-xs">{formatCoords(cloud.lat, cloud.lng)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-slate-400 text-sm">
                            <Maximize className="w-4 h-4 text-emerald-400" />
                            Surface
                          </span>
                          <span className="text-white font-bold">{cloud.area} km²</span>
                        </div>
                      </div>
                    </div>
                    {/* Flèche vers le point */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-slate-800" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Légende des types */}
      <div className="p-4 border-t border-slate-700/50 flex flex-wrap justify-center gap-4">
        {['cumulus', 'stratus', 'nimbus', 'cirrus', 'storm'].map(type => (
          <div key={type} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getCloudColor(type) }}
            />
            <span className="text-slate-400 text-xs font-medium capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Troposphere;
