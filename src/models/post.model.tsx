import Category from "./category.model";
import User from "./user.model";

export interface PostData {
  id?: string;
  title?: string;
  description?: string;
  hashtags?: string;
  category_id?: string;
  image?: any;
  link?: string;
  videoLink?: string;
  post_type?: PostType;
  polls?: string[];
  poll_ends?: Date;
  vote_ends?: Date;
  vote_ends_text?: string;
  initiative_business?: string;
  theme_type?: string;
  category?: any;
  is_anonymous?: boolean;
  update_polls?: any;
  delete_polls?: any;
  add_polls?: any;
  type?: string;
  content?: string;
  imageUrl?: string;
  isReviewed?: boolean;
  isVisible?: boolean;
  isReported?: boolean;
  isAnonymous?: boolean;
  userId?: number;
  closeDate?: Date;
  tenant?: string;
  sendTo?: any;
}

export enum PostType {
  Post = 'Post',
  Poll = 'Poll',
  Initiative = 'Initiative',
}

export enum PostMode {
  Default = 0,
  Report = 1,
  Hidden = 2,
}
export interface Poll {
  id: string;
  title: string;
  count_voted: 0;
  created_at: string;
  percent?: number;
}
export default interface Post {
  id?: string;
  title?: string;
  type?: string;
  content?: any;
  imageUrl?: string;
  isReviewed?: boolean;
  isVisible?: boolean;
  isReported?: boolean;
  isAnonymous?: boolean;
  closeDate?: Date;
  tenant?: string;
  sendTo?: any;
  reactionId?: number;
  theme?: string;
  options?: any;
  categories?: any;
  likeInfo?: any;
  creationDate?: any;
  likeId?: number;
  disLikeId?: number;
  hashTags?: any;
  impact?: string;
  upvoteCount?: number;
  downvoteCount?: number;
  commentCount?: number;
  categoryId?: any;
  reactions?: any;
  cous?: any;
  postPage?: boolean;
  //Old types
  description?: string;
  image?: any;
  link?: string;
  videoLink?: string;
  likes?: number;
  is_liked?: boolean;
  is_disliked?: boolean;
  is_voted?: boolean;
  dislikes?: number;
  total_comments?: number;
  votes?: number;
  hashtags?: string;
  tags?: any[];
  user?: User;
  polls?: Poll[];
  poll_ends?: Date;
  vote_ends?: Date;
  votes_for?: number;
  votes_against?: number;
  user_voted?: VOTE_INITIATIVE;
  initiative_business?: string;
  theme_type?: string;
  is_anonymous?: boolean;
  category?: Category[];
  why_hidden?: string;
  hidden_at?: string;
  created_at?: string;
  in_review?: boolean;
  approved_review?: any;
  reviewed_at?: string;
  is_removed?: boolean;
  //  post_type?: PostType;
}

export enum VOTE_INITIATIVE {
  For = "for",
  Against = "against",
}

export enum PostView {
  report = "report",
  hidden = "hidden",
  review = "review"
}
