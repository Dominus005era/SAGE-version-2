export type Category = 'space' | 'science' | 'nature' | 'brain';

export interface UserProfile {
  userId: string;
  username: string;
  avatarUrl: string | null;
  sageLevel: string;
  xp: number;
  streak: number;
  lastLoginDate: string;
  masteryScore: number;
  categoryProgress: Record<Category, number>;
  settings: {
    theme: 'light' | 'dark';
    appLanguage: string;
    responseLanguage: string;
  };
}

export interface KnowledgeItem {
  id: string;
  type: 'fact' | 'quiz';
  category: Category;
  title: string;
  content: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation: string;
  createdAt: string;
}

export interface UserKnowledgeMapping {
  itemId: string;
  userId: string;
  isSaved: boolean;
  isMistake: boolean;
  lastExplanationSeen?: string;
}
