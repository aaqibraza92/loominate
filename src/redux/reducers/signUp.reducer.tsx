import ReduxConstants from '../../commons/constants/redux.constant';

const initialState = {
  email: '',
  domain: '',
  username: '',
  password: '',
};

const SignUpReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ReduxConstants.SignUp.ADD_EMAIL:
      return { ...state, email: action.data.email, domain: '' };
    case ReduxConstants.SignUp.ADD_DOMAIN:
      return { ...state, domain: action.data.domain, email: '' };
    case ReduxConstants.SignUp.CLEAR_SIGN_UP_DATA:
      return { ...state, ...initialState };
    case ReduxConstants.SignUp.UPDATE_SIGNUP_INFO:
      return {
        ...state,
        [action.data['signUpKey']]: action.data['signUpValue'],
      };
    default: {
      return state;
    }
  }
};

export default SignUpReducer;
