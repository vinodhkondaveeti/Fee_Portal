
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { toast } from "sonner";
// import { supabase } from "@/integrations/supabase/client";
// import jsPDF from "jspdf";

// interface PayFeeProps {
//   student: any;
//   onPayment: (updatedStudent: any) => void;
// }

// const PayFee = ({ student, onPayment }: PayFeeProps) => {
//   const [selectedYear, setSelectedYear] = useState("2024-25");
//   const [selectedFeeType, setSelectedFeeType] = useState("");
//   const [amount, setAmount] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Credit Card");
//   const [loading, setLoading] = useState(false);
  
//   const years = ["2024-25", "2025-26", "2026-27", "2027-28"];
//   const paymentMethods = [
//     "Credit Card", "Debit Card", "UPI Number", "PhonePe", 
//     "GooglePay", "Paytm", "Amazon Pay", "PayPal", "Super Money"
//   ];

//   const getAvailableFees = () => {
//     if (!student.feesByYear || !student.feesByYear[selectedYear]) {
//       return [];
//     }
    
//     return Object.entries(student.feesByYear[selectedYear]).map(([name, amount]) => ({
//       name,
//       desc: name,
//       amount: amount as number
//     }));
//   };

//   const getDueAmount = () => {
//     if (!selectedFeeType || !student.duesByYear || !student.duesByYear[selectedYear]) {
//       return 0;
//     }
//     return student.duesByYear[selectedYear][selectedFeeType] || 0;
//   };

//   const updateStudentFeeInDatabase = async (paidAmount: number) => {
//     try {
//       // Find the student in database using the legacy ID format
//       const { data: dbStudent } = await supabase
//         .from('students')
//         .select('id')
//         .eq('student_id', student.id)
//         .single();

//       if (!dbStudent) {
//         throw new Error('Student not found in database');
//       }

//       // Update the student_fees table
//       const { error: updateError } = await supabase
//         .from('student_fees')
//         .update({
//           due_amount: getDueAmount() - paidAmount,
//           paid_amount: supabase.rpc('student_fees_paid_amount', { 
//             student_uuid: dbStudent.id,
//             fee_name_param: selectedFeeType,
//             year_param: selectedYear
//           }) + paidAmount,
//           updated_at: new Date().toISOString()
//         })
//         .eq('student_id', dbStudent.id)
//         .eq('fee_name', selectedFeeType)
//         .eq('year', selectedYear);

//       if (updateError) throw updateError;

//       // Add transaction record
//       const txnId = "TXN" + Date.now();
//       const { error: transactionError } = await supabase
//         .from('transactions')
//         .insert({
//           student_id: dbStudent.id,
//           description: `Paid ₹${paidAmount} for ${selectedFeeType} (${selectedYear}) via ${paymentMethod} [${txnId}]`,
//           amount: paidAmount,
//           transaction_type: 'payment'
//         });

//       if (transactionError) throw transactionError;

//       return txnId;
//     } catch (error) {
//       console.error('Database update error:', error);
//       throw error;
//     }
//   };

//   const handlePayment = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const due = getDueAmount();
//     const payAmount = parseInt(amount);
    
//     if (!selectedFeeType) {
//       toast.error("Please select a fee type");
//       return;
//     }
    
//     if (!payAmount || payAmount < 1) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
    
//     if (payAmount > due) {
//       toast.error("Amount exceeds due amount");
//       return;
//     }

//     setLoading(true);

//     try {
//       const txnId = await updateStudentFeeInDatabase(payAmount);

//       // Update local student data
//       const updatedStudent = { ...student };
      
//       // Update dues
//       if (!updatedStudent.duesByYear) updatedStudent.duesByYear = {};
//       if (!updatedStudent.duesByYear[selectedYear]) updatedStudent.duesByYear[selectedYear] = {};
//       updatedStudent.duesByYear[selectedYear][selectedFeeType] = due - payAmount;

//       // Add transaction to local data
//       if (!updatedStudent.transactions) updatedStudent.transactions = [];
//       const now = new Date();
//       updatedStudent.transactions.unshift(
//         `${now.toLocaleDateString()} ${now.toLocaleTimeString()}: Paid ₹${payAmount} for ${selectedFeeType} (${selectedYear}) via ${paymentMethod} [${txnId}]`
//       );

//       onPayment(updatedStudent);
//       generateReceipt(payAmount, txnId);
//       setAmount("");
//       toast.success("Payment successful!");
//     } catch (error) {
//       toast.error("Payment failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateReceipt = (paidAmount: number, txnId: string) => {
//     const doc = new jsPDF();
//     const now = new Date();
    
//     // Header
//     doc.setFontSize(20);
//     doc.text('Fee Payment Receipt', 105, 30, { align: 'center' });
    
