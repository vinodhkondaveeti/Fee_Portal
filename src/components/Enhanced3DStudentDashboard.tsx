
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import FeeDetails from "./student/FeeDetails";
import FeeDue from "./student/FeeDue";
import PayFee from "./student/PayFee";
import TransactionHistory from "./student/TransactionHistory";
import { toast } from "sonner";

interface Enhanced3DStudentDashboardProps {
  user: any;
  onLogout: () => void;
}

// 3D Book Animation
function FloatingBooks() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const books = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const radius = 4 + Math.sin(i) * 1;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return (
      <mesh
        key={i}
        position={[x, 0, z]}
        rotation={[0, angle, 0]}
      >
        <boxGeometry args={[0.3, 0.5, 0.1]} />
        <meshStandardMaterial
          color={new THREE.Color().setHSL((i * 0.1) % 1, 0.8, 0.6)}
          emissive={new THREE.Color().setHSL((i * 0.1) % 1, 0.3, 0.1)}
        />
      </mesh>
    );
  });

  return <group ref={group}>{books}</group>;
}

// 3D Graduation Cap
function GraduationCap() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group ref={ref} position={[0, 2, 0]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.5, 0.05, 2.5]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      <mesh position={[1.5, 0.35, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
    </group>
  );
}

// Knowledge Particles
function KnowledgeParticles() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      ref.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  const particles = Array.from({ length: 100 }, (_, i) => (
    <mesh
      key={i}
      position={[
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ]}
    >
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial 
        color={new THREE.Color().setHSL(0.6 + Math.random() * 0.3, 0.8, 0.6)}
        emissive={new THREE.Color().setHSL(0.6 + Math.random() * 0.3, 0.3, 0.2)}
      />
    </mesh>
  ));

  return <group ref={ref}>{particles}</group>;
}

const Enhanced3DStudentDashboard = ({ user, onLogout }: Enhanced3DStudentDashboardProps) => {
  const [activeTab, setActiveTab] = useState("fee-details");
  const [currentStudent, setCurrentStudent] = useState(user);
  const [hasUpcomingDeadlines, setHasUpcomingDeadlines] = useState(false);

  // Check for upcoming fee deadlines
  useEffect(() => {
    const checkDeadlines = () => {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // Simulate deadline checking - in real app, this would come from database
      const hasDeadlines = Math.random() > 0.5; // Demo purposes
      setHasUpcomingDeadlines(hasDeadlines);
      
      if (hasDeadlines) {
        // Simulate SMS sending for overdue fees
        setTimeout(() => {
          toast.warning("SMS sent: Fee deadline approaching! Please check your due payments.");
        }, 2000);
      }
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const tabs = [
    { id: "fee-details", label: "Fee Details", icon: "📊" },
    { id: "fee-due", label: "Fee Due", icon: "⚠️" },
    { id: "pay-fee", label: "Pay Fee", icon: "💳" },
    { id: "transactions", label: "History", icon: "📜" }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "fee-details":
        return <FeeDetails student={currentStudent} />;
      case "fee-due":
        return <FeeDue student={currentStudent} />;
      case "pay-fee":
        return <PayFee student={currentStudent} onPayment={(updatedStudent) => setCurrentStudent(updatedStudent)} />;
      case "transactions":
        return <TransactionHistory student={currentStudent} />;
      default:
        return <FeeDetails student={currentStudent} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fee Deadline Notification Bar */}
      {hasUpcomingDeadlines && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-orange-600 text-white py-2 z-50 overflow-hidden">
          <motion.div
            animate={{
              x: [1200, -1200]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="whitespace-nowrap text-lg font-semibold"
          >
            🚨 URGENT: Fee Deadline Approaching! 💰 Tuition Fee Due: ₹25,000 📅 Deadline: {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()} 📱 SMS Alert Sent 🚨
          </motion.div>
        </div>
      )}

      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 12], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#3b82f6" />
            <pointLight position={[-10, 5, -10]} intensity={0.8} color="#10b981" />
            <spotLight position={[0, 15, 0]} intensity={1} color="#8b5cf6" />
            <FloatingBooks />
            <GraduationCap />
            <KnowledgeParticles />
          </Suspense>
        </Canvas>
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 p-4" style={{ marginTop: hasUpcomingDeadlines ? '48px' : '0' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-lg"
              >
                Logout
              </motion.button>
            </div>
            
            {/* Student Info */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-6"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                style={{ backgroundColor: currentStudent.photoColor }}
              >
                {getInitials(currentStudent.name)}
              </motion.div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{currentStudent.name}</h2>
                <p className="text-gray-300">Pin: {currentStudent.pin}</p>
                <p className="text-gray-300">Course: {currentStudent.course}</p>
                <p className="text-gray-300">Branch: {currentStudent.branch}</p>
                <p className="text-gray-300">Mobile: {currentStudent.mobile}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl"
          >
            <div className="flex flex-wrap gap-4 justify-center">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
          >
            {renderTabContent()}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Enhanced3DStudentDashboard;
