
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CloudInstance } from '../types';

// Fix for default marker icon in Leaflet + React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CloudMapProps {
  instances: CloudInstance[];
}

const CloudMap: React.FC<CloudMapProps> = ({ instances }) => {
  const center: [number, number] = [20, 0];
  const zoom = 2;

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {instances.map((cloud) => (
          <Marker key={cloud.id} position={[cloud.lat, cloud.lng]}>
            <Popup className="custom-popup">
              <div className="p-2 text-slate-900">
                <h3 className="font-bold text-lg">{cloud.name}</h3>
                <p className="text-sm opacity-75">{cloud.type}</p>
                <hr className="my-2" />
                <div className="space-y-1">
                  <div className="flex justify-between gap-4">
                    <span className="text-xs font-semibold">Humidity:</span>
                    <span className="text-xs">{cloud.humidity}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-xs font-semibold">Wind:</span>
                    <span className="text-xs">{cloud.windSpeed} km/h</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-xs font-semibold">Status:</span>
                    <span className={`text-xs font-bold ${cloud.status === 'Active' ? 'text-green-600' : 'text-amber-600'}`}>
                      {cloud.status}
                    </span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Overlay Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-slate-700 shadow-lg pointer-events-none">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Tracking</p>
        <p className="text-xl font-mono text-blue-400">{instances.length} Active Node{instances.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
};

export default CloudMap;
