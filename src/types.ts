export type Category = 'space' | 'science' | 'nature' | 'brain' | string;

export interface UserProfile {
  userId: string;
  username: string;
  avatarUrl: string | null;
  sageLevel: string;
  xp: number;
  streak: number;
  lastLoginDate: string;
  masteryScore: number;
  categoryProgress: Record<string, number>;
  bio?: string;
  primaryFocus?: string;
  dailyGoal?: number;
  settings: {
    theme: 'light' | 'dark';
    fontSize?: 'sm' | 'base' | 'lg' | 'xlarge';
    appLanguage: string;
    responseLanguage: string;
  };
}

export interface KnowledgeItem {
  id: string;
  type: 'fact' | 'quiz' | 'myth' | 'story' | 'case_study' | 'scenario' | 'logic' | 'discussion' | string;
  category: Category;
  title: string;
  content: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
  createdAt: string;
  imageUrl?: string;
  isLearnMode?: boolean;
  mythText?: string;
  truthText?: string;
}

export interface UserKnowledgeMapping {
  itemId: string;
  userId: string;
  isSaved: boolean;
  isMistake: boolean;
  lastExplanationSeen?: string;
}
