# 🗄️ ARCHITECTURE BASE DE DONNÉES UNIVERSELLE

## 🎯 OBJECTIFS DE CONCEPTION

### **Principes directeurs**
- **🏢 Multi-tenant** : Support de milliers d'organisations indépendantes
- **🔧 Modulaire** : Tables activables selon les modules utilisés
- **🌍 International** : Support multilingue natif et localisation
- **⚡ Performance** : Optimisé pour des millions d'utilisateurs
- **🔒 Sécurité** : RLS (Row Level Security) et chiffrement
- **🔄 Évolutif** : Schema flexible pour nouveaux modules

---

## 📊 SCHEMA COMPLET

### **🏢 ORGANISATIONS & MULTI-TENANCY**

```sql
-- Table principale organisations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- Pour sous-domaines
  domain TEXT, -- Domaine custom optional
  plan TEXT NOT NULL DEFAULT 'free', -- free, premium, enterprise
  status TEXT NOT NULL DEFAULT 'active', -- active, suspended, trial
  
  -- Configuration
  settings JSONB DEFAULT '{}', -- Paramètres généraux
  theme JSONB DEFAULT '{}', -- Couleurs, logo, branding
  modules_enabled TEXT[] DEFAULT ARRAY['core'], -- Modules activés
  features JSONB DEFAULT '{}', -- Features par plan
  
  -- Limites par plan
  max_users INTEGER DEFAULT 10,
  max_courses INTEGER DEFAULT 5,
  max_storage_mb INTEGER DEFAULT 100,
  
  -- Localisation
  default_language TEXT DEFAULT 'fr',
  timezone TEXT DEFAULT 'Europe/Paris',
  country TEXT,
  currency TEXT DEFAULT 'EUR',
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Index pour performance
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_status ON organizations(status) WHERE status = 'active';

-- Départements/Divisions within organizations
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES departments(id), -- Hiérarchie
  manager_id UUID, -- Référence vers users
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, name, parent_id)
);
```

### **👥 UTILISATEURS & AUTHENTIFICATION**

```sql
-- Utilisateurs universels (compatible Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY, -- Même ID que auth.users
  email TEXT UNIQUE NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id),
  
  -- Rôle global dans l'org
  role TEXT NOT NULL DEFAULT 'student', -- student, teacher, admin, super_admin
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active', -- active, suspended, invited, archived
  email_verified BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  
  -- Préférences
  preferences JSONB DEFAULT '{}', -- Langue, notifications, etc.
  
  -- Permissions granulaires
  permissions TEXT[] DEFAULT ARRAY['basic'],
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_role CHECK (role IN ('student', 'teacher', 'admin', 'super_admin'))
);

-- Profils détaillés
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Infos personnelles
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT, -- Nom affiché publiquement
  avatar_url TEXT,
  bio TEXT,
  
  -- Contact
  phone TEXT,
  address JSONB, -- Adresse complète structurée
  
  -- Profil académique/professionnel
  title TEXT, -- Poste, grade
  specializations TEXT[], -- Spécialités
  qualifications JSONB, -- Diplômes, certifications
  
  -- Données demo/intérêts
  date_of_birth DATE,
  gender TEXT,
  interests TEXT[],
  
  -- Social
  social_links JSONB, -- LinkedIn, Twitter, etc.
  emergency_contact JSONB,
  
  -- Préférences apprentissage
  learning_preferences JSONB, -- Style d'apprentissage, pace, etc.
  accessibility_needs JSONB, -- Besoins spéciaux
  
  -- Champs custom par organisation
  custom_fields JSONB DEFAULT '{}',
  
  -- Privacy
  public_profile BOOLEAN DEFAULT FALSE,
  show_email BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions pour tracking avancé
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  device_info JSONB,
  location JSONB, -- Pays, ville (si autorisé)
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);
```

### **📚 CONTENU & APPRENTISSAGE**

