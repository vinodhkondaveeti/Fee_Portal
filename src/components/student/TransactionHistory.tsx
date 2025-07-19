
import { motion } from "framer-motion";

interface TransactionHistoryProps {
  student: any;
}

const TransactionHistory = ({ student }: TransactionHistoryProps) => {
  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Transaction History</h3>
      
      <div className="bg-white/5 rounded-xl p-4 max-h-96 overflow-y-auto">
        {student.transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {student.transactions.map((transaction: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 rounded-lg p-3 border border-white/10"
              >
                <p className="text-sm">{transaction}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
