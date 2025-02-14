import { TransportHub } from './constants';

export const mockHubs: TransportHub[] = [
  {
    id: '1',
    name: 'Cape Town Station',
    coordinates: { lat: -33.9241, lng: 18.4254 },
    services: [
      {
        id: '1',
        type: 'train',
        name: 'Southern Line',
        cost: 15,
        route: {
          start: 'Cape Town',
          end: 'Simons Town',
          stops: ['Observatory', 'Rondebosch', 'Claremont'],
        },
        schedule: {
          departure: '05:00',
          arrival: '23:00',
          frequency: 'Every 30 minutes',
        },
      },
    ],
  },
  {
    id: '2',
    name: 'MyCiTi Civic Centre',
    coordinates: { lat: -33.9200, lng: 18.4252 },
    services: [
      {
        id: '2',
        type: 'bus',
        name: 'T01',
        cost: 25,
        route: {
          start: 'Civic Centre',
          end: 'Table View',
          stops: ['Woodbridge', 'Milnerton', 'Racecourse'],
        },
        schedule: {
          departure: '04:30',
          arrival: '22:00',
          frequency: 'Every 15 minutes',
        },
      },
    ],
  },
  {
    id: '3',
    name: 'Wynberg Taxi Rank',
    coordinates: { lat: -34.0075, lng: 18.4646 },
    services: [
      {
        id: '3',
        type: 'taxi',
        name: 'Wynberg - Cape Town',
        cost: 20,
        route: {
          start: 'Wynberg',
          end: 'Cape Town CBD',
          stops: ['Kenilworth', 'Rondebosch', 'Salt River'],
        },
        schedule: {
          departure: '05:00',
          arrival: '21:00',
          frequency: 'When full',
        },
      },
    ],
  },
];