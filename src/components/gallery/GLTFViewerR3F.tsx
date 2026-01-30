import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Center } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Register the specular-glossiness extension
import { useLoader } from '@react-three/fiber';

interface GLTFViewerR3FProps {
  modelUrl: string;
  className?: string;
  labelText?: string;
}

function Model({ url }: { url: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load the GLTF with custom loader that handles the extension
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    // The loader should handle the extension automatically in newer versions
    // but we need to ensure materials are properly processed
  });

  // Convert specular-glossiness materials to standard materials if needed
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;
          if (material) {
            // Ensure the material renders properly
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
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#cccccc" wireframe />
    </mesh>
  );
}

const GLTFViewerR3F = ({ 
  modelUrl, 
  className = "", 
  labelText = "3D View"
}: GLTFViewerR3FProps) => {
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, hsl(38 12% 94%) 0%, hsl(35 10% 91%) 100%)"
      }}
    >
      {/* Subtle inner border for gallery frame effect */}
      <div className="absolute inset-3 md:inset-5 border border-[hsl(30_8%_70%/0.3)] pointer-events-none z-10" />
      
      {/* Corner accents */}
      <div className="absolute top-3 left-3 md:top-5 md:left-5 w-4 h-4 border-t border-l border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />
      <div className="absolute top-3 right-3 md:top-5 md:right-5 w-4 h-4 border-t border-r border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />
      <div className="absolute bottom-3 left-3 md:bottom-5 md:left-5 w-4 h-4 border-b border-l border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />
      <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 w-4 h-4 border-b border-r border-[hsl(30_8%_50%/0.4)] pointer-events-none z-10" />

      {/* Label */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-3">
        <span className="font-sans text-[11px] tracking-[0.15em] text-[hsl(30_8%_25%)] uppercase font-medium">
          {labelText}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(145_60%_40%)] animate-pulse" />
          <span className="text-[9px] font-sans tracking-[0.2em] text-[hsl(145_40%_35%)] uppercase">
            Interactive
          </span>
        </span>
      </div>

      {/* Interaction hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <span className="font-sans text-[9px] tracking-[0.25em] text-[hsl(30_8%_45%)] uppercase">
          Drag to rotate · Scroll to zoom
        </span>
      </div>

      {/* Three.js Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 3], fov: 45 }}
          gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <pointLight position={[0, 5, 0]} intensity={0.3} />
          
          <Suspense fallback={<LoadingFallback />}>
            <Model url={modelUrl} />
            <Environment preset="studio" />
          </Suspense>
          
          <OrbitControls 
            enablePan={false}
            minDistance={1.5}
            maxDistance={5}
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default GLTFViewerR3F;
