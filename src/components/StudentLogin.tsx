
import { useState } from "react";
import { motion } from "framer-motion";
import LoginBackground from "./backgrounds/LoginBackground";
import { useStudents } from "../hooks/useStudents";
import { useFees } from "../hooks/useFees";
import { toast } from "sonner";

interface StudentLoginProps {
  onLogin: (user: any) => void;
  onBack: () => void;
}

const StudentLogin = ({ onLogin, onBack }: StudentLoginProps) => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { authenticateStudent } = useStudents();
  const { getStudentFees } = useFees();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: student, error } = await authenticateStudent(studentId, password);
      
      if (error || !student) {
        toast.error("Invalid Student ID or Password");
        return;
      }

      // Fetch student's fee records
      const { data: studentFees } = await getStudentFees(student.id);

      // Structure fees by year for compatibility with existing components
      const feesByYear: any = {};
      const duesByYear: any = {};
      
      // Group fees by year
      studentFees.forEach((fee: any) => {
        if (!feesByYear[fee.year]) {
          feesByYear[fee.year] = {};
          duesByYear[fee.year] = {};
        }
        feesByYear[fee.year][fee.fee_name] = fee.total_amount;
        duesByYear[fee.year][fee.fee_name] = fee.due_amount;
      });

      // Convert database student to legacy format for compatibility
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
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <LoginBackground />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="relative z-10 bg-black/20 backdrop-blur-lg border border-white/20 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-white text-center mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
        >
          Student Login
        </motion.h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your student ID"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
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
  );
};

export default StudentLogin;
