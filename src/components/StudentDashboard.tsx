
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StudentDashboardBackground from "./backgrounds/StudentDashboardBackground";
import { students, fees, years } from "../data/mockData";
import FeeDetails from "./student/FeeDetails";
import FeeDue from "./student/FeeDue";
import PayFee from "./student/PayFee";
import TransactionHistory from "./student/TransactionHistory";

interface StudentDashboardProps {
  user: any;
  onLogout: () => void;
}

const StudentDashboard = ({ user, onLogout }: StudentDashboardProps) => {
  const [activeTab, setActiveTab] = useState("fee-details");
  const [currentStudent, setCurrentStudent] = useState(user);

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
    <div className="min-h-screen relative">
      <StudentDashboardBackground />
      <div className="relative z-10 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
              >
                Logout
              </motion.button>
            </div>
            
            {/* Student Info */}
            <div className="flex items-center space-x-6">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: currentStudent.photoColor }}
              >
                {getInitials(currentStudent.name)}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{currentStudent.name}</h2>
                <p className="text-gray-300">Pin: {currentStudent.pin}</p>
                <p className="text-gray-300">Course: {currentStudent.course}</p>
                <p className="text-gray-300">Branch: {currentStudent.branch}</p>
                <p className="text-gray-300">Mobile: {currentStudent.mobile}</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl">
            <div className="flex flex-wrap gap-4 justify-center">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl"
          >
            {renderTabContent()}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;
