import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';

// 3D Dress Model Component
function DressModel() {
  const { scene } = useGLTF('/models/blackdress.glb');
  const modelRef = useRef<THREE.Group>(null);
  
  // Apply proper materials for visibility
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      // Enhance material for better light reception
      if (child.material) {
        child.material.needsUpdate = true;
      }
    }
  });

  return (
    <Center>
      <group ref={modelRef}>
        <primitive 
          object={scene} 
          scale={2.8}
          position={[0, 0.5, 0]}
        />
      </group>
    </Center>
  );
}

// Loading placeholder while model loads
function LoadingPlaceholder() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[0.3, 0.5, 2, 32]} />
      <meshStandardMaterial color="#2a2a2a" transparent opacity={0.5} wireframe />
    </mesh>
  );
}

// Studio Lighting Setup
function StudioLighting() {
  return (
    <>
      {/* Ambient base light - slightly warm */}
      <ambientLight intensity={0.3} color="#fff5f0" />
      
      {/* Key light - main front/side illumination */}
      <spotLight
        position={[4, 6, 6]}
        angle={0.5}
        penumbra={0.8}
        intensity={2.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      
      {/* Fill light - softer, opposite side */}
      <spotLight
        position={[-5, 4, 4]}
        angle={0.6}
        penumbra={1}
        intensity={1.2}
        color="#ffeedd"
      />
      
      {/* Rim/back light - creates edge definition */}
      <spotLight
        position={[0, 8, -6]}
        angle={0.4}
        penumbra={0.5}
        intensity={1.8}
        color="#ffffff"
      />
      
      {/* Top light - highlights shoulders and top details */}
      <pointLight
        position={[0, 10, 2]}
        intensity={1.5}
        color="#fff8f5"
      />
      
      {/* Red accent lights to match background */}
      <pointLight position={[-8, 3, 0]} intensity={0.6} color="#ff2200" distance={15} />
      <pointLight position={[8, 3, 0]} intensity={0.6} color="#ff2200" distance={15} />
      
      {/* Front fill for fabric detail visibility */}
      <directionalLight
        position={[0, 2, 8]}
        intensity={0.8}
        color="#ffffff"
      />
    </>
  );
}

// Main 3D Scene
function Scene() {
  return (
    <>
      <StudioLighting />
      
      {/* The dress model */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <DressModel />
      </Suspense>
      
      {/* Contact shadow for grounding */}
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.5}
        scale={12}
        blur={2.5}
        far={5}
        color="#000000"
      />
      
      {/* Floor reflection hint */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.85, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          metalness={0.8} 
          roughness={0.4}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Orbit controls with zoom enabled */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2 + 0.3}
        zoomSpeed={0.8}
        rotateSpeed={0.6}
        dampingFactor={0.08}
        enableDamping={true}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

// Interaction hint component
function InteractionHint() {
  const [isVisible, setIsVisible] = useState(true);
  
  // Fade out after first interaction
  const handleInteraction = () => {
    if (isVisible) setIsVisible(false);
  };
  
  return (
    <div 
      className={`absolute bottom-24 left-1/2 -translate-x-1/2 transition-opacity duration-1000 pointer-events-none ${isVisible ? 'opacity-60' : 'opacity-0'}`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Circular drag indicator */}
        <div className="relative w-20 h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full animate-spin" style={{ animationDuration: '10s' }}>
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1"
              strokeDasharray="10 15"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white/40" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white/50 text-xs tracking-[0.3em] uppercase font-light">
            Drag to Rotate
          </span>
          <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-light">
            Scroll to Zoom
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Fashion3DTest() {
  const [hasInteracted, setHasInteracted] = useState(false);
  
  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden bg-black"
      onMouseDown={() => setHasInteracted(true)}
      onTouchStart={() => setHasInteracted(true)}
    >
      {/* Studio background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/images/studio-background.png)',
          filter: 'brightness(0.9) contrast(1.05)'
        }}
      />
      
      {/* Dark overlay for depth - lighter to show more background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30" />
      
      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        
        {/* Top header - SEE IN 360° */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center z-20">
          <h1 
            className="text-white text-3xl md:text-4xl lg:text-5xl tracking-[0.5em] font-light"
            style={{ 
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              textShadow: '0 0 60px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            SEE IN 360°
          </h1>
          <div className="mt-3 w-20 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
        </div>
        
        {/* 3D Canvas container - full viewport for immersive feel */}
        <div className="absolute inset-0 w-full h-full">
          <Canvas
            camera={{ position: [0, 1, 6], fov: 40 }}
            style={{ background: 'transparent' }}
            gl={{ 
              antialias: true, 
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2
            }}
            shadows
          >
            <Scene />
          </Canvas>
        </div>
        
        {/* Interaction hint - shows until first interaction */}
        {!hasInteracted && <InteractionHint />}
        
        {/* Bottom label */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-20">
          <p 
            className="text-white/40 text-xs tracking-[0.5em] uppercase font-light"
            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
          >
            VPO / Collection 01
          </p>
        </div>
        
        {/* Decorative corner accents */}
        <div className="absolute top-6 left-6 w-10 h-10 border-l border-t border-white/10 z-20" />
        <div className="absolute top-6 right-6 w-10 h-10 border-r border-t border-white/10 z-20" />
        <div className="absolute bottom-6 left-6 w-10 h-10 border-l border-b border-white/10 z-20" />
        <div className="absolute bottom-6 right-6 w-10 h-10 border-r border-b border-white/10 z-20" />
      </div>
      
      {/* Subtle red glow effects to match studio lights */}
      <div className="absolute left-0 top-1/4 w-24 h-1/2 bg-gradient-to-r from-red-900/15 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-24 h-1/2 bg-gradient-to-l from-red-900/15 to-transparent pointer-events-none" />
      
      {/* Vignette effect - softer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)'
        }}
      />
    </div>
  );
}

// Preload the GLB model
useGLTF.preload('/models/blackdress.glb');
