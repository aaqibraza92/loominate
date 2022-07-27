import { LoadingOutlined } from "@ant-design/icons";
import { Avatar, Collapse } from "antd";
import moment from "moment";
import { Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import images from "../../assets/images/images";
import colors from "../../commons/styles/colors";
import IcoMoon from "../../components/icon/IcoMoon";
import CompanyGuideModal from "../../components/modal/CompanyGuideModal";
import BottomNavBar from "../../components/navbar/BottomNavBar";
import EditProfileModal from "../../components/user/EditProfileModal";
import { PostType } from "../../models/post.model";
import User from "../../models/user.model";
import userService from "../../services/user.service";
import "./styles.scss";

const { Panel } = Collapse;

/**
 * Post Detail Page
 * @param props
 * @returns JSX.Element
 */
function ProfilePage(props: any) {
  const params: any = useParams();
  const { id = null } = params;
  const history = useHistory();
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<User>({ ...user });
  const [previewAvatar, setPreviewAvatar] = useState<any>(profile?.avatarLink);
  const [dialogGuide, setDialogGuide] = useState(false);
  const [dialogEditProfile, setDialogEditProfile] = useState(false);
  const [countSelected, setCountSelected] = useState(PostType.Post);

  useEffect(() => {
    setPreviewAvatar(profile?.avatarLink);
  }, [user]);

  const onBack = () => {
    history.goBack();
  };

  // useEffect(() => {
  //   const getProfile = async () => {
  //     setLoading(true);
  //     try {
  //       const rs = await userService.getUser(profile.id);
  //       setProfile(rs.user);
  //     } catch (error) {}
  //     setLoading(false);
  //   };
  //   getProfile();
  // }, []);

  const openEditProfile = async (info: any) => {
    setDialogEditProfile(true);
  };
  const closeEditProfile = async (info: any) => {
    setDialogEditProfile(false);
  };

  const onOpenGuide = () => {
    setDialogGuide(true);
  };
  return (
    <div>
      <div className="m-screen my-profile">
        <Container>
        <Stack className="box-head">
          <div className="bg-sky"></div>
          <Stack className="box-info">
            <Stack direction="horizontal" gap={2}>
              <div className="box-avatar" onClick={openEditProfile}>
                <Avatar
                  src={
                    previewAvatar || user.avatarLink ||
                    images.AVATAR_KEYS[user?.avatar || "avatar1"]
                  }
                  size={100}
                  className="v-avatar"
                />
                {loading && (
                  <div className="box-loading">
                    <LoadingOutlined
                      style={{ fontSize: 30, color: colors.mint }}
                      spin
                    />
                  </div>
                )}
                <button className="btn btn-edit">
                  <IcoMoon icon="edit" color={colors.primary} />
                </button>
              </div>

              <div className="flex-fill">
                <h3 className="text-username">{user.userName}</h3>
                <p className="text-join">
                  Joined on {moment(user.creationDate).format("LL")}
                </p>
              </div>
            </Stack>
            {user?.aboutMe && (
              <p className="text-description">{user.aboutMe}</p>
            )}
          </Stack>
          <Stack
            direction="horizontal"
            className="box-number-count align-self-center"
          >
            <div
              className={`box-item ${
                countSelected === PostType.Post && "box-active"
              }`}
              onClick={() => setCountSelected(PostType.Post)}
            >
              <p className="text-number">{profile.count_posts || "0"}</p>
              <p className="text-title">Posts</p>
            </div>
            <div
              className={`box-item ${
                countSelected === PostType.Poll && "box-active"
              }`}
              onClick={() => setCountSelected(PostType.Poll)}
            >
              <p className="text-number">{profile.count_polls || "0"}</p>
              <p className="text-title">Polls</p>
            </div>
            <div
              className={`box-item ${
                countSelected === PostType.Initiative && "box-active"
              }`}
              onClick={() => setCountSelected(PostType.Initiative)}
            >
              <p className="text-number">{profile.count_initiatives || "0"}</p>
              <p className="text-title">Initiatives</p>
            </div>
          </Stack>
        </Stack>
        <Stack className="box-content">
          <Stack className="align-items-center box-total-post" gap={3}>
            <span>
              <span className="text-mint">Total Upvotes from Posts:</span>{" "}
              {PostType.Poll === countSelected
                ? profile.count_liked_polls
                : PostType.Initiative === countSelected
                ? profile.count_liked_initiatives
                : PostType.Post === countSelected
                ? profile.count_liked_posts
                : ""}{" "}
              Upvotes
            </span>
          </Stack>
          <Collapse
            defaultActiveKey={["1"]}
            expandIconPosition="right"
            className="mt-3"
            expandIcon={({ isActive }) =>
              isActive ? (
                <IcoMoon icon="subtract" color={colors.mint} size={24} />
              ) : (
                <IcoMoon icon="plus" color={colors.mint} size={24} />
              )
            }
          >
            <Panel
              header="Your LOOMI Token Rewards"
              key="1"
              className="box-space-bottom"
            >
              <Stack>
                <p>
                  Did you know that your Karma points can be converted into
                  LOOMI Tokens in 2022? Loominate will be launching its own
                  Token soon. Read more about the LOOMI Tokenomics on our{" "}
                  <a href={"https://www.loominate.org/"} target="_blank">
                    <span className="text-highlight">website</span>
                  </a>
                  .
                </p>
                <Stack
                  direction="horizontal"
                  className="box-number-count align-self-center"
                >
                  <div className="box-item box-first">
                    <p className="text-number">{profile.points || 0}</p>
                    <p className="text-title">Points</p>
                  </div>
                  <div className="box-item">
                    <p className="text-number">0</p>
                    <p className="text-title">Tokens</p>
                  </div>
                </Stack>
              </Stack>
            </Panel>
            <Panel header="Community Guidelines" key="2">
              <p className="text-guide">
                At Loominate, we want to foster a diverse and transparent space
                that gives an equitable voice to every member of our community.
                In order to do this, we need to create an online space where
                every member can feel welcome and free to express their full
                authentic self.
              </p>
              <button className="btn btn-guide" onClick={onOpenGuide}>
                Read more about our Community Guidelines.
              </button>
            </Panel>
          </Collapse>
        </Stack>
        </Container>
      </div>
      <CompanyGuideModal
        visible={dialogGuide}
        onClose={() => setDialogGuide(false)}
      />
      {dialogEditProfile && (
        <EditProfileModal
          visible={dialogEditProfile}
          onClose={closeEditProfile}
        />
      )}
      <div className="mobile-only"><BottomNavBar /></div>
    </div>
  );
}

export default ProfilePage;
