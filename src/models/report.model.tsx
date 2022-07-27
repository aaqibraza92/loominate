import { PageData } from "./page.model";
import Post from "./post.model";
import User from "./user.model";

export default interface Report {
  id?: string;
  user?: User;
  post?: Post;
  why?: string;
  report_user?: User;
  why_hidden?: string;
  updated_at?: string;
  created_at?: string;
}

export interface ReportData {
  id?: string;
  report_user_id?: string;
  post_id?: string;
  why?: string;
  approve?: boolean;
  hidden?: boolean;
}

export interface ReportFilter extends PageData {
  from_date?: any;
  to_date?: any;
}
