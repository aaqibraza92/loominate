import { LoadingOutlined } from "@ant-design/icons";
import ActionSheet, { ActionSheetRef } from "actionsheet-react";
import { Image, Input, Upload } from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Comment from "../../models/comment.model";
import AlertModal from "../AlertModal/AlertModal";
import IcoMoon from "../icon/IcoMoon";
import InputStacked from "../input/InputStacked";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  type?: any;
  open?: boolean;
  onClose?: any;
  data?: Comment;
  postId: string;
  onSubmit?: any;
}

const commentDefault: Comment = {
  type: "text",
  comment_type: "post",
  content: "",
  link: "",
  liked: false,
  like_count: 0,
  created_at: moment().toDate(),
};

/**
 * ReportUserSheet Component
 * @param props
 * @returns JSX.Element
 */
function CommentReplySheet(props: Props) {
  const dispatch = useDispatch();
  const { user = {} } = useSelector((state: any) => state.auth);
  const ref: any = useRef<ActionSheetRef>();
  const { containerStyle, open, onClose, data = {}, postId, onSubmit } = props;
  const [dataRequest, setDataRequest] = useState<any>({});
  const [reportSelected, setReportSelected] = useState("");
  const [dialogSuccess, setDialogSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState<Comment>({
    post_id: postId,
    parent_id: data.id,
    ...commentDefault,
  });
  const [dialogDelete, setDialogDelete] = useState(false);
  const [visibleLink, setVisibleLink] = useState(false);

  useEffect(() => {
    if (open) {
      handleOpen();
    } else {
      handleClose();
    }
  }, [open]);

  useEffect(() => {
    setComment({
      post_id: postId,
      parent_id: data.id,
      ...commentDefault,
    });
  }, [postId, data]);

  /**
   * Handle ActionSheet open
   */
  const handleOpen = () => {
    ref.current.open();
  };

  /**
   * Handle ActionSheet close
   */
  const handleClose = () => {
    ref.current.close();
  };

  /**
   * Handle ActionSheet Close
   */
  const onSheetClose = () => {
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  const onDataChange = (e: any) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle file change
   * @param {any} FileInfo
   */
  const handleFileChange = (info: any) => {
    if (!info.file) return;
    const file = info.file;
    setPreviewImage(URL.createObjectURL(file.originFileObj));
    setComment({
      ...comment,
      image: file.originFileObj
    });
  };

  const removeImage = () => {
    setPreviewImage(undefined);
    setComment({
      ...comment,
      image: null,
    });
  };

  /**
   * Add link
   */
  const onAddLink = () => {
    setVisibleLink(true);
    setComment({
      ...comment,
      link: "",
    });
  };


  const wowBtn = () => {
    onAdd();
    AlertModal.hide();
  };
  const onAdd = () => {
    if (!(comment.content?.trim() || comment.image || comment.link)) return;
    comment.created_at = moment().toDate();
    comment.isSend = true;
    setPreviewImage(null);
    setVisibleLink(false);
    console.log('comment in reply child 2', comment)
    // body
    // console.log('onsubmit in replay child 2', onSubmit)
    if (onSubmit) onSubmit({ ...comment, post_id: postId, user });
    handleClose();
    if (onClose) onClose();
  };

  return (
    <ActionSheet
      ref={ref}
      onClose={onSheetClose}
      mouseEnable={false}
      touchEnable={false}
    >
      {!user.muted && <Stack className="comment-reply-sheet">
        {!!previewImage && (
          <Stack direction="horizontal" className="mt-2 mb-2 align-items-start">
            <Image height={100} width={100} src={previewImage} />
            <button className="btn" onClick={removeImage}>
              <IcoMoon icon="close" />
            </button>
          </Stack>
        )}
        {visibleLink && (
          <InputStacked
            name="link"
            value={comment.link}
            className="mt-2"
            placeholder="Add link"
            onChange={onDataChange}
          />
        )}
        <Input
          name="content"
          placeholder="Write somethings"
          className="flex-fill mb-2"
          autoComplete="off"
          value={comment.content}
          onChange={onDataChange}
          onPressEnter={onAdd}
        />
        <br />
        <Stack direction="horizontal">
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
          <button className="btn" onClick={onAddLink}>
            <IcoMoon icon="link" size={20} />
          </button>
          
              <Form.Select aria-label="Default select example">
                <option>Comment as {user.userName}</option>
                <option>Comment as Anonymous</option>
              </Form.Select>
          <Button
            className="btn-send ms-auto"
            disabled={
              loading ||
              !(comment.content?.trim() || comment.image || comment.link)
            }
            onClick={wowBtn}
          >
            {!loading && <IcoMoon icon="send" size={20} color="#fff" />}
            {loading && (
              <LoadingOutlined style={{ fontSize: 18, marginLeft: 8 }} />
            )}
          </Button>
        </Stack>
      </Stack>}
    </ActionSheet>
  );
}

export default CommentReplySheet;
