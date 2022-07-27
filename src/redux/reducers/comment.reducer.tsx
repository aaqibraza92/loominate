import ReduxConstants from "../../commons/constants/redux.constant";

const initialState = {
  new: null,
  addNew: null,
  createError: null,
  comments: [],
};

const CommentReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ReduxConstants.Comment.COMMENTS_CLEAR:
      return { ...state, addNew: null};
    case ReduxConstants.Comment.COMMENT_ADD_NEW:
      return { ...state, addNew: { ...action.data } };
    default: {
      return state;
    }
  }
};

export default CommentReducer;
