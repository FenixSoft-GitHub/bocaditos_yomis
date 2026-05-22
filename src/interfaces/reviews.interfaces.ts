export interface Review {
  id?: string;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
  user_name: string;
  verified_purchase: boolean;
}

export interface CanReviewResult {
  can_review: boolean;
  has_bought: boolean;
  has_review: boolean;
  reason: "ok" | "not_purchased" | "already_reviewed" | "not_authenticated";
}
