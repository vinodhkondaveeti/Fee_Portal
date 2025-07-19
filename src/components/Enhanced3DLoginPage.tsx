import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { useStudents } from "../hooks/useStudents";
import { useAdmins } from "../hooks/useAdmins";
import { useFees } from "../hooks/useFees";
import { toast } from "sonner";

interface Enhanced3DLoginPageProps {
  onLogin: (user: any) => void;
  onBack: () => void;
  isAdmin?: boolean;
}

// 3D Thinking Emoji Component
function ThinkingEmoji() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={ref} position={[2, 1, 0]}>
      {/* Head */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.15, 0.1, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.15, 0.1, 0.4]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      {/* Body */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.6, -0.4, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.6, -0.4, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, -1.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.2, -1.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Thinking bubble */}
      <mesh position={[0.8, 0.8, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#FFF" opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

// 3D Covering Eyes Emoji Component
function CoveringEyesEmoji() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  return (
    <group ref={ref} position={[-2, 1, 0]}>
      {/* Head */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Body */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.8]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Arms covering eyes */}
      <mesh position={[-0.4, 0.1, 0.3]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.4, 0.1, 0.3]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Hands */}
      <mesh position={[-0.6, 0.3, 0.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.6, 0.3, 0.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, -1.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.2, -1.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  );
}

// Floating particles background
function FloatingParticles() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
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
        color={new THREE.Color().setHSL(Math.random(), 0.7, 0.6)}
        emissive={new THREE.Color().setHSL(Math.random(), 0.3, 0.1)}
      />
    </mesh>
  ));

  return <group ref={ref}>{particles}</group>;
}

const Enhanced3DLoginPage = ({ onLogin, onBack, isAdmin = false }: Enhanced3DLoginPageProps) => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const [showCoveringEyes, setShowCoveringEyes] = useState(false);
  
  const { authenticateStudent } = useStudents();
  const { authenticateAdmin } = useAdmins();
  const { getStudentFees } = useFees();

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    setShowThinking(e.target.value.length > 0);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setShowCoveringEyes(e.target.value.length > 0);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      toast.error("Please enter both ID and password");
      return;
    }

    setLoading(true);

    try {
      if (isAdmin) {
        // Admin login
        const { data: admin, error } = await authenticateAdmin(userId, password);
        
        if (error || !admin) {
          toast.error("Invalid Admin ID or Password");
          return;
        }

        const legacyAdmin = {
          id: admin.admin_id,
          password: admin.password,
          name: admin.name,
          role: admin.role,
          mobile: admin.mobile,
          photoColor: admin.photo_color
        };

        onLogin(legacyAdmin);
        toast.success(`Welcome back, ${admin.name}!`);
      } else {
        // Student login
        const { data: student, error } = await authenticateStudent(userId, password);
        
        if (error || !student) {
          toast.error("Invalid Student ID or Password");
          return;
        }

        // Fetch student's fee records
        const { data: studentFees } = await getStudentFees(student.id);
        const feesByYear: any = {};
        const duesByYear: any = {};
        
        // Group fees by year if fees exist
        if (studentFees && studentFees.length > 0) {
          studentFees.forEach((fee: any) => {
            if (!feesByYear[fee.year]) {
              feesByYear[fee.year] = {};
              duesByYear[fee.year] = {};
            }
            feesByYear[fee.year][fee.fee_name] = fee.total_amount;
            duesByYear[fee.year][fee.fee_name] = fee.due_amount;
          });
        }

        const legacyStudent = {
          id: student.student_id,
          password: student.password,
          name: student.name,
          pin: student.pin,
          course: student.course,
          branch: student.branch,
          mobile: student.mobile,
          photoColor: student.photo_color,
          feesByYear,
          duesByYear,
          fines: [],
          extraFees: [],
          transactions: []
        };

        onLogin(legacyStudent);
        toast.success(`Welcome back, ${student.name}!`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scrolling text at top */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 z-50 overflow-hidden">
        <motion.div
          animate={{
            x: [1200, -1200]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="whitespace-nowrap text-lg font-semibold"
        >
          🎓 Automated Fee Management And Financial Management System 💰 Advanced Student Portal 📊 Real-time Payment Processing ⚡
        </motion.div>
      </div>

      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#4f46e5" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#06b6d4" />
            <FloatingParticles />
            {showThinking && <ThinkingEmoji />}
            {showCoveringEyes && <CoveringEyesEmoji />}
          </Suspense>
        </Canvas>
      </div>

      {/* Login Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <motion.h2 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl font-bold text-white text-center mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
          >
            {isAdmin ? "Admin Portal" : "Student Portal"}
          </motion.h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-gray-300 mb-2">
                {isAdmin ? "Admin ID" : "Student ID"}
              </label>
              <input
                type="text"
                value={userId}
                onChange={handleUserIdChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder={`Enter your ${isAdmin ? 'admin' : 'student'} ID`}
                required
                disabled={loading}
              />
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </motion.div>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:from-blue-600 hover:to-cyan-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onBack}
                disabled={loading}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-700 shadow-lg disabled:opacity-50"
              >
                Back
              </motion.button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
            Demo: ID: S123, Password: pass123
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Enhanced3DLoginPage;
