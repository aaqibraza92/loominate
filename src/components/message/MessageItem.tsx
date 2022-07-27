import { LinkPreview } from "@dhaiwat10/react-link-preview";
import { Avatar, Image } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import Linkify from "react-linkify";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import Message from "../../models/message.model";
import User from "../../models/user.model";
import utils from "../../utils";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  data?: Message;
}
/**
 * MessageItem Component
 * @param {Props} props
 * @returns {JSX.Element}
 */
function MessageItem(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const { data } = props;
  const [message, setMessage] = useState<Message>({ ...data });
  const [sender, setSender] = useState<User>({ ...message.sender });
  const [isSend, setIsSend] = useState(user.id === sender.id);
  const [link, setLink] = useState<string>("");

  useEffect(() => {
    if (message) {
      const matches: any = message?.message?.match(/\bhttps?:\/\/\S+/gi);
      if (matches?.length > 0) {
        setLink(matches[0]);
      }
      console.log('message in messageitem', message)
    }
  }, [message]);

  return (
    <Stack className={`message-item ${message.sender != user.id || message.receiver != user.id && "is-send"}`}>
      <Stack className={`box-message align-items-${message.sender == user.id || message.receiver == user.id ? "end" : "start"}`}>
        {!!message?.image && (
          <Image
            src={message?.image}
            height={"200px"}
            className="mb-2 box-image"
          />
        )}
        {!!link && !message?.image && (
          <LinkPreview url={utils.parseURL(link)} width="80.5vw" />
        )}
        {message.body && (
          <span>
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a target="blank" href={decoratedHref} key={key}>
                  {decoratedText}
                </a>
              )}
            >
              {message.body}
            </Linkify>
          </span>
        )}
      </Stack>
      <Stack
        direction="horizontal"
        className={`flex-fill mt-2 mb-2 box-info`}
        gap={1}
      >
        {sender.id !== user.id && (
          <Avatar
            src={
              sender.avatarLink ||
              images.AVATAR_KEYS[sender.avatar || "avatar1"]
            }
          />
        )}
        {sender.id === user.id && (
          <Avatar
            src={
              user.avatarLink ||
              images.AVATAR_KEYS[user?.avatar || "avatar1"]
            }
          />
        )}
        <label>{moment(message.modifiedDate).format("LLL")}</label>
      </Stack>
    </Stack>
  );
}

export default MessageItem;
