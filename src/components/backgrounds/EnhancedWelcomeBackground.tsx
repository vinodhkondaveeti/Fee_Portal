
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

// Floating Particles
function WelcomeParticles() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const particles = Array.from({ length: 50 }, (_, i) => (
    <mesh
      key={i}
      position={[
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ]}
    >
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial 
        color={new THREE.Color().setHSL(0.6 + Math.random() * 0.4, 0.8, 0.6)}
        emissive={new THREE.Color().setHSL(0.6 + Math.random() * 0.4, 0.3, 0.2)}
      />
    </mesh>
  ));

  return <group ref={ref}>{particles}</group>;
}

// Floating Logo Elements
function FloatingElements() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const elements = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2;
    const radius = 5;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return (
      <mesh
        key={i}
        position={[x, Math.sin(angle + 1) * 0.5, z]}
        rotation={[0, angle, 0]}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL((i * 0.15) % 1, 0.8, 0.6)}
          emissive={new THREE.Color().setHSL((i * 0.15) % 1, 0.3, 0.1)}
        />
      </mesh>
    );
  });

  return <group ref={group}>{elements}</group>;
}

const EnhancedWelcomeBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
          <WelcomeParticles />
          <FloatingElements />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default EnhancedWelcomeBackground;
