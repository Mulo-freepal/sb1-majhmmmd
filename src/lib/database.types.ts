export type Database = {
  public: {
    Tables: {
      employers: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          company_verified: boolean;
          contact_email: string;
          contact_phone: string | null;
          role: 'admin' | 'recruiter' | 'viewer';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          company_verified?: boolean;
          contact_email: string;
          contact_phone?: string | null;
          role?: 'admin' | 'recruiter' | 'viewer';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          company_verified?: boolean;
          contact_email?: string;
          contact_phone?: string | null;
          role?: 'admin' | 'recruiter' | 'viewer';
          created_at?: string;
          updated_at?: string;
        };
      };
      workers: {
        Row: {
          id: string;
          profile_picture_url: string | null;
          full_name: string;
          gender: string | null;
          date_of_birth: string | null;
          email: string | null;
          phone: string | null;
          location: string | null;
          availability: string | null;
          current_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_picture_url?: string | null;
          full_name: string;
          gender?: string | null;
          date_of_birth?: string | null;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          availability?: string | null;
          current_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_picture_url?: string | null;
          full_name?: string;
          gender?: string | null;
          date_of_birth?: string | null;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          availability?: string | null;
          current_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      work_experience: {
        Row: {
          id: string;
          worker_id: string;
          employer: string;
          role: string;
          duties: string | null;
          start_date: string | null;
          end_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          employer: string;
          role: string;
          duties?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          employer?: string;
          role?: string;
          duties?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
        };
      };
      worker_languages: {
        Row: {
          id: string;
          worker_id: string;
          language: string;
          proficiency: 'native' | 'fluent' | 'intermediate' | 'basic';
          created_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          language: string;
          proficiency: 'native' | 'fluent' | 'intermediate' | 'basic';
          created_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          language?: string;
          proficiency?: 'native' | 'fluent' | 'intermediate' | 'basic';
          created_at?: string;
        };
      };
      worker_skills: {
        Row: {
          id: string;
          worker_id: string;
          skill: string;
          certification: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          skill: string;
          certification?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          skill?: string;
          certification?: string | null;
          created_at?: string;
        };
      };
      worker_references: {
        Row: {
          id: string;
          worker_id: string;
          contact_name: string;
          position: string | null;
          phone: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          contact_name: string;
          position?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          contact_name?: string;
          position?: string | null;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
        };
      };
      shortlisted_workers: {
        Row: {
          id: string;
          employer_id: string;
          worker_id: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          employer_id: string;
          worker_id: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          employer_id?: string;
          worker_id?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      contact_requests: {
        Row: {
          id: string;
          employer_id: string;
          worker_id: string;
          message: string | null;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          employer_id: string;
          worker_id: string;
          message?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          employer_id?: string;
          worker_id?: string;
          message?: string | null;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
      };
    };
  };
};
