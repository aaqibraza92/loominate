import { Avatar, message } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import Report from "../../models/report.model";
import User, { UserRole } from "../../models/user.model";
import userService from "../../services/user.service";
import IcoMoon from "../icon/IcoMoon";
import ModalConfirm, { ModalConfirmType } from "../modal/ModalConfirm";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  data?: User;
  onPostDeleted?: any;
  key?: any;
  report?: Report;
}

/**
 * BlockedUserItem
 * @param props
 * @returns JSX.Element
 */
function BlockedUserItem(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { data } = props;
  const user: User = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | undefined>(data);
  const [dialogReport, setDialogReport] = useState(false);
  const [dialogBlock, setDialogBlock] = useState(false);
  const [dialogDeleteUser, setDialogDeleteUser] = useState(false);
  const [dialogMute, setDialogMute] = useState(false);
  const [blockRequesting, setBlockRequesting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
      // if (profile?.is_blocked) {
        await userService.unblockUser(profile?.id);
        if (profile) {
          profile.isBlocked = false;
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
      // } else {
      //   await userService.blockUser(profile?.id);
      //   if (profile) {
      //     profile.is_blocked = true;
      //     setProfile({ ...profile });
      //   }
      //   message.success({
      //     content: <label className="message">User Blocked</label>,
      //     icon: (
      //       <IcoMoon icon="profile" className="icon" color="#fff" size={18} />
      //     ),
      //     duration: 2,
      //     className: "top-message",
      //   });
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const onProfileView = () => {
    if (!!profile?.id) {
      history.push(routes.ViewProfilePage.replace(":id", profile.id));
    }
  };

  return (
    <>
      <div className="blocked-user-item">
        {profile && (
          <Stack direction="horizontal" gap={2}>
            <Avatar
              src={
                profile?.avatarLink ||
                images.AVATAR_KEYS[profile?.avatar || "avatar1"]
              }
              size={50}
              className="v-avatar"
            />
            <div className="flex-fill">
              <h3 className="text-username">{profile.userName}</h3>
              <button className="btn btn-profile" onClick={onProfileView}>
                View profile{" "}
                <IcoMoon icon="chevron_right" color={colors.mint} size={20} />{" "}
              </button>
            </div>
            <Button className="btn btn-unblock" onClick={onBlockUser}>
              UNBLOCK
            </Button>
          </Stack>
        )}
      </div>
      <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogBlock}
        message={`Are you sure you want to unblock this user?`}
        okText="Yes, I’m sure"
        onCancel={() => {
          setDialogBlock(false);
        }}
        onOk={handleBlockUser}
      />
    </>
  );
}

export default BlockedUserItem;
