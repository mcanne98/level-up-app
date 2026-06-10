/**
 * Demo data for MVP — no database required.
 * Replace with real Supabase queries once configured.
 */

import type { ChildProfile, LearningChain, Lesson, Mission } from '@/types'

export const DEMO_CHILD: ChildProfile = {
  id: 'demo-child-1',
  parent_id: 'demo-parent-1',
  first_name: 'Alex',
  display_name: 'AlexStar',
  age: 11,
  grade: 6,
  province: 'Ontario',
  country: 'Canada',
  avatar_url: '🧑‍🚀',
  daily_time_limit_minutes: 60,
  current_xp: 350,
  current_level: 3,
  created_at: new Date().toISOString(),
}

const KARATE_CURIOSITY: Lesson = {
  id: 'lesson-curiosity-1',
  title: 'The Physics Behind a Karate Kick',
  mode: 'curiosity',
  category: 'Sports Science',
  subject: 'Science',
  grade_min: 4,
  grade_max: 8,
  difficulty: 2,
  hook: "Did you know a karate kick can break boards because of SCIENCE? Let's find out how!",
  script: 'When a karate master kicks, they apply focused force to a tiny area.\nThe faster the kick, the more kinetic energy is released.\nForce = Mass × Acceleration — that is Newton\'s Second Law.\nConcentrated force on a single point creates massive pressure!',
  summary: 'Discover how Newton\'s Laws of Motion explain the science of martial arts.',
  estimated_duration_seconds: 45,
  interest_tags: ['karate', 'sports'],
  thumbnail_emoji: '🥋',
  status: 'published',
  safety_status: 'approved',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  fallback_animation_json: {
    scenes: [
      { id: 's1', type: 'title', text: 'Why does a karate kick break boards?', emoji: '🥋', bg_color: '#e74c3c', text_color: '#ffffff', duration_ms: 3000, transition: 'fade' },
      { id: 's2', type: 'fact', text: 'Force = Mass × Acceleration (Newton\'s 2nd Law!)', emoji: '💪', bg_color: '#c0392b', text_color: '#ffffff', duration_ms: 4000, transition: 'slide' },
      { id: 's3', type: 'fact', text: 'Focused force on a small area = MASSIVE pressure!', bg_color: '#922b21', text_color: '#ffffff', duration_ms: 4000, transition: 'slide' },
      { id: 's4', type: 'fact', text: 'That\'s why martial artists can break boards and bricks 🧱', bg_color: '#7b241c', text_color: '#ffffff', duration_ms: 4000, transition: 'slide' },
      { id: 's5', type: 'celebration', text: 'You just learned Newton\'s 2nd Law! 🔥', emoji: '⭐', bg_color: '#f39c12', text_color: '#ffffff', duration_ms: 2500, transition: 'zoom' },
    ],
  },
  quizzes: [
    {
      id: 'quiz-1',
      lesson_id: 'lesson-curiosity-1',
      question: 'According to Newton\'s 2nd Law, what happens when you increase acceleration with the same mass?',
      explanation: 'Force = Mass × Acceleration. If mass stays the same but acceleration increases, force increases proportionally!',
      options: [
        { id: 'q1o1', quiz_id: 'quiz-1', option_text: 'Force increases', is_correct: true },
        { id: 'q1o2', quiz_id: 'quiz-1', option_text: 'Force decreases', is_correct: false },
        { id: 'q1o3', quiz_id: 'quiz-1', option_text: 'Force stays the same', is_correct: false },
        { id: 'q1o4', quiz_id: 'quiz-1', option_text: 'Mass increases', is_correct: false },
      ],
    },
  ],
}

