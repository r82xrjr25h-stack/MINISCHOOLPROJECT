export enum AppView {
  DASHBOARD = 'DASHBOARD',
  EXPLAINER = 'EXPLAINER',
  QUIZ = 'QUIZ',
  VISION = 'VISION',
  RESEARCH = 'RESEARCH',
  PLANNER = 'PLANNER'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export interface StudyTask {
  time: string;
  activity: string;
}

export interface StudyDay {
  day: string;
  focus: string;
  tasks: StudyTask[];
}

export interface StudyPlan {
  title: string;
  schedule: StudyDay[];
  tips: string[];
}

export interface ResearchSource {
  title: string;
  uri: string;
}

export interface ResearchResult {
  content: string;
  sources: ResearchSource[];
}
