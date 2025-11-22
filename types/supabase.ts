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
      Food: {
        Row: {
          created_at: string
          id: number
          name: string
          uploaded_by: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          uploaded_by?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          uploaded_by?: string | null
          url?: string | null
        }
        Relationships: []
      }
      Note: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          id: number
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      Photo: {
        Row: {
          created_at: string
          id: number
          name: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      Pokemon: {
        Row: {
          created_at: string
          created_by: string
          id: number
          pokemon_id: number
          pokemon_image_url: string
          pokemon_name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          pokemon_id: number
          pokemon_image_url: string
          pokemon_name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          pokemon_id?: number
          pokemon_image_url?: string
          pokemon_name?: string
        }
        Relationships: []
      }
      PokemonReview: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          id: number
          pokemon_id: number
          rating: number | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          id?: number
          pokemon_id: number
          rating?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          id?: number
          pokemon_id?: number
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "PokemonReview_pokemon_id_fkey"
            columns: ["pokemon_id"]
            isOneToOne: false
            referencedRelation: "Pokemon"
            referencedColumns: ["id"]
          },
        ]
      }
      Profile: {
        Row: {
          created_at: string
          fullname: string | null
          id: string
        }
        Insert: {
          created_at?: string
          fullname?: string | null
          id: string
        }
        Update: {
          created_at?: string
          fullname?: string | null
          id?: string
        }
        Relationships: []
      }
      Review: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          food_id: number
          id: number
          rating: number | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          food_id: number
          id?: number
          rating?: number | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          food_id?: number
          id?: number
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Review_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "Food"
            referencedColumns: ["id"]
          },
        ]
      }
      Task: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: number
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: number
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          title?: string
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
