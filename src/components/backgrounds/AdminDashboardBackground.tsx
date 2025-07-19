
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function DataSphere() {
  const ref = useRef<THREE.Points>(null);
  
  const sphere = new Float32Array(1500 * 3);
  for (let i = 0; i < 1500; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 8 + 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    sphere[i3] = radius * Math.sin(phi) * Math.cos(theta);
    sphere[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    sphere[i3 + 2] = radius * Math.cos(phi);
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.05;
      ref.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#7c3aed"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function FloatingCubes() {
  const cubes = Array.from({ length: 12 }, (_, i) => {
    const ref = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
      if (ref.current) {
        ref.current.rotation.x = state.clock.elapsedTime * (0.2 + i * 0.05);
        ref.current.rotation.y = state.clock.elapsedTime * 0.15;
        ref.current.position.y = Math.sin(state.clock.elapsedTime + i) * 1;
      }
    });

    return (
      <mesh 
        key={i} 
        ref={ref}
        position={[
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 15
        ]}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#a855f7"
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
    );
  });

  return <>{cubes}</>;
}

const AdminDashboardBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#7c3aed" />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#ec4899" />
          <DataSphere />
          <FloatingCubes />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AdminDashboardBackground;
