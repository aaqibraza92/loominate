import { limitToLast, onChildAdded, query, ref } from '@firebase/database';
import { notification } from 'antd';
import { getToken, onMessage } from 'firebase/messaging';
import moment from 'moment';
import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, Redirect } from 'react-router';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { Route } from 'react-router-dom';
import './App.css';
import routes from './commons/constants/routes.constant';
import AlertModal from './components/AlertModal/AlertModal';
import Loading from './components/loading/Loading';
import ModalConfirm from './components/modal/ModalConfirm';
import SplashScreen from './components/splash/SplashScreen';
import Notification from './models/notification.model';
import { PostType } from './models/post.model';
import { UserRole } from './models/user.model';
import DashboardPage from './pages/admin/Dashboard';
import DashboardTenant from './pages/tenant/Dashboard';
import DashboardTenantAdmin from './pages/tenant/DashboardAdmin';
import PostManagementPage from './pages/admin/PostManagement';
import UserManagementPage from './pages/admin/UserManagement';
import CategoryPage from './pages/category';
import FeedPage from './pages/feed';
import InitiativesPage from './pages/initiatives';
import InvitePeersPage from './pages/invite/InvitePeers';
import LeaderBoardPage from './pages/leaderboard';
import MessagePage from './pages/message';
import MessageDetailPage from './pages/message/MessageDetail';
import PostPage from './pages/post';
import ProfilePage from './pages/profile';
import BlockedUsersPage from './pages/profile/BlockedUsers';
import ContentInReviewPage from './pages/profile/ContentInReview';
import ViewProfilePage from './pages/profile/ViewProfile';
import ResetPasswordPage from './pages/reset-password';
import NewPasswordPage from './pages/reset-password/NewPassword';
import SearchPage from './pages/search';
import SettingsPage from './pages/setting';
import SignInPage from './pages/sign-in';
import SignUpCompanyPage from './pages/sign-up-company';
import SignUpCompanyInvitePage from './pages/sign-up-company/SignUpCompanyInvitePage';
import SignUpSuccessPage from './pages/sign-up-company/SignUpSuccessPage';
import SignUpCompanySpacePage from './pages/sign-up-company/SignUpCompanySpacePage';
import SignUpStepPage from './pages/sign-up-steps/index';
import TermsOfUse from './pages/static/TermsOfUse';
import authAction from './redux/actions/auth.action';
import postAction from './redux/actions/post.action';
import { firebaseMessage, realtimeDB } from './services/firebase.service';
import useOIDCProvider from './hooks/useOIDCProvider';
import { RecoilRoot } from 'recoil';
import storageKeys from './commons/constants/storageKeys.constant';
import jwt_decode from "jwt-decode";

const URL = 'wss://sop2jbsrj5.execute-api.ap-southeast-1.amazonaws.com/production';

export const ThemeContext = createContext<WebSocket| null>(null);
/**
 * Description
 * @returns {any}
 */
