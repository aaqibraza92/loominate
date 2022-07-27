import { LoadingOutlined } from "@ant-design/icons";
import { Image, Input, Upload } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Comment from "../../models/comment.model";
import commentAction from "../../redux/actions/comment.action";
import IcoMoon from "../icon/IcoMoon";
import InputStacked from "../input/InputStacked";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  postId: string;
  data?: any;
}

const commentDefault: Comment = {
  type: "text",
  comment_type: "post",
  liked: false,
  like_count: 0,
  content: "",
  link: "",
  created_at: moment().toDate(),
};

/**
 * CommentBottomBar Component
 * @param {Props} props
 * @returns {JSX.Element}
 */
function CommentBottomBar(props: Props) {
  const dispatch = useDispatch();
  const { postId } = props;
  const { user = {} } = useSelector((state: any) => state.auth);
  const {} = useSelector((state: any) => state.comment);
  const [comment, setComment] = useState<Comment>({
    post_id: postId,
    ...commentDefault,
  });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>();
  const [visibleLink, setVisibleLink] = useState(false);

  useEffect(() => {
    if (user) {
      setComment({
        ...comment,
        user: { ...user },
      });
    }
  }, [user]);

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
      image: file.originFileObj,
    });
  };

  const removeImage = () => {
    setPreviewImage(undefined);
    setComment({
      ...comment,
    });
  };

  const onAdd = () => {
    if (user.muted) return;
    if (!(comment.content?.trim() || comment.image || comment.link)) return;
    comment.created_at = moment().toDate();
    dispatch(commentAction.add(comment));
    setPreviewImage(null);
    setVisibleLink(false);
    setComment({ ...commentDefault, post_id: postId, user });
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

  return (
    <div className="comment-bottom-bar mobile-only">
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
          className="mt-2"
          value={comment.link}
          placeholder="Add link"
          onChange={onDataChange}
        />
      )}
      {!user.muted && <Stack direction="horizontal">
        <Input
          name="content"
          placeholder="Write somethings"
          className="flex-fill"
          value={comment.content}
          onChange={onDataChange}
          autoComplete="off"
          onPressEnter={onAdd}
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
        <button className="btn" onClick={onAddLink}>
          <IcoMoon icon="link" size={20} />
        </button>
        <Button
          className="btn-send ms-auto"
          disabled={
            loading ||
            !(comment.content?.trim() || comment.image || comment.link)
          }
          onClick={onAdd}
        >
          {!loading && <IcoMoon icon="send" size={20} color="#fff" />}
          {loading && (
            <LoadingOutlined style={{ fontSize: 18, marginLeft: 8 }} />
          )}
        </Button>
      </Stack>}
      {user.muted && <span>You are muted</span>}
    </div>
  );
}

export default CommentBottomBar;