//     // Student Details
//     doc.setFontSize(12);
//     doc.text(`Student Name: ${student.name}`, 20, 60);
//     doc.text(`Student ID: ${student.id}`, 20, 70);
//     doc.text(`Course: ${student.course}`, 20, 80);
//     doc.text(`Branch: ${student.branch}`, 20, 90);
//     doc.text(`Mobile: ${student.mobile}`, 20, 100);
    
//     // Payment Details
//     doc.text(`Date: ${now.toLocaleDateString()}`, 20, 120);
//     doc.text(`Time: ${now.toLocaleTimeString()}`, 20, 130);
//     doc.text(`Academic Year: ${selectedYear}`, 20, 140);
//     doc.text(`Fee Type: ${selectedFeeType}`, 20, 150);
//     doc.text(`Amount Paid: ₹${paidAmount.toLocaleString()}`, 20, 160);
//     doc.text(`Payment Method: ${paymentMethod}`, 20, 170);
//     doc.text(`Transaction ID: ${txnId}`, 20, 180);
    
//     // Footer
//     doc.text('Thank you for your payment!', 105, 220, { align: 'center' });
    
//     // Download
//     doc.save(`Receipt_${student.name}_${txnId}.pdf`);
//     toast.success("Receipt downloaded successfully!");
//   };

//   return (
//     <div className="text-white">
//       <h3 className="text-2xl font-bold mb-6">Pay Fee</h3>
      
//       <form onSubmit={handlePayment} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-gray-300 mb-2">Year:</label>
//             <select
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(e.target.value)}
//               className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {years.map(year => (
//                 <option key={year} value={year} className="bg-gray-800">{year}</option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-gray-300 mb-2">Fee Type:</label>
//             <select
//               value={selectedFeeType}
//               onChange={(e) => setSelectedFeeType(e.target.value)}
//               required
//               className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="" className="bg-gray-800">Select Fee Type</option>
//               {getAvailableFees().map(fee => (
//                 <option key={fee.name} value={fee.name} className="bg-gray-800">{fee.desc}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {selectedFeeType && (
//           <div className="bg-white/10 rounded-xl p-4 border border-white/20">
//             <p className="text-gray-300">Due Amount: <span className="text-red-400 font-bold">₹{getDueAmount().toLocaleString()}</span></p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-gray-300 mb-2">Amount:</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               max={getDueAmount()}
//               min="1"
//               required
//               disabled={loading}
//               className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//               placeholder={`Max: ₹${getDueAmount().toLocaleString()}`}
//             />
//           </div>
          
//           <div>
//             <label className="block text-gray-300 mb-2">Payment Method:</label>
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               disabled={loading}
//               className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//             >
//               {paymentMethods.map(method => (
//                 <option key={method} value={method} className="bg-gray-800">{method}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <motion.button
//           whileHover={{ scale: loading ? 1 : 1.02 }}
//           whileTap={{ scale: loading ? 1 : 0.98 }}
//           type="submit"
//           disabled={loading || !selectedFeeType || !amount}
//           className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {loading ? "Processing Payment..." : `Pay ₹${amount || 0}`}
//         </motion.button>
//       </form>
//     </div>
//   );
// };

// export default PayFee;


import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";

interface PayFeeProps {
  student: any;
  onPayment: (updatedStudent: any) => void;
}

