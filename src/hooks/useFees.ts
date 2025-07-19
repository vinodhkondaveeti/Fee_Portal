
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Fee = Database['public']['Tables']['fees']['Row'];
type StudentFee = Database['public']['Tables']['student_fees']['Row'];

export const useFees = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFees(data || []);
    } catch (error) {
      console.error('Error fetching fees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStudentFees = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('student_fees')
        .select('*')
        .eq('student_id', studentId);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  };

  const initializeStudentFees = async (studentId: string) => {
    try {
      const years = ['2024-25', '2025-26', '2026-27', '2027-28'];
      const studentFeeRecords = [];

      for (const year of years) {
        for (const fee of fees) {
          studentFeeRecords.push({
            student_id: studentId,
            fee_name: fee.name,
            year,
            total_amount: fee.amount,
            due_amount: fee.amount,
            paid_amount: 0
          });
        }
      }

      const { error } = await supabase
        .from('student_fees')
        .insert(studentFeeRecords);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    fees,
    loading,
    getStudentFees,
    initializeStudentFees,
    refetch: fetchFees
  };
};
