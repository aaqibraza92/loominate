import session from "redux-persist/lib/storage/session";
import ReduxConstants from "../../commons/constants/redux.constant";
import storageKeys from "../../commons/constants/storageKeys.constant";
import { setAuthorization } from "../../services";
import localStorage from "../../utils/localStorage";

const initialState = {
  isAuthenticated: false,
  requesting: false,
  user: null,
  auth_token: "",
  resetToken: "",
  authError: null,
  isAuthenticationBeingChecked: false,
  checkError: false,
  userManager: null,
  poolData: null,
  sessionActive: false,
};

const AuthReducer = (state = initialState, action: any) => {
  const { user = {} } = state;
  switch (action.type) {
    case ReduxConstants.Auth.SIGN_IN_FETCH:
      localStorage.setValue(storageKeys.AUTH_FLAG, false);
      localStorage.setValue(storageKeys.SESSION, "");
      localStorage.setValue('userInfo', "");
      localStorage.setValue('poolData', "");
      // localStorage.setValue('tenantName', "");
      localStorage.setValue('access_token', "");
      return {
        ...state,
        isAuthenticated: false,
        requesting: true,
        auth_token: "",
        authError: null,
        
      };
    case ReduxConstants.Auth.SIGN_IN_SUCCESS:
      console.log("accestoken", action.data.accessToken.jwtToken);
      const token = action.data.accessToken.jwtToken;
      const user_rs = action.data.user_rs
      setAuthorization(token);
      console.log("user rs data data in reducer", action.data.user_rs)
      console.log("pool data in reducer", action.data.poolData);
      localStorage.setValue(storageKeys.ACCESS_TOKEN, token);
      localStorage.setValue(storageKeys.ACCESS_TOKEN, token);
      localStorage.setValue(storageKeys.AUTH_FLAG, true);
      let PoolDataString = JSON.stringify(action.data.poolData)
      localStorage.setValue(storageKeys.SESSION, PoolDataString);
      localStorage.setValue('userInfo', action.data.user_rs);
      localStorage.setValue('poolData', PoolDataString);
      return {
        ...state,
        isAuthenticated: true,
        requesting: false,
        auth_token: token,
        user: user_rs,
        poolData: action.data.poolData,
      };

    case ReduxConstants.Auth.SIGN_OUT_SUCCESS:
      localStorage.setValue(storageKeys.AUTH_FLAG, false);
      localStorage.setValue(storageKeys.SESSION, "");
      localStorage.setValue('userInfo', "");
      localStorage.setValue('poolData', "");
      localStorage.setValue('tenantName', "");
      localStorage.setValue('access_token', "");
      localStorage.setValue('catIds', "");
      return {
        ...state,
        isAuthenticated: false,
        requesting: false,
        auth_token: "",
        user: null,
        poolData: null,
        sessionActive: false
      };
    case ReduxConstants.Auth.KEEP_SIGN_IN:
      const tokenLocal = action.data.auth_token;
      setAuthorization(tokenLocal);
      return {
        ...state,
        isAuthenticated: true,
        requesting: false,
        auth_token: tokenLocal,
        // user: action.data,
      };
    case ReduxConstants.Auth.SIGN_IN_FAILURE:
      console.log('inside signin failure reducer', action.error)
      
      return {
        requesting: false,
        auth_token: null,
        authError: action.error,
        sessionActive: false
      };

    case ReduxConstants.Auth.SESSION_ACTIVE:
      return {
        sessionActive: true,
      };

    case ReduxConstants.Auth.SESSION_INACTIVE:
      return {
        sessionActive: false,
      };
    case ReduxConstants.Auth.ADD_RESET_PASSWORD_TOKEN:
      return { ...state, resetToken: action.data.resetToken };
    case ReduxConstants.Auth.REMOVE_RESET_PASSWORD_TOKEN:
      return { ...state, resetToken: "" };
    case ReduxConstants.Auth.RESET_DATA:
      return {
        ...state,
        isAuthenticated: false,
        requesting: false,
        // user: null,
        auth_token: "",
        resetToken: "",
        authError: null,
      };
    case ReduxConstants.Auth.CHECK_FETCH:
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticationBeingChecked: true,
        auth_token: null,
        user: null,
        checkError: null,
      };
    case ReduxConstants.Auth.CHECK_SUCCESS:
      const checkToken = action.data.auth_token;
      localStorage.setValue(storageKeys.ACCESS_TOKEN, checkToken);
      return {
        ...state,
        isAuthenticated: true,
        isAuthenticationBeingChecked: false,
        auth_token: checkToken,
        // user: { ...action.data },
        checkError: null,
      };
      case ReduxConstants.Auth.SET_USER:
        const user_data = action.data;
        console.log("inside action set user", action)
        return {
          ...state,
          user: { ...user_data },
        };
    case ReduxConstants.Auth.CHECK_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        isAuthenticationBeingChecked: false,
        auth_token: null,
        // user: null,
        checkError: action.error,
      };
    case ReduxConstants.Auth.USER_UPDATE_PROFILE:
      console.log('inside user update reducer', action.data)
      return {
        ...state,
        user: { ...user, ...action.data },
      };
    // case ReduxConstants.Auth.LOGOUT:
    //   localStorage.setValue(storageKeys.ACCESS_TOKEN, null);
    //   localStorage.setValue(storageKeys.USER_ID, null);
    //   return {
    //     ...state,
    //     isAuthenticated: false,
    //     requesting: false,
    //     auth_token: "",
    //     authError: null,
    //   };
    // OIDC
    case ReduxConstants.Auth.SET_USER_MANAGER:
      return Object.assign(
        {},
        { ...state },
        { userManager: action.data.userManager }
      );
    case ReduxConstants.Auth.USER_EXPIRED:
      return Object.assign(
        {},
        { ...state },
        { user: null, isLoadingUser: false }
      );
    case ReduxConstants.Auth.SILENT_RENEW_ERROR:
      return Object.assign(
        {},
        { ...state },
        { user: null, isLoadingUser: false }
      );
    case ReduxConstants.Auth.SESSION_TERMINATED:
    case ReduxConstants.Auth.USER_SIGNED_OUT:
      return Object.assign(
        {},
        { ...state },
        { user: null, isLoadingUser: false }
      );
    case ReduxConstants.Auth.USER_FOUND:
      return Object.assign(
        {},
        { ...state },
        { user: action.data, isLoadingUser: false }
      );
    default: {
      return state;
    }
  }
};

export default AuthReducer;