const PayFee = ({ student, onPayment }: PayFeeProps) => {
  const [selectedYear, setSelectedYear] = useState("2024-25");
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);

  const years = ["2024-25", "2025-26", "2026-27", "2027-28"];
  const paymentMethods = [
    "Credit Card", "Debit Card", "UPI Number", "PhonePe", 
    "GooglePay", "Paytm", "Amazon Pay", "PayPal", "Super Money"
  ];

  // Get available fee types for the selected year
  const getAvailableFees = () => {
    if (!student.feesByYear || !student.feesByYear[selectedYear]) {
      return [];
    }
    return Object.entries(student.feesByYear[selectedYear]).map(([name, amount]) => ({
      name,
      desc: name,
      amount: amount as number
    }));
  };

  // Get due amount for the selected fee type and year
  const getDueAmount = () => {
    if (!selectedFeeType || !student.duesByYear || !student.duesByYear[selectedYear]) {
      return 0;
    }
    return student.duesByYear[selectedYear][selectedFeeType] || 0;
  };

  // Update student fee in database
  const updateStudentFeeInDatabase = async (paidAmount: number) => {
    try {
      // Find the student in database using the legacy ID format
      const { data: dbStudent, error: studentFetchError } = await supabase
        .from('students')
        .select('id')
        .eq('student_id', student.id)
        .single();

      if (studentFetchError || !dbStudent) {
        throw new Error('Student not found in database');
      }

      // Fetch current paid_amount and due_amount
      const { data: feeRow, error: feeFetchError } = await supabase
        .from('student_fees')
        .select('paid_amount, due_amount')
        .eq('student_id', dbStudent.id)
        .eq('fee_name', selectedFeeType)
        .eq('year', selectedYear)
        .single();

      if (feeFetchError || !feeRow) throw new Error('Fee record not found');

      const newPaidAmount = (feeRow.paid_amount || 0) + paidAmount;
      const newDueAmount = (feeRow.due_amount || 0) - paidAmount;

      // Update the student_fees table
      const { error: updateError } = await supabase
        .from('student_fees')
        .update({
          due_amount: newDueAmount,
          paid_amount: newPaidAmount,
          updated_at: new Date().toISOString()
        })
        .eq('student_id', dbStudent.id)
        .eq('fee_name', selectedFeeType)
        .eq('year', selectedYear);

      if (updateError) throw updateError;

      // Add transaction record
      const txnId = "TXN" + Date.now();
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          student_id: dbStudent.id,
          description: `Paid ₹${paidAmount} for ${selectedFeeType} (${selectedYear}) via ${paymentMethod} [${txnId}]`,
          amount: paidAmount,
          transaction_type: 'payment'
        });

      if (transactionError) throw transactionError;

      return txnId;
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  };

  // Handle payment form submission
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const due = getDueAmount();
    const payAmount = parseInt(amount);

    if (!selectedFeeType) {
      toast.error("Please select a fee type");
      return;
    }
    if (!payAmount || payAmount < 1) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (payAmount > due) {
      toast.error("Amount exceeds due amount");
      return;
    }

    setLoading(true);

    try {
      const txnId = await updateStudentFeeInDatabase(payAmount);

      // Update local student data
      const updatedStudent = { ...student };

      // Update dues
      if (!updatedStudent.duesByYear) updatedStudent.duesByYear = {};
      if (!updatedStudent.duesByYear[selectedYear]) updatedStudent.duesByYear[selectedYear] = {};
      updatedStudent.duesByYear[selectedYear][selectedFeeType] = due - payAmount;

      // Add transaction to local data
      if (!updatedStudent.transactions) updatedStudent.transactions = [];
      const now = new Date();
      updatedStudent.transactions.unshift(
        `${now.toLocaleDateString()} ${now.toLocaleTimeString()}: Paid ₹${payAmount} for ${selectedFeeType} (${selectedYear}) via ${paymentMethod} [${txnId}]`
      );

      onPayment(updatedStudent);
      generateReceipt(payAmount, txnId);
      setAmount("");
      toast.success("Payment successful!");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate and download payment receipt
  const generateReceipt = (paidAmount: number, txnId: string) => {
    const doc = new jsPDF();
    const now = new Date();

    // Header
    doc.setFontSize(20);
    doc.text('Fee Payment Receipt', 105, 30, { align: 'center' });

    // Student Details
    doc.setFontSize(12);
    doc.text(`Student Name: ${student.name}`, 20, 60);
    doc.text(`Student ID: ${student.id}`, 20, 70);
    doc.text(`Course: ${student.course}`, 20, 80);
    doc.text(`Branch: ${student.branch}`, 20, 90);
    doc.text(`Mobile: ${student.mobile}`, 20, 100);

    // Payment Details
    doc.text(`Date: ${now.toLocaleDateString()}`, 20, 120);
    doc.text(`Time: ${now.toLocaleTimeString()}`, 20, 130);
    doc.text(`Academic Year: ${selectedYear}`, 20, 140);
    doc.text(`Fee Type: ${selectedFeeType}`, 20, 150);
    doc.text(`Amount Paid: ₹${paidAmount.toLocaleString()}`, 20, 160);
    doc.text(`Payment Method: ${paymentMethod}`, 20, 170);
    doc.text(`Transaction ID: ${txnId}`, 20, 180);

    // Footer
    doc.text('Thank you for your payment!', 105, 220, { align: 'center' });

    // Download
    doc.save(`Receipt_${student.name}_${txnId}.pdf`);
    toast.success("Receipt downloaded successfully!");
  };

  return (
    <div className="text-white">
      <h3 className="text-2xl font-bold mb-6">Pay Fee</h3>
      <form onSubmit={handlePayment} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year} className="bg-gray-800">{year}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Fee Type:</label>
            <select
              value={selectedFeeType}
              onChange={(e) => setSelectedFeeType(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-gray-800">Select Fee Type</option>
              {getAvailableFees().map(fee => (
                <option key={fee.name} value={fee.name} className="bg-gray-800">{fee.desc}</option>
              ))}
            </select>
          </div>
        </div>
        {selectedFeeType && (
          <div className="bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-gray-300">
              Due Amount: <span className="text-red-400 font-bold">₹{getDueAmount().toLocaleString()}</span>
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={getDueAmount()}
              min="1"
              required
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder={`Max: ₹${getDueAmount().toLocaleString()}`}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Payment Method:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={loading}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {paymentMethods.map(method => (
                <option key={method} value={method} className="bg-gray-800">{method}</option>
              ))}
            </select>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading || !selectedFeeType || !amount}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing Payment..." : `Pay ₹${amount || 0}`}
        </motion.button>
      </form>
    </div>
  );
};

export default PayFee;

