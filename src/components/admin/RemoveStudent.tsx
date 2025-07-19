
import { useState } from "react";
import { motion } from "framer-motion";
import { useStudents } from "../../hooks/useStudents";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Search, X } from "lucide-react";

const RemoveStudent = () => {
  const [loading, setLoading] = useState(false);
  const [searchPin, setSearchPin] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const { students } = useStudents();

  const filteredStudents = students.filter(student => 
    searchPin === "" || student.pin.toLowerCase().includes(searchPin.toLowerCase())
  );

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
      toast.error("Please select at least one student to remove");
      return;
    }
    
    setLoading(true);
    
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const student of selectedStudents) {
        try {
          // Remove student record (this will cascade to related tables)
          const { error: deleteError } = await supabase
            .from('students')
            .delete()
            .eq('id', student.id);

          if (deleteError) throw deleteError;
          successCount++;
        } catch (error) {
          console.error(`Error removing student ${student.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully removed ${successCount} student(s)`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to remove ${errorCount} student(s)`);
      }
      
      setSelectedStudents([]);
    } catch (error) {
      console.error('Error removing students:', error);
      toast.error("Failed to remove students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Remove Students</h3>
      
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
              placeholder="Enter PIN to search and select students to remove..."
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
            <label className="block text-gray-300 mb-2">Students to Remove ({selectedStudents.length}):</label>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 max-h-32 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {selectedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-1 flex items-center gap-2"
                  >
                    <span className="text-red-300 text-sm">{student.name} (PIN: {student.pin})</span>
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
            <p className="text-red-400 text-sm mt-2">⚠️ Warning: This action cannot be undone. All student data including fees and transactions will be permanently deleted.</p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading || selectedStudents.length === 0}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-8 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Removing Students..." : `Remove ${selectedStudents.length} Student(s)`}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default RemoveStudent;
