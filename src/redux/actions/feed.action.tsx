import ReduxConstants from "../../commons/constants/redux.constant";
import Category from "../../models/category.model";
import Post from "../../models/post.model";
import User from "../../models/user.model";

const setPosts = (data: Post[]) => {
  console.log('inside feed action', data)
  return (dispatch: any) => {
    try {
      dispatch({ type: ReduxConstants.Feed.POST_UPDATE_LIST_SUCCESS, data });
    } catch (error) {
      dispatch({ type: ReduxConstants.Feed.POST_UPDATE_LIST_ERROR, error });
    }
  };
};

const setUsers = (data : User[]) => {
  console.log('inside user action',data);
  return (dispatch: any) => {
    try {
      dispatch({type : ReduxConstants.Feed.USER_UPDATE_LIST_SEARCH, data});
    } catch (error){}
  }
}

const setSearchPosts = (data: Post[]) => {
  return (dispatch: any) => {
    try {
      dispatch({
        type: ReduxConstants.Feed.POST_UPDATE_LIST_SEARCH,
        data,
      });
    } catch (error) {}
  };
};

const setInitiatives = (data: Post[]) => {
  return (dispatch: any) => {
    try {
      dispatch({
        type: ReduxConstants.Feed.POST_UPDATE_LIST_INITIATIVES,
        data,
      });
    } catch (error) {}
  };
};

const updateCategoriesSelected = (data: Category[]) => {
  return (dispatch: any) => {
    try {
      dispatch({
        type: ReduxConstants.Feed.FEED_UPDATE_CATEGORIES_SELECTED,
        data,
      });
    } catch (error) {}
  };
};

const feedAction = {
  setPosts,
  setInitiatives,
  setSearchPosts,
  updateCategoriesSelected,
  setUsers
};

export default feedAction;
