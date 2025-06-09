# 🛠️ STANDARDS TECHNIQUES - ALIMNI UNIVERSAL

## 🎯 OBJECTIFS QUALITÉ

**Mission** : Garantir un code de **qualité production enterprise** avec une **sécurité maximale** et des **performances optimales** pour supporter des millions d'utilisateurs à l'échelle mondiale.

---

## 🔒 SÉCURITÉ (NIVEAU ENTERPRISE)

### **🛡️ AUTHENTIFICATION & AUTORISATION**

#### **Standards authentification**
```typescript
// JWT + Refresh Tokens obligatoires
interface AuthTokens {
  accessToken: string;    // Durée: 15 minutes
  refreshToken: string;   // Durée: 7 jours
  expiresAt: number;
  tokenType: 'Bearer';
}

// Row Level Security sur TOUTES les tables
-- Exemple policy obligatoire
CREATE POLICY "Users can only access their organization data" 
ON courses FOR ALL 
USING (organization_id = auth.organization_id());

// Validation input côté client ET serveur
const createCourseSchema = z.object({
  title: z.string().min(3).max(100).trim(),
  description: z.string().max(2000).trim(),
  organizationId: z.string().uuid(),
  // Sanitisation automatique
});
```

#### **Protection contre attaques**
```typescript
// Rate Limiting obligatoire
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
}));

// CORS strict configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://alimni.com'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Helmet pour headers sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://trusted-cdn.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));
```

### **🔐 CHIFFREMENT & DONNÉES SENSIBLES**

#### **Standards chiffrement**
```typescript
// Chiffrement données sensibles (PII)
import { encrypt, decrypt } from '@/lib/encryption';

// Toujours chiffrer PII en base
const encryptedData = await encrypt(personalInfo, process.env.ENCRYPTION_KEY);

// Variables d'environnement sécurisées OBLIGATOIRES
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'ENCRYPTION_KEY',
  'SUPABASE_KEY',
] as const;

// Validation au démarrage
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

#### **Audit et logs**
```typescript
// Audit logs OBLIGATOIRE pour actions sensibles
interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  organizationId: string;
}

// Logging automatique via middleware
const auditMiddleware = (action: string) => (req: Request, res: Response, next: NextFunction) => {
  // Log avant et après chaque action sensible
  auditLogger.info({
    userId: req.user.id,
    action,
    resource: req.route.path,
    ipAddress: req.ip,
    userAgent: req.get('User-Agent'),
  });
  next();
};
```

---

## ⚡ PERFORMANCE & OPTIMISATION

### **🚀 STANDARDS PERFORMANCE**

#### **Métriques obligatoires**
```typescript
// Web Vitals targets STRICTS
const performanceTargets = {
  FCP: 1500,  // First Contentful Paint < 1.5s
  LCP: 2500,  // Largest Contentful Paint < 2.5s
  TTI: 3000,  // Time to Interactive < 3s
  CLS: 0.1,   // Cumulative Layout Shift < 0.1
  FID: 100,   // First Input Delay < 100ms
} as const;

// Monitoring automatique
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // Envoyer vers monitoring (Sentry/PostHog)
  analytics.track('web_vital', metric);
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### **Optimisations obligatoires**
```typescript
// Pagination OBLIGATOIRE pour listes > 50 items
interface PaginationParams {
  page: number;
  limit: number; // max 100
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Lazy loading composants lourds
const CourseEditor = lazy(() => import('@/components/CourseEditor'));
const AnalyticsDashboard = lazy(() => import('@/components/AnalyticsDashboard'));

// Image optimization Next.js
import Image from 'next/image';
<Image 
  src={thumbnail} 
  alt={title}
  width={300}
  height={200}
  placeholder="blur"
  priority={isAboveFold}
/>;

// Bundle analysis obligatoire
// package.json
"analyze": "cross-env ANALYZE=true next build"
```

### **🗄️ OPTIMISATION BASE DE DONNÉES**

