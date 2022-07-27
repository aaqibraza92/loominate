import ReduxConstants from "../../commons/constants/redux.constant";
import Post from "../../models/post.model";

const create = (data: Post) => {
  return (dispatch: any) => {
    dispatch({ type: ReduxConstants.Post.POST_CREATE_FETCH });
    try {
      dispatch({ type: ReduxConstants.Post.POST_CREATE_SUCCESS, data });
    } catch (error) {
      dispatch({ type: ReduxConstants.Post.POST_CREATE_ERROR, error });
    }
  };
};

const update = (data: Post) => {
  return (dispatch: any) => {
    dispatch({ type: ReduxConstants.Post.POST_UPDATE_FETCH });
    try {
      dispatch({
        type: ReduxConstants.Post.POST_UPDATE_SUCCESS,
        data: { ...data },
      });
    } catch (error) {}
  };
};

const updateLocal = (data: Post) => {
  return (dispatch: any) => {
    try {
      dispatch({
        type: ReduxConstants.Post.POST_UPDATE_LOCAL,
        data: { ...data },
      });
    } catch (error) {}
  };
};

const clear = () => {
  return (dispatch: any) => {
    dispatch({ type: ReduxConstants.Post.POST_DATA_CLEAR });
  };
};

const deletePost = (postId?: string) => {
  return (dispatch: any) => {
    dispatch({
      type: ReduxConstants.Post.POST_DELETE_SUCCESS,
      data: { id: postId },
    });
  };
};

const postAction = {
  create,
  clear,
  deletePost,
  update,
  updateLocal
};

export default postAction;
