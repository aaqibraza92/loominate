import ReduxConstants from '../../commons/constants/redux.constant';

const visible = (
  username: string = '',
  message: string = '',
  duration?: number
) => {
  return (dispatch: any) => {
    dispatch({
      type: ReduxConstants.Loading.LOADING_VISIBLE,
      data: { message, username },
    });
    if (duration) {
      setTimeout(() => {
        dispatch({
          type: ReduxConstants.Loading.LOADING_HIDE,
        });
      }, duration);
    }
  };
};

const hide = (message?: string) => {
  return (dispatch: any) => {
    dispatch({
      type: ReduxConstants.Loading.LOADING_HIDE,
      data: { message },
    });
  };
};

const setLoading = (status: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: ReduxConstants.Loading.LOADING,
      data: { status },
    });
  };
};

const loadingAction = {
  visible,
  hide,
  setLoading,
};

export default loadingAction;
