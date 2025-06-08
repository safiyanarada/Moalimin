# 🕌 Moalimin - Plateforme d'apprentissage islamique

## 📱 Architecture Monorepo

```
moalimin/
├── packages/
│   ├── mobile/          # React Native + Expo
│   ├── web/            # Next.js + React
│   └── shared/         # Types, hooks, Supabase partagés
├── supabase/           # Base de données et migrations
└── package.json        # Configuration monorepo
```

## 🚀 Installation rapide

### 1. **Prérequis**
- Node.js 18+ 
- npm 8+
- Docker Desktop (pour Supabase local)
- Expo CLI (pour mobile)

### 2. **Installation**
```bash
# Cloner et installer
git clone <votre-repo>
cd moalimin
npm install

# Installer les dépendances des packages
npm run setup:packages
```

### 3. **Démarrer Supabase**
```bash
# Démarrer Docker Desktop d'abord !
supabase start
```

### 4. **Lancer les applications**

**Web (Next.js) :**
```bash
npm run dev:web
# Ouvre http://localhost:3000
```

**Mobile (React Native) :**
```bash
npm run dev:mobile
# Scanner le QR code avec Expo Go
```

## 🗄️ Base de données

### **Schéma principal :**
- `profiles` - Profils utilisateurs (élèves/professeurs)
- `courses` - Cours disponibles
- `sessions` - Sessions de cours en direct
- `progress` - Progression des élèves
- `notifications` - Notifications système

### **Authentification :**
- Supabase Auth avec RLS (Row Level Security)
- Rôles : `student`, `teacher`, `admin`
- Création automatique de profil à l'inscription

### **Commandes Supabase :**
```bash
supabase start          # Démarrer local
supabase stop           # Arrêter
supabase db reset       # Reset + migrations
supabase status         # Voir les URLs/clés
```

## 🔧 Configuration

### **Variables d'environnement :**

**Mobile (.env) :**
```env
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Web (.env.local) :**
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📱 Fonctionnalités

### ✅ **Implémenté :**
- Architecture monorepo React Native + Next.js
- Authentification Supabase avec profils
- Base de données avec RLS et triggers
- Hooks partagés (useAuth)
- Interface de connexion mobile + web
- Dashboard de base

### 🚧 **À développer :**
- Inscription complète
- Gestion des cours
- Sessions live
- Progression élèves
- Notifications push
- Mode hors ligne

## 🎨 Design System

### **Couleurs :**
```css
/* Islamique */
islamic-50: #f7fdf4
islamic-600: #10b981
islamic-800: #047857

/* Primaire */
primary-50: #f0f9ff
primary-600: #0284c7
```

### **Composants partagés :**
- Types TypeScript dans `packages/shared/src/types/`
- Hook d'auth dans `packages/shared/src/hooks/useAuth.ts`
- Client Supabase dans `packages/shared/src/lib/supabase.ts`

## 🔐 Sécurité

### **Row Level Security (RLS) :**
- Utilisateurs voient seulement leurs données
- Professeurs accès étendu à leurs cours
- Politiques strictes sur toutes les tables

### **Authentification :**
- Tokens JWT Supabase
- Sessions persistantes
- Refresh automatique

## 📚 Développement

### **Structure des packages :**

**Shared :**
```typescript
// Types partagés
import { User, Profile, Course } from '@moalimin/shared';

// Hook d'authentification
import { useAuth } from '@moalimin/shared';

// Client Supabase
import { supabase } from '@moalimin/shared';
```

**Mobile :**
- React Native + Expo
- Navigation avec React Navigation
- Styling avec NativeWind (Tailwind)

**Web :**
- Next.js 15 + App Router
- Tailwind CSS
- Composants client avec 'use client'

### **Scripts disponibles :**
```bash
npm run dev:mobile      # Expo start
npm run dev:web         # Next.js dev
npm run build:web       # Build production web
npm run supabase:start  # Démarrer Supabase
npm run supabase:reset  # Reset DB + migrations
```

## 🐛 Dépannage

### **Erreurs communes :**

**"Cannot find module '@moalimin/shared'" :**
```bash
npm run setup:packages
```

**"Docker daemon not running" :**
- Démarrer Docker Desktop
- Puis `supabase start`

**"Permission denied npm" :**
```bash
sudo chown -R $(whoami) ~/.npm
```

**Erreurs TypeScript :**
- Les erreurs sont normales avant installation des dépendances
- Lancer `npm install` dans chaque package

## 🚀 Déploiement

### **Production :**
- **Web :** Vercel/Netlify
- **Mobile :** Expo EAS Build
- **Database :** Supabase Cloud

### **Variables de production :**
Remplacer les URLs localhost par les URLs Supabase Cloud.

## 📞 Support

Pour toute question technique :
1. Vérifier que Docker est démarré
2. Vérifier que toutes les dépendances sont installées
3. Consulter les logs Supabase avec `supabase logs`

---

**🎯 Objectif :** Créer une plateforme d'apprentissage islamique moderne, accessible sur mobile et web, avec une base de données robuste et une authentification sécurisée.

**📈 Roadmap :** Développement itératif par fonctionnalités, validation à chaque étape, déploiement progressif. 