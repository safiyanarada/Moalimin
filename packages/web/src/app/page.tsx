'use client';

import { useEffect } from 'react';
import { useAuth } from '@moalimin/shared';
import LoginForm from '@/components/auth/LoginForm';
import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
  const { isLoading, isAuthenticated, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-islamic-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-50 to-primary-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-islamic-800 mb-4">
          🕌 Moalimin
        </h1>
        <p className="text-xl text-islamic-600 mb-8">
          Plateforme d'apprentissage islamique moderne
        </p>
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-islamic-700 mb-2">
              ✅ Application Web Fonctionnelle
            </h2>
            <p className="text-islamic-600">
              Next.js 15 + Tailwind CSS + TypeScript
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-primary-700 mb-2">
              📱 Prochaines étapes
            </h2>
            <ul className="text-left text-primary-600 space-y-2">
              <li>• Configurer Supabase (base de données)</li>
              <li>• Créer les pages d'authentification</li>
              <li>• Développer les dashboards étudiant/professeur</li>
              <li>• Intégrer l'application mobile</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
