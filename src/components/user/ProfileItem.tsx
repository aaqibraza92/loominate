import { Avatar, Dropdown, Menu, message, notification } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ReactComponent as IconMore } from "../../assets/icons/more.svg";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import Report from "../../models/report.model";
import User, { UserRole, UserView } from "../../models/user.model";
import reportService from "../../services/report.service";
import userService from "../../services/user.service";
import IcoMoon from "../icon/IcoMoon";
import ModalConfirm, { ModalConfirmType } from "../modal/ModalConfirm";
import MuteUserSheet from "../report/MuteUserSheet";
import ReportUserSheet from "../report/ReportUserSheet";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  data?: User;
  onPostDeleted?: any;
  key?: any;
  report?: Report;
  view?: UserView;
  onStatusChange?: any;
}

/**
 * ProfileItem
 * @param props
 * @returns JSX.Element
 */
function ProfileItem(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { data, view, report, onStatusChange } = props;
  const user: User = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | undefined>(data);
  const [dialogReport, setDialogReport] = useState(false);
  const [dialogBlock, setDialogBlock] = useState(false);
  const [dialogDeleteUser, setDialogDeleteUser] = useState(false);
  const [dialogMute, setDialogMute] = useState(false);
  const [blockRequesting, setBlockRequesting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hidden, setHidden] = useState(false);

  // useEffect(() => {
  //   const getProfile = async () => {
  //     try {
  //       const rs = await userService.getUser(id);
  //       setProfile(rs.user);
  //     } catch (error) {}
  //     setLoading(false);
  //   };
  //   getProfile();
  // }, []);

  useEffect(() => {
    setIsAdmin(user?.role === UserRole.ADMIN);
  }, [user]);

  const onGoChat = () => {
    history.push(routes.MessageDetailPage.replace(":id", profile?.id || ""));
  };

  const onBlockUser = () => {
    setDialogBlock(true);
  };

  const handleBlockUser = async () => {
    setDialogBlock(false);
    try {
      if (profile?.is_blocked) {
        await userService.unblockUser(profile?.id);
        if (profile) {
          profile.is_blocked = false;
          setProfile({ ...profile });
        }
        message.success({
          content: <label className="message">User Unblocked</label>,
          icon: (
            <IcoMoon icon="profile" className="icon" color="#fff" size={18} />
          ),
          duration: 2,
          className: "top-message",
        });
      } else {
        await userService.blockUser(profile?.id);
        if (profile) {
          profile.is_blocked = true;
          setProfile({ ...profile });
        }
        message.success({
          content: <label className="message">User Blocked</label>,
          icon: (
            <IcoMoon icon="profile" className="icon" color="#fff" size={18} />
          ),
          duration: 2,
          className: "top-message",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onReportUser = () => {
    setDialogReport(true);
  };

  const onReportClose = () => {
    setDialogReport(false);
  };

  const onMuteUser = () => {
    setDialogMute(true);
  };

  const onMuteClose = () => {
    setDialogMute(false);
  };

  const onRemoveUser = () => {
    setDialogDeleteUser(true);
  };

  const handleRemoveUser = async () => {
    try {
      await userService.removeUser(profile?.id);
      message.success({
        content: <label className="message">User Removed</label>,
        icon: (
          <IcoMoon icon="profile" className="icon" color="#fff" size={18} />
        ),
        duration: 0,
        className: "top-message",
      });
      setProfile(undefined);
    } catch (error: any) {
      console.log(error);

      notification.error({
        key: `${Date.now()}`,
        message: error,
      });
    }
    setDialogDeleteUser(false);
  };

  /**
   * Menu Component
   */
  const menu = !isAdmin ? (
    <Menu key={`menu`} className="profile-detail-menu">
      <Menu.Item key="view-profile">
        <button className="btn btn-menu" onClick={onBlockUser}>
          {profile?.is_blocked ? "Unblock User" : "Block User"}
        </button>
      </Menu.Item>
      <Menu.Item key="report">
        <button className="btn btn-menu btn-dg" onClick={onReportUser}>
          Report user
        </button>
      </Menu.Item>
    </Menu>
  ) : (
    <Menu key={`menu`} className="profile-detail-menu">
      <Menu.Item key="view-profile">
        <button className="btn btn-menu" onClick={onMuteUser}>
          Mute user
        </button>
      </Menu.Item>
      <Menu.Item key="report">
        <button className="btn btn-menu btn-dg" onClick={onRemoveUser}>
          Remove user
        </button>
      </Menu.Item>
    </Menu>
  );

  const onProfileView = () => {
    if (!!profile?.id) {
      history.push(routes.ViewProfilePage.replace(":id", profile?.id));
    }
  };

  const onProfileReported = () => {
    if (!!report?.user) {
      history.push(
        routes.ViewProfilePage.replace(":id", report.user?.id || "")
      );
    }
  };

  const updateReported = async (isHide: boolean) => {
    if (!report && view !== UserView.report) return;
    try {
      console.log(report);

      const data = {
        id: report?.id,
        approve: !isHide,
        hidden: isHide,
      };
      await reportService.updateUserReported(data);
      setHidden(true);
      if (onStatusChange) onStatusChange(report?.report_user);
      notification.success({
        key: `${Date.now()}`,
        message: isHide ? "Hidden Success" : "Approved Success",
        duration: 2,
      });
    } catch (error) {}
  };

  const republish = async () => {
    if (!report && view !== UserView.hidden) return;
    try {
      await reportService.republishUser(profile?.id);
      setHidden(true);
      notification.success({
        key: `${Date.now()}`,
        message: "Republished!",
        duration: 2,
      });
    } catch (error) {}
  };

  const updateMute = async (isHide: boolean) => {
    if (view !== UserView.mute) return;
    try {
      const data = {
        id: profile?.id,
        unmuted: !isHide,
        hidden: isHide,
      };
      await reportService.updateMuteUser(data);
      setHidden(true);
      notification.success({
        key: `${Date.now()}`,
        message: isHide ? "Hidden Success" : "Unmute Success",
        duration: 2,
      });
    } catch (error) {}
  };

  if (hidden) return <></>;

  return (
    <div className="profile-item">
        <div>
          {view === UserView.report && (
            <div className="post-box-report">
              <Stack
                direction="horizontal"
                gap={2}
                className="align-items-center mb-2 mt-2"
              >
                <div onClick={onProfileReported}>
                  <Avatar
                    src={
                      report?.user?.avatarLink ||
                      images.AVATAR_KEYS[user?.avatar || "avatar1"]
                    }
                  />
                </div>
                <label className="text-user" onClick={onProfileReported}>
                  {report?.user?.username} reported this user
                </label>
                <div className="ms-auto">
                  <IcoMoon icon="time" /> {moment(user.created_at).fromNow()}
                </div>
              </Stack>
            </div>
          )}
          <Stack className="v-profile-info" gap={3}>
            <Stack direction="horizontal" gap={2}>
              <Avatar
                src={
                  profile?.avatarLink ||
                  images.AVATAR_KEYS[profile?.avatar || "avatar1"]
                }
                size="large"
                className="v-avatar"
              />
              <div className="flex-fill">
                <h3 className="text-username">{profile?.username}</h3>
                <p className="text-join">
                  Joined on {moment(profile?.created_at).format("LL")}
                </p>
              </div>
              <Button className="btn-chat" onClick={onGoChat}>
                <IcoMoon icon="sms" size={20} color="#fff" />
              </Button>
              {!view && (
                <Dropdown
                  overlay={menu}
                  placement="bottomRight"
                  className="ms-auto"
                  trigger={["click"]}
                >
                  <button className="btn">
                    <IconMore />
                  </button>
                </Dropdown>
              )}
            </Stack>
            {profile?.description && (
              <p className="text-description">{profile?.description}</p>
            )}
            {!!view && (
              <Stack className="align-items-start">
                <button className="btn btn-view-full" onClick={onProfileView}>
                  View full profile
                </button>
              </Stack>
            )}
            <Stack direction="horizontal" className="box-statistic" gap={3}>
              <div className="box-point">
                <p className="text text-point">{profile?.points}</p>
                <p className="text">Karma Points</p>
              </div>
              <Stack
                direction="horizontal"
                gap={2}
                className="box-count flex-fill align-items-content"
              >
                <div className="flex-fill">
                  <p className="text text-number">
                    {profile?.count_posts || "0"}
                  </p>
                  <p className="text">Posts</p>
                </div>
                <div className="flex-fill">
                  <p className="text text-number">
                    {profile?.count_polls || "0"}
                  </p>
                  <p className="text">Polls</p>
                </div>
                <div className="flex-fill">
                  <p className="text text-number">
                    {profile?.count_initiatives || "0"}
                  </p>
                  <p className="text">Initiatives</p>
                </div>
              </Stack>
            </Stack>
          </Stack>
          {view === UserView.report && (
            <div className="user-box-report">
              <Stack>
                <span className="text-reason">Reason:</span>
                <span className="text-content">{report?.why}</span>
              </Stack>
              <Stack direction="horizontal" gap={2} className="mt-3">
                <button
                  className="btn flex-fill btn-approve"
                  onClick={updateReported.bind(null, false)}
                >
                  Approve User
                </button>
                <button
                  className="btn flex-fill btn-hidden"
                  onClick={updateReported.bind(null, true)}
                >
                  Hide User
                </button>
              </Stack>
            </div>
          )}
          {view === UserView.hidden && (
            <div className="post-box-report">
              {!!profile?.why_hidden && (
                <Stack>
                  <span className="text-reason">Reason:</span>
                  <span className="text-content">{profile?.why_hidden}</span>
                </Stack>
              )}
              <Stack direction="horizontal" gap={2} className="mt-3">
                <button
                  className="btn flex-fill btn-approve"
                  onClick={republish}
                >
                  Republish User
                </button>
              </Stack>
            </div>
          )}
          {view === UserView.mute && (
            <div className="user-box-report">
              <Stack>
                <span className="text-reason">Reason:</span>
                <span className="text-content">{profile?.why_muted}</span>
              </Stack>
              <Stack direction="horizontal" gap={2} className="mt-3">
                <button
                  className="btn flex-fill btn-approve"
                  onClick={updateMute.bind(null, false)}
                >
                  Unmute User
                </button>
                <button
                  className="btn flex-fill btn-hidden"
                  onClick={updateMute.bind(null, true)}
                >
                  Hide User
                </button>
              </Stack>
            </div>
          )}
        </div>

      {dialogReport && (
        <ReportUserSheet
          open={dialogReport}
          onClose={onReportClose}
          data={profile}
        />
      )}
      {dialogMute && <MuteUserSheet open={dialogMute} onClose={onMuteClose} />}
      <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogBlock}
        message="Are you sure you want to block this user? To unblock, please go to
        Menu > Blocked Users."
        okText="Yes, I’m sure"
        onCancel={() => {
          setDialogBlock(false);
        }}
        onOk={handleBlockUser}
      />
      <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogDeleteUser}
        message="Are you sure you want to remove this user?"
        okText="Yes, I’m sure"
        onCancel={() => {
          setDialogDeleteUser(false);
        }}
        onOk={handleRemoveUser}
      />
    </div>
  );
}

export default ProfileItem;
