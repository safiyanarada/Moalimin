import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { 
  User, 
  Profile, 
  AuthState, 
  LoginCredentials, 
  RegisterCredentials,
  UserRole 
} from '../types';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            role: (session.user.user_metadata?.role || 'student') as UserRole,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at,
          },
          profile: profile || null,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Erreur initialisation auth:', error);
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (credentials: LoginCredentials) => {
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            role: (data.user.user_metadata?.role || 'student') as UserRole,
            created_at: data.user.created_at,
            updated_at: data.user.updated_at || data.user.created_at,
          },
          profile: profile || null,
          isAuthenticated: true,
          isLoading: false,
        });

        return { success: true };
      }

      set({ isLoading: false });
      return { success: false, error: 'Erreur de connexion' };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Erreur de connexion' };
    }
  },

  register: async (credentials: RegisterCredentials) => {
    try {
      set({ isLoading: true });

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            role: credentials.role,
            first_name: credentials.first_name,
            last_name: credentials.last_name,
          }
        }
      });

      if (error) {
        set({ isLoading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        set({ isLoading: false });
        return { success: true };
      }

      set({ isLoading: false });
      return { success: false, error: 'Erreur lors de l\'inscription' };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: 'Erreur lors de l\'inscription' };
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Erreur logout:', error);
    }
  },

  updateProfile: async (profileData: Partial<Profile>) => {
    try {
      const { user } = get();
      if (!user) return { success: false, error: 'Utilisateur non connecté' };

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      set({ profile: data });
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur mise à jour profil' };
    }
  },
})); 