const FORCES_SCHOOL: Lesson = {
  id: 'lesson-school-1',
  title: "Forces & Motion — Newton's Laws",
  mode: 'school',
  category: 'Physics',
  subject: 'Science',
  grade_min: 5,
  grade_max: 7,
  difficulty: 3,
  hook: 'Want to know WHY your karate kick creates power? It\'s all in F = ma!',
  script: 'A force is a push or pull that changes how an object moves.\nNewton\'s First Law: an object in motion stays in motion unless a force acts on it.\nNewton\'s Second Law: Force = Mass × Acceleration (F=ma).\nNewton\'s Third Law: every action has an equal and opposite reaction.\nExample: 2kg × 5 m/s² = 10 Newtons of force!',
  summary: 'Master all three of Newton\'s Laws and understand the science of movement.',
  estimated_duration_seconds: 120,
  interest_tags: ['karate', 'sports', 'science'],
  thumbnail_emoji: '⚡',
  status: 'published',
  safety_status: 'approved',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  fallback_animation_json: {
    scenes: [
      { id: 's1', type: 'title', text: "Newton's Three Laws of Motion", emoji: '⚡', bg_color: '#2c3e50', text_color: '#ffffff', duration_ms: 3000, transition: 'fade' },
      { id: 's2', type: 'fact', text: 'Law 1: Objects keep moving unless a force stops them', bg_color: '#1a252f', text_color: '#ecf0f1', duration_ms: 4000, transition: 'slide' },
      { id: 's3', type: 'fact', text: 'Law 2: F = ma (Force = Mass × Acceleration) ⚡', bg_color: '#2c3e50', text_color: '#f39c12', duration_ms: 5000, transition: 'slide' },
      { id: 's4', type: 'fact', text: 'Law 3: Every action has an equal and opposite reaction', bg_color: '#1a252f', text_color: '#ecf0f1', duration_ms: 4000, transition: 'slide' },
      { id: 's5', type: 'question', text: 'A 2kg object accelerates at 5 m/s². What is the force?', bg_color: '#16213e', text_color: '#ffffff', duration_ms: 5000, transition: 'fade' },
      { id: 's6', type: 'answer', text: 'F = 2 × 5 = 10 Newtons ✅', emoji: '🎯', bg_color: '#27ae60', text_color: '#ffffff', duration_ms: 3000, transition: 'zoom' },
      { id: 's7', type: 'celebration', text: "Newton's Laws mastered! 🚀", emoji: '⭐', bg_color: '#f39c12', text_color: '#ffffff', duration_ms: 2500, transition: 'zoom' },
    ],
  },
  quizzes: [
    {
      id: 'quiz-2',
      lesson_id: 'lesson-school-1',
      question: 'A 5kg ball accelerates at 3 m/s². What force is acting on it?',
      explanation: 'Use F = ma: 5kg × 3 m/s² = 15 Newtons. Remember: multiply mass by acceleration!',
      options: [
        { id: 'q2o1', quiz_id: 'quiz-2', option_text: '15 Newtons', is_correct: true },
        { id: 'q2o2', quiz_id: 'quiz-2', option_text: '8 Newtons', is_correct: false },
        { id: 'q2o3', quiz_id: 'quiz-2', option_text: '2 Newtons', is_correct: false },
        { id: 'q2o4', quiz_id: 'quiz-2', option_text: '53 Newtons', is_correct: false },
      ],
    },
  ],
}

const FORCE_MISSION: Mission = {
  id: 'mission-1',
  title: 'Force in the Wild',
  description: 'Find 3 examples of force in your home or outside. For each one, write down: What is the force? What is it pushing or pulling? Which Newton\'s Law does it show?',
  category: 'Science',
  proof_type: 'self_report',
  xp_reward: 150,
  emoji: '💪',
  created_at: new Date().toISOString(),
}

// --- Chain 2: Rockets ---

