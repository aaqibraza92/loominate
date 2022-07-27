import { PageData } from "./page.model";
import User from "./user.model";

interface Comment {
  id?: string;
  type?: "text" | "image" | "video";
  content?: string;
  image?: any;
  video?: any;
  post_id?: string;
  parent_id?: string;
  comment_type?: "post";
  link?: string;
  user?: User;
  liked?: boolean;
  disliked?: boolean;
  like_count?: number;
  dislikes?: number;
  child_comments?: Comment[];
  isSend?: boolean;
  created_at?: Date;
  updated_at?: Date;
  contentId?: number;
  userId?: number;
  body?: string;
  comments?: any;
  commentId?: number; 
  tenant?: string;
  thirdPerson?: string;
  creationDate?: string
}

export interface CommentPageData extends PageData {
  post_id?: string;
  comment_type?: "post";
}

export interface CommentData {
  id?: string;
  type?: "text" | "image" | "video";
  content?: string;
  link?: string;
  image?: any;
  video?: any;
  post_id?: string;
  parent_id?: string;
  comment_type?: "post";
  user?: User;
}

export default Comment;
