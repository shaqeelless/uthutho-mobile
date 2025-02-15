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
  description: string;
  startLocation: string;
  endLocation: string;
  departureTime: string;
  returnTime: string;
  members: string[];
  capacity: number;
  daysActive: string[];
  contactInfo: string;
  driver: CarpoolDriver;
  reviews: CarpoolReview[];
  rules: string[];
}

export interface Route {
  start: string;
  end: string;
  stops: string[];
  price: number;
  schedule: {
    firstDeparture: string;
    lastDeparture: string;
    frequency: string;
  };
}

export interface TransportType {
  id: string;
  name: string;
  type: 'bus' | 'train' | 'taxi';
  icon: 'bus' | 'train' | 'car';
  routes: Route[];
  operator: string;
}

export interface TransportHub {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  transportTypes: TransportType[];
}

export interface CarpoolReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CarpoolDriver {
  id: string;
  name: string;
  rating: number;
  totalTrips: number;
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    color: string;
    plateNumber: string;
  };
  profileImage?: string;
}