const ROCKETS_CURIOSITY: Lesson = {
  id: 'lesson-curiosity-2',
  title: 'Why Do Rockets Have Multiple Stages?',
  mode: 'curiosity',
  category: 'Space Science',
  subject: 'Science',
  grade_min: 4,
  grade_max: 9,
  difficulty: 2,
  hook: "Rockets drop pieces of themselves on the way to space — and it's pure GENIUS!",
  script: 'Getting to space means escaping Earth\'s gravity — that takes enormous fuel.\nCarrying empty fuel tanks slows you down, like wearing a heavy backpack on a race.\nBy dropping empty stages, the rocket gets lighter and faster as it climbs higher.\nThis staged approach is the only way we can reach orbit with current technology!',
  summary: 'Learn how staged rockets use physics to escape Earth\'s gravity efficiently.',
  estimated_duration_seconds: 50,
  interest_tags: ['space', 'technology'],
  thumbnail_emoji: '🚀',
  status: 'published',
  safety_status: 'approved',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  fallback_animation_json: {
    scenes: [
      { id: 's1', type: 'title', text: 'Why rockets drop pieces of themselves 🚀', emoji: '🚀', bg_color: '#1a1a2e', text_color: '#ffffff', duration_ms: 3000, transition: 'fade' },
      { id: 's2', type: 'fact', text: 'Getting to space needs MASSIVE fuel... but empty tanks = dead weight!', bg_color: '#16213e', text_color: '#a8d8ea', duration_ms: 4000, transition: 'slide' },
      { id: 's3', type: 'fact', text: 'Drop the stage → lighter rocket → go faster → reach orbit! 🛸', bg_color: '#0f3460', text_color: '#ffffff', duration_ms: 4000, transition: 'slide' },
      { id: 's4', type: 'celebration', text: "You understand rocket staging — like an aerospace engineer! 🌟", emoji: '⭐', bg_color: '#f39c12', text_color: '#ffffff', duration_ms: 2500, transition: 'zoom' },
    ],
  },
  quizzes: [
    {
      id: 'quiz-3',
      lesson_id: 'lesson-curiosity-2',
      question: 'Why do rockets drop empty fuel stages during launch?',
      explanation: 'Empty stages are dead weight. Dropping them makes the rocket lighter so it can accelerate faster using less fuel for the remaining journey.',
      options: [
        { id: 'q3o1', quiz_id: 'quiz-3', option_text: 'To reduce weight and go faster', is_correct: true },
        { id: 'q3o2', quiz_id: 'quiz-3', option_text: 'Because they explode automatically', is_correct: false },
        { id: 'q3o3', quiz_id: 'quiz-3', option_text: 'To make the rocket look cool', is_correct: false },
        { id: 'q3o4', quiz_id: 'quiz-3', option_text: 'To slow down near the Moon', is_correct: false },
      ],
    },
  ],
}

const FLIGHT_SCHOOL: Lesson = {
  id: 'lesson-school-2',
  title: 'The Four Forces of Flight',
  mode: 'school',
  category: 'Forces and Flight',
  subject: 'Science',
  grade_min: 4,
  grade_max: 6,
  difficulty: 2,
  hook: 'Four invisible forces keep every plane and rocket airborne — learn them all!',
  script: 'Four forces act on every aircraft: lift, drag, thrust, and gravity.\nLift is created when air moves faster over the curved top of a wing.\nGravity pulls down — lift must exceed gravity to stay airborne.\nThrust from engines pushes forward; drag from air resistance pushes back.\nBalance these four forces and you can design anything that flies!',
  summary: 'Master the four forces of flight and understand how planes stay in the air.',
  estimated_duration_seconds: 100,
  interest_tags: ['space', 'technology', 'science'],
  thumbnail_emoji: '✈️',
  status: 'published',
  safety_status: 'approved',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  fallback_animation_json: {
    scenes: [
      { id: 's1', type: 'title', text: 'The 4 Forces of Flight ✈️', emoji: '✈️', bg_color: '#2980b9', text_color: '#ffffff', duration_ms: 3000, transition: 'fade' },
      { id: 's2', type: 'fact', text: 'LIFT ↑ pushes up • GRAVITY ↓ pulls down', bg_color: '#2471a3', text_color: '#ffffff', duration_ms: 4000, transition: 'slide' },
      { id: 's3', type: 'fact', text: 'THRUST → pushes forward • DRAG ← slows you down', bg_color: '#1a5276', text_color: '#ffffff', duration_ms: 4000, transition: 'slide' },
      { id: 's4', type: 'question', text: 'What must LIFT be greater than for a plane to fly?', bg_color: '#154360', text_color: '#ffffff', duration_ms: 5000, transition: 'fade' },
      { id: 's5', type: 'answer', text: 'GRAVITY! Lift > Gravity = Flight! ✅', emoji: '🛫', bg_color: '#27ae60', text_color: '#ffffff', duration_ms: 3000, transition: 'zoom' },
      { id: 's6', type: 'celebration', text: 'Flight engineer unlocked! 🚀', emoji: '⭐', bg_color: '#f39c12', text_color: '#ffffff', duration_ms: 2500, transition: 'zoom' },
    ],
  },
  quizzes: [
    {
      id: 'quiz-4',
      lesson_id: 'lesson-school-2',
      question: 'Which two forces must be balanced for an airplane to fly at a constant altitude?',
      explanation: 'At constant altitude, lift equals gravity. If lift > gravity, the plane rises. If gravity > lift, it descends.',
      options: [
        { id: 'q4o1', quiz_id: 'quiz-4', option_text: 'Lift and Gravity', is_correct: true },
        { id: 'q4o2', quiz_id: 'quiz-4', option_text: 'Thrust and Drag', is_correct: false },
        { id: 'q4o3', quiz_id: 'quiz-4', option_text: 'Lift and Thrust', is_correct: false },
        { id: 'q4o4', quiz_id: 'quiz-4', option_text: 'Drag and Gravity', is_correct: false },
      ],
    },
  ],
}

