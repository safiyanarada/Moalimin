# 🌍 STRATÉGIE D'INTERNATIONALISATION (i18n)

## 🎯 OBJECTIFS INTERNATIONAUX

### **Vision globale**
- **15+ langues** supportées dès le lancement
- **Support RTL** natif pour arabe, hébreu, persan
- **Localisation culturelle** complète (dates, devises, calendriers)
- **Interface de traduction** pour organisations
- **Détection automatique** de langue et région

---

## 🗣️ LANGUES CIBLES PRIORITAIRES

### **Phase 1 - Langues principales (MVP)**
1. **🇫🇷 Français** (langue de base)
2. **🇬🇧 Anglais** (langue internationale)
3. **🇸🇦 Arabe** (important pour marché MENA et diversité culturelle)
4. **🇪🇸 Espagnol** (2ème langue mondiale)
5. **🇩🇪 Allemand** (marché européen)

### **Phase 2 - Expansion régionale**
6. **🇮🇹 Italien**
7. **🇵🇹 Portugais** (Brésil inclus)
8. **🇳🇱 Néerlandais**
9. **🇷🇺 Russe**
10. **🇹🇷 Turc**

### **Phase 3 - Marchés émergents**
11. **🇮🇩 Indonésien** (plus grand pays musulman)
12. **🇺🇷 Urdu** (Pakistan, Inde)
13. **🇮🇷 Persan/Farsi**
14. **🇲🇾 Malais**
15. **🇨🇳 Mandarin** (marché énorme)

---

## 🏗️ ARCHITECTURE TECHNIQUE I18N

### **Structure des fichiers de traduction**

```typescript
// Structure recommandée
src/
├── locales/
│   ├── fr/
│   │   ├── common.json          // Éléments UI communs
│   │   ├── auth.json           // Authentification
│   │   ├── dashboard.json      // Dashboard
│   │   ├── courses.json        // Cours et contenu
│   │   ├── assessments.json    // Évaluations
│   │   ├── communication.json  // Messages, forums
│   │   ├── admin.json          // Interface admin
│   │   └── errors.json         // Messages d'erreur
│   ├── en/
│   │   └── [same structure]
│   ├── ar/
│   │   └── [same structure]
│   └── [other languages]/
├── i18n/
│   ├── config.ts              // Configuration i18n
│   ├── detect.ts              // Détection langue
│   ├── plurals.ts             // Règles de pluriel
│   └── rtl.ts                 // Support RTL
```

### **Configuration i18n avec react-i18next**

```typescript
// i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const languages = {
  fr: { nativeName: 'Français', dir: 'ltr' },
  en: { nativeName: 'English', dir: 'ltr' },
  ar: { nativeName: 'العربية', dir: 'rtl' },
  es: { nativeName: 'Español', dir: 'ltr' },
  de: { nativeName: 'Deutsch', dir: 'ltr' },
  it: { nativeName: 'Italiano', dir: 'ltr' },
  pt: { nativeName: 'Português', dir: 'ltr' },
  nl: { nativeName: 'Nederlands', dir: 'ltr' },
  ru: { nativeName: 'Русский', dir: 'ltr' },
  tr: { nativeName: 'Türkçe', dir: 'ltr' },
  id: { nativeName: 'Bahasa Indonesia', dir: 'ltr' },
  ur: { nativeName: 'اردو', dir: 'rtl' },
  fa: { nativeName: 'فارسی', dir: 'rtl' },
  ms: { nativeName: 'Bahasa Melayu', dir: 'ltr' },
  zh: { nativeName: '中文', dir: 'ltr' }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    debug: process.env.NODE_ENV === 'development',
    
    // Espaces de noms
    ns: ['common', 'auth', 'dashboard', 'courses', 'assessments', 'communication', 'admin', 'errors'],
    defaultNS: 'common',
    
    // Détection de langue
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    // Configuration backend
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Interpolation
    interpolation: {
      escapeValue: false,
      formatSeparator: ',',
      format: (value, format, lng) => {
        if (format === 'number') return new Intl.NumberFormat(lng).format(value);
        if (format === 'currency') return new Intl.NumberFormat(lng, { style: 'currency', currency: 'EUR' }).format(value);
        if (format === 'date') return new Intl.DateTimeFormat(lng).format(value);
        return value;
      }
    },
    
    // Support pluriel
    pluralSeparator: '_',
    contextSeparator: '_',
  });

export { languages };
export default i18n;
```

