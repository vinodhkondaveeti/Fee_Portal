
import { useState } from "react";
import { motion } from "framer-motion";
import { useStudents } from "../../hooks/useStudents";
import { useFees } from "../../hooks/useFees";
import { toast } from "sonner";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    password: "",
    name: "",
    pin: "",
    course: "B.Tech",
    branch: "",
    mobile: ""
  });
  const [loading, setLoading] = useState(false);
  
  const { addStudent, students } = useStudents();
  const { initializeStudentFees } = useFees();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateUniquePin = (pin: string): boolean => {
    return !students.some(s => s.pin === pin);
  };

  const validateUniqueStudentId = (studentId: string): boolean => {
    return !students.some(s => s.student_id === studentId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate Student ID uniqueness
      if (!validateUniqueStudentId(formData.student_id)) {
        toast.error("Student ID already exists");
        return;
      }

      // Validate Pin uniqueness
      if (!validateUniquePin(formData.pin)) {
        toast.error("Pin number already exists. Please use a unique pin number.");
        return;
      }

      // Validate mobile number
      if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
        toast.error("Mobile number must be exactly 10 digits");
        return;
      }

      const studentData = {
        ...formData,
        photo_color: `#${Math.floor(Math.random()*16777215).toString(16)}`
      };

      const { data: newStudent, error } = await addStudent(studentData);
      
      if (error || !newStudent) {
        toast.error("Failed to add student. Please try again.");
        return;
      }

      // Initialize fee records for the new student
      await initializeStudentFees(newStudent.id);

      toast.success("Student added successfully!");
      
      // Reset form
      setFormData({
        student_id: "",
        password: "",
        name: "",
        pin: "",
        course: "B.Tech",
        branch: "",
        mobile: ""
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error("Failed to add student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Add Student</h3>
      
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Student ID:</label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Password:</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={loading}
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Pin No (Unique):</label>
            <input
              type="text"
              name="pin"
              value={formData.pin}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            {formData.pin && !validateUniquePin(formData.pin) && (
              <p className="text-red-400 text-sm mt-1">This pin number already exists</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Course:</label>
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Branch:</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Mobile (10 digits):</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              maxLength={10}
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-8 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Student..." : "Add Student"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddStudent;
