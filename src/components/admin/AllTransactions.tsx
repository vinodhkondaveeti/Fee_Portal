
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

const AllTransactions = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPin, setSearchPin] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (searchPin === "") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction => 
        transaction.students?.pin?.toLowerCase().includes(searchPin.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  }, [searchPin, transactions]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          students:student_id (
            name,
            student_id,
            branch,
            pin
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
      setFilteredTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">All Students' Transaction History</h3>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by PIN..."
              value={searchPin}
              onChange={(e) => setSearchPin(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="bg-purple-500/20 rounded-xl px-4 py-2 border border-purple-500/30">
            <span className="text-purple-300 font-semibold">
              {searchPin ? `Found: ${filteredTransactions.length}` : `Total: ${transactions.length}`}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 max-h-96 overflow-y-auto">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            {searchPin ? `No transactions found for PIN: ${searchPin}` : "No transactions yet."}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 rounded-xl p-4 border border-white/10"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400">
                      {transaction.students?.name} ({transaction.students?.student_id})
                    </h4>
                    <p className="text-sm text-gray-400">
                      Branch: {transaction.students?.branch} | PIN: {transaction.students?.pin}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">₹{transaction.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">{new Date(transaction.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-gray-300">{transaction.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Type: {transaction.transaction_type}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTransactions;
