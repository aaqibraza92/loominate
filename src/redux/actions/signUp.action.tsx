import ReduxConstants from '../../commons/constants/redux.constant';

const addEmail = (email: string) => {
  return (dispatch: any) => {
    dispatch({ type: ReduxConstants.SignUp.ADD_EMAIL, data: { email } });
  };
};

const addDomain = (domain: string) => {
  return (dispatch: any) => {
    dispatch({ type: ReduxConstants.SignUp.ADD_DOMAIN, data: { domain } });
  };
};

const clearData = () => {
  return (dispatch: any) => {
    dispatch({ type: ReduxConstants.SignUp.CLEAR_SIGN_UP_DATA });
  };
};

const updateSignUpInfo = (signUpKey: string, signUpValue: string) => {
  return (dispatch: any) => {
    dispatch({
      type: ReduxConstants.SignUp.UPDATE_SIGNUP_INFO,
      data: {
        signUpKey,
        signUpValue,
      },
    });
  };
};

const signUpAction = {
  addEmail,
  addDomain,
  clearData,
  updateSignUpInfo,
};

export default signUpAction;
