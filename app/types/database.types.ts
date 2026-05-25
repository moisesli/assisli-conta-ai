export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: {
          id: number;
          usuario_id: string;
          nombre: string;
          descripcion: string | null;
          tipo_ciclo: "mensual" | "dias";
          ciclo_dias: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          usuario_id: string;
          nombre: string;
          descripcion?: string | null;
          tipo_ciclo: "mensual" | "dias";
          ciclo_dias?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          usuario_id?: string;
          nombre?: string;
          descripcion?: string | null;
          tipo_ciclo?: "mensual" | "dias";
          ciclo_dias?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categorias_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      periodos: {
        Row: {
          id: number;
          categoria_id: number;
          fecha_inicio: string;
          fecha_fin: string;
          cerrado: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          categoria_id: number;
          fecha_inicio: string;
          fecha_fin: string;
          cerrado?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          categoria_id?: number;
          fecha_inicio?: string;
          fecha_fin?: string;
          cerrado?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "periodos_categoria_id_fkey";
            columns: ["categoria_id"];
            isOneToOne: false;
            referencedRelation: "categorias";
            referencedColumns: ["id"];
          },
        ];
      };
      registros: {
        Row: {
          id: number;
          periodo_id: number;
          descripcion: string;
          monto: number;
          fecha: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          periodo_id: number;
          descripcion: string;
          monto: number;
          fecha?: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          periodo_id?: number;
          descripcion?: string;
          monto?: number;
          fecha?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "registros_periodo_id_fkey";
            columns: ["periodo_id"];
            isOneToOne: false;
            referencedRelation: "periodos";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
