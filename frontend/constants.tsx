
import React from 'react';
import { Cloud, Activity, Wallet, Eye, ShoppingCart, Ghost, Wind, LocateFixed, Sun, Radar } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tour de Contrôle', icon: <Activity className="w-5 h-5" /> },
  { id: 'fleet', label: 'Mon Hangar', icon: <Wind className="w-5 h-5" /> },
  { id: 'marketplace', label: 'Marché de la Pluie', icon: <ShoppingCart className="w-5 h-5" /> },
  { id: 'troposphere', label: 'Vue Satellite', icon: <Radar className="w-5 h-5" /> },
  { id: 'history', label: 'Cimetière Céleste', icon: <Ghost className="w-5 h-5" /> },
  { id: 'billing', label: 'Compte-Gouttes', icon: <Wallet className="w-5 h-5" /> },
];

export const ABSURDITY_COEFFICIENT = 42.69;

export const MOCK_CLOUDS = [
  {
    id: 'cl-101',
    name: 'Nimbus-IDF-04',
    type: 'Cumulus',
    lat: 48.8566,
    lng: 2.3522,
    humidity: 88,
    windSpeed: 12,
    area: 2.5,
    status: 'Active',
    rentedAt: new Date(Date.now() - 3600000),
    expiresAt: new Date(Date.now() + 7200000),
    ownerId: 'user-1',
    creditsPerHour: 15.5
  },
  {
    id: 'cl-102',
    name: 'Vapor-Stratus-NY',
    type: 'Stratus',
    lat: 40.7128,
    lng: -74.0060,
    humidity: 45,
    windSpeed: 25,
    area: 1.2,
    status: 'Active',
    rentedAt: new Date(Date.now() - 5000000),
    expiresAt: new Date(Date.now() + 600000),
    ownerId: 'user-1',
    creditsPerHour: 8.0
  }
];

export const MOCK_HEALTH: any[] = [
  { service: 'Station-Météo-Nord', status: 'healthy', uptime: '14d 2h', latency: 42 },
  { service: 'Unité-de-Compression-01', status: 'healthy', uptime: '14d 2h', latency: 12 },
  { service: 'Réserve-H2O-Principale', status: 'warning', uptime: '2d 4h', latency: 156 },
  { service: 'Moniteur-de-Rosée', status: 'healthy', uptime: '140d', latency: 5 },
];
