import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// 3D Dress Model Component
function DressModel() {
  const { scene } = useGLTF('/models/blackdress.glb');
  const modelRef = useRef<THREE.Group>(null);
  
  // Subtle automatic rotation when not being interacted with
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive 
        object={scene} 
        scale={2.5}
        position={[0, -1.5, 0]}
      />
    </group>
  );
}

// Loading placeholder while model loads
function LoadingPlaceholder() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 2, 0.3]} />
      <meshStandardMaterial color="#1a1a1a" transparent opacity={0.3} />
    </mesh>
  );
}

// Main 3D Scene
function Scene() {
  return (
    <>
      {/* Lighting setup for dramatic studio effect */}
      <ambientLight intensity={0.2} />
      <spotLight
        position={[5, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#ffffff"
        castShadow
      />
      <spotLight
        position={[-5, 8, -5]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.5}
        color="#ff3333"
      />
      <pointLight position={[0, 5, -10]} intensity={0.8} color="#cc0000" />
      
      {/* The dress model */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <DressModel />
      </Suspense>
      
      {/* Contact shadow for grounding */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
      
      {/* Orbit controls for rotation */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Interaction hint component
function InteractionHint() {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div 
      className={`absolute bottom-20 left-1/2 -translate-x-1/2 transition-opacity duration-1000 ${isVisible ? 'opacity-60' : 'opacity-0'}`}
      onMouseEnter={() => setIsVisible(false)}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Circular drag indicator */}
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 64 64" className="w-full h-full animate-spin" style={{ animationDuration: '8s' }}>
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              strokeDasharray="8 12"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white/50" />
          </div>
        </div>
        <span className="text-white/40 text-xs tracking-[0.3em] uppercase font-light">
          Drag to Explore
        </span>
      </div>
    </div>
  );
}

export default function Fashion3DTest() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Studio background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/images/studio-background.png)',
          filter: 'brightness(0.85) contrast(1.1)'
        }}
      />
      
      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      
      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        
        {/* Top header - SEE IN 360° */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 text-center">
          <h1 
            className="text-white text-4xl md:text-5xl lg:text-6xl tracking-[0.4em] font-light"
            style={{ 
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              textShadow: '0 0 40px rgba(0,0,0,0.8)'
            }}
          >
            SEE IN 360°
          </h1>
          <div className="mt-4 w-24 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto" />
        </div>
        
        {/* 3D Canvas container - centered focal area */}
        <div className="relative w-full max-w-4xl aspect-[3/4] md:aspect-[4/3] lg:aspect-[16/10]">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            style={{ background: 'transparent' }}
            gl={{ antialias: true, alpha: true }}
          >
            <Scene />
          </Canvas>
        </div>
        
        {/* Interaction hint */}
        <InteractionHint />
        
        {/* Bottom label */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p 
            className="text-white/50 text-sm tracking-[0.5em] uppercase font-light"
            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
          >
            VPO / Collection 01
          </p>
        </div>
        
        {/* Decorative corner accents */}
        <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-white/10" />
        <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-white/10" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-white/10" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-white/10" />
      </div>
      
      {/* Subtle red glow effects to match studio lights */}
      <div className="absolute left-0 top-1/4 w-32 h-1/2 bg-gradient-to-r from-red-900/20 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-32 h-1/2 bg-gradient-to-l from-red-900/20 to-transparent pointer-events-none" />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }}
      />
    </div>
  );
}

// Preload the GLB model
useGLTF.preload('/models/blackdress.glb');
