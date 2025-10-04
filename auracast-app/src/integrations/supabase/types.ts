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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_profiles: {
        Row: {
          cold_weight: number
          created_at: string | null
          description: string | null
          hot_weight: number
          icon: string | null
          id: string
          name: string
          wet_weight: number
          windy_weight: number
        }
        Insert: {
          cold_weight: number
          created_at?: string | null
          description?: string | null
          hot_weight: number
          icon?: string | null
          id?: string
          name: string
          wet_weight: number
          windy_weight: number
        }
        Update: {
          cold_weight?: number
          created_at?: string | null
          description?: string | null
          hot_weight?: number
          icon?: string | null
          id?: string
          name?: string
          wet_weight?: number
          windy_weight?: number
        }
        Relationships: []
      }
      community_messages: {
        Row: {
          created_at: string | null
          id: string
          likes: number | null
          message: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          likes?: number | null
          message: string
          user_id?: string | null
          user_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          likes?: number | null
          message?: string
          user_id?: string | null
          user_name?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          order_index: number
          question: string
          updated_at: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          order_index?: number
          question: string
          updated_at?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          order_index?: number
          question?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string | null
          id: string
          lat: number
          lon: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lat: number
          lon: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lat?: number
          lon?: number
          name?: string
        }
        Relationships: []
      }
      nearby_risks: {
        Row: {
          created_at: string | null
          distance: number
          id: string
          lat: number
          lon: number
          name: string
          risk: number
          weather_data_id: string | null
        }
        Insert: {
          created_at?: string | null
          distance: number
          id?: string
          lat: number
          lon: number
          name: string
          risk: number
          weather_data_id?: string | null
        }
        Update: {
          created_at?: string | null
          distance?: number
          id?: string
          lat?: number
          lon?: number
          name?: string
          risk?: number
          weather_data_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nearby_risks_weather_data_id_fkey"
            columns: ["weather_data_id"]
            isOneToOne: false
            referencedRelation: "weather_data"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      safety_alerts: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          message: string
          severity: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          message: string
          severity: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          message?: string
          severity?: string
          type?: string
        }
        Relationships: []
      }
      travel_routes: {
        Row: {
          average_risk: number | null
          created_at: string | null
          estimated_time: string | null
          geographical_risk: number | null
          id: string
          route_name: string
          seasonal_risk: number | null
          total_distance: string | null
          updated_at: string | null
          user_id: string | null
          weather_risk: number | null
        }
        Insert: {
          average_risk?: number | null
          created_at?: string | null
          estimated_time?: string | null
          geographical_risk?: number | null
          id?: string
          route_name: string
          seasonal_risk?: number | null
          total_distance?: string | null
          updated_at?: string | null
          user_id?: string | null
          weather_risk?: number | null
        }
        Update: {
          average_risk?: number | null
          created_at?: string | null
          estimated_time?: string | null
          geographical_risk?: number | null
          id?: string
          route_name?: string
          seasonal_risk?: number | null
          total_distance?: string | null
          updated_at?: string | null
          user_id?: string | null
          weather_risk?: number | null
        }
        Relationships: []
      }
      travel_waypoints: {
        Row: {
          created_at: string | null
          eta: string | null
          id: string
          lat: number
          lon: number
          name: string
          order_index: number
          risk: number
          route_id: string | null
        }
        Insert: {
          created_at?: string | null
          eta?: string | null
          id?: string
          lat: number
          lon: number
          name: string
          order_index: number
          risk: number
          route_id?: string | null
        }
        Update: {
          created_at?: string | null
          eta?: string | null
          id?: string
          lat?: number
          lon?: number
          name?: string
          order_index?: number
          risk?: number
          route_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "travel_waypoints_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "travel_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_data: {
        Row: {
          cold_factor: number
          confidence: number
          created_at: string | null
          hot_factor: number
          id: string
          insight: string
          location_id: string | null
          overall_risk: number
          trend_change: string | null
          trend_direction: string | null
          trend_significance: number | null
          updated_at: string | null
          wet_factor: number
          windy_factor: number
        }
        Insert: {
          cold_factor: number
          confidence: number
          created_at?: string | null
          hot_factor: number
          id?: string
          insight: string
          location_id?: string | null
          overall_risk: number
          trend_change?: string | null
          trend_direction?: string | null
          trend_significance?: number | null
          updated_at?: string | null
          wet_factor: number
          windy_factor: number
        }
        Update: {
          cold_factor?: number
          confidence?: number
          created_at?: string | null
          hot_factor?: number
          id?: string
          insight?: string
          location_id?: string | null
          overall_risk?: number
          trend_change?: string | null
          trend_direction?: string | null
          trend_significance?: number | null
          updated_at?: string | null
          wet_factor?: number
          windy_factor?: number
        }
        Relationships: [
          {
            foreignKeyName: "weather_data_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
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