### **Hook personnalisé pour i18n**

```typescript
// hooks/useI18n.ts
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n/config';

export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  const currentLanguage = i18n.language;
  const currentDir = languages[currentLanguage]?.dir || 'ltr';
  const isRTL = currentDir === 'rtl';
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = languages[lang]?.dir || 'ltr';
  };
  
  const formatCurrency = (amount: number, currency = 'EUR') => {
    return new Intl.NumberFormat(currentLanguage, {
      style: 'currency',
      currency
    }).format(amount);
  };
  
  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(currentLanguage, options).format(date);
  };
  
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat(currentLanguage).format(number);
  };
  
  return {
    t,
    currentLanguage,
    currentDir,
    isRTL,
    changeLanguage,
    formatCurrency,
    formatDate,
    formatNumber,
    availableLanguages: Object.keys(languages)
  };
};
```

---

## 🎨 SUPPORT RTL (RIGHT-TO-LEFT)

### **CSS pour RTL**

```css
/* globals.css */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}

[dir="rtl"] .mr-4 {
  margin-right: 0;
  margin-left: 1rem;
}

[dir="rtl"] .pl-4 {
  padding-left: 0;
  padding-right: 1rem;
}

[dir="rtl"] .pr-4 {
  padding-right: 0;
  padding-left: 1rem;
}

/* Flexbox direction */
[dir="rtl"] .flex-row {
  flex-direction: row-reverse;
}

/* Icons flip */
[dir="rtl"] .flip-rtl {
  transform: scaleX(-1);
}
```

### **Composant RTL-aware**

```typescript
// components/ui/RTLProvider.tsx
import React, { useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';

export const RTLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentDir, currentLanguage } = useI18n();
  
  useEffect(() => {
    document.documentElement.dir = currentDir;
    document.documentElement.lang = currentLanguage;
  }, [currentDir, currentLanguage]);
  
  return <>{children}</>;
};

// Hook pour classes RTL
export const useRTL = () => {
  const { isRTL } = useI18n();
  
  const rtlClass = (ltrClass: string, rtlClass: string) => 
    isRTL ? rtlClass : ltrClass;
  
  const marginLeft = (size: string) => 
    isRTL ? `mr-${size}` : `ml-${size}`;
  
  const marginRight = (size: string) => 
    isRTL ? `ml-${size}` : `mr-${size}`;
  
  const paddingLeft = (size: string) => 
    isRTL ? `pr-${size}` : `pl-${size}`;
  
  const paddingRight = (size: string) => 
    isRTL ? `pl-${size}` : `pr-${size}`;
  
  return {
    isRTL,
    rtlClass,
    marginLeft,
    marginRight,
    paddingLeft,
    paddingRight
  };
};
```

---

## 🗄️ BASE DE DONNÉES MULTILINGUE

### **Tables de traduction**

```sql
-- Table pour stocker les traductions
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Clé de traduction
  key TEXT NOT NULL, -- ex: "course.title.123"
  
  -- Langue et contenu
  language TEXT NOT NULL, -- ex: "fr", "en", "ar"
  value TEXT NOT NULL, -- Texte traduit
  
  -- Contexte
  namespace TEXT DEFAULT 'default', -- Groupement logique
  organization_id UUID REFERENCES organizations(id), -- Traductions spécifiques à l'org
  
  -- Metadata
  is_plural BOOLEAN DEFAULT FALSE,
  plural_key TEXT, -- Pour gérer les pluriels
  context TEXT, -- Contexte additionnel
  
  -- Quality
  is_machine_translated BOOLEAN DEFAULT FALSE,
  translator_id UUID REFERENCES users(id), -- Qui a traduit
  reviewed_by UUID REFERENCES users(id), -- Qui a validé
  reviewed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(key, language, organization_id, context)
);

-- Index pour performance
CREATE INDEX idx_translations_key_lang ON translations(key, language);
CREATE INDEX idx_translations_org_lang ON translations(organization_id, language);
CREATE INDEX idx_translations_namespace ON translations(namespace);

-- Vue pour faciliter les requêtes
CREATE VIEW translation_keys AS
SELECT DISTINCT 
  key,
  namespace,
  organization_id,
  COUNT(DISTINCT language) as languages_count,
  ARRAY_AGG(DISTINCT language) as available_languages
FROM translations 
GROUP BY key, namespace, organization_id;
```

