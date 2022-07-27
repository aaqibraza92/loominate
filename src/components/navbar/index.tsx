import { onValue, ref } from "@firebase/database";
import { Avatar } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Navbar, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";
import images from "../../assets/images/images";
import { notReadNotification } from "../../atoms/globalStates";
import api from "../../commons/constants/api.constant";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import User from "../../models/user.model";
import authAction from "../../redux/actions/auth.action";
import { realtimeDB } from "../../services/firebase.service";
import notificationService from "../../services/notification.service";
import IcoMoon from "../icon/IcoMoon";
import NotificationModal from "../notification/NotificationModal";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  type?: any;
  hasBack?: boolean;
  handleBack?: any;
}

function AppNavBar(props: Props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { containerStyle, hasBack, handleBack } = props;
  const user: User = useSelector((state: any) => state.auth.user);
  const [visibleNotification, setVisibleNotification] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useRecoilState(
    notReadNotification
  );
  const [unreadMessages, setUnreadMessages] = useState(user?.unread_messages);


  // const tenantName = localStorage.getItem('tenantName')
  // let  eventSource : EventSource;
  // const eventName = user.id+"_"+tenantName;

   

  // const getNotificationsNotReadCout = async () =>{
  //   let count = await notificationService.getNotReadCount(2)
  //   console.log("juju", count)
  //   setUnreadNotifications(count);
  // }
  // useEffect( () => {
  //  getNotificationsNotReadCout();
  //  eventSource  = new EventSource(`${api.NOTIFICATION_EVENT_API}/${user.id}?tenantname=${tenantName}`);
  // eventSource.addEventListener(
  //  eventName, function(e) {
  //     const counter = parseInt(e.data);
  //     setUnreadNotifications(counter);
  //   });

  //   eventSource.onmessage = (e) =>{
  //     setUnreadNotifications(parseInt(e.data))
  //   }
  
  //   eventSource.onerror = (e) =>{
  //     // console.log("Error in notificatin event: ", e);
  //     // eventSource.close();
  //   } 
  // }, []);

 
  const onOpenNotification = async () => {
    setVisibleNotification(true);
    try {
      dispatch(authAction.updateUser({ count_unread_notification: 0 }));
      notificationService.markRead(parseInt(user.id!))
      setUnreadNotifications(0);
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
  
  function gettenant() {
    const tenantName: any = localStorage.getItem("tenantName");
    return tenantName;
  }
  return (
    <>
      <Navbar bg="light" className="nav-bar-header mobile-only">
        <Container>
          <Stack
            direction="horizontal"
            gap={1}
            className="align-items-center w-100"
          >
            {!hasBack && (
              <Avatar
                src={user?.company?.logo.url || images.avatarCompany}
                size={45}
              /> 
              
            )}
            <h4 className="m-0">{gettenant()}</h4>
            {!hasBack && (
              <label className="text-user">{user?.company?.name}</label>
            )}
            {hasBack && (
              <button className="btn btn-back" onClick={onBack}>
                <IcoMoon icon="chevron_left" size={20} className="icon" />
                Back
              </button>
            )}
            <button className="btn ms-auto" onClick={onMessages}>
              <IcoMoon icon="message" size={24} color={colors.mint} />
              {!!unreadMessages && unreadMessages > 0 && (
                <span className="text-count text-count-message">
                  {unreadMessages}
                </span>
              )}
            </button>
            <button className="btn" onClick={onOpenNotification}>
              <IcoMoon icon="notification" size={24} color={colors.mint} />
              {!!unreadNotifications && unreadNotifications > 0 && (
                <span className="text-count">{unreadNotifications}</span>
              )}
            </button>
          </Stack>
        </Container>
        <NotificationModal
          visible={visibleNotification}
          onClose={onCloseNotification}
        />
      </Navbar>
    </>
  );
}

export default AppNavBar;
