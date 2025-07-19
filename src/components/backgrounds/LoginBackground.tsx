
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedWave() {
  const ref = useRef<THREE.Points>(null);
  
  const wave = new Float32Array(1800 * 3);
  for (let i = 0; i < 1800; i++) {
    const i3 = i * 3;
    const x = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    const y = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 3;
    
    wave[i3] = x;
    wave[i3 + 1] = y;
    wave[i3 + 2] = z;
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = Math.sin(x * 0.3 + state.clock.elapsedTime) * Math.cos(z * 0.3 + state.clock.elapsedTime) * 2;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={wave} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#06b6d4"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function FloatingGems() {
  const gems = Array.from({ length: 8 }, (_, i) => {
    const ref = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
      if (ref.current) {
        ref.current.rotation.x = state.clock.elapsedTime * (0.3 + i * 0.1);
        ref.current.rotation.y = state.clock.elapsedTime * 0.2;
        ref.current.position.y = Math.sin(state.clock.elapsedTime + i * 1.5) * 1.5;
      }
    });

    return (
      <mesh
        key={i}
        ref={ref}
        position={[
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 16
        ]}
      >
        <icosahedronGeometry args={[0.6]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL(0.5 + Math.random() * 0.3, 0.8, 0.6)}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
    );
  });

  return <>{gems}</>;
}

const LoginBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 2, 10], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#4f46e5" />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#06b6d4" />
          <AnimatedWave />
          <FloatingGems />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default LoginBackground;
