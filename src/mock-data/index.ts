export const teams = [
  { id: 'arg', name: 'Argentina', code: 'ARG', color: '#43A1D5', theme: 'argentina' },
  { id: 'bra', name: 'Brazil', code: 'BRA', color: '#FFDC02', theme: 'brazil' },
  { id: 'fra', name: 'France', code: 'FRA', color: '#002654', theme: 'france' },
  { id: 'ger', name: 'Germany', code: 'GER', color: '#000000', theme: 'germany' },
  { id: 'eng', name: 'England', code: 'ENG', color: '#CE1124', theme: 'england' },
  { id: 'esp', name: 'Spain', code: 'ESP', color: '#AA151B', theme: 'spain' },
  { id: 'por', name: 'Portugal', code: 'POR', color: '#006600', theme: 'portugal' },
  { id: 'cro', name: 'Croatia', code: 'CRO', color: '#FF0000', theme: 'croatia' },
  { id: 'mar', name: 'Morocco', code: 'MAR', color: '#C1272D', theme: 'morocco' },
  { id: 'mex', name: 'Mexico', code: 'MEX', color: '#006847', theme: 'mexico' },
  { id: 'jpn', name: 'Japan', code: 'JPN', color: '#BC002D', theme: 'japan' },
  { id: 'ned', name: 'Netherlands', code: 'NED', color: '#F36C21', theme: 'netherlands' },
  { id: 'usa', name: 'USA', code: 'USA', color: '#002868', theme: 'usa' },
];

export const matches = [
  { id: 'm1', date: '2026-06-11T12:00:00Z', homeTeam: 'mex', awayTeam: 'bra', stadium: 'azteca', status: 'upcoming' },
  { id: 'm2', date: '2026-06-12T15:00:00Z', homeTeam: 'usa', awayTeam: 'arg', stadium: 'metlife', status: 'upcoming' },
];

export const stadiums = [
  { id: 'azteca', name: 'Estadio Azteca', location: 'Mexico City', capacity: 83264, gates: ['A', 'B', 'C', 'D'], coords: { lat: 19.3029, lng: -99.1505 } },
  { id: 'metlife', name: 'MetLife Stadium', location: 'New York/New Jersey', capacity: 82500, gates: ['Verizon', 'Pepsi', 'SAP', 'Bud Light'], coords: { lat: 40.8128, lng: -74.0742 } },
];

export const crowdAnalytics = {
  azteca: {
    gates: [
      { id: 'A', name: 'Gate A', density: 72, prediction: 95, warning: 'High congestion predicted in 6 mins.' },
      { id: 'B', name: 'Gate B', density: 45, prediction: 60, warning: null },
      { id: 'C', name: 'Gate C', density: 20, prediction: 25, warning: null },
      { id: 'D', name: 'Gate D', density: 88, prediction: 99, warning: 'Critical congestion. Avoid.' },
    ],
    washrooms: [
      { id: 'w1', location: 'North Wing', queueTime: '2 mins' },
      { id: 'w2', location: 'South Wing', queueTime: '15 mins' },
    ],
    foodCourts: [
      { id: 'f1', name: 'Taco Hub', queueTime: '5 mins', walkingTime: '3 mins' },
    ]
  }
};

export const notifications = [
  { id: 'n1', title: 'Welcome to FIFA NEXUS', message: 'Your personalized World Cup experience is ready.', type: 'info', time: 'Just now' },
  { id: 'n2', title: 'Match Reminder', message: 'Argentina vs USA kicks off in 3 hours!', type: 'match', time: '1 hour ago' },
];
