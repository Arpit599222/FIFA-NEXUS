// Mock Data simulating real backend APIs until implemented

const mockCrowdData = {
  gateA: 'Moderate',
  gateB: 'Heavy',
  gateC: 'Light',
  foodCourt1: 'High wait times (20 mins)',
  foodCourt2: 'Low wait times (5 mins)'
};

const mockMatchData = {
  teams: 'Argentina vs Brazil',
  stadium: 'MetLife Stadium, New York/New Jersey',
  kickoff: '2026-07-19T20:00:00Z',
  status: 'Pre-match'
};

const mockTransportationData = {
  metro: 'Running on schedule. Next train in 3 mins.',
  shuttle: 'Heavy traffic near Gate B shuttle drop-off.',
  parking: 'Lot A full. Lot B 60% capacity.'
};

export const getContextData = (userContext: any) => {
  // In a real app, this would fetch from a database or live cache
  return {
    ...userContext,
    match: mockMatchData.teams + ' at ' + mockMatchData.stadium,
    crowdLevel: mockCrowdData.gateA + ' (Average across active gates)',
    transportation: mockTransportationData,
    weather: 'Clear, 24°C'
  };
};