```sql
-- Catégories universelles et hiérarchiques
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Hiérarchie
  parent_id UUID REFERENCES categories(id),
  path TEXT, -- Calculated field: "math/algebra/linear"
  level INTEGER DEFAULT 0, -- Profondeur dans la hiérarchie
  
  -- Content
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Icon name ou URL
  color TEXT, -- Couleur hex
  
  -- Metadata
  tags TEXT[],
  settings JSONB DEFAULT '{}', -- Config spécifique à la catégorie
  
  -- Multi-langue
  translations JSONB DEFAULT '{}', -- {"fr": {"name": "..."}, "en": {...}}
  
  -- Ordre d'affichage
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id, name, parent_id)
);

-- Cours universels
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  department_id UUID REFERENCES departments(id),
  
  -- Metadata de base
  title TEXT NOT NULL,
  slug TEXT, -- URL-friendly, unique par org
  description TEXT,
  short_description TEXT,
  
  -- Instructor(s)
  instructor_id UUID NOT NULL REFERENCES users(id),
  co_instructors UUID[], -- Autres instructeurs
  
  -- Classification
  level TEXT NOT NULL DEFAULT 'beginner', -- beginner, intermediate, advanced
  difficulty_score INTEGER DEFAULT 1, -- 1-10
  prerequisites TEXT[], -- IDs d'autres cours ou compétences
  
  -- Content structure
  estimated_duration INTEGER, -- En minutes
  lesson_count INTEGER DEFAULT 0,
  
  -- Access & Enrollment
  enrollment_type TEXT DEFAULT 'open', -- open, invitation, paid, private
  max_students INTEGER,
  enrollment_start DATE,
  enrollment_end DATE,
  course_start DATE,
  course_end DATE,
  
  -- Pricing (si applicable)
  price DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'EUR',
  payment_type TEXT DEFAULT 'free', -- free, one_time, subscription
  
  -- Status & Quality
  status TEXT DEFAULT 'draft', -- draft, published, archived, suspended
  is_featured BOOLEAN DEFAULT FALSE,
  quality_score DECIMAL(3,2), -- Score qualité calculé
  
  -- Media
  thumbnail_url TEXT,
  trailer_url TEXT, -- Vidéo de présentation
  
  -- Settings
  settings JSONB DEFAULT '{}', -- Config avancée
  
  -- Modules activés pour ce cours
  modules_enabled TEXT[],
  
  -- Multi-langue
  language TEXT DEFAULT 'fr',
  translations JSONB DEFAULT '{}',
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  enrollment_count INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2),
  average_rating DECIMAL(3,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  UNIQUE(organization_id, slug)
);

-- Leçons/Modules
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Structure
  parent_id UUID REFERENCES lessons(id), -- Pour sous-leçons
  chapter_id UUID, -- Groupement en chapitres
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- Contenu principal (HTML/Markdown)
  content_type TEXT DEFAULT 'text', -- text, video, audio, quiz, assignment
  
  -- Media
  video_url TEXT,
  audio_url TEXT,
  slides_url TEXT,
  duration INTEGER, -- En secondes
  
  -- Progression
  is_required BOOLEAN DEFAULT TRUE,
  estimated_time INTEGER, -- Minutes estimées
  
  -- Access control
  is_free BOOLEAN DEFAULT FALSE, -- Accessible sans inscription
  unlock_conditions JSONB, -- Conditions pour débloquer
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  -- Multi-langue
  translations JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ressources attachées
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE, -- Ressources générales
  
  -- Type et contenu
  type TEXT NOT NULL, -- file, link, embedded, scorm
  name TEXT NOT NULL,
  description TEXT,
  
  -- File info
  file_url TEXT,
  file_size INTEGER, -- En bytes
  file_type TEXT, -- PDF, DOCX, etc.
  mime_type TEXT,
  
  -- Link info
  external_url TEXT,
  
  -- Metadata
  tags TEXT[],
  is_downloadable BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  
  -- Access
  access_level TEXT DEFAULT 'students', -- students, instructors, public
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **🎯 ÉVALUATIONS & PROGRESSION**

```sql
-- Évaluations modulaires
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  
  -- Metadata
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  
  -- Type et configuration
  type TEXT NOT NULL, -- quiz, assignment, exam, project, peer_review
  config JSONB DEFAULT '{}', -- Configuration spécifique par type
  
  -- Timing
  time_limit INTEGER, -- En minutes
  attempts_allowed INTEGER DEFAULT 1,
  available_from TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  late_submission_allowed BOOLEAN DEFAULT FALSE,
  
  -- Scoring
  total_points DECIMAL(8,2) DEFAULT 100,
  passing_score DECIMAL(5,2) DEFAULT 60,
  weight DECIMAL(5,2) DEFAULT 1, -- Poids dans la note finale
  
  -- Options
  randomize_questions BOOLEAN DEFAULT FALSE,
  show_correct_answers BOOLEAN DEFAULT TRUE,
  show_score_immediately BOOLEAN DEFAULT TRUE,
  allow_review BOOLEAN DEFAULT TRUE,
  
  -- Status
  is_published BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions d'évaluation
