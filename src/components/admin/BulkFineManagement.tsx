
import { useState } from "react";
import { motion } from "framer-motion";
import { useStudents } from "../../hooks/useStudents";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Search, X } from "lucide-react";

const BulkFineManagement = () => {
  const [formData, setFormData] = useState({
    year: "2024-25",
    fineName: "",
    fineDescription: "",
    amount: ""
  });
  const [loading, setLoading] = useState(false);
  const [searchPin, setSearchPin] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { students } = useStudents();
  const years = ["2024-25", "2025-26", "2026-27", "2027-28"];

  const filteredStudents = students.filter(student => 
    searchPin === "" || student.pin.toLowerCase().includes(searchPin.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const amount = parseInt(formData.amount);
      let successCount = 0;
      let errorCount = 0;

      for (const student of selectedStudents) {
        try {
          // Add to student_fees table
          const { error: feeError } = await supabase
            .from('student_fees')
            .insert({
              student_id: student.id,
              fee_name: formData.fineName,
              year: formData.year,
              total_amount: amount,
              due_amount: amount,
              paid_amount: 0
            });

          if (feeError) throw feeError;

          // Add transaction record for the fine
          const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
              student_id: student.id,
              description: `Fine added: ${formData.fineDescription} (${formData.year})`,
              amount: amount,
              transaction_type: 'fine_added'
            });

          if (transactionError) throw transactionError;
          successCount++;
        } catch (error) {
          console.error(`Error adding fine for ${student.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Fine added for ${successCount} student(s)`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to add fine for ${errorCount} student(s)`);
      }
      
      setFormData({
        year: "2024-25",
        fineName: "",
        fineDescription: "",
        amount: ""
      });
      setSelectedStudents([]);
    } catch (error) {
      console.error('Error adding fines:', error);
      toast.error("Failed to add fines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Add Fine to Multiple Students</h3>
      
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
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {selectedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="bg-orange-500/20 border border-orange-500/30 rounded-lg px-3 py-1 flex items-center gap-2"
                  >
                    <span className="text-orange-300 text-sm">{student.name} (PIN: {student.pin})</span>
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
            <label className="block text-gray-300 mb-2">Fine Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min="1"
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Fine Name:</label>
          <input
            type="text"
            name="fineName"
            value={formData.fineName}
            onChange={handleInputChange}
            required
            disabled={loading}
            placeholder="e.g., Late Submission Fine, Library Fine, etc."
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Fine Description:</label>
          <input
            type="text"
            name="fineDescription"
            value={formData.fineDescription}
            onChange={handleInputChange}
            required
            disabled={loading}
            placeholder="Detailed description of the fine"
            className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading || selectedStudents.length === 0}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-8 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Fines..." : `Add Fine to ${selectedStudents.length} Student(s)`}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default BulkFineManagement;
