export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          admin_id: string
          created_at: string | null
          id: string
          mobile: string
          name: string
          password: string
          photo_color: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          id?: string
          mobile: string
          name: string
          password: string
          photo_color?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          id?: string
          mobile?: string
          name?: string
          password?: string
          photo_color?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fee_deadlines: {
        Row: {
          branch: string
          created_at: string | null
          created_by: string | null
          deadline: string
          fee_type: string
          id: string
        }
        Insert: {
          branch: string
          created_at?: string | null
          created_by?: string | null
          deadline: string
          fee_type: string
          id?: string
        }
        Update: {
          branch?: string
          created_at?: string | null
          created_by?: string | null
          deadline?: string
          fee_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_deadlines_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      fees: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      student_fees: {
        Row: {
          created_at: string | null
          due_amount: number
          fee_name: string
          id: string
          paid_amount: number
          student_id: string | null
          total_amount: number
          updated_at: string | null
          year: string
        }
        Insert: {
          created_at?: string | null
          due_amount?: number
          fee_name: string
          id?: string
          paid_amount?: number
          student_id?: string | null
          total_amount: number
          updated_at?: string | null
          year: string
        }
        Update: {
          created_at?: string | null
          due_amount?: number
          fee_name?: string
          id?: string
          paid_amount?: number
          student_id?: string | null
          total_amount?: number
          updated_at?: string | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          branch: string
          course: string
          created_at: string | null
          id: string
          mobile: string
          name: string
          password: string
          photo_color: string | null
          pin: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          branch: string
          course: string
          created_at?: string | null
          id?: string
          mobile: string
          name: string
          password: string
          photo_color?: string | null
          pin: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          branch?: string
          course?: string
          created_at?: string | null
          id?: string
          mobile?: string
          name?: string
          password?: string
          photo_color?: string | null
          pin?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          student_id: string | null
          transaction_type: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          id?: string
          student_id?: string | null
          transaction_type?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          student_id?: string | null
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
