import { Avatar, Modal, ModalProps } from "antd";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import images from "../../assets/images/images";
import { feedFilter, karmaPoints } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import { PostView } from "../../models/post.model";
import User, { UserRole, UserView } from "../../models/user.model";
import authAction from "../../redux/actions/auth.action";
import IcoMoon from "../icon/IcoMoon";
import ModalConfirm from "../modal/ModalConfirm";
import "./styles.scss";

interface Props extends ModalProps {
  visible?: boolean;
  loading?: boolean;
  onClose?: any;
  onMenuClick?: any;
}

const MENU_KEYS = {
  feed: "feed",
  dashboard: "dashboard",
  leaderboard: "leaderboard",
  initiatives: "initiatives",
  peers: "peers",
  contentInReview: "contentInReview",
  blocked: "blocked",
  settings: "settings",
  help: "help",
  reportedUsers: "reportedUsers",
  mutedUsers: "mutedUsers",
  removedUsers: "removedUsers",
  invitePeers: "peers",
};

const MENUS = [
  {
    key: "dashboard",
    icon: "initiative",
    text: "REPORTS",
    navigate: routes.DashboardPage,
    role: UserRole.ADMIN,
  },
  {
    key: "feed",
    icon: "feed",
    text: "FEED",
    navigate: {name: 'All', value: 'All'},

  },
  {
    key: "leaderboard",
    icon: "leaderboard",
    text: "LEADERBOARD",
    navigate: routes.LeaderBoardPage,
  },
  {
    key: "initiatives",
    icon: "initiatives",
    text: "INITIATIVES",
    navigate: {name: 'Initiatives', value: 'Initiative'},
    // role: UserRole.USER,
  },
  // {
  //   key: "profile",
  //   icon: "profile",
  //   text: "PROFILE",
  //   navigate: routes.ProfilePage,
  //   role: UserRole.ADMIN,
  // },
  {
    key: "peers",
    icon: "peers",
    text: "INVITE PEERS",
    navigate: routes.InvitePeersPage,
    role: UserRole.USER,
  },
  {
    key: "contentInReview",
    icon: "label",
    text: "CONTENT IN REVIEW",
    navigate: routes.ContentInReviewPage,
    role: UserRole.USER,
  },
  {
    key: "reportedUsers",
    icon: "peers",
    text: "REPORTED USERS",
    navigate: `${routes.UserManagementPage}?view=${UserView.report}`,
    role: UserRole.ADMIN,
  },
  {
    key: "mutedUsers",
    text: "MUTED USERS",
    navigate: `${routes.UserManagementPage}?view=${UserView.mute}`,
    role: UserRole.ADMIN,
  },
  {
    key: "removedUsers",
    text: "REMOVED USERS",
    navigate: `${routes.UserManagementPage}?view=${UserView.hidden}`,
    role: UserRole.ADMIN,
  },
  {
    key: "reportedContent",
    icon: "label",
    text: "REPORTED CONTENT",
    navigate: `${routes.PostManagementPage}?view=${PostView.report}`,
    role: UserRole.ADMIN,
  },
  {
    key: "hiddenContent",
    text: "HIDDEN CONTENT",
    navigate: `${routes.PostManagementPage}?view=${PostView.hidden}`,
    role: UserRole.ADMIN,
  },
  {
    key: "contentInReview",
    text: "CONTENT IN REVIEW",
    navigate: `${routes.PostManagementPage}?view=${PostView.review}`,
    role: UserRole.ADMIN,
  },
  {
    key: "blocked",
    icon: "close",
    text: "BLOCKED USERS",
    navigate: routes.BlockedUsersPage,
    role: UserRole.USER,
  },
  {
    key: "settings",
    icon: "settings",
    text: "SETTINGS",
    navigate: routes.SettingsPage,
  },
  {
    key: "help",
    icon: "help",
    text: "HELP & SUPPORT",
  },
  {
    key: "logout",
    icon: "logout",
    text: "LOG OUT",
  },
];

/**
 * ModalConfirm Component
 * @param { Props} props
 * @returns JSX.Element
 */
