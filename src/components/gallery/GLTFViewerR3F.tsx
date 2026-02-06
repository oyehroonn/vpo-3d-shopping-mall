import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLoader } from '@react-three/fiber';

interface GLTFViewerR3FProps {
  modelUrl: string;
  className?: string;
  labelText?: string;
}

function Model({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    // The loader handles the extension automatically
  });

  // Ensure materials are properly updated
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;
          if (material) {
            material.needsUpdate = true;
          }
        }
      });
    }
  });

  return (
    <Center>
      <group ref={groupRef}>
        <primitive 
          object={gltf.scene} 
          scale={1.2}
          position={[0, 0, 0]}
        />
      </group>
    </Center>
  );
}

function LoadingFallback() {
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

// Studio Lighting Setup - adapted from Fashion3DTest
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

const GLTFViewerR3F = ({ 
  modelUrl, 
  className = "", 
  labelText = "3D View"
}: GLTFViewerR3FProps) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  
  return (
    <div 
      className={`relative overflow-hidden bg-black ${className}`}
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
      
      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/30" />

      {/* SEE IN 360° header */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20">
        <h2 
          className="text-white text-lg md:text-xl lg:text-2xl tracking-[0.5em] font-light"
          style={{ 
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            textShadow: '0 0 60px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.5)'
          }}
        >
          SEE IN 360°
        </h2>
        <div className="mt-1.5 w-12 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
      </div>

      {/* Corner accents - white for dark background */}
      <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-white/10 pointer-events-none z-10" />
      <div className="absolute top-3 right-3 w-6 h-6 border-r border-t border-white/10 pointer-events-none z-10" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-white/10 pointer-events-none z-10" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-white/10 pointer-events-none z-10" />

      {/* Label - positioned bottom left to avoid overlap */}
      <div className="absolute bottom-14 left-5 md:bottom-16 md:left-7 z-20 flex items-center gap-2">
        <span className="font-sans text-[11px] tracking-[0.15em] text-white/70 uppercase font-medium">
          {labelText}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(145_60%_40%)] animate-pulse" />
          <span className="text-[9px] font-sans tracking-[0.2em] text-[hsl(145_60%_50%)] uppercase">
            Interactive
          </span>
        </span>
      </div>

      {/* Interaction hint - shows until first interaction */}
      {!hasInteracted && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-1000 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            {/* Circular drag indicator */}
            <div className="relative w-14 h-14">
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
                <div className="w-2 h-2 rounded-full bg-white/40" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-white/50 text-[10px] tracking-[0.25em] uppercase font-light">
                Drag to Rotate
              </span>
              <span className="text-white/30 text-[9px] tracking-[0.2em] uppercase font-light">
                Scroll to Zoom
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom label */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center z-20">
        <p 
          className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-light"
          style={{ fontFamily: '"Instrument Sans", sans-serif' }}
        >
          VPO / Private Showroom
        </p>
      </div>

      {/* Subtle red glow effects to match studio lights */}
      <div className="absolute left-0 top-1/4 w-16 h-1/2 bg-gradient-to-r from-red-900/15 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-16 h-1/2 bg-gradient-to-l from-red-900/15 to-transparent pointer-events-none" />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)'
        }}
      />

      {/* Three.js Canvas */}
      <div className="absolute inset-0 w-full h-full z-10">
        <Canvas
          camera={{ position: [0, 0.5, 4], fov: 40 }}
          style={{ background: 'transparent' }}
          gl={{ 
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2
          }}
          shadows
        >
          <StudioLighting />
          
          <Suspense fallback={<LoadingFallback />}>
            <Model url={modelUrl} />
          </Suspense>
          
          {/* Contact shadow for grounding */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={8}
            blur={2}
            far={4}
            color="#000000"
          />
          
          {/* Floor reflection hint */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]} receiveShadow>
            <planeGeometry args={[15, 15]} />
            <meshStandardMaterial 
              color="#0a0a0a" 
              metalness={0.8} 
              roughness={0.4}
              transparent
              opacity={0.3}
            />
          </mesh>
          
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2 + 0.2}
            zoomSpeed={0.8}
            rotateSpeed={0.6}
            dampingFactor={0.08}
            enableDamping={true}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default GLTFViewerR3F;
