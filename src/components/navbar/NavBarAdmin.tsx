import { onValue, ref } from "@firebase/database";
import { Avatar } from "antd";
import { useEffect, useState } from "react";
import { Navbar, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import User, { UserRole } from "../../models/user.model";
import authAction from "../../redux/actions/auth.action";
import { realtimeDB } from "../../services/firebase.service";
import notificationService from "../../services/notification.service";
import IcoMoon from "../icon/IcoMoon";
import InputSearch from "../input/InputSearch";
import NotificationModal from "../notification/NotificationModal";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  type?: any;
  hasBack?: boolean;
  hasSearch?: boolean;
  handleBack?: any;
  onSearch?: any;
}

function NavBarAdmin(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { containerStyle, hasBack, handleBack, onSearch } = props;
  const user: User = useSelector((state: any) => state.auth.user);
  const [visibleNotification, setVisibleNotification] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(
    user?.count_unread_notification
  );
  const [unreadMessages, setUnreadMessages] = useState(user?.unread_messages);

  // useEffect(() => {
  //   const getNotifications = async () => {
  //     try {
  //       const rs = await notificationService.list();
  //       setNotificationUnread(rs.meta.total);
  //     } catch (error) {}
  //   };
  //   getNotifications();
  // }, []);
  useEffect(() => {
    if (user.role !== UserRole.ADMIN) {
      history.replace(routes.HomePage);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: any;
    try {
      if (user) {
        const badgeRef = ref(realtimeDB, `users/${user.id}/badge`);
        unsubscribe = onValue(badgeRef, (snapshot) => {
          const data = snapshot.val();
          setUnreadNotifications(data.notifications);
          setUnreadMessages(data.unread_messages);
        });
      }
    } catch (error) {}
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  const onOpenNotification = () => {
    setVisibleNotification(true);
    try {
      dispatch(authAction.updateUser({ count_unread_notification: 0 }));
      notificationService.read({ read_all: true });
    } catch (error) {}
  };
  const onCloseNotification = () => {
    setVisibleNotification(false);
  };
  const onMessages = () => {
    history.push(routes.MessagePage);
  };
  const onBack = () => {
    if (handleBack) {
      handleBack();
    } else {
      history.goBack();
    }
  };
  const goHome = () => {
    history.push(routes.HomePage);
  };
  return (
    <Navbar
      bg="light"
      className={`nav-bar-header nav-bar-admin mobile-only ${hasBack && "hasBack"}`}
    >
      <Stack>
        <Stack
          direction="horizontal"
          gap={1}
          className="align-items-center w-100 mb-3"
        >
          {!hasBack && (
            <div onClick={goHome}>
              <Avatar
                src={
                  user?.avatarLink ||
                  images.AVATAR_KEYS[user?.avatar || "avatar1"]
                }
                size={44}
              />
            </div>
          )}
          {!hasBack && (
            <Stack className="ms-2" onClick={goHome}>
              <label className="text-user">{user?.username}</label>
              <label className="text-role">Super admin</label>
            </Stack>
          )}

          {hasBack && (
            <button className="btn btn-back" onClick={onBack}>
              <IcoMoon icon="chevron_left" size={20} className="icon" />
              Back
            </button>
          )}
          <button className="btn ms-auto" onClick={onMessages}>
            <IcoMoon
              icon="message"
              size={24}
              color={hasBack ? colors.primary : "#fff"}
            />
            {!!unreadMessages && unreadMessages > 0 && (
              <span className="text-count text-count-message">
                {unreadMessages}
              </span>
            )}
          </button>
          <button className="btn" onClick={onOpenNotification}>
            <IcoMoon
              icon="notification"
              size={24}
              color={hasBack ? colors.primary : "#fff"}
            />
            {!!unreadNotifications && unreadNotifications > 0 && (
              <span className="text-count">{unreadNotifications}</span>
            )}
          </button>
        </Stack>
        <InputSearch
          placeholder="Search anything..."
          className="input-search"
          onSearch={onSearch}
        />
      </Stack>

      {visibleNotification && (
        <NotificationModal
          visible={visibleNotification}
          onClose={onCloseNotification}
        />
      )}
    </Navbar>
  );
}

export default NavBarAdmin;