### **API de traduction**

```typescript
// services/translationService.ts
interface TranslationKey {
  key: string;
  namespace?: string;
  organizationId?: string;
  context?: string;
}

interface Translation {
  key: string;
  language: string;
  value: string;
  namespace: string;
  isMachineTranslated: boolean;
  translatorId?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

class TranslationService {
  async getTranslations(
    language: string, 
    namespace: string = 'default',
    organizationId?: string
  ): Promise<Record<string, string>> {
    const query = `
      SELECT key, value 
      FROM translations 
      WHERE language = $1 
        AND namespace = $2 
        AND (organization_id = $3 OR organization_id IS NULL)
      ORDER BY organization_id DESC NULLS LAST
    `;
    
    const result = await db.query(query, [language, namespace, organizationId]);
    
    return result.rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  }
  
  async setTranslation(
    key: string,
    language: string,
    value: string,
    options: {
      namespace?: string;
      organizationId?: string;
      translatorId?: string;
      isMachineTranslated?: boolean;
    } = {}
  ): Promise<void> {
    await db.query(`
      INSERT INTO translations (key, language, value, namespace, organization_id, translator_id, is_machine_translated)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (key, language, organization_id, context)
      DO UPDATE SET 
        value = EXCLUDED.value,
        translator_id = EXCLUDED.translator_id,
        is_machine_translated = EXCLUDED.is_machine_translated,
        updated_at = NOW()
    `, [
      key,
      language,
      value,
      options.namespace || 'default',
      options.organizationId,
      options.translatorId,
      options.isMachineTranslated || false
    ]);
  }
  
  async getMissingTranslations(
    targetLanguage: string,
    sourceLanguage: string = 'fr',
    namespace?: string,
    organizationId?: string
  ): Promise<TranslationKey[]> {
    const query = `
      SELECT DISTINCT t1.key, t1.namespace, t1.organization_id
      FROM translations t1
      LEFT JOIN translations t2 ON (
        t1.key = t2.key 
        AND t2.language = $1
        AND t1.organization_id = t2.organization_id
      )
      WHERE t1.language = $2
        AND t2.key IS NULL
        AND ($3::text IS NULL OR t1.namespace = $3)
        AND ($4::uuid IS NULL OR t1.organization_id = $4)
    `;
    
    const result = await db.query(query, [targetLanguage, sourceLanguage, namespace, organizationId]);
    return result.rows;
  }
}
```

---

## 🤖 TRADUCTION AUTOMATIQUE

### **Intégration avec services de traduction**

