
export type PoetId = 'libai' | 'liqingzhao' | 'dufu' | 'shakespeare' | 'tolstoy' | 'hugo';

export enum Checkpoint {
  Intro = 0,
  Background = 1,
  Style = 2,
  Personal = 3,
  Complete = 4
}

export interface VocabularyItem {
  word: string;
  pos: string;
  meaningCN: string;
  usage: string;
  expansion: string;
  category: 'nature' | 'emotion' | 'action' | 'object';
}

export interface SentencePattern {
  structure: string;
  example: string;
  template: string;
  level: 'Elementary' | 'Junior' | 'Senior';
  usage: string;
  grammarTip: string;
}

export interface PoetProfile {
  id: PoetId;
  nameCN: string;
  nameEN: string;
  title: string;
  dynasty: string;
  region: 'East' | 'West';
  tags: string[];
  representativePoem: string;
  bio: string;
  themeColor: string; 
  secondaryColor: string;
  bgImage: string;
  avatar: string;
  systemPrompt: string;
  vocabulary: VocabularyItem[];
  sentencePatterns: SentencePattern[];
  styleDescription: string;
  fontClass: string;
  translationPrompt: string;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  explanation: string;
  errorType: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'poet' | 'system';
  poetId?: PoetId; 
  timestamp: number;
  translationClassical?: string;
  translationModern?: string;
  classicalChinese?: string;
  vernacular?: string;
  grammarCorrection?: GrammarCorrection;
}

export interface ReportData {
  poetId: PoetId;
  poetTheme: {
    main: string;
    secondary: string;
  };
  starStats: {
    total: number;
    average: number;
  };
  historicalFacts: string[];
  englishNotes: string[];
  dialogueHistory: Message[];
  brilliantSentences: Message[];
}

export interface GameState {
  currentPoet: PoetId;
  poetMessages: Record<PoetId, Message[]>;
  brilliantSentences: Message[];
  grammarNotes: GrammarCorrection[];
  voiceEnabled: boolean;
  showAnimation: string | null;
  sessionMode: 'free' | 'class';
  classTimer: number; // in seconds
  questionsCount: number;
}