const ROCKET_MISSION: Mission = {
  id: 'mission-2',
  title: 'Paper Airplane Engineer',
  description: 'Build a paper airplane and test it 5 times. Change the wing shape between tests. Which design flew farthest? Write down your hypothesis and results. Show a family member!',
  category: 'Science',
  proof_type: 'parent_confirmed',
  xp_reward: 200,
  emoji: '✈️',
  created_at: new Date().toISOString(),
}

// --- Chain 3: Math ---

const MINECRAFT_CURIOSITY: Lesson = {
  id: 'lesson-curiosity-3',
  title: 'Minecraft Secretly Teaches You Math',
  mode: 'curiosity',
  category: 'Gaming & Math',
  subject: 'Math',
  grade_min: 3,
  grade_max: 7,
  difficulty: 1,
  hook: "Every time you build in Minecraft, you're doing REAL math — and you didn't even know it!",
  script: 'Building a house in Minecraft means calculating area and volume every single time.\nA 10×10 floor uses 100 blocks — that\'s area: length times width.\nFilling it 5 blocks high? That\'s volume: length × width × height = 500 blocks!\nMinecraft players are doing geometry, multiplication, and spatial reasoning constantly.',
  summary: "Discover how the world's most popular game secretly teaches real mathematics.",
  estimated_duration_seconds: 40,
  interest_tags: ['minecraft', 'gaming'],
  thumbnail_emoji: '⛏️',
  status: 'published',
  safety_status: 'approved',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  fallback_animation_json: {
    scenes: [
      { id: 's1', type: 'title', text: 'Minecraft is a secret math classroom! ⛏️', emoji: '⛏️', bg_color: '#27ae60', text_color: '#ffffff', duration_ms: 3000, transition: 'fade' },
      { id: 's2', type: 'fact', text: 'Area = Length × Width (your floor plan!) 📐', bg_color: '#229954', text_color: '#ffffff', duration_ms: 4000, transition: 'slide' },
      { id: 's3', type: 'fact', text: 'Volume = L × W × H (fill that building!) 📦', bg_color: '#1e8449', text_color: '#ffffff', duration_ms: 4000, transition: 'slide' },
      { id: 's4', type: 'celebration', text: 'Math master builder! 🏗️', emoji: '⭐', bg_color: '#f39c12', text_color: '#ffffff', duration_ms: 2500, transition: 'zoom' },
    ],
  },
  quizzes: [
    {
      id: 'quiz-5',
      lesson_id: 'lesson-curiosity-3',
      question: "In Minecraft, you build a room that's 8 blocks long, 6 blocks wide, and 4 blocks tall. What's the volume?",
      explanation: 'Volume = Length × Width × Height = 8 × 6 × 4 = 192 blocks. You need 192 blocks to fill the entire room!',
      options: [
        { id: 'q5o1', quiz_id: 'quiz-5', option_text: '192 blocks', is_correct: true },
        { id: 'q5o2', quiz_id: 'quiz-5', option_text: '48 blocks', is_correct: false },
        { id: 'q5o3', quiz_id: 'quiz-5', option_text: '18 blocks', is_correct: false },
        { id: 'q5o4', quiz_id: 'quiz-5', option_text: '96 blocks', is_correct: false },
      ],
    },
  ],
}

