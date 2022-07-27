import { PageData } from "./page.model";
import { PostType } from "./post.model";

export interface FeedFilter extends PageData {
  category_id?: string;
  post_type?: PostType;
  order?: any;
  hashtags?: string;
  user_id?: string;
  voted_by_user?: boolean;
  id?: string;
}
