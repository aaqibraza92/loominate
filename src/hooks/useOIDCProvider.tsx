import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReduxConstants from '../commons/constants/redux.constant';

const useOIDCProvider = () => {
  const dispatch = useDispatch();
  const { userManager } = useSelector((store: any) => store.auth);

  const onUserLoaded = useCallback(() => {}, []);

  const onSilentRenewError = useCallback(() => {}, []);

  const onAccessTokenExpired = useCallback(() => {}, []);

  const onAccessTokenExpiring = useCallback(() => {}, []);

  const onUserUnloaded = useCallback(() => {}, []);

  const onUserSignedOut = useCallback(() => {}, []);

  useEffect(() => {
    if (userManager) {
      // register events
      userManager.events.addUserLoaded(onUserLoaded);
      userManager.events.addSilentRenewError(onSilentRenewError);
      userManager.events.addAccessTokenExpired(onAccessTokenExpired);
      userManager.events.addAccessTokenExpiring(onAccessTokenExpiring);
      userManager.events.addUserUnloaded(onUserUnloaded);
      userManager.events.addUserSignedOut(onUserSignedOut);

      // unregister events
      return () => {
        userManager.events.removeUserLoaded(onUserLoaded);
        userManager.events.removeSilentRenewError(onSilentRenewError);
        userManager.events.removeAccessTokenExpired(onAccessTokenExpired);
        userManager.events.removeAccessTokenExpiring(onAccessTokenExpiring);
        userManager.events.removeUserUnloaded(onUserUnloaded);
        userManager.events.removeUserSignedOut(onUserSignedOut);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userManager]);
};

export default useOIDCProvider;
