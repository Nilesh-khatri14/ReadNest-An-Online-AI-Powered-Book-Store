export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exchange_requests: {
        Row: {
          created_at: string
          id: string
          offered_book_id: string
          owner_id: string
          requested_book_id: string
          requester_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          offered_book_id: string
          owner_id: string
          requested_book_id: string
          requester_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          offered_book_id?: string
          owner_id?: string
          requested_book_id?: string
          requester_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "exchange_requests_offered_book_id_fkey"
            columns: ["offered_book_id"]
            isOneToOne: false
            referencedRelation: "used_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exchange_requests_requested_book_id_fkey"
            columns: ["requested_book_id"]
            isOneToOne: false
            referencedRelation: "used_books"
            referencedColumns: ["id"]
          },
        ]
      }
      login_attempts: {
        Row: {
          attempt_time: string
          email: string
          id: string
          ip_address: string | null
          successful: boolean
        }
        Insert: {
          attempt_time?: string
          email: string
          id?: string
          ip_address?: string | null
          successful: boolean
        }
        Update: {
          attempt_time?: string
          email?: string
          id?: string
          ip_address?: string | null
          successful?: boolean
        }
        Relationships: []
      }
      order_items: {
        Row: {
          author: string
          book_id: string
          created_at: string
          id: string
          image_url: string | null
          order_id: string
          price_at_purchase: number
          quantity: number
          title: string
        }
        Insert: {
          author: string
          book_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          order_id: string
          price_at_purchase: number
          quantity: number
          title: string
        }
        Update: {
          author?: string
          book_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          order_id?: string
          price_at_purchase?: number
          quantity?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          order_date: string
          payment_method: string
          shipping_address: Json
          status: Database["public"]["Enums"]["order_status_enum"]
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_date?: string
          payment_method: string
          shipping_address: Json
          status?: Database["public"]["Enums"]["order_status_enum"]
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_date?: string
          payment_method?: string
          shipping_address?: Json
          status?: Database["public"]["Enums"]["order_status_enum"]
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      used_books: {
        Row: {
          author: string
          condition: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          price: number
          status: string
          title: string
          user_id: string
        }
        Insert: {
          author: string
          condition: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          price: number
          status?: string
          title: string
          user_id: string
        }
        Update: {
          author?: string
          condition?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_login_attempt: {
        Args: {
          login_email: string
          login_password: string
          client_ip?: string
        }
        Returns: Json
      }
    }
    Enums: {
      order_status_enum: "Processing" | "Shipped" | "Delivered" | "Cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status_enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    },
  },
} as const
