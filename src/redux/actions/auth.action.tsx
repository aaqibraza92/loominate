import { getToken } from "firebase/messaging";
import { Dispatch } from "redux";
import {
  default as ReduxConstants,
  default as reduxTypes,
} from "../../commons/constants/redux.constant";
import storageKeys from "../../commons/constants/storageKeys.constant";
import { IDPConfig } from "../../models/auth.model";
import User from "../../models/user.model";
import { setAuthorization } from "../../services";
import { firebaseMessage } from "../../services/firebase.service";
import userService from "../../services/user.service";
import localStorage from "../../utils/localStorage";
import authHelpers from "../../helpers/auth.helper";
import loadingAction from "./loading.action";
import oidcServices from "../../services/oidc.service";
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import tenantService from "../../services/tenant.service";
import { useSelector } from "react-redux";
// import Pool from './UserPool'
// TODO: replace with aws cognito / oidc flow
const signIn =
  (Username: any, Password: string, _tenantName: string) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: reduxTypes.Auth.SIGN_IN_FETCH });
    const rs = await tenantService.tenantData(_tenantName);
    console.log("result from tenant service", rs);
    const idp = JSON.parse(rs.idpConfig);
    const poolData = {
      UserPoolId: idp.poolId,
      ClientId: idp.clientID,
    };

    let Pool = new CognitoUserPool(poolData);
    console.log("pool data in auth action", Pool);
    // let user_rs: any = await userService.getUser(_tenantName, Username);
    // let count_posts: any = await userService.getCountPosts(_tenantName, user_rs.id);
    // let count_polls: any = await userService.getCountPoll(_tenantName, user_rs.id);
    // let count_ini = await userService.getCountInitiative(
    //   _tenantName,
    //   user_rs.id
    // );

    // console.log("user rs data in auth actions", user_rs);
    await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool });
      const authDetails = new AuthenticationDetails({ Username, Password });
      console.log('userNamecheck', Username)
      user.authenticateUser(authDetails, {
        onSuccess: async (data: any) => {
          let user_rs: any = await userService.getUser(_tenantName, Username);
          console.log('userDetailsInAuthAction', user_rs)
          console.log("onSuccess:", data);
          data.poolData = Pool;
          // user_rs.count_post = count_posts;
          // user_rs.count_ini = count_ini;
          // user_rs.count_polls = count_polls;
          data.user_rs = user_rs;
          dispatch({
            type: reduxTypes.Auth.SIGN_IN_SUCCESS,
            data: data,
          });
          resolve(data);
        },

        onFailure: (error) => {
          console.error("onFailure1:", error);
          dispatch({
            type: reduxTypes.Auth.SIGN_IN_FAILURE,
            error: error,
          });
          // reject(err);
        },

        newPasswordRequired: (data) => {
          console.log("newPasswordRequired:", data);
          resolve(data);
        },
      });
    });

    // dispatch({ type: reduxTypes.Auth.SIGN_IN_FETCH });
    // try {
    //   let device_token;
    //   try {
    //     device_token = await getToken(firebaseMessage, {
    //       vapidKey: process.env.REACT_APP_FIREBASE_MESSAGE_KEY,
    //     });
    //   } catch (error) {}
    //   const rs = await userService.signIn({ username, password, device_token });
    //   const user = rs.user;
    //   dispatch({
    //     type: reduxTypes.Auth.SIGN_IN_SUCCESS,
    //     data: user,
    //   });
    //   dispatch({
    //     type: ReduxConstants.Feed.FEED_UPDATE_CATEGORIES_SELECTED,
    //     data: user.user_categories || [],
    //   });
    // } catch (error) {
    //   dispatch({
    //     type: reduxTypes.Auth.SIGN_IN_FAILURE,
    //     error,
    //   });
    // }

    try {
    } catch (error) {
      dispatch({
        type: reduxTypes.Auth.SIGN_IN_FAILURE,
        error,
      });
    }
  };

// const getSession = (Pool: any) => {
//   return async (dispatch: Dispatch) => {
//     const user = Pool.getCurrentUser();
//     if (user) {
//       user.getSession(async (err: any) => {
//         if (err) {
//           dispatch({
//             type: ReduxConstants.Auth.SESSION_INACTIVE,
//             data: { ...user },
//           });
//         } else {
//           dispatch({
//             type: ReduxConstants.Auth.SESSION_ACTIVE,
//             data: { ...user },
//           });
//         }
//       });
//     } else {
//       dispatch({
//         type: ReduxConstants.Auth.SESSION_INACTIVE,
//         data: { ...user },
//       });
//     }
//   };
// };

