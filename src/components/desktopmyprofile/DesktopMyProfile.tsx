import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  Nav,
  Row,
  Stack,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import IconFeed from "../../assets/images/IconFeed";
import IconInitiatives from "../../assets/images/IconInitiatives";
import IconLeaderboard from "../../assets/images/IconLeaderboard";
import images from "../../assets/images/images";
import { flagFeedUpdate, karmaPoints } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import User from "../../models/user.model";
import userService from "../../services/user.service";
import IcoMoon from "../icon/IcoMoon";
import InputSearch from "../input/InputSearch";
import EditProfileModal from "../user/EditProfileModal";
import "./styles.scss";

const DesktopMyProfile = () => {
  const [dialogGuide, setDialogGuide] = useState(false);
  const user: User = useSelector((state: any) => state.auth.user);
  const [dialogEditProfile, setDialogEditProfile] = useState(false);
  const openEditProfile = async (info: any) => {
    setDialogEditProfile(true);
  };
  const closeEditProfile = async (info: any) => {
    setDialogEditProfile(false);
  };
  const history = useHistory();
  const [countPost, setCountPost] = useState();
  const [countPoll, setCountPoll] = useState();
  const [countIni, setCountIni] = useState()
  const [flag_feed, setFlag_feed] = useRecoilState(flagFeedUpdate);
  const [karmaPointsState, setKarmaPointsState] = useRecoilState<any>(karmaPoints)
 
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let avatar_key = user.avatarLink;
  const dateConverstion = (date: any) => {
    console.log("user from dektop profile", user);
    var temp_date = date.split("-");
    return (
      temp_date[2] + " " + months[Number(temp_date[1]) - 1] + " " + temp_date[0]
    );
  };

  const onProfileView = () => {
    // console.log('insideOnProfileViewPage', post.user?.userName!)
    // if (!!post?.user?.id && !post.isAnonymous) {
      history.push(routes.ViewProfilePage.replace(":id", user?.id+'/'+user.userName!));
    // }
  };

  const getCount = async () => {
    let tenantName: any = localStorage.getItem('tenantName');
    // let user_rs: any = await userService.getUser(tenantName, user.userName);
    let count_feed: any = await userService.getCountPosts(tenantName, user?.id);
    console.log('count result in profile', count_feed)
    setCountPost(count_feed.Post)
    setCountPoll(count_feed.Poll)
    setCountIni(count_feed.Initiative)
    let user_rs: any = await userService.getUser(tenantName, user.userName)
    // if(user.karmaPoints == karmaPointsState || karmaPointsState == 0 || karmaPointsState == null){
      console.log('siginInKarma', user.karmaPoints)
    setKarmaPointsState(user_rs.karmaPoints)
  // }
}

  useEffect(() => {
    getCount()
  }, [])

  useEffect(() => {
    getCount()
  }, [flag_feed])
  
  return (
    <div className="white-box mb-5">
      <h5>MY PROFILE</h5>
      <div className="profile-sec">
        <Stack className="my-3" direction="horizontal" gap={3}>
          <div className="profile-persona" onClick={openEditProfile}>
            <img
              src={
                user.avatarLink || images.AVATAR_KEYS[user?.avatar || "avatar1"]
              }
              alt="Avatar"
              className="profile-img"
            />
            <button className="btn btn-edit">
              <IcoMoon icon="edit" color={colors.primary} />
            </button>
          </div>
          <div>
            <h4 className="m-0" onClick={onProfileView}>{user.userName}</h4>
            <span className="small">
              Joined {moment(user.creationDate).format("MMMM YYYY")}
            </span>
          </div>
        </Stack>
        <p className="profile-text mb-0">{user.aboutMe}</p>
        <Stack
          className="text-center profile-box"
          direction="horizontal"
          gap={3}
        >
          <div className="kpoints">
            <strong>{karmaPointsState > 0 && karmaPointsState}</strong>
            <br />
            <span className="small">Karma Points</span>
          </div>
          <Stack className="stats" direction="horizontal" gap={3}>
            <div>
              {/* <strong>{user.count_posts == null ? 0 : user.count_posts}</strong> */}
              <strong>{countPost ? countPost : 0}</strong>

              <br />
              <span className="small">Posts</span>
            </div>
            <div>
              {/* <strong>{user.count_polls == null ? 0 : user.count_polls}</strong>
               */}

              <strong>{countPoll ? countPoll : 0}</strong>

              <br />
              <span className="small">Polls</span>
            </div>
            <div>
              {/* <strong>{user.count_initiatives == null ? 0 : user.count_initiatives}</strong>
               */}
              <strong>{countIni ? countIni : 0}</strong>
               
              <br />
              <span className="small">Initiatives</span>
            </div>
          </Stack>
        </Stack>
      </div>

      {dialogEditProfile && (
        <EditProfileModal
          visible={dialogEditProfile}
          onClose={closeEditProfile}
        />
      )}
    </div>
  );
};

export default DesktopMyProfile;
