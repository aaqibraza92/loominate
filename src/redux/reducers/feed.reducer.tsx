import ReduxConstants from "../../commons/constants/redux.constant";

const initialState = {
  posts: [],
  initiatives: [],
  searchPosts: [],
  categoriesSelected: [],
  searchUsers: [],
};

const FeedReducer = (state = initialState, action: any) => {
  const { posts = [], initiatives = [] } = state;
  switch (action.type) {
    case ReduxConstants.Feed.POST_LIST_FETCH:
      return { ...state, posts: [] };
    case ReduxConstants.Feed.POST_UPDATE_LIST_SUCCESS:
      console.log('inside feed reducer succes',action.data)
      return { ...state, posts: [...action.data] };
    case ReduxConstants.Feed.USER_UPDATE_LIST_SEARCH:
      console.log('inside feed reducer user update data');
      return {...state, searchUser: [...action.data]}
    case ReduxConstants.Post.POST_CREATE_SUCCESS:
      return { ...state, posts: [action.data, ...state.posts] };
    case ReduxConstants.Feed.POST_UPDATE_LIST_INITIATIVES:
      return { ...state, initiatives: [...action.data] };
    case ReduxConstants.Feed.POST_UPDATE_LIST_SEARCH:
      return { ...state, searchPosts: [...action.data] };
    case ReduxConstants.Post.POST_DELETE_SUCCESS:
      console.log('id in redux delete', action)
      const id = action.data.id;
      const i = posts.findIndex((x: any) => x.id === id);
      if (i > -1) {
        posts.splice(i, 1);
      }
      return { ...state, posts: [...posts] };
    case ReduxConstants.Feed.FEED_UPDATE_CATEGORIES_SELECTED:
      return { ...state, categoriesSelected: [...action.data] };
    // case ReduxConstants.Auth.LOGOUT:
    //   return {
    //     ...state,
    //     ...initialState,
    //   };
    case ReduxConstants.Post.POST_UPDATE_LOCAL:
      const findIPost = posts.findIndex((x: any) => x.id === action.data.id);
      const findIInitiative = initiatives.findIndex(
        (x: any) => x.id === action.data.id
      );
      const p: any = posts;
      const ini: any = initiatives;
      if (posts && findIPost > -1 && posts[findIPost]) {
        p[findIPost] = { ...p[findIPost], ...action.data };
      }
      if (initiatives && findIInitiative > -1 && initiatives[findIInitiative]) {
        ini[findIInitiative] = { ...ini[findIInitiative], ...action.data };
      }
      return {
        ...state,
        posts: [...p],
        initiatives: [...ini],
      };
    default: {
      return state;
    }
  }
};

export default FeedReducer;
