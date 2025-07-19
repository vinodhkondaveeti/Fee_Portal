
import { motion } from "framer-motion";
import { fees, fines, deadlines } from "../../data/mockData";

const FeeManagement = () => {
  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Fee Structure & Management</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 rounded-xl p-6 border border-white/10"
        >
          <h4 className="text-xl font-semibold mb-4">Current Fees</h4>
          <div className="space-y-3">
            {fees.map((fee, index) => (
              <div key={fee.name} className="flex justify-between items-center py-2 border-b border-white/10">
                <div>
                  <p className="font-semibold">{fee.desc}</p>
                  <p className="text-sm text-gray-400">{fee.name}</p>
                </div>
                <p className="text-lg font-bold text-green-400">₹{fee.amount}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 rounded-xl p-6 border border-white/10"
        >
          <h4 className="text-xl font-semibold mb-4">Payment Deadlines</h4>
          <div className="space-y-3">
            {Object.entries(deadlines).map(([feeType, deadline]) => (
              <div key={feeType} className="flex justify-between items-center py-2 border-b border-white/10">
                <p className="font-semibold">{feeType}</p>
                <p className="text-orange-400">{deadline.toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-white/10 rounded-xl p-6 border border-white/10"
      >
        <h4 className="text-xl font-semibold mb-4">Fine Structure</h4>
        <div className="space-y-3">
          {fines.map((fine, index) => (
            <div key={fine.name} className="flex justify-between items-center py-2 border-b border-white/10">
              <div>
                <p className="font-semibold text-red-400">{fine.desc}</p>
                <p className="text-sm text-gray-400">{fine.name}</p>
              </div>
              <p className="text-lg font-bold text-red-400">₹{fine.amount}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FeeManagement;
