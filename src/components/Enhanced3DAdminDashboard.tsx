
import { useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { students } from "../data/mockData";
import StudentList from "./admin/StudentList";
import AddStudent from "./admin/AddStudent";
import FeeManagement from "./admin/FeeManagement";
import AddExtraFee from "./admin/AddExtraFee";
import AllTransactions from "./admin/AllTransactions";
import RemoveFeeStudent from "./admin/RemoveFeeStudent";
import BulkStudentImport from "./admin/BulkStudentImport";
import FeeDeadlineManager from "./admin/FeeDeadlineManager";
import RemoveStudent from "./admin/RemoveStudent";
import BulkFineManagement from "./admin/BulkFineManagement";

interface Enhanced3DAdminDashboardProps {
  user: any;
  onLogout: () => void;
}

// 3D Data Visualization Sphere
function DataVisualizationSphere() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const rings = Array.from({ length: 5 }, (_, i) => (
    <mesh
      key={i}
      rotation={[Math.PI / 2 * i, 0, 0]}
      position={[0, 0, 0]}
    >
      <torusGeometry args={[2 + i * 0.5, 0.1, 16, 100]} />
      <meshStandardMaterial 
        color={new THREE.Color().setHSL(0.8 - i * 0.1, 0.8, 0.6)}
        emissive={new THREE.Color().setHSL(0.8 - i * 0.1, 0.3, 0.2)}
      />
    </mesh>
  ));

  return <group ref={ref}>{rings}</group>;
}

// 3D Floating Dashboard Elements
function FloatingDashboardElements() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const elements = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 6;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return (
      <group key={i} position={[x, 0, z]}>
        <mesh>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(0.7 + i * 0.05, 0.8, 0.6)}
            emissive={new THREE.Color().setHSL(0.7 + i * 0.05, 0.3, 0.1)}
          />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[0.6, 0.4]} />
          <meshStandardMaterial color="#000" opacity={0.8} transparent />
        </mesh>
      </group>
    );
  });

  return <group ref={group}>{elements}</group>;
}

// 3D Currency Symbols
function FloatingCurrencySymbols() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  const symbols = ['₹', '$', '€', '£'].map((symbol, i) => (
    <mesh
      key={i}
      position={[
        Math.cos(i * Math.PI / 2) * 8,
        Math.sin(i * Math.PI / 2) * 2,
        Math.sin(i * Math.PI / 2) * 8
      ]}
    >
      <cylinderGeometry args={[0.5, 0.5, 0.2]} />
      <meshStandardMaterial 
        color="#ffd700"
        emissive="#ffaa00"
        emissiveIntensity={0.3}
      />
    </mesh>
  ));

  return <group ref={ref}>{symbols}</group>;
}

// Administrative Network
function AdminNetwork() {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const nodes = Array.from({ length: 15 }, (_, i) => (
    <mesh
      key={i}
      position={[
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 15
      ]}
    >
      <octahedronGeometry args={[0.3]} />
      <meshStandardMaterial 
        color={new THREE.Color().setHSL(0.9, 0.8, 0.6)}
        emissive={new THREE.Color().setHSL(0.9, 0.3, 0.2)}
      />
    </mesh>
  ));

  return <group ref={ref}>{nodes}</group>;
}

const Enhanced3DAdminDashboard = ({ user, onLogout }: Enhanced3DAdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("student-list");

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const tabs = [
    { id: "student-list", label: "Student List", icon: "👥" },
    { id: "add-student", label: "Add Student", icon: "➕" },
    { id: "bulk-import", label: "Bulk Import", icon: "📊" },
    { id: "fee-management", label: "Fee Management", icon: "💰" },
    { id: "deadline-manager", label: "Fee Deadlines", icon: "⏰" },
    { id: "add-extra-fee", label: "Extra Fee", icon: "📋" },
    { id: "bulk-fine", label: "Bulk Fine", icon: "⚠️" },
    { id: "transactions", label: "Transactions", icon: "📊" },
    { id: "remove-fee", label: "Remove Fee", icon: "🗑️" },
    { id: "remove-student", label: "Remove Student", icon: "❌" }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "student-list":
        return <StudentList />;
      case "add-student":
        return <AddStudent />;
      case "bulk-import":
        return <BulkStudentImport />;
      case "fee-management":
        return <FeeManagement />;
      case "deadline-manager":
        return <FeeDeadlineManager />;
      case "add-extra-fee":
        return <AddExtraFee />;
      case "bulk-fine":
        return <BulkFineManagement />;
      case "transactions":
        return <AllTransactions />;
      case "remove-fee":
        return <RemoveFeeStudent />;
      case "remove-student":
        return <RemoveStudent />;
      default:
        return <StudentList />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#7c3aed" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ec4899" />
            <spotLight position={[0, 20, 0]} intensity={2} color="#06b6d4" />
            <DataVisualizationSphere />
            <FloatingDashboardElements />
            <FloatingCurrencySymbols />
            <AdminNetwork />
          </Suspense>
        </Canvas>
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Admin Dashboard
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
            
            {/* Admin Info */}
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-6"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                  style={{ backgroundColor: user.photoColor }}
                >
                  {getInitials(user.name)}
                </motion.div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-300">ID: {user.id}</p>
                  <p className="text-gray-300">Role: {user.role}</p>
                  <p className="text-gray-300">Mobile: {user.mobile}</p>
                </div>
              </motion.div>
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="text-3xl font-bold text-purple-400"
                >
                  {students.length}
                </motion.div>
                <div className="text-gray-300">Total Students</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all text-sm duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <span className="block mb-1">{tab.icon}</span>
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

export default Enhanced3DAdminDashboard;
