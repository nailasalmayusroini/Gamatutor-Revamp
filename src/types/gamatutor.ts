export type ActionType = 'click' | 'type' | 'verify' | 'select' | 'alert' | 'drag';

export type CalloutType = 'instruction' | 'tip' | 'warning' | 'success';

export type BackdropType = 
  | 'rme_hospital' 
  | 'rme_triage' 
  | 'pharmacy_system' 
  | 'laboratory_lims' 
  | 'flowchart_logic' 
  | 'medical_diagram';

export interface CalloutConfig {
  title: string;
  text: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  type: CalloutType;
}

export interface HotspotConfig {
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  label: string;
  interactiveHint: string;
}

export interface CursorAnimation {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface TutorialStep {
  id: string;
  stepNumber: number;
  title: string;
  duration: number; // in seconds
  narration: string;
  backdrop: BackdropType;
  actionType: ActionType;
  targetElement: string;
  callout: CalloutConfig;
  hotspot: HotspotConfig;
  cursorAnimation: CursorAnimation;
  interactivePrompt?: string;
  completed?: boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Pemula' | 'Menengah' | 'Mahir';
  scenes: TutorialStep[];
  author: {
    name: string;
    role: string;
    avatar: string;
    badge: string;
  };
  views: number;
  likes: number;
  peerFeedbackCount: number;
  createdAt: string;
  tags: string[];
  teachBackScores?: {
    before: number;
    after: number;
    delta: number;
  };
}

export interface KnowledgeGap {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendedReview: string;
}

export interface GapDetectionResult {
  completenessScore: number;
  clarityScore: number;
  overallSummary: string;
  strengths: string[];
  detectedGaps: KnowledgeGap[];
  guidingQuestions: string[];
}

export interface TeachBackAssessment {
  beforeScore: number;
  afterScore: number;
  improvementDelta: number;
  masteryBadge: string;
  pedagogicalVerdict: string;
  resolvedGaps: string[];
  remainingNuances: string[];
  earnedXP: number;
  learningQuote: string;
}

export interface PeerFeedback {
  id: string;
  tutorialId: string;
  tutorialTitle: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  clarityRating: number; // 1 to 5
  easyToUnderstandPart: string;
  confusingOrMissingPart: string;
  suggestion: string;
  timestamp: string;
  helpfulVotes: number;
  creatorReplied?: boolean;
  creatorReplyText?: string;
}

export interface LearningChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  type: 'daily' | 'weekly' | 'milestone';
  progress: number;
  target: number;
  completed: boolean;
  badgeUnlock?: string;
  iconName: string;
}

export interface TemplateStarterKit {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  iconName: string;
  description: string;
  defaultExplanation: string;
  sampleScenes: TutorialStep[];
  learningObjectives: string[];
}

export interface UserProfile {
  name: string;
  role: string;
  institution: string;
  avatar: string;
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  tutorialsCreated: number;
  feedbacksGiven: number;
  completedChallenges: number;
  badges: {
    id: string;
    title: string;
    icon: string;
    description: string;
    dateUnlocked: string;
  }[];
}
