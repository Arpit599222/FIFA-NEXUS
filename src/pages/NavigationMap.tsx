import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { crowdAnalytics } from '../mock-data';
import { MapPin, Navigation, AlertTriangle, Users, ArrowRight } from 'lucide-react';

export const NavigationMap = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-background relative flex flex-col md:flex-row">
      {/* Sidebar Panel */}
      <div className="w-full md:w-96 glass-panel z-10 flex flex-col h-[50vh] md:h-screen border-r border-[var(--theme-glass-border)]">
        <header className="p-6 border-b border-[var(--theme-glass-border)]">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground mb-4 inline-block">← Back</Link>
          <h1 className="text-2xl font-bold">Smart Navigation</h1>
          <p className="text-sm text-muted-foreground">AI optimized routing</p>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h2 className="font-semibold mb-4 text-lg">Your Routes</h2>
            <div className="space-y-3">
              <RouteCard 
                icon={<MapPin />}
                title="To My Seat (Block 114)"
                time="8 mins"
                status="optimal"
                onClick={() => setSelectedRoute('seat')}
                active={selectedRoute === 'seat'}
              />
              <RouteCard 
                icon={<Navigation />}
                title="Nearest Washroom"
                time="2 mins"
                status="optimal"
                onClick={() => setSelectedRoute('washroom')}
                active={selectedRoute === 'washroom'}
              />
            </div>
          </div>
          
          <div>
            <h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
              <Users className="w-5 h-5" /> Crowd Intelligence
            </h2>
            <div className="space-y-3">
              {crowdAnalytics.azteca.gates.map(gate => (
                <div key={gate.id} className="p-4 rounded-2xl bg-white/5 border border-[var(--theme-glass-border)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{gate.name}</span>
                    <span className={`text-sm font-bold ${gate.density > 80 ? 'text-destructive' : gate.density > 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {gate.density}% Capacity
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${gate.density > 80 ? 'bg-destructive' : gate.density > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${gate.density}%` }}
                    />
                  </div>
                  {gate.warning && (
                    <div className="flex items-center gap-2 text-xs text-destructive mt-3 bg-destructive/10 p-2 rounded-md">
                      <AlertTriangle className="w-4 h-4" />
                      {gate.warning}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Area - Simulated */}
      <div className="flex-1 relative overflow-hidden bg-[#0a0a0a]">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }} />
        
        {/* Animated Route Line */}
        <AnimatePresence>
          {selectedRoute && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <motion.path
                  d="M 50,350 Q 200,350 200,200 T 350,50"
                  fill="transparent"
                  stroke="hsl(var(--theme-primary))"
                  strokeWidth="4"
                  strokeDasharray="10 10"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                />
                <circle cx="50" cy="350" r="8" fill="white" />
                <circle cx="350" cy="50" r="8" fill="hsl(var(--theme-primary))" />
              </svg>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-20 bg-background p-4 rounded-2xl border border-[hsl(var(--theme-primary))]/30 shadow-2xl flex items-center gap-4 pointer-events-auto">
                <div className="w-12 h-12 rounded-full bg-[hsl(var(--theme-primary))]/20 flex items-center justify-center text-[hsl(var(--theme-primary))]">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xl font-bold">Turn Right</div>
                  <div className="text-muted-foreground">in 50 meters towards Sector B</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!selectedRoute && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Select a route to begin navigation
          </div>
        )}
      </div>
    </div>
  );
};

const RouteCard = ({ icon, title, time, status, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4
      ${active ? 'bg-[hsl(var(--theme-primary))]/10 border-[hsl(var(--theme-primary))]' : 'bg-white/5 border-transparent hover:border-[var(--theme-glass-border)]'}`}
  >
    <div className={`p-3 rounded-full ${active ? 'bg-[hsl(var(--theme-primary))] text-primary-foreground' : 'bg-white/10'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{time} away</div>
    </div>
    <div className={`text-xs px-2 py-1 rounded-full ${status === 'optimal' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
      {status}
    </div>
  </button>
);
