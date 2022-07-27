import Company from "./company.model";

/**
 * User model
 */
export default interface User {
  id?: string;
  username?: string;
  userId?: number;
  avatar?:  | "avatar1"
  | "avatar2"
  | "avatar3"
  | "avatar4"
  | "avatar5"
  | "avatar6"
  | "avatar7"
  | "avatar8"
  | "avatar9"
  | "avatar10"
  | "avatar11"
  | "avatar12"
  | "avatar13"
  | "avatar14"
  | "avatar15";
  avatar_key?:
    | "avatar1"
    | "avatar2"
    | "avatar3"
    | "avatar4"
    | "avatar5"
    | "avatar6"
    | "avatar7"
    | "avatar8"
    | "avatar9"
    | "avatar10"
    | "avatar11"
    | "avatar12"
    | "avatar13"
    | "avatar14"
    | "avatar15";
  categories?: any;
  user_categories?: any;
  points?: number;
  is_blocked?: boolean;
  role?: string | number;
  is_role?: UserRole;
  company?: Company;
  description?: string;
  count_posts?: number;
  count_polls?: number;
  count_initiatives?: number;
  count_unread_notification?: number;
  unread_messages?: number;
  count_voted?: number;
  count_liked_posts?: number;
  count_liked_polls?: number;
  count_liked_initiatives?: number;
  count_voted_polls?: number;
  count_voted_initiatives?: number;
  muted?: boolean;
  why_hidden?: string;
  why_muted?: string;
  muted_at?: string;
  agreed_terms_of_use?: boolean;
  agreed_community_guidelines?: boolean;
  hidden_at?: string;
  referral?: string;
  enable_notification?: boolean;
  created_at?: string;
  updated_at?: string;
  aboutMe?: string;
  avatarLink?: string;
  isBlocked?: boolean;
  isActive?: boolean;
  isReported?: boolean;
  tenantId?: number;
  idpConfig?: string;
  creationDate?: string;
  karmaPoints?: number;
  socketInfo?: any
}

export default interface UserLeaderBoard {
  id?: string;
  userName?: string;
  avatarLink?: string;
  points?: number;
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserView {
  report = "report",
  hidden = "hidden",
  mute = "mute",
}