function App() {
  const history = useHistory();
  const dispatch = useDispatch();
  const search: any = useLocation().search;
  const referralCode: string =
    new URLSearchParams(search).get('referral') || '';
  const [isSplashShown, setisSplashShown] = useState(true);
  const { isAuthenticationBeingChecked, isAuthenticated, user } = useSelector(
    (state: any) => state.auth
  );
  const { create: postCreated } = useSelector((state: any) => state.post);
  const [notifyCreate, setNotifyCreate] = useState({
    point: 0,
  });
  useOIDCProvider();
  const { poolData,sessionActive } = useSelector((state: any) => state.auth);
  // dispatch(authAction.getSession(poolData));


  // socket start
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [members, setMembers] = useState([]);
  const [chatRows, setChatRows] = useState<React.ReactNode[]>([]);

  const onSocketOpen = useCallback(() => {
    setIsConnected(true);
    socket.current?.send(JSON.stringify({"action": "setName", "tenantname": "milton","user":2 }));
  }, []);

  const onSocketClose = useCallback(() => {
    setMembers([]);
    setIsConnected(false);
    setChatRows([]);
  }, []);

  const onSocketMessage = useCallback((dataStr) => {
    const data = JSON.parse(dataStr);
    console.log('check data', data)
    if (data.members) {
      setMembers(data.userId);
    } else if (data.publicMessage) {
      setChatRows(oldArray => [...oldArray, <span><b>{data.publicMessage}</b></span>]);
    } else if (data.privateMessage) {
      // alert(data.privateMessage.body);
    } else if (data.systemMessage) {
      setChatRows(oldArray => [...oldArray, <span><i>{data.privateMessage.body}</i></span>]);
    }
  }, []);

  const onConnect = useCallback(() => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      socket.current = new WebSocket(URL);
      console.log('socker.current', socket.current)
      let socketCurrent = JSON.stringify(socket)
      localStorage.setItem('socketUser', socketCurrent)
      // user.socketInfo = "";
      // user.socketInfo = socket;
      // dispatch(authAction.updateUser(user));
      socket.current.addEventListener('open', onSocketOpen);
      socket.current.addEventListener('close', onSocketClose);
      socket.current.addEventListener('message', (event) => {
        onSocketMessage(event.data);
      });
    }
  }, []);

  useEffect(() => {
    // manageSession()
    return () => {
      socket.current?.close();
    };
  }, []);

  const onSendPrivateMessage = useCallback((to: string) => {
    // const message = prompt('Enter private message for ' + to);
    // socket.current?.send(JSON.stringify({
    //   action: 'sendPrivate',
    //   message,
    //   to,
    // }));
  }, []);

  const onSendPublicMessage = useCallback(() => {
    // const message = prompt('Enter private message');
    socket.current?.send(JSON.stringify({"action": "setPrivate", "tenantname": "l6", "from": 1, "to": 1, "body": "hi from 1" , "chatId": 1}));
  }, []);

  const onDisconnect = useCallback(() => {
    if (isConnected) {
      socket.current?.close();
    }
  }, [isConnected]);

  const manageSession = () => {
    const token: any = localStorage.getItem(storageKeys.ACCESS_TOKEN)
    var decodedToken: any = jwt_decode(token);
    console.log('decode token',decodedToken)
    const expirationTime = (decodedToken.exp * 1000) - 60000
    console.log('expirationTime', expirationTime)
  }
  // socket end
  
  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ',
      s: '%ds ago',
      m: '%dm ago',
      mm: '%dm ago',
      h: '%dh ago',
      hh: '%dh ago',
      d: '%dd ago',
      dd: '%dd ago',
      M: '%d month',
      MM: '%d months',
      y: '%d year',
      yy: '%d years',
    },
  });

  // useEffect(() => {
  //   dispatch(authAction.check());
  //   try {
  //     if (!('Notification' in window)) {
  //       console.log('This browser does not support desktop notification');
  //     } else {
  //       Notification.requestPermission();
  //       getToken(firebaseMessage, {
  //         vapidKey: process.env.REACT_APP_FIREBASE_MESSAGE_KEY,
  //       })
  //         .then((token) => {
  //           if (token) {
  //             console.log('FIREBASE_TOKEN', token);
  //           } else {
  //             console.log(
  //               'No registration token available. Request permission to generate one.'
  //             );
  //           }
  //         })
  //         .catch((err) => {
  //           console.log('An error occurred while retrieving token. ', err);
  //         });
  //       onMessage(firebaseMessage, (payload) => {
  //         console.log('Message received. ', payload);
  //       });
  //     }
  //   } catch (error) {
  //     console.log('Notification Init', error);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!isAuthenticationBeingChecked) {
  //     setTimeout(() => {
  //       setisSplashShown(false);
  //     }, 2000);
  //     if (!isAuthenticated) {
  //       console.log(search);

  //       if (referralCode) {
  //         history.push(`${routes.SignInPage}?referral=${referralCode}`);
  //       } else {
  //         history.push(routes.SignInPage);
  //       }
  //     }
  //   }
  // }, [isAuthenticationBeingChecked, user, isAuthenticated]);

//   useEffect(() => {
//       dispatch(authAction.getSession(poolData));
//   }, [isAuthenticated]);

//   useEffect(() => {
//     dispatch(authAction.getSession(poolData));
// }, []);
  useEffect(() => {
    console.log('inside role admin', user?.role)
    if (user?.role === UserRole.ADMIN) {
      document.body.className = 'admin_user';
      return () => {
        document.body.className = 'regular_user';
      };
    }
  });

  useEffect(() => {
    console.log('inside app.ts', user?.role)
    onConnect()
  }, [])
