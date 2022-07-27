import { Popover } from "antd";
import { useEffect, useState } from "react";
import { Container, Modal, Navbar, Stack } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";
import { feedFilter } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import storageKeys from "../../commons/constants/storageKeys.constant";
import colors from "../../commons/styles/colors";
import { PostType } from "../../models/post.model";
import User, { UserRole } from "../../models/user.model";
import { setAuthorization } from "../../services";
import localStorage from "../../utils/localStorage";
import IcoMoon from "../icon/IcoMoon";
import MenuModal from "../menu/MenuModal";
import ModalConfirm, { ModalConfirmType } from "../modal/ModalConfirm";
import ActionSheetPost from "../post/ActionSheetPost";
import HelpSupportSheet from "../support/HelpSupportSheet";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  type?: any;
  active?: "home" | "board" | "initiatives" | "menu" | "dashboard";
  myClass?: any;
}

/**
 * BottomNavBar Component
 * @param props
 * @returns JSX.Element
 */
function BottomNavBar(props: Props) {
  const history = useHistory();
  const { containerStyle, active = null,myClass } = props;
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const { create: postCreated } = useSelector((state: any) => state.post);
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [visiblePost, setVisiblePost] = useState(false);
  const [visiblePoll, setVisiblePoll] = useState(false);
  const [visibleInitiative, setVisibleInitiative] = useState(false);
  const [visibleSideMenu, setVisibleSiteMenu] = useState(false);
  const [dialogMute, setDialogMute] = useState(false);
  const [color, setColor] = useState(
    user?.role === UserRole.ADMIN ? colors.primary : colors.mint
  );
  const [visibleSupport, setVisibleSupport] = useState(false);
  const [feedFilterState, setFeedFilter] = useRecoilState(feedFilter);

  useEffect(() => {
    const token = localStorage.getValue(storageKeys.ACCESS_TOKEN);
    console.log("TOKEN", token);
    if (token) {
      setAuthorization(token);
    }
  }, []);

  useEffect(() => {
    setColor(user?.role === UserRole.ADMIN ? colors.primary : colors.mint);
  }, [user]);

  useEffect(() => {
    if (postCreated) {
      onSheetClose();
    }
  }, [postCreated]);

  const onGoHome = () => {
    if (user?.role === UserRole.ADMIN) {
      history.push(routes.DashboardPage);
    } else {
      history.push(routes.HomePage);
    }
  };
  // const onGoInitiatives = () => {
  //   history.push(routes.InitiativesPage);
  // };
  const onMenuClickFunction = (filter: any) => {
    const tenantName: any = localStorage.getValue('tenantName')
    // if(post.postPage){
      history.push(routes.HomePage.replace(":tenant", tenantName));
    // } else{
    //   window.scrollTo(0, 0)
    // }
    setFeedFilter(filter)
    // setWakeUpHashtagSearch(!wakeUpHashtagSearch) 
  }
  const onGoLeaderBoard = () => {
    history.push(routes.LeaderBoardPage);
  };

  /**
   * Handle open actionSheet to create a post
   * @param {PostType} type
   */
  const onVisiblePost = (type: PostType) => {
    if (user.muted) {
      setDialogMute(true);
      return;
    }
    switch (type) {
      case PostType.Post:
        setVisiblePost(true);
        break;
      case PostType.Poll:
        setVisiblePoll(true);
        break;
      case PostType.Initiative:
        setVisibleInitiative(true);
        break;
      default:
        break;
    }
    setVisibleMenu(false);
  };
  const menu = (
    <Stack className="v-menu-center" gap={3}>
      <button
        className="btn flex-fill"
        onClick={onVisiblePost.bind(null, PostType.Post)}
      >
        <div className="v-circle">
          <IcoMoon icon="post" size={24} color="#fff" />
        </div>
        <p>Post</p>
      </button>
      <button
        className="btn flex-fill"
        onClick={onVisiblePost.bind(null, PostType.Initiative)}
      >
        <div className="v-circle">
          <IcoMoon icon="initiative" size={24} color="#fff" />
        </div>
        <p>Initiative</p>
      </button>
      <button
        className="btn flex-fill"
        onClick={onVisiblePost.bind(null, PostType.Poll)}
      >
        <div className="v-circle">
          <IcoMoon icon="poll" size={24} color="#fff" />
        </div>
        <p>Poll</p>
      </button>
    </Stack>
  );
  /**
   * Handle actionSheet close
   */
  const onSheetClose = () => {
    setVisiblePost(false);
    setVisiblePoll(false);
    setVisibleInitiative(false);
  };

  /**
   * Handle display center menu
   * @param { boolean} visible
   */
  const onVisibleMenuChange = (visible: boolean) => {
    setVisibleMenu(visible);
  };

  const onOpenMenuSite = () => {
    setVisibleSiteMenu(true);
  };
  const onCloseMenuSite = () => {
    setVisibleSiteMenu(false);
  };

  const onMenuClick = (menu: any) => {
    if (menu.key == "help") {
      setVisibleSupport(true);
    }
  };

  return (
    <div>
      <Navbar
        bg="light"
        className={`bottom-nav-bar mobile-only ${myClass +
          user?.role === UserRole.ADMIN && "bottom-bar-admin"
        }`}
      >
        <Container style={isMobile ? { padding: 0 } : {}}>
          <Stack direction="horizontal" className="w-100">
            <button
              className={`btn btn-tab flex-fill ${
                user?.role === UserRole.ADMIN
                  ? active === "dashboard" && "active"
                  : active === "home" && "active"
              }`}
              // onClick={user?.role === UserRole.USER ? () => onMenuClick({name: 'All', value: 'All'}) : () => onGoHome}
              onClick={() => onMenuClickFunction({name: 'All', value: 'All'})}
            >
              <IcoMoon
                icon="feed"
                size={24}
                color={
                  (
                    user?.role === UserRole.ADMIN
                      ? active === "dashboard"
                      : active === "home"
                  )
                    ? color
                    : ""
                }
              />
              <p>
                {user?.role === UserRole.ADMIN ? "Dashboard" : "MY FEED"}
              </p>
            </button>
            <button
              className={`btn btn-tab flex-fill ${
                active === "initiatives" && "active"
              }`}
              onClick={() => onMenuClickFunction({name: 'Initiatives', value: 'Initiative'})}
            >
              <IcoMoon
                icon="initiatives"
                size={24}
                color={active === "initiatives" ? color : ""}
              />
              <p>Initiatives</p>
            </button>
            <Popover
              content={menu}
              trigger="click"
              visible={visibleMenu}
              onVisibleChange={onVisibleMenuChange}
            >
              <button className={`btn btn-add`}>
                <IcoMoon icon="plus" size={24} color="#fff" />
              </button>
            </Popover>
            <button
              className={`btn btn-tab flex-fill ${
                active === "board" && "active"
              }`}
              onClick={onGoLeaderBoard}
            >
              <IcoMoon
                icon="leaderboard"
                size={24}
                color={active === "board" ? color : ""}
              />
              <p>Board</p>
            </button>
            <button className="btn btn-tab flex-fill" onClick={onOpenMenuSite}>
              <IcoMoon icon="menu" size={24} />
              <p>Menu</p>
            </button>
          </Stack>
        </Container>
      </Navbar>
      {visiblePost && (
        <Modal show={visiblePost} animation={false}>
          <ActionSheetPost open={visiblePost} onClose={onSheetClose} />
        </Modal>
      )}
      {visiblePoll && (
        <Modal show={visiblePoll} animation={false}>
          <ActionSheetPost
            open={visiblePoll}
            onClose={onSheetClose}
            type={PostType.Poll}
          />
        </Modal>
      )}
      {visibleInitiative && (
        <Modal show={visibleInitiative} animation={false}>
          <ActionSheetPost
            open={visibleInitiative}
            onClose={onSheetClose}
            type={PostType.Initiative}
          />
        </Modal>
      )}
      {/* <ModalConfirm
        visible={!!postCreated}
        message={`${
          postCreated?.post_type === PostType.Poll
            ? "Poll"
            : postCreated?.post_type === PostType.Initiative
            ? "Initiative"
            : "Post"
        } created! You have earned +10 Karma Points`}
        cancelText={null}
        onOk={() => {
          dispatch(postAction.clear());
        }}
      /> */}
      <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogMute}
        message="You are muted!"
        cancelText={null}
        onOk={() => {
          setDialogMute(false);
        }}
      />
      {visibleSideMenu && (
        <MenuModal
          visible={visibleSideMenu}
          onClose={onCloseMenuSite}
          onMenuClick={onMenuClick}
        />
      )}
      {visibleSupport && (
        <HelpSupportSheet
          open={visibleSupport}
          onClose={() => setVisibleSupport(false)}
        />
      )}
    </div>
  );
}

export default BottomNavBar;
