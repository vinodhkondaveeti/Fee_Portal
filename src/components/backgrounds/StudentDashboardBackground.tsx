
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function BookSpiral() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const books = Array.from({ length: 15 }, (_, i) => {
    const angle = (i / 15) * Math.PI * 2;
    const radius = 3 + i * 0.3;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = i * 0.5 - 3;

    return (
      <mesh
        key={i}
        position={[x, y, z]}
        rotation={[0, angle, 0]}
      >
        <boxGeometry args={[0.6, 0.8, 0.1]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL((i * 0.1) % 1, 0.7, 0.6)}
        />
      </mesh>
    );
  });

  return <group ref={group}>{books}</group>;
}

function FloatingPencils() {
  const pencils = Array.from({ length: 10 }, (_, i) => {
    const ref = useRef<THREE.Mesh>(null);
    
    useFrame((state) => {
      if (ref.current) {
        ref.current.rotation.z = state.clock.elapsedTime * (0.5 + i * 0.1);
        ref.current.position.y = Math.sin(state.clock.elapsedTime + i * 2) * 2;
      }
    });

    return (
      <mesh
        key={i}
        ref={ref}
        position={[
          (Math.random() - 0.5) * 20,
          Math.random() * 10,
          (Math.random() - 0.5) * 20
        ]}
      >
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL(0.1 + Math.random() * 0.2, 0.8, 0.5)}
        />
      </mesh>
    );
  });

  return <>{pencils}</>;
}

function KnowledgeGrid() {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current && mesh.current.geometry) {
      const time = state.clock.elapsedTime;
      const position = (mesh.current.geometry as THREE.PlaneGeometry).attributes.position;
      
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const wave = Math.sin(x * 0.3 + time) * Math.sin(y * 0.3 + time * 0.7) * 0.3;
        position.setZ(i, wave);
      }
      position.needsUpdate = true;
    }
  });

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]}>
      <planeGeometry args={[25, 25, 40, 40]} />
      <meshStandardMaterial
        color="#1e40af"
        transparent
        opacity={0.4}
        wireframe
      />
    </mesh>
  );
}

const StudentDashboardBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 4, 12], fov: 75 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
          <pointLight position={[-10, 5, -10]} intensity={0.7} color="#10b981" />
          <BookSpiral />
          <FloatingPencils />
          <KnowledgeGrid />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StudentDashboardBackground;