#### **Index strategiques obligatoires**
```sql
-- Performance indexes OBLIGATOIRES
CREATE INDEX CONCURRENTLY idx_users_org_active 
ON users(organization_id, status) WHERE status = 'active';

CREATE INDEX CONCURRENTLY idx_courses_published 
ON courses(organization_id, status, created_at) WHERE status = 'published';

CREATE INDEX CONCURRENTLY idx_enrollments_active 
ON enrollments(user_id, status, last_accessed) WHERE status = 'active';

-- Full-text search
CREATE INDEX CONCURRENTLY idx_courses_search 
ON courses USING gin(to_tsvector('french', title || ' ' || description));
```

#### **Requêtes optimisées**
```typescript
// TOUJOURS utiliser select spécifique
const getCourses = async (organizationId: string) => {
  return supabase
    .from('courses')
    .select('id, title, description, thumbnail_url, instructor:profiles(first_name, last_name)')
    .eq('organization_id', organizationId)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(50); // TOUJOURS limiter
};

// Avoid N+1 queries avec eager loading
const getCoursesWithStats = async () => {
  return supabase
    .from('courses')
    .select(`
      *,
      enrollments(count),
      lessons(count),
      instructor:profiles(first_name, last_name)
    `)
    .eq('status', 'published');
};
```

---

## 🧪 QUALITÉ CODE & TESTS

### **🔧 CONFIGURATION STRICTE**

#### **TypeScript strict obligatoire**
```json
// tsconfig.json - Configuration STRICTE
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false
  }
}
```

#### **ESLint configuration enterprise**
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-template": "error"
  }
}
```

### **🧪 STRATÉGIE TESTS OBLIGATOIRE**

#### **Couverture tests minimale**
```typescript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// Tests OBLIGATOIRES pour fonctions critiques
describe('Authentication Service', () => {
  it('should validate JWT tokens correctly', async () => {
    const token = generateJWT({ userId: '123', role: 'student' });
    const decoded = await validateJWT(token);
    expect(decoded.userId).toBe('123');
  });

  it('should reject expired tokens', async () => {
    const expiredToken = generateJWT({ userId: '123' }, { expiresIn: '-1h' });
    await expect(validateJWT(expiredToken)).rejects.toThrow('Token expired');
  });
});
```

#### **Tests E2E critiques**
```typescript
// playwright.config.ts - Tests E2E OBLIGATOIRES
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});

// Tests E2E critiques
test('Complete user registration flow', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[data-testid=email]', 'test@example.com');
  await page.fill('[data-testid=password]', 'SecurePass123!');
  await page.click('[data-testid=submit]');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 🏗️ ARCHITECTURE & PATTERNS

### **🎯 CLEAN ARCHITECTURE OBLIGATOIRE**

#### **Structure dossiers standardisée**
```
src/
├── app/                    # Next.js 15 App Router
│   ├── (auth)/            # Route groups
│   ├── (dashboard)/       
│   └── api/               # API routes
├── components/            # UI Components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Core business logic
│   ├── services/         # Business services
│   ├── repositories/     # Data access
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom React hooks
│   └── validations/      # Zod schemas
├── store/                # State management (Zustand)
└── styles/               # Global styles
```

#### **Patterns obligatoires**
```typescript
// Repository pattern OBLIGATOIRE
interface CourseRepository {
  findById(id: string): Promise<Course | null>;
  findByOrganization(orgId: string): Promise<Course[]>;
  create(course: CreateCourseDto): Promise<Course>;
  update(id: string, course: UpdateCourseDto): Promise<Course>;
  delete(id: string): Promise<void>;
}

// Service layer pour logique métier
class CourseService {
  constructor(
    private courseRepo: CourseRepository,
    private enrollmentRepo: EnrollmentRepository,
    private analytics: AnalyticsService
  ) {}

  async createCourse(data: CreateCourseDto, userId: string): Promise<Course> {
    // Validation business rules
    await this.validateCourseCreation(data, userId);
    
    // Create course
    const course = await this.courseRepo.create({
      ...data,
      instructorId: userId,
      status: 'draft'
    });

    // Analytics event
    await this.analytics.track('course_created', {
      courseId: course.id,
      userId,
      organizationId: data.organizationId
    });

    return course;
  }
}

// Custom hooks pour réutilisabilité
export const useCourses = (organizationId: string) => {
  return useQuery({
    queryKey: ['courses', organizationId],
    queryFn: () => courseService.getCoursesByOrganization(organizationId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### **⚛️ REACT BEST PRACTICES**

#### **Component composition**
```typescript
// Composition over inheritance TOUJOURS
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);

