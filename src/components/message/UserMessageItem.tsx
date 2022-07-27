import { UserOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import Chat from "../../models/chat.model";
import User from "../../models/user.model";
import IcoMoon from "../icon/IcoMoon";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  data?: Chat;
  onNewMessage?: any;
  countRate?: any
}
/**
 * MessageItem Component
 * @param {Props} props
 * @returns {JSX.Element}
 */
function UserMessageItem(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { data, onNewMessage, countRate } = props;
  const [chat, setChat] = useState<any>({ ...data });
  const [countSingle, setCountSingle] = useState()
  const [recipient, setRecipient] = useState<User>(
    chat.sender && chat.sender?.id === user.id
      ? { ...chat.recipient }
      : { ...chat.sender }
  );

  useEffect(() => {
    setChat({ ...data });
    console.log('readCount in useritem', data)
    countRate && countRate.map((item: any) => {
      console.log('outside count', item.chatId , chat.chat_id)
      if(item.chatId == chat.chat_id){
        setCountSingle(item.count)
        console.log('inside count', item.count)
      }
    })
  }, [data]);

  // useEffect(() => {
  //   let unsubscribe: any;
  //   if (chat) {
  //     const roomRef = ref(realtimeDB, `rooms/${chat.identifier}`);
  //     const messageRef = query(roomRef, limitToLast(2));
  //     let isFirstLoading = true;
  //     unsubscribe = onChildAdded(messageRef, (snapshot) => {
  //       const data = snapshot.val();
  //       if (typeof data === "object") {
  //         setLastMessage(data);
  //         if (!isFirstLoading && onNewMessage) {
  //           data.roomId = chat.identifier;
  //           onNewMessage(data);
  //         }
  //       } else {
  //         isFirstLoading = false;
  //       }
  //     });
  //   }
  //   return () => {
  //     if (unsubscribe) unsubscribe();
  //   };
  // }, [chat]);

  const onGoDetail = () => {
    history.push(routes.MessageDetailPage.replace(":id", chat?.chat_id || ""));
  };
  return (
    <div className="user-message-item">
      <Stack direction="horizontal" onClick={onGoDetail}>
        <Badge dot color="cyan" offset={[-10, 10]} size="default">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={
              recipient?.avatarLink ||
              images.AVATAR_KEYS[recipient.avatar || "avatar1"]
            }
            className="avatar"
          />
        </Badge>
        <Stack className="flex-fill">
          <h6 className="text-name">{chat?.id1 == user.id ? chat?.userName2 : chat?.userName1}</h6>
          <p className="text-message">
            {chat.msg_body || "not available"}
          </p>
        </Stack>
        <Stack className="align-items-end box-info">
          {!!countRate && (
            <span className="text-badge">{countSingle}</span>
          )} 
          <p className="text-time mt-auto">
            <IcoMoon icon="double-check" color={colors.primary} />{" "}
            {moment(chat.msg_deliveryTime).format("H:m a")}
          </p>
        </Stack>
      </Stack>
    </div>
  );
}

export default UserMessageItem;
