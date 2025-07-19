
import { motion } from "framer-motion";

interface FeeDueProps {
  student: any;
}

const FeeDue = ({ student }: FeeDueProps) => {
  const years = Object.keys(student.duesByYear || {});
  
  if (years.length === 0) {
    return (
      <div className="text-white text-center py-8">
        <p className="text-gray-300">No due records found.</p>
        <p className="text-sm text-gray-400 mt-2">All fees are up to date!</p>
      </div>
    );
  }

  // Filter years that have dues
  const yearsWithDues = years.filter(year => {
    const dues = student.duesByYear[year] || {};
    return Object.values(dues).some((due: any) => due > 0);
  });

  if (yearsWithDues.length === 0) {
    return (
      <div className="text-white text-center py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">All Caught Up!</h3>
        <p className="text-gray-300">You have no pending dues.</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6 text-center text-red-400">Pending Dues</h3>
      
      <div className="space-y-6">
        {yearsWithDues.map((year, yearIndex) => (
          <motion.div
            key={year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: yearIndex * 0.1 }}
            className="bg-red-900/20 rounded-xl p-6 border border-red-500/30"
          >
            <h4 className="text-xl font-semibold mb-4 text-red-300">{year}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(student.duesByYear[year] || {})
                .filter(([_, amount]) => (amount as number) > 0)
                .map(([feeName, amount], index) => (
                <motion.div
                  key={feeName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (yearIndex * 0.1) + (index * 0.05) }}
                  className="bg-red-800/20 rounded-lg p-4 border border-red-400/20"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{feeName}</span>
                    <span className="text-red-400 font-bold">₹{(amount as number)?.toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-red-500/30">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Due for {year}:</span>
                <span className="text-red-400">
                  ₹{Object.values(student.duesByYear[year] || {})
                    .filter((amount: any) => amount > 0)
                    .reduce((sum: number, amount: any) => sum + (amount || 0), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <div className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-500/30">
          <p className="text-yellow-300 font-semibold">
            💡 Tip: Use the "Pay Fee" tab to clear your dues
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeeDue;
