
import { ABSURDITY_COEFFICIENT } from '../constants';

/**
 * The Silly-as-a-Service Formula:
 * T_life = ((Humidity * Area) / (WindSpeed + 1)) * AbsurdityCoefficient
 * Result in minutes.
 */
export const calculateLifeExpectancy = (humidity: number, area: number, windSpeed: number): number => {
  const tLife = ((humidity * area) / (windSpeed + 1)) * ABSURDITY_COEFFICIENT;
  return Math.max(0, Math.round(tLife / 10)); // Scaled for demo purposes
};

export const getEvaporationRisk = (humidity: number, temp: number): 'Low' | 'Medium' | 'Critical' => {
  if (temp > 30 || humidity < 20) return 'Critical';
  if (temp > 22 || humidity < 40) return 'Medium';
  return 'Low';
};