// let storageFlag: any = false
//   useEffect(() => {
//     storageFlag = localStorage.getItem(storageKeys.AUTH_FLAG)
//    }, []);

  // useEffect(() => {
  //  localStorage.setItem(storageKeys.AUTH_FLAG,isAuthenticated)
  // }, [isAuthenticated]);

  useEffect(() => {
    const tenant = window.location.host.split('.')[0]
    localStorage.setItem('tenantName', tenant)
  })
  

  useEffect(() => {
    let unsubscribe: any;
    if (user) {
      try {
        let isFirst = true;
        const notifyRef = ref(realtimeDB, `users/${user.id}/notifications`);
        const notifyQuery = query(notifyRef, limitToLast(1));
        unsubscribe = onChildAdded(notifyQuery, (snapshot) => {
          const data: Notification = snapshot.val();

          if (!isFirst) {
            switch (data.action) {
              case 'create_post':
              case 'create_poll':
              case 'create_initiative':
                setNotifyCreate({
                  point: data.points || 0,
                });
                break;
              default:
                notification.info({
                  key: `${Date.now}`,
                  message: `${data.sender?.username} ${data.body}`,
                  // description: "description.",
                  duration: 3,
                });
                break;
            }
          }
          isFirst = false;
        });
      } catch (error) {}
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return (
    <ThemeContext.Provider value={socket.current}>
    <RecoilRoot>
      <Helmet>
        <title>Loominate</title>
      </Helmet>
      <AlertModal />
      {/* <SplashScreen visible={isSplashShown} /> */}
      <Loading />

      {/* {isAuthenticationBeingChecked && ( */}
        <CacheSwitch>
          {localStorage.getItem(storageKeys.AUTH_FLAG) == 'false' || localStorage.getItem(storageKeys.AUTH_FLAG) == null ? (
            <>
              <Route path={routes.HomePage} component={SignInPage} exact />
              {/* <Route path={routes.SignInPage} component={SignInPage} exact /> */}
              {/* <Route path={routes.OurSteps} component={SignInPage} exact /> */}
              <Route
                path={routes.SignUpPage}
                component={SignUpStepPage}
                exact
              />
              <Route
                path={routes.SignUpCompanyPage}
                component={SignUpCompanyPage}
                exact
              />
              <Route
                path={routes.SignUpCompanySpacePage}
                component={SignUpCompanySpacePage}
                exact
              />
              <Route
                path={routes.SignUpCompanyInvitePage}
                component={SignUpCompanyInvitePage}
                exact
              />
              <Route
                path={routes.SignUpSuccessPage}
                component={SignUpSuccessPage}
                exact
              />
              
            </>
          ) : (
            <>
              <CacheRoute exact path={routes.HomePage} component={FeedPage} />
              <Route path={routes.FeedSpacePage} component={FeedPage} />
              <Route
                path={routes.ResetPasswordPage}
                component={ResetPasswordPage}
                exact
              />
              <Route
                path={routes.NewPasswordPage}
                component={NewPasswordPage}
                exact
              />
              <Route path={routes.PostPage} component={PostPage} />
              <Route path={routes.ProfilePage} component={ProfilePage} />
              <Route
                path={routes.ViewProfilePage}
                component={ViewProfilePage}
              />
              <Route path={routes.CategoryPage} component={CategoryPage} />
              <Route path={routes.MessagePage} component={MessagePage} />
              <Route
                path={routes.MessageDetailPage}
                component={MessageDetailPage }
              />
              <Route path={routes.DashboardPage} component={DashboardPage} />
              <Route path={routes.DashboardTenant} component={DashboardTenant} />
              <Route path={routes.DashboardTenantAdmin} component={DashboardTenantAdmin} />
              <Route
                path={routes.PostManagementPage}
                component={PostManagementPage}
              />
              <Route
                path={routes.UserManagementPage}
                component={UserManagementPage}
              />
              <Route
                path={routes.LeaderBoardPage}
                component={LeaderBoardPage}
              />
              <Route
                path={routes.InitiativesPage}
                component={InitiativesPage}
              />
              <Route path={routes.SearchPage} component={SearchPage} />
              <Route
                path={routes.BlockedUsersPage}
                component={BlockedUsersPage}
              />
              <Route path={routes.SettingsPage} component={SettingsPage} />
              <Route
                path={routes.ContentInReviewPage}
                component={ContentInReviewPage}
              />
              <Route
                path={routes.InvitePeersPage}
                component={InvitePeersPage}
              />
            </>
          )}
          <Redirect path="*" to={routes.HomePage} />
        </CacheSwitch>
      {/* // )} */}
      <ModalConfirm
        visible={!!notifyCreate.point}
        message={`${
          postCreated?.post_type === PostType.Poll
            ? 'Poll'
            : postCreated?.post_type === PostType.Initiative
            ? 'Initiative'
            : 'Post'
        } created! You have earned +${notifyCreate.point} Karma Points`}
        cancelText={null}
        onOk={() => {
          dispatch(postAction.clear());
          setNotifyCreate({
            point: 0,
          });
        }}
      />
    </RecoilRoot>
    </ThemeContext.Provider>
  );
}

export default App;
