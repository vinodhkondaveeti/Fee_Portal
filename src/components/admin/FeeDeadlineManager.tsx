
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Send, Users } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { useFees } from "../../hooks/useFees";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const FeeDeadlineManager = () => {
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [selectedFee, setSelectedFee] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [loading, setLoading] = useState(false);

  const { students } = useStudents();
  const { fees } = useFees();
  const branches = [...new Set(students.map(s => s.branch))];

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const { data, error } = await supabase
        .from('fee_deadlines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeadlines(data || []);
    } catch (error) {
      console.error('Error fetching deadlines:', error);
    }
  };

  const handleSetDeadline = async () => {
    if (!selectedFee || !selectedBranch || !deadlineDate) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('fee_deadlines')
        .insert({
          branch: selectedBranch,
          fee_type: selectedFee,
          deadline: deadlineDate
        });

      if (error) throw error;

      toast.success(`Deadline set for ${selectedFee} - ${selectedBranch}`);
      
      // Reset form
      setSelectedFee("");
      setSelectedBranch("");
      setDeadlineDate("");
      
      // Refresh deadlines
      fetchDeadlines();
    } catch (error) {
      console.error('Error setting deadline:', error);
      toast.error("Failed to set deadline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendImmediateNotification = (deadline: any) => {
    const studentsInBranch = students.filter(s => s.branch === deadline.branch);
    
    // In a real implementation, this would send actual SMS/email notifications
    toast.success(`Notifications would be sent to ${studentsInBranch.length} students in ${deadline.branch}`);
  };

  const removeDeadline = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fee_deadlines')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Deadline removed");
      fetchDeadlines();
    } catch (error) {
      console.error('Error removing deadline:', error);
      toast.error("Failed to remove deadline");
    }
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Fee Deadline Manager</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 rounded-xl p-6 border border-white/10"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Set Fee Deadline
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Fee Type:</label>
              <select
                value={selectedFee}
                onChange={(e) => setSelectedFee(e.target.value)}
                disabled={loading}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <option value="">Select Fee Type</option>
                {fees.map(fee => (
                  <option key={fee.name} value={fee.name} className="bg-gray-800">
                    {fee.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Branch:</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={loading}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch} className="bg-gray-800">
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Deadline Date:</label>
              <input
                type="datetime-local"
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                disabled={loading}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              />
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              onClick={handleSetDeadline}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Setting Deadline..." : "Set Deadline"}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 rounded-xl p-6 border border-white/10"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Deadlines
          </h4>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {deadlines.length === 0 ? (
              <p className="text-gray-400">No deadlines set</p>
            ) : (
              deadlines.map((deadline, index) => (
                <motion.div
                  key={deadline.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{deadline.fee_type}</p>
                      <p className="text-sm text-gray-400">Branch: {deadline.branch}</p>
                    </div>
                    <button
                      onClick={() => removeDeadline(deadline.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-sm text-gray-300">
                    Deadline: {new Date(deadline.deadline).toLocaleString()}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendImmediateNotification(deadline)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    Send Notification
                  </motion.button>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeeDeadlineManager;
