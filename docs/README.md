# 📚 DOCUMENTATION ALIMNI UNIVERSAL

## 🎯 ORGANISATION

Cette documentation est **automatiquement consultée** par Cursor selon les règles définies dans `.cursorrules` pour garantir la cohérence du développement.

---

## 📋 STRUCTURE DOCUMENTATION

### **🗺️ PLANIFICATION GÉNÉRALE**
- **[ROADMAP_UNIVERSAL_LEARNING_PLATFORM.md](./ROADMAP_UNIVERSAL_LEARNING_PLATFORM.md)**
  - Roadmap complète 6 phases sur 12 mois
  - Architecture modulaire et fonctionnalités
  - Système de modules activables
  - Vision transformation universelle

### **🗄️ ARCHITECTURE TECHNIQUE**
- **[DATABASE_ARCHITECTURE_UNIVERSAL.md](./DATABASE_ARCHITECTURE_UNIVERSAL.md)**
  - Schéma PostgreSQL complet multi-tenant
  - Row Level Security (RLS) policies
  - Optimisations performance & index
  - Support millions d'utilisateurs

### **🌍 INTERNATIONALISATION**
- **[INTERNATIONALIZATION_STRATEGY.md](./INTERNATIONALIZATION_STRATEGY.md)**
  - Support 15+ langues (FR/EN/AR prioritaires)
  - Architecture i18n avec react-i18next
  - Support RTL natif (arabe, hébreu, persan)
  - Localisation culturelle complète

### **💰 MONÉTISATION**
- **[MONETIZATION_STRATEGY.md](./MONETIZATION_STRATEGY.md)**
  - Modèles de revenus SaaS + Marketplace
  - Plans tarifaires (Free/Premium/Enterprise)
  - Projections financières 3 ans
  - Stratégies d'acquisition & pricing géographique

### **🎨 IDENTITÉ DE MARQUE**
- **[BRAND_IDENTITY_BRAINSTORM.md](./BRAND_IDENTITY_BRAINSTORM.md)**
  - Analyse problème identité actuelle
  - Propositions noms universels
  - Stratégies rebranding
  - Plan transition et budget

### **📦 INVENTAIRE EXISTANT**
- **[INVENTORY_COMPLETE_ARCHIVE.md](./INVENTORY_COMPLETE_ARCHIVE.md)**
  - Audit complet du frontend existant (70% réutilisable)
  - Composants UI développés (shadcn/ui)
  - Services et hooks personnalisés
  - Gaps techniques identifiés

### **🚀 PLAN D'ACTION**
- **[PLAN_ACTION_IMMEDIAT.md](./PLAN_ACTION_IMMEDIAT.md)**
  - Timeline 8 semaines MVP production
  - Milestones et livrables concrets
  - Budget infrastructure (~85€/mois)
  - Setup monorepo et outils

### **🛠️ STANDARDS TECHNIQUES**
- **[TECHNICAL_STANDARDS.md](./TECHNICAL_STANDARDS.md)**
  - Standards sécurité niveau enterprise
  - Bonnes pratiques code & architecture
  - Configuration obligatoire TypeScript/ESLint
  - Tests, monitoring, CI/CD

---

## 🤖 RULES CURSOR

Le fichier **`.cursorrules`** à la racine du projet définit :

### **📖 Consultation automatique**
```json
{
  "database_changes": {
    "must_read": ["docs/DATABASE_ARCHITECTURE_UNIVERSAL.md"],
    "description": "Toujours consulter l'architecture DB avant toute modification de schéma"
  },
  "business_features": {
    "must_read": ["docs/ROADMAP_UNIVERSAL_LEARNING_PLATFORM.md", "docs/MONETIZATION_STRATEGY.md"],
    "description": "Aligner les fonctionnalités avec la roadmap et la stratégie de monétisation"
  },
  "branding_communication": {
    "must_read": ["docs/BRAND_IDENTITY_BRAINSTORM.md"],
    "description": "Respecter l'identité universelle et éviter références culturelles spécifiques"
  }
}
```

### **🔒 Standards obligatoires**
- **Sécurité niveau enterprise** (RLS, JWT, chiffrement)
- **Qualité code stricte** (TypeScript strict, ESLint, tests 80%+)
- **Performance optimisée** (Web Vitals, pagination, lazy loading)
- **Architecture clean** (Repository pattern, Service layer)
- **🌍 Neutralité culturelle** (éviter références spécifiques)

### **🌐 Contraintes business**
- **Multi-tenancy complet** avec isolation données
- **Support multilingue natif** (15+ langues)
- **Modules activables** selon besoins organisation
- **Responsive mobile-first** avec accessibilité WCAG 2.1 AA
- **Universalité stricte** dans naming et messaging

---

## 🔄 MISE À JOUR

Cette documentation **évolue avec le projet** :

### **✅ Processus de mise à jour**
1. **Changements architecture** → Mettre à jour `DATABASE_ARCHITECTURE_UNIVERSAL.md`
2. **Nouvelles fonctionnalités** → Mettre à jour `ROADMAP_UNIVERSAL_LEARNING_PLATFORM.md`
3. **Évolutions business** → Mettre à jour `MONETIZATION_STRATEGY.md`
4. **Standards techniques** → Mettre à jour `TECHNICAL_STANDARDS.md`
5. **Questions branding** → Mettre à jour `BRAND_IDENTITY_BRAINSTORM.md`

### **🎯 Responsabilités**
- **Développeur** : Consulter docs pertinentes avant développement
- **Product Owner** : Maintenir cohérence business/technique
- **Tech Lead** : Valider conformité aux standards
- **Brand Manager** : Assurer neutralité culturelle universelle

---

## 📞 SUPPORT

Pour toute question sur la documentation :
1. Consulter le fichier pertinent selon le contexte
2. Vérifier les règles dans `.cursorrules`
3. Maintenir la cohérence avec la vision universelle
4. **TOUJOURS respecter la neutralité culturelle**

**Vision** : Transformer la plateforme en **LMS universel de référence** permettant à toute organisation d'enseigner n'importe quel domaine avec excellence technique, business model durable et **accessibilité culturelle mondiale**. 