// Error boundaries OBLIGATOIRES
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback: ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <this.props.fallback error={this.state.error!} />;
    }
    return this.props.children;
  }
}
```

---

## 📱 STANDARDS MOBILE & RESPONSIVE

### **📐 DESIGN SYSTEM MOBILE-FIRST**

#### **Breakpoints standardisés**
```css
/* tailwind.config.ts */
module.exports = {
  theme: {
    screens: {
      'xs': '375px',   // Mobile S
      'sm': '640px',   // Mobile L  
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Desktop L
      '2xl': '1536px', // Desktop XL
    },
  },
};

/* Utilisation OBLIGATOIRE */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>
```

#### **Touch targets et accessibilité**
```typescript
// Touch targets minimum 44px
const touchTargetClass = "min-h-[44px] min-w-[44px]";

// WCAG 2.1 AA compliance OBLIGATOIRE
interface AccessibleProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  tabIndex?: number;
}

// Focus management
const useFocusManagement = () => {
  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    firstElement?.focus();
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  };

  return { trapFocus };
};
```

---

## 🌐 INTERNATIONALISATION STANDARDS

### **🗣️ i18n OBLIGATOIRE**

#### **Structure traductions**
```typescript
// types/i18n.ts - Types stricts pour traductions
interface Translations {
  common: {
    buttons: {
      save: string;
      cancel: string;
      delete: string;
    };
    errors: {
      required: string;
      invalid_email: string;
      server_error: string;
    };
  };
  dashboard: {
    welcome: string;
    my_courses: string;
    progress: string;
  };
}

// Usage avec autocomplétion
const { t } = useTranslation();
const welcomeMessage = t('dashboard.welcome'); // ✅ Type-safe
```

#### **RTL Support obligatoire**
```typescript
// Direction automatique selon langue
const useDirection = () => {
  const { i18n } = useTranslation();
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const isRTL = rtlLanguages.includes(i18n.language);
  
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  return { isRTL };
};

// Classes conditionnelles RTL
const useRTLClass = () => {
  const { isRTL } = useDirection();
  
  return (ltrClass: string, rtlClass: string) => 
    isRTL ? rtlClass : ltrClass;
};
```

---

## 🚀 CI/CD & DÉPLOIEMENT

### **🔄 PIPELINE OBLIGATOIRE**

#### **GitHub Actions standardisé**
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test:unit
      - run: pnpm test:e2e
      - run: pnpm build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm audit --audit-level moderate
      - run: pnpm dlx @snyk/cli test

  deploy:
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: vercel/action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### **📊 MONITORING OBLIGATOIRE**

#### **Setup monitoring complet**
```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';
import { PostHog } from 'posthog-js';

// Error tracking
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Filter sensitive data
    if (event.request?.headers) {
      delete event.request.headers.authorization;
    }
    return event;
  },
});

// Analytics
const analytics = new PostHog(
  process.env.NEXT_PUBLIC_POSTHOG_KEY!, 
  { 
    api_host: 'https://app.posthog.com',
    capture_pageview: false // manual page views
  }
);

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    analytics.capture('performance_metric', {
      name: entry.name,
      duration: entry.duration,
      type: entry.entryType,
    });
  });
});

performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
```

Ces standards techniques garantissent que **Alimni deviendra la référence mondiale** en matière de LMS universel, avec une architecture robuste capable de supporter la croissance internationale d'Alimni. 