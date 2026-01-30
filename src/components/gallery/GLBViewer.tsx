import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
  autoRotate?: boolean;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);
  
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
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
          scale={2}
          position={[0, 0, 0]}
        />
      </group>
    </Center>
  );
}

function LoadingPlaceholder() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[0.5, 0.8, 0.3]} />
      <meshStandardMaterial color="#c4b5a0" transparent opacity={0.3} wireframe />
    </mesh>
  );
}

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#fff8f0" />
      <spotLight
        position={[3, 5, 5]}
        angle={0.5}
        penumbra={0.8}
        intensity={1.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[-4, 3, 3]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        color="#ffeedd"
      />
      <spotLight
        position={[0, 6, -4]}
        angle={0.4}
        penumbra={0.5}
        intensity={1}
        color="#ffffff"
      />
      <pointLight position={[0, 8, 2]} intensity={0.8} color="#fff8f5" />
      <directionalLight position={[0, 2, 6]} intensity={0.5} color="#ffffff" />
    </>
  );
}

interface GLBViewerProps {
  modelUrl: string;
  className?: string;
  labelText?: string;
  autoRotate?: boolean;
}

const GLBViewer = ({ 
  modelUrl, 
  className = "", 
  labelText = "3D View",
  autoRotate = true
}: GLBViewerProps) => {
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

      {/* 3D Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <Canvas
          camera={{ position: [0, 0.5, 4], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ 
            antialias: true, 
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1
          }}
          shadows
        >
          <StudioLighting />
          
          <Suspense fallback={<LoadingPlaceholder />}>
            <Model url={modelUrl} autoRotate={autoRotate} />
          </Suspense>
          
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.4}
            scale={8}
            blur={2}
            far={4}
            color="#8a7a6a"
          />
          
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            minDistance={2}
            maxDistance={8}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2 + 0.2}
            zoomSpeed={0.6}
            rotateSpeed={0.5}
            dampingFactor={0.1}
            enableDamping={true}
            target={[0, 0.3, 0]}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default GLBViewer;
