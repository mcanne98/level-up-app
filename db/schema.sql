-- Level Up Database Schema
-- PostgreSQL / Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== USERS ====================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parent_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE child_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES parent_profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  grade INTEGER NOT NULL,
  province TEXT DEFAULT 'Ontario',
  country TEXT DEFAULT 'Canada',
  avatar_url TEXT,
  daily_time_limit_minutes INTEGER DEFAULT 60,
  current_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INTERESTS ====================

CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE child_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  interest_id UUID REFERENCES interests(id) ON DELETE CASCADE,
  UNIQUE(child_id, interest_id)
);

-- ==================== CURRICULUM ====================

CREATE TABLE curriculum_regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country TEXT NOT NULL,
  province_or_state TEXT,
  name TEXT NOT NULL,
  source_url TEXT,
  version TEXT,
  effective_date DATE
);

CREATE TABLE curriculum_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_id UUID REFERENCES curriculum_regions(id) ON DELETE CASCADE,
  grade_number INTEGER NOT NULL,
  grade_label TEXT NOT NULL
);

CREATE TABLE curriculum_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_id UUID REFERENCES curriculum_regions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  education_level TEXT CHECK (education_level IN ('elementary', 'secondary', 'college', 'university', 'professional'))
);

CREATE TABLE curriculum_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id UUID REFERENCES curriculum_subjects(id) ON DELETE CASCADE,
  grade_id UUID REFERENCES curriculum_grades(id) ON DELETE CASCADE,
  course_code TEXT,
  course_name TEXT NOT NULL
);

CREATE TABLE curriculum_strands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES curriculum_courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE curriculum_expectations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strand_id UUID REFERENCES curriculum_strands(id) ON DELETE CASCADE,
  expectation_code TEXT,
  expectation_text TEXT NOT NULL,
  parent_expectation_id UUID REFERENCES curriculum_expectations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE curriculum_concepts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expectation_id UUID REFERENCES curriculum_expectations(id) ON DELETE CASCADE,
  concept_name TEXT NOT NULL,
  concept_description TEXT,
  prerequisite_concepts_json JSONB DEFAULT '[]'
);

-- ==================== LESSONS ====================

CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('curiosity', 'school', 'mission_intro')),
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade_min INTEGER NOT NULL DEFAULT 1,
  grade_max INTEGER NOT NULL DEFAULT 12,
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  hook TEXT NOT NULL,
  script TEXT,
  summary TEXT,
  estimated_duration_seconds INTEGER DEFAULT 60,
  video_url TEXT,
  fallback_animation_json JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  safety_status TEXT DEFAULT 'pending' CHECK (safety_status IN ('pending', 'approved', 'flagged')),
  created_by UUID REFERENCES users(id),
  interest_tags TEXT[] DEFAULT '{}',
  thumbnail_emoji TEXT DEFAULT '📚',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lesson_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  segment_type TEXT NOT NULL CHECK (segment_type IN ('hook', 'teach', 'example', 'quiz', 'reinforce', 'reward')),
  content JSONB NOT NULL,
  order_index INTEGER NOT NULL
);

CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE lesson_curriculum_map (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  curriculum_expectation_id UUID REFERENCES curriculum_expectations(id),
  curriculum_concept_id UUID REFERENCES curriculum_concepts(id),
  alignment_confidence FLOAT DEFAULT 0.8,
  reviewed_by_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== LEARNING CHAINS ====================

CREATE TABLE learning_chains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  curiosity_lesson_id UUID REFERENCES lessons(id),
  school_lesson_id UUID REFERENCES lessons(id),
  mission_id UUID,
  reward_value INTEGER DEFAULT 100,
  interest_tags TEXT[] DEFAULT '{}',
  grade_min INTEGER DEFAULT 1,
  grade_max INTEGER DEFAULT 12,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE child_learning_chain_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  learning_chain_id UUID REFERENCES learning_chains(id) ON DELETE CASCADE,
  curiosity_completed BOOLEAN DEFAULT FALSE,
  school_completed BOOLEAN DEFAULT FALSE,
  mission_completed BOOLEAN DEFAULT FALSE,
  reward_unlocked BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(child_id, learning_chain_id)
);

-- ==================== PROGRESS ====================

CREATE TABLE child_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'started', 'completed')),
  score INTEGER,
  completed_at TIMESTAMPTZ,
  UNIQUE(child_id, lesson_id)
);

CREATE TABLE child_curriculum_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  curriculum_concept_id UUID REFERENCES curriculum_concepts(id) ON DELETE CASCADE,
  mastery_level TEXT DEFAULT 'introduced' CHECK (mastery_level IN ('introduced', 'practicing', 'proficient', 'mastered')),
  score_average FLOAT,
  last_practiced_at TIMESTAMPTZ,
  UNIQUE(child_id, curriculum_concept_id)
);

-- ==================== MISSIONS ====================

CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  proof_type TEXT NOT NULL CHECK (proof_type IN ('parent_confirmed', 'photo_upload', 'self_report')),
  xp_reward INTEGER DEFAULT 100,
  emoji TEXT DEFAULT '🎯',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE child_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'submitted', 'completed', 'approved')),
  submitted_proof_url TEXT,
  parent_approved_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- ==================== XP & REWARDS ====================

CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_id UUID,
  xp_amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  emoji TEXT DEFAULT '🏆',
  criteria_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE child_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(child_id, badge_id)
);

CREATE TABLE parent_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES parent_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cost_points INTEGER NOT NULL DEFAULT 500,
  emoji TEXT DEFAULT '🎁',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE child_reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID REFERENCES child_profiles(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES parent_rewards(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'redeemed', 'rejected')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  redeemed_at TIMESTAMPTZ
);

-- ==================== VIDEO JOBS ====================

CREATE TABLE video_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id),
  provider TEXT NOT NULL DEFAULT 'fallback',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  job_id_external TEXT,
  result_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================

CREATE INDEX idx_child_profiles_parent ON child_profiles(parent_id);
CREATE INDEX idx_lessons_mode_status ON lessons(mode, status);
CREATE INDEX idx_lessons_grade ON lessons(grade_min, grade_max);
CREATE INDEX idx_child_lesson_progress_child ON child_lesson_progress(child_id);
CREATE INDEX idx_xp_events_child ON xp_events(child_id);
CREATE INDEX idx_learning_chains_grade ON learning_chains(grade_min, grade_max);

-- ==================== ROW LEVEL SECURITY ====================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Parents can see their own data
CREATE POLICY "parents_own_data" ON parent_profiles
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "parents_see_children" ON child_profiles
  FOR ALL USING (
    parent_id IN (SELECT id FROM parent_profiles WHERE user_id = auth.uid())
  );

-- Lessons are public read for published/approved
CREATE POLICY "published_lessons_readable" ON lessons
  FOR SELECT USING (status = 'published' AND safety_status = 'approved');

-- Admins bypass RLS (set via JWT custom claim)