function MenuModal(props: Props) {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { visible, onClose, onMenuClick } = props;
  const [isVisible, setIsVisible] = useState(visible);
  const [activeIndex, setActiveIndex] = useState<string>();
  const user: User = useSelector((state: any) => state.auth.user);
  const { poolData } = useSelector((state: any) => state.auth);
  const [dialogComingSoon, setDialogComingSoon] = useState(false);
  const [feedFilterState, setFeedFilter] = useRecoilState(feedFilter);
  const [karmaPointsState, setKarmaPoints] = useRecoilState(karmaPoints)

  useEffect(() => {
    switch (location.pathname) {
      case routes.HomePage:
        setActiveIndex(MENU_KEYS.feed);
        break;
      case routes.DashboardPage:
        setActiveIndex(MENU_KEYS.dashboard);
        break;
      case routes.LeaderBoardPage:
        setActiveIndex(MENU_KEYS.leaderboard);
        break;
      case routes.InitiativesPage:
        setActiveIndex(MENU_KEYS.initiatives);
        break;
      case routes.SettingsPage:
        setActiveIndex(MENU_KEYS.settings);
        break;
      case routes.ContentInReviewPage:
        setActiveIndex(MENU_KEYS.contentInReview);
        break;
      case routes.InvitePeersPage:
        setActiveIndex(MENU_KEYS.invitePeers);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleOk = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  const onMenuClickFunction = (filter: any) => {
    const tenantName: any = localStorage.getItem('tenantName')
      history.push(routes.HomePage.replace(":tenant", tenantName));
    setFeedFilter(filter)
    // setWakeUpHashtagSearch(!wakeUpHashtagSearch) 
  }

  const handleMenuClick = (menu: any) => {
    switch (menu.key) {
      case "feed":
        onMenuClickFunction(menu.navigate)
        handleClose();
        break;
      case "leaderboard":
      case "initiatives": 
        onMenuClickFunction(menu.navigate)
        handleClose();
        break;
      case "dashboard":
      case "blocked":
      case "settings":
      case "profile":
      case "contentInReview":
      case "reportedContent":
      case "hiddenContent":
      case "reportedUsers":
      case "mutedUsers":
      case "removedUsers":
      case "peers":
        handleClose();
        setTimeout(() => {
          history.push(menu.navigate);
        }, 500);
        break;
      case "logout":
          setKarmaPoints(0)
          console.log('inside logout of mobile')
          const tenantName: any = localStorage.getItem('tenantName')
          history.push(routes.HomePage.replace(":tenant", tenantName));
          dispatch(authAction.Logout(poolData));  
          handleClose();
        break;
      case "help":
        handleClose();
        if (onMenuClick) onMenuClick(menu);
        break;
      default:
        setDialogComingSoon(true);
        break;
    }
  };

  const onGoProfile = () => {
    handleClose();
    setTimeout(() => {
      history.push(routes.ViewProfilePage.replace(":id", user?.id+'/'+user?.userName!));
    }, 500);
  };

  return (
    <Modal
      className="menu-modal"
      visible={isVisible}
      centered
      footer={null}
      afterClose={onClose}
      onCancel={handleClose}
    >
      <Stack direction="horizontal" gap={2} className="mb-3">
        <Avatar
          src={
            user?.avatarLink ||
            images.AVATAR_KEYS[user?.avatar || "avatar1"]
          }
          size={48}
        />
        <Stack className="align-items-start" gap={1}>
          <span className="text-username">{user?.userName}</span>
          <button className="btn btn-profile" onClick={onGoProfile}>
            My profile <IcoMoon icon="chevron_right" color={colors.primary} />
          </button>
        </Stack>
      </Stack>

      <Stack direction="vertical" gap={2}>
        {MENUS.map((item, index) =>
          !item.role || (item.role && item.role === user?.role) ? (
            <div key={item.key}>
              <button
                className={`btn btn-menu ${
                  activeIndex === item.key && "active"
                }`}
                onClick={handleMenuClick.bind(null, item)}
              >
                {typeof item.icon === "string" ? (
                  <IcoMoon
                    icon={item.icon}
                    color={activeIndex === item.key ? colors.mint : ""}
                  />
                ) : (
                  item.icon
                )}{" "}
                {!item.icon && <label style={{ paddingLeft: 28 }}></label>}
                {item.text}
              </button>
            </div>
          ) : (
            <></>
          )
        )}
      </Stack>
      <ModalConfirm
        visible={dialogComingSoon}
        message="Coming soon"
        cancelText={null}
        onOk={() => {
          setDialogComingSoon(false);
        }}
      />
    </Modal>
  );
}

export default MenuModal;