// const keepSignIn = () => {
//   return async (dispatch: Dispatch) => {
//     const id = localStorage.getValue(storageKeys.USER_ID);
//     try {
//       const rs = await userService.getUser(id);
//       const user: User = rs.user;
//       dispatch({
//         type: ReduxConstants.Auth.KEEP_SIGN_IN,
//         data: { ...user },
//       });
//       dispatch({
//         type: ReduxConstants.Feed.FEED_UPDATE_CATEGORIES_SELECTED,
//         data: user.user_categories,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };

const updateUser = (user: User) => {
  console.log("dispatch update user", user);
  return async (dispatch: Dispatch) => {
    console.log("inside dispatch");
    try {
      await dispatch({
        type: reduxTypes.Auth.USER_UPDATE_PROFILE,
        data: { ...user },
      });
      if (user.user_categories) {
        dispatch({
          type: ReduxConstants.Feed.FEED_UPDATE_CATEGORIES_SELECTED,
          data: user.user_categories || [],
        });
      }
    } catch (error) {
      console.log("dispatch error in action", error);
    }
  };
};

// const check = () => {
//   return async (dispatch: Dispatch) => {
//     const tokenLocal = localStorage.getValue(storageKeys.ACCESS_TOKEN);
//     const id = localStorage.getValue(storageKeys.USER_ID);
//     setAuthorization(tokenLocal);
//     dispatch({ type: reduxTypes.Auth.CHECK_FETCH });
//     try {
//       const rs = await userService.getUser(id);
//       const user = rs.user;
//       dispatch({
//         type: reduxTypes.Auth.CHECK_SUCCESS,
//         data: user,
//       });
//       if (user.user_categories && user.user_categories.length > 0) {
//         dispatch({
//           type: ReduxConstants.Feed.FEED_UPDATE_CATEGORIES_SELECTED,
//           data: user.user_categories,
//         });
//       }
//     } catch (error) {
//       dispatch({
//         type: reduxTypes.Auth.CHECK_FAILURE,
//         error,
//       });
//     }
//   };
// };

const addResetPasswordToken = (token: string) => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: ReduxConstants.Auth.ADD_RESET_PASSWORD_TOKEN,
      data: { resetToken: token },
    });
  };
};

const removeResetPasswordToken = () => {
  return (dispatch: any) => {
    dispatch({ type: ReduxConstants.Auth.REMOVE_RESET_PASSWORD_TOKEN });
  };
};

const Logout = (poolData: any) => {
  // let Pool = new CognitoUserPool(_poolData);
  // console.log("poolData in auth userPoolId: ", poolData.userPoolId)
  // console.log("poolData in auth clientId: ", poolData.clientId)

  var _poolData: any = {
    UserPoolId: poolData.userPoolId, // Your user pool id here
    ClientId: poolData.clientId, // Your client id here
  };
  console.log('pool object', _poolData)

  // var userPool = new CognitoUserPool(poolData);
  // console.log("poolData in auth storage pool data", _poolData.storage.poolData)
  var userPool = new CognitoUserPool(_poolData);
  const user = userPool.getCurrentUser();

  console.log("uaer: ", user);
  if (user) {
    console.log("is working");
    user.signOut();
  }
  return (dispatch: any) => {
    dispatch({ type: ReduxConstants.Auth.SIGN_OUT_SUCCESS });
  };
};

// OIDC Actions

const setUserManager = (idpConfig: any) => {
  return (dispatch: any) => {
    const userManager = authHelpers.handleIDPConfig(idpConfig);

    dispatch({
      type: ReduxConstants.Auth.SET_USER_MANAGER,
      data: { userManager },
    });
  };
};

const setUser = (user: any) => {
  return (dispatch: any) => {
    dispatch({
      type: ReduxConstants.Auth.SET_USER,
      data: { user },
    });
  };
};

const loadUser = (userManager: any, cb?: Function, errCb?: Function) => {
  return async (dispatch: any) => {
    try {
      const user = await oidcServices.getUser(userManager);

      console.log(user);

      if (!user) {
        console.error("No user found");
        errCb && errCb();
        return;
      }
    } catch (error) {
      console.error(error);
      errCb && errCb();
    } finally {
      dispatch(loadingAction.setLoading(false));
    }
  };
};

const setUserFound = (user: any) => {
  return (dispatch: any) => {
    dispatch({ type: ReduxConstants.Auth.USER_FOUND, data: user });
  };
};

const authAction = {
  signIn,
  // keepSignIn,
  addResetPasswordToken,
  removeResetPasswordToken,
  // check,
  updateUser,
  setUserManager,
  setUserFound,
  setUser,
  loadUser,
  Logout,
  // getSession,
};

export default authAction;
