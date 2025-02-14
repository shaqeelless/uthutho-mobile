export const HERE_API_KEY = 'tEzSszjXMvnBlus-bapyE2hF0qnnPmKpreM7wK3ciAg';
export const HERE_USER_ID = 'HERE-d9224a74-f129-4bb8-955a-d4e6195a4a7c';
export const HERE_APP_ID = 'MXeNa531T3aru034vMgS';

export const DEFAULT_CENTER = {
  lat: -33.9249,
  lng: 18.4241,
};

export const DEFAULT_ZOOM = 13;

export type TransportMode = 'bus' | 'taxi' | 'train';

export interface TransportService {
  id: string;
  type: TransportMode;
  name: string;
  cost: number;
  route: {
    start: string;
    end: string;
    stops: string[];
  };
  schedule: {
    departure: string;
    arrival: string;
    frequency: string;
  };
}

export interface CarpoolClub {
  id: string;
  name: string;
  destination: string;
  departureLocation: string;
  schedule: {
    departureTimes: string[];
    days: string[];
  };
  members: number;
  cost: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TransportHub {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  services: TransportService[];
}