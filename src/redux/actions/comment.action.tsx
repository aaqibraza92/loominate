import ReduxConstants from "../../commons/constants/redux.constant";
import Comment from "../../models/comment.model";

const add = (data: Comment) => {
  return (dispatch: any) => {
    data.isSend = true;
    dispatch({
      type: ReduxConstants.Comment.COMMENT_ADD_NEW,
      data: { ...data },
    });
  };
};

const clear = () => {
  return (dispatch: any) => {
    dispatch({ type: ReduxConstants.Comment.COMMENTS_CLEAR });
  };
};

const commentAction = {
  add,
  clear,
};

export default commentAction;
