export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_login_attempts: {
        Row: {
          id: number
          ip_address: string | null
          timestamp: string | null
          username: string | null
        }
        Insert: {
          id?: number
          ip_address?: string | null
          timestamp?: string | null
          username?: string | null
        }
        Update: {
          id?: number
          ip_address?: string | null
          timestamp?: string | null
          username?: string | null
        }
        Relationships: []
      }
      admin_preferences: {
        Row: {
          admin_id: string
          filter_date_end: string | null
          filter_date_start: string | null
          filter_room_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          admin_id: string
          filter_date_end?: string | null
          filter_date_start?: string | null
          filter_room_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          admin_id?: string
          filter_date_end?: string | null
          filter_date_start?: string | null
          filter_room_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_preferences_filter_room_id_fkey"
            columns: ["filter_room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          admin_id: number | null
          created_at: string | null
          expires_at: string | null
          id: number
          token: string | null
        }
        Insert: {
          admin_id?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: number
          token?: string | null
        }
        Update: {
          admin_id?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: number
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string | null
          id: number
          password: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          password?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          password?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      booking_repeats: {
        Row: {
          booking_id: string
          created_at: string | null
          end_date: string | null
          id: string
          repeat_type: Database["public"]["Enums"]["repeat_type_enum"] | null
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          repeat_type?: Database["public"]["Enums"]["repeat_type_enum"] | null
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          repeat_type?: Database["public"]["Enums"]["repeat_type_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_repeats_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string | null
          date: string
          end_time: string
          id: string
          is_recurring: boolean | null
          parent_booking_id: string | null
          remarks: string | null
          repeat_end_date: string | null
          repeat_type: string | null
          room_id: string
          start_time: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          end_time: string
          id?: string
          is_recurring?: boolean | null
          parent_booking_id?: string | null
          remarks?: string | null
          repeat_end_date?: string | null
          repeat_type?: string | null
          room_id: string
          start_time: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          end_time?: string
          id?: string
          is_recurring?: boolean | null
          parent_booking_id?: string | null
          remarks?: string | null
          repeat_end_date?: string | null
          repeat_type?: string | null
          room_id?: string
          start_time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_bookings_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_upload_logs: {
        Row: {
          admin_id: string | null
          error_message: string | null
          id: string
          timestamp: string | null
        }
        Insert: {
          admin_id?: string | null
          error_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Update: {
          admin_id?: string | null
          error_message?: string | null
          id?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          email: string | null
          error_message: string | null
          id: number
          status: string | null
          timestamp: string | null
          type: string | null
        }
        Insert: {
          email?: string | null
          error_message?: string | null
          id?: number
          status?: string | null
          timestamp?: string | null
          type?: string | null
        }
        Update: {
          email?: string | null
          error_message?: string | null
          id?: number
          status?: string | null
          timestamp?: string | null
          type?: string | null
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          id: number
          ip_address: string | null
          pin: string | null
          timestamp: string | null
        }
        Insert: {
          id?: number
          ip_address?: string | null
          pin?: string | null
          timestamp?: string | null
        }
        Update: {
          id?: number
          ip_address?: string | null
          pin?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      otp_attempts: {
        Row: {
          id: number
          otp: string | null
          success: boolean | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: number
          otp?: string | null
          success?: boolean | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: number
          otp?: string | null
          success?: boolean | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      otp_requests: {
        Row: {
          email: string | null
          id: number
          ip_address: string | null
          timestamp: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          ip_address?: string | null
          timestamp?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          ip_address?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      otps: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: number
          otp: string | null
          used: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: number
          otp?: string | null
          used?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: number
          otp?: string | null
          used?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          designation: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          pin: string | null
          role: string | null
          status: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          pin?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          pin?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      registration_logs: {
        Row: {
          error_message: string | null
          id: number
          ip_address: string | null
          timestamp: string | null
        }
        Insert: {
          error_message?: string | null
          id?: number
          ip_address?: string | null
          timestamp?: string | null
        }
        Update: {
          error_message?: string | null
          id?: number
          ip_address?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          available_time: Json | null
          capacity: number | null
          color: string | null
          created_at: string | null
          facilities: string | null
          id: string
          image: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          available_time?: Json | null
          capacity?: number | null
          color?: string | null
          created_at?: string | null
          facilities?: string | null
          id?: string
          image?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          available_time?: Json | null
          capacity?: number | null
          color?: string | null
          created_at?: string | null
          facilities?: string | null
          id?: string
          image?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: number
          token: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: number
          token?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: number
          token?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          id: string
          layout: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          layout?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          layout?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      repeat_type_enum: "no_repeat" | "daily" | "weekly" | "monthly" | "custom"
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
    Enums: {
      repeat_type_enum: ["no_repeat", "daily", "weekly", "monthly", "custom"],
    },
  },
} as const
