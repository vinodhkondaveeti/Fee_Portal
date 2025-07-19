
import { useState } from "react";
import { motion } from "framer-motion";
import { useStudents } from "../../hooks/useStudents";
import { useFees } from "../../hooks/useFees";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Search, X } from "lucide-react";

const RemoveFeeStudent = () => {
  const [formData, setFormData] = useState({
    year: "2024-25",
    feeType: ""
  });
  const [loading, setLoading] = useState(false);
  const [searchPin, setSearchPin] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { students } = useStudents();
  const { fees } = useFees();
  const years = ["2024-25", "2025-26", "2026-27", "2027-28"];

  const filteredStudents = students.filter(student => 
    searchPin === "" || student.pin.toLowerCase().includes(searchPin.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentSelect = (student: any) => {
    if (!selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents(prev => [...prev, student]);
    }
    setSearchPin("");
    setShowDropdown(false);
  };

  const removeSelectedStudent = (studentId: string) => {
    setSelectedStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }
    
    setLoading(true);
    
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const student of selectedStudents) {
        try {
          // Remove from student_fees table
          const { error: deleteError } = await supabase
            .from('student_fees')
            .delete()
            .eq('student_id', student.id)
            .eq('fee_name', formData.feeType)
            .eq('year', formData.year);

          if (deleteError) throw deleteError;

          // Add transaction record for the fee removal
          const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
              student_id: student.id,
              description: `Fee removed: ${formData.feeType} (${formData.year})`,
              amount: 0,
              transaction_type: 'fee_removed'
            });

          if (transactionError) throw transactionError;
          successCount++;
        } catch (error) {
          console.error(`Error removing fee for ${student.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Fee removed for ${successCount} student(s)`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to remove fee for ${errorCount} student(s)`);
      }
      
      setFormData({
        year: "2024-25",
        feeType: ""
      });
      setSelectedStudents([]);
    } catch (error) {
      console.error('Error removing fees:', error);
      toast.error("Failed to remove fees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Remove Fee Type for Students</h3>
      
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl"
      >
        <div className="relative">
          <label className="block text-gray-300 mb-2">Search Students by PIN:</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Enter PIN to search and select students..."
              value={searchPin}
              onChange={(e) => {
                setSearchPin(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>
          
          {showDropdown && searchPin && filteredStudents.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-white/20 rounded-xl max-h-40 overflow-y-auto">
              {filteredStudents.slice(0, 5).map((student) => (
                <div
                  key={student.id}
                  onClick={() => handleStudentSelect(student)}
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0"
                >
                  <div className="text-white font-medium">{student.name}</div>
                  <div className="text-gray-400 text-sm">PIN: {student.pin} | ID: {student.student_id}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedStudents.length > 0 && (
          <div>
            <label className="block text-gray-300 mb-2">Selected Students ({selectedStudents.length}):</label>
            <div className="bg-white/5 rounded-xl p-4 max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {selectedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="bg-purple-500/20 border border-purple-500/30 rounded-lg px-3 py-1 flex items-center gap-2"
                  >
                    <span className="text-purple-300 text-sm">{student.name} (PIN: {student.pin})</span>
                    <button
                      type="button"
                      onClick={() => removeSelectedStudent(student.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Year:</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {years.map(year => (
                <option key={year} value={year} className="bg-gray-800">{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 mb-2">Fee Type:</label>
            <select
              name="feeType"
              value={formData.feeType}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <option value="" className="bg-gray-800">Select Fee Type</option>
              {fees.map(fee => (
                <option key={fee.name} value={fee.name} className="bg-gray-800">{fee.name}</option>
              ))}
            </select>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading || selectedStudents.length === 0}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-8 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Removing Fees..." : `Remove Fee for ${selectedStudents.length} Student(s)`}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default RemoveFeeStudent;
