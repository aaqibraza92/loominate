import { Avatar } from "antd";
import moment from "moment";
import { useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import Notification from "../../models/notification.model";
import Post from "../../models/post.model";
import ButtonGradient from "../button/ButtonGradient";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  data?: Notification;
}
/**
 * NotificationItem Component
 * @param {Props} props
 * @returns {JSX.Element}
 */
function NotificationItem(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { data } = props;
  const [post, setPost] = useState<Post>(data);
  const [isViewDetail, setIsViewDetail] = useState(false);
  const [notification, setNotification] = useState<Notification>({ ...data });
  console.log("noti data in noit", notification.notificationData)
  let payload =notification?.notificationData!
  const notificationPayload  = JSON.parse(payload);
  console.log("parsed payload:", notificationPayload)
  const getActionPerfromed = (type : string) =>{
    switch(type){
      case 'DOWNVOTE':
        return 'downvoted';
      case 'UPVOTE':
        return 'upvoted';
      case 'COMMENT':
        return 'commented';
      case 'REPORT':
        return 'reported'

    }
  }
  // const onGoPostDetail = () => {
  //   // e.stopPropagation()
  //     history.push(routes.PostPage);
  // };

  const onGoPostDetail = () => {
    if (post.id && !isViewDetail) {
      let tempUrl = post.title?.replace(/ /g, "_");
      history.push(routes.PostPage.replace(":id", post.id + "/" + tempUrl));
    }
  };

  return (
    <div>
      <div className="notification-item" onClick={onGoPostDetail}>
        <Stack
          direction="horizontal"
          className="align-items-start mb-2"
          gap={2}
        >
          <Avatar
            src={
              notificationPayload.sender?.avatarLink || images.AVATAR_KEYS[notification.sender?.avatar || "avatar1"]
            }
          />
          <Stack onClick={()=>onGoPostDetail()}>
            <Stack direction="horizontal" className="align-items-start">
              <p>
                {/* <span>23 users </span> */}
                <b>{notificationPayload.sender?.userName} </b>
                {getActionPerfromed(notificationPayload.payload.actionType)+"   on your  "+ notificationPayload.payload.actionOn}
              </p>
              <label className="text-time ms-auto">
                {moment(notification.creationDate).fromNow()}
              </label>
            </Stack>
            {notificationPayload.payload.karmaPoints && (
              <p
                className={`text-point ${
                  notificationPayload.payload.karmaPoints > 0 ? "text-add" : "text-sub"
                }`}
              >
                {notificationPayload.payload.karmaPoints > 0 ? "+" : "-"}{notificationPayload.payload.karmaPoints} Karma
                Point
              </p>
            )}
          </Stack>
        </Stack>

        {notificationPayload.payload.contentTitle && <p className="text-message">{notificationPayload.payload.contentTitle}</p>}
        {/* <div className="d-grid mt-2">
        <Button variant="primary">Accept</Button>
        <Button variant="primary" className="accepted-btn mt-2">Accepted</Button>
        </div> */}
      </div>
    </div>
  );
}

export default NotificationItem;
