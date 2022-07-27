import ReduxConstants from "../../commons/constants/redux.constant";

const initialState = {
  new: null,
  create: null,
  createError: null,
  update: null,
  updateError: null,
  postUpdate: {},
};

const PostReducer = (state = initialState, action: any) => {
  const { postUpdate } = state;
  switch (action.type) {
    case ReduxConstants.Post.POST_CREATE_FETCH:
    case ReduxConstants.Post.POST_UPDATE_FETCH:
    case ReduxConstants.Post.POST_DATA_CLEAR:
      return {
        ...state,
        create: null,
        createError: null,
        update: null,
        updateError: null,
      };
    case ReduxConstants.Post.POST_CREATE_SUCCESS:
      return { ...state, create: { ...action.data } };
    case ReduxConstants.Post.POST_CREATE_ERROR:
      return { ...state, createError: action.error };
    case ReduxConstants.Post.POST_UPDATE_SUCCESS:
      return { ...state, update: { ...action.data } };
    case ReduxConstants.Post.POST_UPDATE_LOCAL:
      return {
        ...state,
        postUpdate: { ...action.data },
      };
    default: {
      return state;
    }
  }
};

export default PostReducer;