CREATE TABLE assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  
  -- Content
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- multiple_choice, true_false, short_answer, essay, code
  
  -- Options (pour QCM)
  options JSONB, -- [{"text": "...", "is_correct": true}, ...]
  correct_answer TEXT, -- Pour questions à réponse courte
  
  -- Scoring
  points DECIMAL(6,2) DEFAULT 1,
  explanation TEXT, -- Explication de la réponse
  
  -- Metadata
  tags TEXT[],
  difficulty TEXT DEFAULT 'medium', -- easy, medium, hard
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Soumissions d'évaluation
CREATE TABLE assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Tentative
  attempt_number INTEGER DEFAULT 1,
  
  -- Réponses
  answers JSONB NOT NULL, -- {"question_id": "answer", ...}
  
  -- Scoring
  score DECIMAL(8,2),
  max_score DECIMAL(8,2),
  percentage DECIMAL(5,2),
  passed BOOLEAN,
  
  -- Auto vs Manual grading
  auto_scored_at TIMESTAMPTZ,
  manually_graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES users(id),
  grader_feedback TEXT,
  
  -- Timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  time_spent INTEGER, -- En secondes
  
  -- Status
  status TEXT DEFAULT 'in_progress', -- in_progress, submitted, graded
  
  -- Late submission
  is_late BOOLEAN DEFAULT FALSE,
  
  UNIQUE(assessment_id, user_id, attempt_number)
);

-- Inscriptions aux cours
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Status
  status TEXT DEFAULT 'active', -- active, completed, withdrawn, suspended
  enrollment_type TEXT DEFAULT 'student', -- student, audit, ta (teaching assistant)
  
  -- Progress tracking
  progress_percentage DECIMAL(5,2) DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  
  -- Time tracking
  total_time_spent INTEGER DEFAULT 0, -- En minutes
  last_accessed TIMESTAMPTZ,
  
  -- Grading
  current_grade DECIMAL(5,2),
  final_grade DECIMAL(5,2),
  grade_letter TEXT, -- A, B, C, D, F
  
  -- Dates importantes
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  certificate_issued_at TIMESTAMPTZ,
  
  -- Settings
  notifications_enabled BOOLEAN DEFAULT TRUE,
  
  UNIQUE(user_id, course_id)
);

