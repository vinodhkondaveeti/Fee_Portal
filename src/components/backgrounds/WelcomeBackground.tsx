
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingIcons() {
  const icons = Array.from({ length: 10 }, (_, i) => {
    const ref = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
      if (ref.current) {
        ref.current.rotation.x = state.clock.elapsedTime * 0.5;
        ref.current.rotation.y = state.clock.elapsedTime * 0.3;
        ref.current.position.y = Math.sin(state.clock.elapsedTime + i * 2) * 2;
      }
    });

    return (
      <Float key={i} speed={1 + Math.random()} rotationIntensity={0.5} floatIntensity={1}>
        <mesh
          ref={ref}
          position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 20
          ]}
        >
          <octahedronGeometry args={[0.8]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(0.6 + Math.random() * 0.4, 0.8, 0.6)}
            transparent
            opacity={0.8}
            wireframe
          />
        </mesh>
      </Float>
    );
  });

  return <>{icons}</>;
}

function OrbitingRings() {
  const rings = Array.from({ length: 3 }, (_, i) => {
    const ref = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
      if (ref.current) {
        ref.current.rotation.z = state.clock.elapsedTime * (0.3 + i * 0.2);
        ref.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      }
    });

    return (
      <mesh key={i} ref={ref} position={[0, 0, -i * 3]}>
        <torusGeometry args={[4 + i * 1.5, 0.1, 16, 100]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL(0.55 + i * 0.15, 0.9, 0.7)}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    );
  });

  return <>{rings}</>;
}

const WelcomeBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#4f46e5" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#06b6d4" />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          <FloatingIcons />
          <OrbitingRings />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default WelcomeBackground;
