/*
  This is a placeholder for the real data model of a train.
  It is used in the app to display a list of trains and their details.
  In the future implementation, the data will come from the configured server via the API.
 */
export interface Train {
  id: string;
  name: string;
}

export const TRAINS: Train[] = [
  { id: '1', name: 'IR 2275' },
  { id: '2', name: 'IC 1234' },
  { id: '3', name: 'S 2050' },
];

