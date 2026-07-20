export type RecommendationCategory = 
  | 'FEATURED' 
  | 'TRENDING' 
  | 'RECOMMENDED' 
  | 'EDITORS_CHOICE' 
  | 'LUXURY_COLLECTION' 
  | 'INVESTMENT_OPPORTUNITY' 
  | 'NEW_LAUNCH' 
  | 'READY_TO_MOVE' 
  | 'HOT_DEAL' 
  | 'PREMIUM_LISTING' 
  | 'VERIFIED_PICK' 
  | 'STAFF_PICK';

export interface PropertyRecommendationEntity {
  id: string;
  property_id: string;
  category: RecommendationCategory;
  collection_name: string | null;
  recommendation_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