const FRACTIONS_SCHOOL: Lesson = {
  id: 'lesson-school-3',
  title: 'Equivalent Fractions — Soccer Edition',
  mode: 'school',
  category: 'Number Sense',
  subject: 'Math',
  grade_min: 4,
  grade_max: 6,
  difficulty: 2,
  hook: 'A soccer team plays half the match — but is 1/2 the same as 2/4? The answer changes everything!',
  script: 'Equivalent fractions represent the same amount with different numbers.\n1/2 and 2/4 are equivalent — multiply top and bottom by the same number.\nA 90-minute soccer match: playing 45 minutes is 45/90 = 1/2 of the game.\nTo create equivalent fractions: multiply BOTH numerator and denominator by the same value.\nAlways simplify fractions by dividing both parts by their greatest common factor.',
  summary: 'Learn equivalent fractions using soccer as a real-world context.',
  estimated_duration_seconds: 90,
  interest_tags: ['soccer', 'sports'],
  thumbnail_emoji: '⚽',
  status: 'published',
  safety_status: 'approved',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  fallback_animation_json: {
    scenes: [
      { id: 's1', type: 'title', text: 'Equivalent Fractions with Soccer ⚽', emoji: '⚽', bg_color: '#2ecc71', text_color: '#ffffff', duration_ms: 3000, transition: 'fade' },
      { id: 's2', type: 'fact', text: '1/2 = 2/4 = 3/6 = 4/8 — all the SAME!', bg_color: '#27ae60', text_color: '#ffffff', duration_ms: 4000, transition: 'slide' },
      { id: 's3', type: 'fact', text: 'Rule: multiply TOP and BOTTOM by the same number ×', bg_color: '#1e8449', text_color: '#ffffff', duration_ms: 4000, transition: 'slide' },
      { id: 's4', type: 'question', text: 'Is 3/4 equivalent to 6/8?', bg_color: '#196f3d', text_color: '#ffffff', duration_ms: 4000, transition: 'fade' },
      { id: 's5', type: 'answer', text: 'YES! 3×2=6 and 4×2=8 — multiply by 2! ✅', emoji: '⚽', bg_color: '#27ae60', text_color: '#ffffff', duration_ms: 3000, transition: 'zoom' },
      { id: 's6', type: 'celebration', text: 'Fraction champion! 🏆', emoji: '⭐', bg_color: '#f39c12', text_color: '#ffffff', duration_ms: 2500, transition: 'zoom' },
    ],
  },
  quizzes: [
    {
      id: 'quiz-6',
      lesson_id: 'lesson-school-3',
      question: 'Which fraction is equivalent to 2/3?',
      explanation: 'Multiply both numerator and denominator by 2: 2×2=4 and 3×2=6. So 4/6 = 2/3. They represent the same amount!',
      options: [
        { id: 'q6o1', quiz_id: 'quiz-6', option_text: '4/6', is_correct: true },
        { id: 'q6o2', quiz_id: 'quiz-6', option_text: '3/4', is_correct: false },
        { id: 'q6o3', quiz_id: 'quiz-6', option_text: '2/4', is_correct: false },
        { id: 'q6o4', quiz_id: 'quiz-6', option_text: '5/6', is_correct: false },
      ],
    },
  ],
}

