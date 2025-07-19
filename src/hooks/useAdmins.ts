
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Admin = Database['public']['Tables']['admins']['Row'];

export const useAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();

    // Set up real-time subscription
    const channel = supabase
      .channel('admins_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admins'
        },
        () => {
          fetchAdmins();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const authenticateAdmin = async (adminId: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('admin_id', adminId)
        .eq('password', password)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    admins,
    loading,
    authenticateAdmin,
    refetch: fetchAdmins
  };
};
