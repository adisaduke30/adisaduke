export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'client'
          avatar_url: string | null
          phone: string | null
          company: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'admin' | 'client'
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'client'
          avatar_url?: string | null
          phone?: string | null
          company?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          client_id: string
          name: string
          description: string | null
          status: 'pending' | 'pre_production' | 'shooting' | 'editing' | 'review' | 'delivered' | 'cancelled'
          project_type: string | null
          deadline: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          description?: string | null
          status?: 'pending' | 'pre_production' | 'shooting' | 'editing' | 'review' | 'delivered' | 'cancelled'
          project_type?: string | null
          deadline?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          name?: string
          description?: string | null
          status?: 'pending' | 'pre_production' | 'shooting' | 'editing' | 'review' | 'delivered' | 'cancelled'
          project_type?: string | null
          deadline?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_messages: {
        Row: {
          id: string
          project_id: string
          sender_id: string
          body: string
          attachment_url: string | null
          attachment_name: string | null
          attachment_size: number | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          sender_id: string
          body: string
          attachment_url?: string | null
          attachment_name?: string | null
          attachment_size?: number | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          sender_id?: string
          body?: string
          attachment_url?: string | null
          attachment_name?: string | null
          attachment_size?: number | null
          read_at?: string | null
          created_at?: string
        }
      }
      project_files: {
        Row: {
          id: string
          project_id: string
          uploaded_by: string
          file_url: string
          file_name: string
          file_type: string
          file_size: number | null
          is_final: boolean
          version: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          uploaded_by: string
          file_url: string
          file_name: string
          file_type: string
          file_size?: number | null
          is_final?: boolean
          version?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          uploaded_by?: string
          file_url?: string
          file_name?: string
          file_type?: string
          file_size?: number | null
          is_final?: boolean
          version?: number
          notes?: string | null
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          project_id: string
          stripe_invoice_id: string | null
          amount: number
          deposit_amount: number | null
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date: string | null
          paid_at: string | null
          notes: string | null
          line_items: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          stripe_invoice_id?: string | null
          amount: number
          deposit_amount?: number | null
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string | null
          paid_at?: string | null
          notes?: string | null
          line_items?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          stripe_invoice_id?: string | null
          amount?: number
          deposit_amount?: number | null
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string | null
          paid_at?: string | null
          notes?: string | null
          line_items?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          invoice_id: string
          stripe_payment_intent: string
          amount: number
          status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'
          payment_method: string | null
          is_deposit: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          stripe_payment_intent: string
          amount: number
          status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'
          payment_method?: string | null
          is_deposit?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          stripe_payment_intent?: string
          amount?: number
          status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'
          payment_method?: string | null
          is_deposit?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          client_id: string | null
          email: string
          name: string
          desired_date: string | null
          project_type: string | null
          message: string
          budget_range: string | null
          attachments: Json | null
          status: 'pending' | 'reviewing' | 'approved' | 'declined' | 'converted'
          converted_project_id: string | null
          admin_notes: string | null
          responded_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          email: string
          name: string
          desired_date?: string | null
          project_type?: string | null
          message: string
          budget_range?: string | null
          attachments?: Json | null
          status?: 'pending' | 'reviewing' | 'approved' | 'declined' | 'converted'
          converted_project_id?: string | null
          admin_notes?: string | null
          responded_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          email?: string
          name?: string
          desired_date?: string | null
          project_type?: string | null
          message?: string
          budget_range?: string | null
          attachments?: Json | null
          status?: 'pending' | 'reviewing' | 'approved' | 'declined' | 'converted'
          converted_project_id?: string | null
          admin_notes?: string | null
          responded_at?: string | null
          created_at?: string
        }
      }
      client_notes: {
        Row: {
          id: string
          client_id: string
          admin_id: string
          note: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          admin_id: string
          note: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          admin_id?: string
          note?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          link: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          link?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          link?: string | null
          read_at?: string | null
          created_at?: string
        }
      }
    }
  }
}