const MINECRAFT_MISSION: Mission = {
  id: 'mission-3',
  title: 'Minecraft Math Build',
  description: "Build any structure in Minecraft (or on paper). Calculate its area AND volume. Show your math: what are the length, width, and height? How many blocks would it take to fill completely?",
  category: 'Math',
  proof_type: 'self_report',
  xp_reward: 150,
  emoji: '⛏️',
  created_at: new Date().toISOString(),
}

export const DEMO_CHAINS: (LearningChain & {
  curiosity_lesson: Lesson
  school_lesson: Lesson
  mission: Mission
})[] = [
  {
    id: 'chain-1',
    title: 'The Science of Power',
    curiosity_lesson_id: KARATE_CURIOSITY.id,
    school_lesson_id: FORCES_SCHOOL.id,
    mission_id: FORCE_MISSION.id,
    reward_value: 300,
    interest_tags: ['karate', 'sports', 'science'],
    grade_min: 5,
    grade_max: 7,
    created_at: new Date().toISOString(),
    curiosity_lesson: KARATE_CURIOSITY,
    school_lesson: FORCES_SCHOOL,
    mission: FORCE_MISSION,
  },
  {
    id: 'chain-2',
    title: 'Space: Forces and Flight',
    curiosity_lesson_id: ROCKETS_CURIOSITY.id,
    school_lesson_id: FLIGHT_SCHOOL.id,
    mission_id: ROCKET_MISSION.id,
    reward_value: 350,
    interest_tags: ['space', 'technology'],
    grade_min: 4,
    grade_max: 6,
    created_at: new Date().toISOString(),
    curiosity_lesson: ROCKETS_CURIOSITY,
    school_lesson: FLIGHT_SCHOOL,
    mission: ROCKET_MISSION,
  },
  {
    id: 'chain-3',
    title: 'Math in the Game',
    curiosity_lesson_id: MINECRAFT_CURIOSITY.id,
    school_lesson_id: FRACTIONS_SCHOOL.id,
    mission_id: MINECRAFT_MISSION.id,
    reward_value: 250,
    interest_tags: ['minecraft', 'gaming'],
    grade_min: 3,
    grade_max: 7,
    created_at: new Date().toISOString(),
    curiosity_lesson: MINECRAFT_CURIOSITY,
    school_lesson: FRACTIONS_SCHOOL,
    mission: MINECRAFT_MISSION,
  },
]

export const DEMO_BADGES = [
  { id: 'b1', name: 'First Step', emoji: '👣', description: 'Complete your first lesson', earned: true },
  { id: 'b2', name: 'Curious Mind', emoji: '🔭', description: 'Complete 5 Curiosity lessons', earned: false },
  { id: 'b3', name: 'Scholar', emoji: '🎓', description: 'Complete 5 School Mode lessons', earned: false },
  { id: 'b4', name: 'Mission Possible', emoji: '🎯', description: 'Complete your first Mission', earned: false },
  { id: 'b5', name: 'Chain Breaker', emoji: '⛓️', description: 'Complete a full learning chain', earned: false },
  { id: 'b6', name: 'Level 5', emoji: '⭐', description: 'Reach Level 5', earned: false },
  { id: 'b7', name: 'Space Explorer', emoji: '🚀', description: 'Complete 3 Space-themed lessons', earned: false },
  { id: 'b8', name: 'Science Star', emoji: '🔬', description: 'Master a Science concept', earned: false },
]

export const DEMO_PARENT_REWARDS = [
  { id: 'r1', title: 'Movie Night', emoji: '🎬', cost_points: 300, description: 'Choose the family movie this week!' },
  { id: 'r2', title: 'Extra Gaming Time', emoji: '🎮', cost_points: 200, description: '30 extra minutes of gaming today.' },
  { id: 'r3', title: 'Ice Cream Trip', emoji: '🍦', cost_points: 400, description: 'Family ice cream outing — your choice of flavour!' },
  { id: 'r4', title: 'Choose Dinner', emoji: '🍕', cost_points: 250, description: 'You pick what the family has for dinner.' },
  { id: 'r5', title: 'Stay Up Later', emoji: '🌙', cost_points: 350, description: 'Stay up 30 minutes past your regular bedtime.' },
]
