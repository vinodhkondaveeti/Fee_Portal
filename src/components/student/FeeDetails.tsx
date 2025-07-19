
import { motion } from "framer-motion";

interface FeeDetailsProps {
  student: any;
}

const FeeDetails = ({ student }: FeeDetailsProps) => {
  const years = Object.keys(student.feesByYear || {});
  
  if (years.length === 0) {
    return (
      <div className="text-white text-center py-8">
        <p className="text-gray-300">No fee records found.</p>
        <p className="text-sm text-gray-400 mt-2">Fee records will be initialized by admin.</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6 text-center">Fee Details</h3>
      
      <div className="space-y-6">
        {years.map((year, yearIndex) => (
          <motion.div
            key={year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: yearIndex * 0.1 }}
            className="bg-white/10 rounded-xl p-6 border border-white/20"
          >
            <h4 className="text-xl font-semibold mb-4 text-blue-300">{year}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(student.feesByYear[year] || {}).map(([feeName, amount], index) => (
                <motion.div
                  key={feeName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (yearIndex * 0.1) + (index * 0.05) }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{feeName}</span>
                    <span className="text-green-400 font-bold">₹{amount?.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total for {year}:</span>
                <span className="text-yellow-400">
                  ₹{Object.values(student.feesByYear[year] || {})
                    .reduce((sum: number, amount: any) => sum + (amount || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeeDetails;
