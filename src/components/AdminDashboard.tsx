import { useState } from "react";
import { motion } from "framer-motion";
import AdminDashboardBackground from "./backgrounds/AdminDashboardBackground";
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

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
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
    <div className="min-h-screen relative">
      <AdminDashboardBackground />
      <div className="relative z-10 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
              >
                Logout
              </motion.button>
            </div>
            
            {/* Admin Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: user.photoColor }}
                >
                  {getInitials(user.name)}
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-gray-300">ID: {user.id}</p>
                  <p className="text-gray-300">Role: {user.role}</p>
                  <p className="text-gray-300">Mobile: {user.mobile}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{students.length}</div>
                <div className="text-gray-300">Total Students</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-black/20 backdrop-blur-lg border border-white/20 rounded-3xl p-6 mb-6 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all text-sm ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <span className="block mb-1">{tab.icon}</span>
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

export default AdminDashboard;
