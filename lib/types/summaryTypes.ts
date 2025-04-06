export interface StatsData {
  op?: string;
  subreddit?: string;
  created?: string;
  upvotes?: string;
  comments?: number;
}

export interface TopCommentData {
  text?: string;
  user?: string;
  votes?: number;
}

export interface LinkData {
  text: string;
  url: string;
}

export interface SummaryData {
  quickGlance?: string;
  stats?: StatsData;
  keyPoints?: string[];
  topComment?: TopCommentData;
  sentiment?: string;
  links?: LinkData[];
}

// Define the keys of SummaryData as a type for type safety
export type SummaryDataKey = keyof SummaryData;