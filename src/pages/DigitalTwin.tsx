import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../stores/themeStore';
import * as THREE from 'three';

const MetLifeStadiumModel = () => {
  const groupRef = useRef<any>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  // Access paths representing "highest people way" (congestion lines)
  const path1Points = [
    new THREE.Vector3(-6, -0.4, 6),
    new THREE.Vector3(-4, 0.5, 4),
    new THREE.Vector3(-2, -0.4, 0)
  ];
  const curve1 = new THREE.CatmullRomCurve3(path1Points);

  const path2Points = [
    new THREE.Vector3(6, -0.4, -6),
    new THREE.Vector3(4, 0.8, -3),
    new THREE.Vector3(2, -0.4, 0)
  ];
  const curve2 = new THREE.CatmullRomCurve3(path2Points);

  return (
    <group ref={groupRef}>
      {/* MetLife Stadium Green Pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[11, 7]} />
        <meshStandardMaterial color="#1a5c2d" roughness={0.8} />
      </mesh>
      
      {/* Stadium Tier 1 (Lower Bowl) */}
      <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[6.5, 7.5, 0.8, 64, 1, true]} />
        <meshStandardMaterial color="#0f2537" roughness={0.3} metalness={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Stadium Tier 2 (Middle Suites Bowl) */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[7.8, 8.5, 0.6, 64, 1, true]} />
        <meshStandardMaterial color="#111827" roughness={0.1} metalness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Stadium Tier 3 (Upper Grandstand Bowl) */}
      <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[8.8, 9.8, 0.8, 64, 1, true]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Glowing Accesway Curves ("highest people way" flow paths) */}
      <mesh>
        <tubeGeometry args={[curve1, 20, 0.15, 8, false]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
      </mesh>

      <mesh>
        <tubeGeometry args={[curve2, 20, 0.12, 8, false]} />
        <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={1.2} />
      </mesh>

      {/* MetLife Specific Access Hotspots */}
      <Hotspot position={[-6, 0.2, 6]} label="Verizon Gate (Verizon Congestion: Critical)" color="#ef4444" />
      <Hotspot position={[6, 0.2, -6]} label="SAP Gate (SAP Congestion: Moderate)" color="#eab308" />
      <Hotspot position={[0, 0.2, -4.5]} label="Pepsi Gate (Pepsi Congestion: Low)" color="#22c55e" />
      <Hotspot position={[0, 1.8, 0]} label="MetLife Skybox & Premium Suites" color="#3b82f6" />
    </group>
  );
};

const Hotspot = ({ position, label, color }: { position: [number, number, number], label: string, color: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <group position={position} 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
    >
      <mesh>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
      </mesh>
      {hovered && (
        <Html center position={[0, 0.8, 0]}>
          <div className="bg-black/90 text-white border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shadow-2xl select-none pointer-events-none">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

export const DigitalTwin = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  
  const getThemeColor = () => {
    switch (currentTheme) {
      case 'argentina': return '#43A1D5';
      case 'brazil': return '#FFDC02';
      case 'france': return '#002654';
      default: return '#ffffff';
    }
  };

  return (
    <div className="w-full h-screen bg-black relative">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 pointer-events-none">
        <Link to="/dashboard" className="text-white hover:text-white/80 pointer-events-auto bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">← Back</Link>
        <div className="bg-black/50 px-4 py-2 rounded-full backdrop-blur-md text-white">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2 animate-pulse" />
          MetLife Stadium 3D Twin
        </div>
      </header>

      <Canvas camera={{ position: [0, 9, 14], fov: 45 }}>
        <color attach="background" args={['#030303']} />
        <fog attach="fog" args={['#030303', 12, 32]} />
        
        <ambientLight intensity={0.4} />
        <spotLight position={[0, 18, 0]} angle={0.7} penumbra={1} intensity={2.5} color={getThemeColor()} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <MetLifeStadiumModel />
          <Environment preset="city" />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.1} 
          minDistance={10} 
          maxDistance={22} 
        />
      </Canvas>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-6 z-10 text-white shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="w-3 h-3 rounded-full bg-red-500" /> Verizon (Critical Congestion Flow)
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="w-3 h-3 rounded-full bg-yellow-500" /> SAP (Moderate Flow)
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="w-3 h-3 rounded-full bg-green-500" /> Pepsi (Low Flow)
        </div>
      </div>
    </div>
  );
};
