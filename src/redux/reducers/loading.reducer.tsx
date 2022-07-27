import ReduxConstants from '../../commons/constants/redux.constant';

const initialState = {
  visible: false,
  message: '',
  username: '',
  loading: false,
};

const LoadingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ReduxConstants.Loading.LOADING_VISIBLE:
      return { ...state, ...action.data, visible: true };
    case ReduxConstants.Loading.LOADING_HIDE:
      return { ...state, ...action.data, visible: false };
    case ReduxConstants.Loading.LOADING:
      return Object.assign({}, { ...state }, { loading: action.data.status });
    default: {
      return state;
    }
  }
};

export default LoadingReducer;
