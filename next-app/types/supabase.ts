export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          description: string;
          price: string;
          image_url: string[];
          stock: number | null;
          created_at: string | null;
          updated_at: string | null;
          slug: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          description: string;
          price: string | number;
          image_url: string[];
          stock?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          slug: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          description?: string;
          price?: string | number;
          image_url?: string[];
          stock?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          slug?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          slug: string | null; // ← Nuevo campo
          created_at: string | null;
        };
      };
    };
  };
};

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
