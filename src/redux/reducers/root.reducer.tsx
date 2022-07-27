import { combineReducers } from "redux";
import AuthReducer from "./auth.reducer";
import CommentReducer from "./comment.reducer";
import FeedReducer from "./feed.reducer";
import LoadingReducer from "./loading.reducer";
import PostReducer from "./post.reducer";
import SignUpReducer from "./signUp.reducer";

export default combineReducers({
  auth: AuthReducer,
  signUp: SignUpReducer,
  loading: LoadingReducer,
  feed: FeedReducer,
  post: PostReducer,
  comment: CommentReducer
});