```typescript
// services/autoTranslationService.ts
import { GoogleTranslate } from '@google-cloud/translate';
import { DeepLAPI } from 'deepl-node';

class AutoTranslationService {
  private googleTranslate: GoogleTranslate;
  private deepl: DeepLAPI;
  
  constructor() {
    this.googleTranslate = new GoogleTranslate({
      projectId: process.env.GOOGLE_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    
    this.deepl = new DeepLAPI(process.env.DEEPL_API_KEY);
  }
  
  async translateText(
    text: string,
    targetLang: string,
    sourceLang: string = 'fr',
    service: 'google' | 'deepl' = 'deepl'
  ): Promise<string> {
    try {
      if (service === 'deepl') {
        const result = await this.deepl.translateText(
          text,
          sourceLang as any,
          targetLang as any
        );
        return result.text;
      } else {
        const [translation] = await this.googleTranslate.translate(text, {
          from: sourceLang,
          to: targetLang,
        });
        return translation;
      }
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Failed to translate text: ${error.message}`);
    }
  }
  
  async translateMissingKeys(
    targetLanguage: string,
    sourceLang: string = 'fr',
    organizationId?: string
  ): Promise<number> {
    const translationService = new TranslationService();
    const missingKeys = await translationService.getMissingTranslations(
      targetLanguage,
      sourceLang,
      undefined,
      organizationId
    );
    
    let translatedCount = 0;
    
    for (const keyInfo of missingKeys) {
      try {
        // Récupérer le texte source
        const sourceTranslations = await translationService.getTranslations(
          sourceLang,
          keyInfo.namespace,
          keyInfo.organizationId
        );
        
        const sourceText = sourceTranslations[keyInfo.key];
        if (!sourceText) continue;
        
        // Traduire
        const translatedText = await this.translateText(
          sourceText,
          targetLanguage,
          sourceLang
        );
        
        // Sauvegarder
        await translationService.setTranslation(
          keyInfo.key,
          targetLanguage,
          translatedText,
          {
            namespace: keyInfo.namespace,
            organizationId: keyInfo.organizationId,
            isMachineTranslated: true,
          }
        );
        
        translatedCount++;
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Failed to translate key ${keyInfo.key}:`, error);
      }
    }
    
    return translatedCount;
  }
}
```

---

## 🌐 LOCALISATION CULTURELLE

### **Formats de dates et heures**

```typescript
// utils/localization.ts
export const getLocalizedFormats = (language: string) => {
  const formats = {
    fr: {
      dateShort: 'dd/MM/yyyy',
      dateLong: 'EEEE d MMMM yyyy',
      time: 'HH:mm',
      datetime: 'dd/MM/yyyy HH:mm',
      currency: '€',
      weekStart: 1, // Lundi
    },
    en: {
      dateShort: 'MM/dd/yyyy',
      dateLong: 'EEEE, MMMM d, yyyy',
      time: 'h:mm a',
      datetime: 'MM/dd/yyyy h:mm a',
      currency: '$',
      weekStart: 0, // Dimanche
    },
    ar: {
      dateShort: 'dd/MM/yyyy',
      dateLong: 'EEEE، d MMMM yyyy',
      time: 'HH:mm',
      datetime: 'dd/MM/yyyy HH:mm',
      currency: 'ر.س',
      weekStart: 6, // Samedi
    },
    // ... autres langues
  };
  
  return formats[language] || formats.fr;
};

// Calendriers culturels et traditionnels
export const getCulturalCalendars = (language: string) => {
  return {
    islamic: language === 'ar',
    gregorian: true,
    hebrew: language === 'he',
    persian: language === 'fa',
    lunar: ['ar', 'he', 'fa'].includes(language),
    solar: true,
  };
};
```

### **Composant sélecteur de langue**

```typescript
// components/LanguageSelector.tsx
import React from 'react';
import { useI18n } from '../hooks/useI18n';
import { languages } from '../i18n/config';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useI18n();
  
  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
      className="rounded border p-2"
    >
      {Object.entries(languages).map(([code, { nativeName }]) => (
        <option key={code} value={code}>
          {nativeName}
        </option>
      ))}
    </select>
  );
};
```

---

## 📋 CHECKLIST IMPLEMENTATION

### **Phase 1 - Setup (Semaine 1)**
- [ ] Configuration react-i18next
- [ ] Structure des fichiers de traduction
- [ ] Hook useI18n personnalisé
- [ ] Support RTL de base
- [ ] Composant RTLProvider

### **Phase 2 - Traductions core (Semaine 2)**
- [ ] Traduction français (base)
- [ ] Traduction anglais
- [ ] Traduction arabe
- [ ] Messages d'erreur multilingues
- [ ] Validation des clés manquantes

### **Phase 3 - Database & API (Semaine 3)**
- [ ] Tables de traduction
- [ ] API CRUD traductions
- [ ] Interface admin pour traductions
- [ ] Service de traduction automatique
- [ ] Système de validation par natifs

### **Phase 4 - Localisation avancée (Semaine 4)**
- [ ] Formats dates/heures localisés
- [ ] Devises et nombres
- [ ] Calendriers culturels
- [ ] Détection automatique de langue
- [ ] Tests sur tous navigateurs

Cette stratégie garantit une **expérience utilisateur native** dans chaque langue et culture cible. 