export type ArticleType = 'research' | 'news';
export type AccessType = 'open' | 'summary-only';
export type ReviewStatus = 'ai_draft' | 'reviewed';

export interface TechniqueStep {
  step_number: number;
  title: string;
  description: string;
  caution?: string;
  image_url?: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  source: 'article' | 'general';
}

export interface WeatherGuidance {
  rule: string;
  trigger_description: string;
  applicable_conditions: {
    temp_min_f?: number;
    temp_max_f?: number;
    wind_max_mph?: number;
    rain_min_inches?: number;
    rain_window_hours?: number;
  };
}

export interface Article {
  id: string;
  type: ArticleType;
  title: string;
  authors: string;
  date: string;
  source_repository: 'OAKTrust' | 'AgriLife Extension' | 'AgriLife Today' | string;
  source_url: string;
  access: AccessType;
  crops: string[];
  topics: ('drought' | 'irrigation' | 'pests' | 'soil health' | 'planting' | 'livestock' | 'weather' | string)[];
  texas_regions: string[];
  full_text: string;
  has_technique: boolean;
  review_status: ReviewStatus;
  reviewer_name?: string;
  image_url?: string;
  takeaway: string;
  spanish_takeaway: string;
  plain_summary: {
    what_they_studied: string;
    what_found: string;
    what_it_means: string;
    things_to_watch: string;
  };
  spanish_plain_summary: {
    what_they_studied: string;
    what_found: string;
    what_it_means: string;
    things_to_watch: string;
  };
  technical_summary: string;
  weather_guidance?: WeatherGuidance;
  suggested_questions: string[];
  technique_steps?: TechniqueStep[];
  glossary_terms: GlossaryTerm[];
}

export interface TexasCounty {
  name: string;
  region: string;
  lat: number;
  lon: number;
  extensionOfficeUrl: string;
  primaryCrops: string[];
}

export interface FarmerFeedback {
  id: string;
  articleId: string;
  articleTitle: string;
  helpful: boolean | null;
  triedOnFarm: boolean;
  note?: string;
  county: string;
  crop: string;
  timestamp: string;
}

export interface MyFarmSettings {
  county: string;
  crops: string[];
  firstTimeCompleted: boolean;
}