-- Progression détaillée par leçon
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Status
  status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Time tracking
  time_spent INTEGER DEFAULT 0, -- En secondes
  first_accessed TIMESTAMPTZ,
  last_accessed TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Video progress (si applicable)
  video_position INTEGER DEFAULT 0, -- Position en secondes
  video_watched_percentage DECIMAL(5,2) DEFAULT 0,
  
  -- Notes personnelles
  notes TEXT,
  bookmarked BOOLEAN DEFAULT FALSE,
  
  UNIQUE(user_id, lesson_id)
);
```

### **💬 COMMUNICATION & COLLABORATION**

```sql
-- Forums/Discussions
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE, -- NULL = forum général
  
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES forum_categories(id) ON DELETE CASCADE,
  
  -- Metadata
  title TEXT NOT NULL,
  slug TEXT,
  
  -- Author
  author_id UUID NOT NULL REFERENCES users(id),
  
  -- Status
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  is_answered BOOLEAN DEFAULT FALSE, -- Pour threads Q&A
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  
  -- Moderation
  is_hidden BOOLEAN DEFAULT FALSE,
  hidden_reason TEXT,
  hidden_by UUID REFERENCES users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES forum_threads(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES forum_posts(id), -- Pour réponses
  
  -- Content
  content TEXT NOT NULL,
  content_html TEXT, -- Version HTML rendue
  
  -- Author
  author_id UUID NOT NULL REFERENCES users(id),
  
  -- Moderation
  is_hidden BOOLEAN DEFAULT FALSE,
  is_best_answer BOOLEAN DEFAULT FALSE, -- Pour Q&A
  
  -- Voting (optionnel)
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages privés
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Participants
  sender_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  
  -- Thread grouping
  thread_id UUID, -- Pour grouper les messages
  
  -- Content
  subject TEXT,
  content TEXT NOT NULL,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Type
  message_type TEXT DEFAULT 'direct', -- direct, system, notification
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **🔔 NOTIFICATIONS & ACTIVITÉS**

```sql
-- Notifications système
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Type et priorité
  type TEXT NOT NULL, -- course_update, assignment_due, message, system
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  
  -- Action (optionnel)
  action_url TEXT,
  action_text TEXT,
  
  -- Context
  related_id UUID, -- ID de l'objet lié (cours, message, etc.)
  related_type TEXT, -- Type de l'objet lié
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- Delivery
  sent_via EMAIL TEXT[], -- email, push, sms
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Log d'activités pour analytics
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Action
  action TEXT NOT NULL, -- login, course_access, lesson_complete, etc.
  action_category TEXT, -- auth, learning, communication, admin
  
  -- Context
  resource_type TEXT, -- course, lesson, assessment, etc.
  resource_id UUID,
  
  -- Metadata
  metadata JSONB DEFAULT '{}', -- Données spécifiques à l'action
  
  -- Session info
  session_id UUID,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔒 SÉCURITÉ & RLS

### **Row Level Security Policies**

```sql
-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
-- ... etc pour toutes les tables

-- Policies exemples
CREATE POLICY "Users can only see their own organization's data" ON users
  FOR SELECT USING (organization_id = (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Teachers can manage their own courses" ON courses
  FOR ALL USING (
    instructor_id = auth.uid() OR 
    auth.uid() = ANY(co_instructors) OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Students can see published courses in their org" ON courses
  FOR SELECT USING (
    status = 'published' AND 
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );
```

---

## 📈 PERFORMANCE & OPTIMISATION

### **Index stratégiques**

```sql
-- Users & Auth
CREATE INDEX idx_users_org_role ON users(organization_id, role);
CREATE INDEX idx_users_email_verified ON users(email) WHERE email_verified = true;

-- Courses
CREATE INDEX idx_courses_org_status ON courses(organization_id, status);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_category ON courses(category_id);

-- Enrollments
CREATE INDEX idx_enrollments_user_status ON enrollments(user_id, status);
CREATE INDEX idx_enrollments_course_active ON enrollments(course_id) WHERE status = 'active';

-- Activities
CREATE INDEX idx_activity_logs_user_date ON activity_logs(user_id, created_at);
CREATE INDEX idx_activity_logs_org_date ON activity_logs(organization_id, created_at);

-- Full-text search
CREATE INDEX idx_courses_search ON courses USING gin(to_tsvector('french', title || ' ' || description));
```

### **Partitioning pour scale**

```sql
-- Partitionner activity_logs par date (important pour analytics)
CREATE TABLE activity_logs_y2024m01 PARTITION OF activity_logs
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partitionner notifications par organisation (pour multi-tenancy)
CREATE TABLE notifications_org_1 PARTITION OF notifications
  FOR VALUES IN ('org-uuid-1');
```

Cette architecture garantit **scalabilité**, **sécurité** et **flexibilité** pour une plateforme d'apprentissage universelle moderne. 