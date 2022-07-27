import { LoadingOutlined } from "@ant-design/icons";
import { Image, Input, Upload } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext } from "../../App";
import chatService from "../../services/chat.service";
import IcoMoon from "../icon/IcoMoon";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  recipientId?: string;
  data?: any;
  onSent?: any;
}

const dataDefault: any = {
  message: "",
  message_type: 0,
  image: null,
};

/**
 * MessageBottomBar Component
 * @param {Props} props
 * @returns {JSX.Element}
 */
function MessageBottomBar(props: Props) {
  const dispatch = useDispatch();
  const { recipientId, onSent } = props;
  const { user = {} } = useSelector((state: any) => state.auth);
  const {} = useSelector((state: any) => state.comment);
  const socket = useRef<WebSocket | null>(null);
  const theme = useContext(ThemeContext);

  // const [comment, setComment] = useState<Comment>({
  //   post_id: postId,
  //   ...commentDefault,
  // });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const [dataRequest, setDataRequest] = useState({
    ...dataDefault,
  });

  useEffect(() => {
    if (user) {
    }
  }, [user]);

  const onDataChange = (e: any) => {
    setDataRequest({
      ...dataRequest,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle file change
   * @param {any} FileInfo
   */
  const handleFileChange = (info: any) => {
    if (!info.file) return;
    const file = info.file.originFileObj;
    setPreviewImage(URL.createObjectURL(file));
    setDataRequest({
      ...dataRequest,
      image: file,
    });
  };

  const removeImage = () => {
    setPreviewImage(undefined);
    setDataRequest({
      ...dataRequest,
      image: null,
    });
  };

  const onSend = async () => {
    setLoading(true);
    // if (recipientId) {
      // if (dataRequest.image) {
        dataRequest.message_type = 1;
      // }
      const messageData = { ...dataRequest };
      setDataRequest({ ...dataDefault });
      setPreviewImage(undefined);
      console.log('datarequest in msg onsend', dataRequest.message)
      const tenantName = localStorage.getItem('tenantName')
      let socketCurrent: any = localStorage.getItem('socketUser')
      socketCurrent = JSON.parse(socketCurrent);
      console.log('socketCurrent in Bottombar', theme)
      // theme.send(JSON.stringify({"action": "setPrivate", "tenantname": tenantName, "from": 2, "to": 3, "body": dataRequest.message , "chatId": 5}));
      
      // try {
      //   chatService.sendMessage(recipientId, messageData).then(() => {
      //     if (onSent) onSent();
      //   });
      // } catch (error) {
      //   setDataRequest({ ...messageData });
      //   if (dataRequest.image) {
      //     setPreviewImage(URL.createObjectURL(dataRequest.image));
      //   }
      // }
    // }
    setLoading(false);
  };

  return (
    <div className="message-bottom-bar">
      <div>
        {!!previewImage && (
          <Stack direction="horizontal" className="mt-2 mb-2 align-items-start">
            <Image src={previewImage} height={100} width={100} />
            <button className="btn" onClick={removeImage}>
              <IcoMoon icon="close" />
            </button>
          </Stack>
        )}
      </div>
      <Stack direction="horizontal">
        <Input
          value={dataRequest.message}
          name="message"
          placeholder="Write somethings"
          className="flex-fill"
          onChange={onDataChange}
          autoComplete="off"
          onPressEnter={onSend}
          disabled={loading}
        />
        <Upload
          accept="image/png,image/jpeg"
          maxCount={1}
          fileList={[]}
          onChange={handleFileChange}
        >
          <button className="btn">
            <IcoMoon icon="image" size={20} />
          </button>
        </Upload>
        {/* <button className="btn">
          <IcoMoon icon="link" size={20} />
        </button> */}
        <Button
          className="btn-send ms-auto"
          onClick={onSend}
          disabled={!(dataRequest.message || dataRequest.image) || loading}
        >
          {!loading && <IcoMoon icon="send" size={20} color="#fff" />}
          {loading && (
            <LoadingOutlined style={{ fontSize: 18, marginLeft: 8 }} />
          )}
        </Button>
      </Stack>
    </div>
  );
}

export default MessageBottomBar;
