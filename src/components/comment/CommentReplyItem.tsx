import { LoadingOutlined } from "@ant-design/icons";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import { Avatar, Dropdown, Image, Input, Menu, Tag, Upload } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { Content } from "react-bootstrap/lib/Tab";
import { bootstrapUtils } from "react-bootstrap/lib/utils";
import Linkify from "react-linkify";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { ReactComponent as IconMore } from "../../assets/icons/more.svg";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import Comment, { CommentData } from "../../models/comment.model";
import User from "../../models/user.model";
import commentAction from "../../redux/actions/comment.action";
import commentService from "../../services/comment.service";
import utils from "../../utils";
import IcoMoon from "../icon/IcoMoon";
import InputStacked from "../input/InputStacked";
import ModalConfirm, { ModalConfirmType } from "../modal/ModalConfirm";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  data?: Comment;
  onCommentDeleted?: any;
  onUpdated?: any;
  isFirstSend?: any;
  postOwner?: number;
}
/**
 * CommentItem Component
 * @param {Props} props
 * @returns {JSX.Element}
 */
function CommentReplyItem(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const { addNew } = useSelector((state: any) => state.comment);
  const { data = {}, onCommentDeleted, isFirstSend, onUpdated, postOwner } = props;
  const [comment, setComment] = useState<Comment | undefined>(data);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [dialogReply, setDialogReply] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>(comment?.image?.url);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [visibleLink, setVisibleLink] = useState(false);

  useEffect(() => {
    if (user) {
      setIsOwner(user?.id === comment?.userId);
    }
  }, [user, comment]);

  const sendComment = async (data?: any) => {
    setLoading(true);
    const tenantName = localStorage.getItem('tenantName')
    try {
      const dataRequest: any = { ...data };
      console.log('reply comment add data', data)
      console.log('reply comment add datarequest', dataRequest)
      let body: any = {};
      body.tenant = tenantName;
      body.thirdPerson = postOwner;
      body.body = dataRequest.content;
      body.contentId = dataRequest.post_id;
      body.comment = dataRequest.parent_id;
      body.userId = user.id
      const rs = await commentService.add(body);
      console.log('after reply add item', rs)
      console.log("commentList: ", comment);
      setComment({ ...rs, isSend: false });
      if (onUpdated) onUpdated({ ...rs, isSend: false });
      // mouse
    } catch (error) {
      setError(true);
    }
    dispatch(commentAction.clear());
    setLoading(false);
  };

  useEffect(() => {
    if (isFirstSend && data.isSend) {
      sendComment(data);
    }
    if (!isFirstSend || !data.isSend) {
      setComment({ ...data });
    }
  }, [data]);

  const onComment = () => {};

  const onResend = () => {
    sendComment();
  };

  const onLike = async () => {
    if (!comment) return;
    if (comment.disliked) {
      onDislike();
    }
    if (!comment?.liked) {
      comment.like_count = (comment.like_count || 0) + 1;
      comment.liked = true;
      setComment({ ...comment });
      try {
        await commentService.like(comment.id);
      } catch (error) {
        comment.like_count -= 1;
        comment.liked = false;
      }
    } else {
      comment.like_count = (comment.like_count || 0) - 1;
      comment.liked = false;
      setComment({ ...comment });
      try {
        await commentService.unlike(comment.id);
      } catch (error) {
        comment.like_count += 1;
        comment.liked = true;
        setComment({ ...comment });
      }
    }
  };

  const onDislike = async () => {
    if (!comment) return;
    if (comment.liked) {
      onLike();
    }
    if (!comment?.disliked) {
      comment.dislikes = (comment.dislikes || 0) + 1;
      comment.disliked = true;
      setComment({ ...comment });
      try {
        await commentService.dislike(comment.id);
      } catch (error) {
        comment.dislikes -= 1;
        comment.disliked = false;
      }
    } else {
      comment.dislikes = (comment.dislikes || 0) - 1;
      comment.disliked = false;
      setComment({ ...comment });
      try {
        await commentService.undislike(comment.id);
      } catch (error) {
        comment.dislikes += 1;
        comment.disliked = true;
        setComment({ ...comment });
      }
    }
  };

  const onVisibleDialogDelete = () => {
    // setDialogDelete(true);
  };

  const onReplyComment = () => {
    setDialogReply(true);
  };

  function handleMenuClick(e: any) {}

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

  const removeImage = () => {
    setPreviewImage(undefined);
    setComment({
      ...comment,
      image: {},
    });
  };

  const onEditComment = () => {
    setShowEdit(true);
    setVisibleLink(!!comment?.link);
  };

  const onEdit = async () => {
    if (!(comment?.content?.trim() || comment?.image || comment?.link)) return;
    setLoading(true);
    try {
      const rs = await commentService.edit(comment);
      setComment({ ...rs.comments });
      setShowEdit(false);
    } catch (error) {}
    setLoading(false);
  };

  const onOpenDelete = () => {
    setDialogDelete(true);
  };
  const onDeleteComment = async () => {
    setDialogDelete(false);
    try {
      await commentService.deleteComment(comment?.id);
      if (onCommentDeleted) onCommentDeleted();
      setComment(undefined);
    } catch (error) {}
  };

  const onProfileView = () => {
    if (!!comment?.user?.id) {
      history.push(routes.ViewProfilePage.replace(":id", comment.user.id));
    }
  };

  const onGoChat = () => {
    history.push(
      routes.MessageDetailPage.replace(":id", comment?.user?.id || "")
    );
  };

  const menu = isOwner ? (
    <Menu
      key={`menu-owner-`}
      className="comment-menu"
      // onClick={handleMenuClick}
    >
      {/* <Menu.Item key="share">
        <button className="btn btn-menu">Share this comment</button>
      </Menu.Item> */}
      <Menu.Item key="edit">
        <button className="btn btn-menu" onClick={onEditComment}>
          Edit this comment
        </button>
      </Menu.Item>
      <Menu.Item key="delete">
        <button className="btn btn-menu btn-dg" onClick={onOpenDelete}>
          Delete this comment
        </button>
      </Menu.Item>
    </Menu>
  ) : (
    <Menu key={`menu-`} className="comment-menu">
      <Menu.Item>
        <button className="btn btn-menu" onClick={onProfileView}>
          View author’s profile
        </button>
      </Menu.Item>
      <Menu.Item>
        <button className="btn btn-menu" onClick={onGoChat}>
          Chat with author
        </button>
      </Menu.Item>
      <Menu.Item>
        <button className="btn btn-menu btn-dg">Report content</button>
      </Menu.Item>
    </Menu>
  );

  if (!comment) return <div></div>;

  return (
    <div>
      <div className="comment-item comment-reply-item">
        <Stack
          direction="horizontal"
          gap={2}
          className="align-items-center mb-2 mt-2"
        >
          <div onClick={onProfileView}>
          <Avatar
              src={
                comment.user?.avatarLink ||
                images.AVATAR_KEYS[comment.user?.avatar || "avatar1"]
              }
            />
          </div>
          <label className="text-user" onClick={onProfileView}>
            {comment.user?.userName}
          </label>
          {isOwner && <Tag className="tag-outline">You</Tag>}
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
        </Stack>
        {!showEdit && (
          <div>
            <p className="text-content">{comment.body ? comment.body : comment.content }</p>
            {!!comment.image?.url && (
              <Image src={comment.image?.url} width={"100%"} className="mt-2" />
            )}
            {!!comment.link && (
              <LinkPreview
                url={utils.parseURL(comment.link)}
                width="100%"
                className="mt-2"
                fallback={
                  <Linkify
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a target="blank" href={decoratedHref} key={key}>
                        {decoratedText}
                      </a>
                    )}
                  >
                    {utils.parseURL(comment.link)}
                  </Linkify>
                }
              />
            )}
            <Stack direction="horizontal" className="mt-2 v-action" gap={1}>
              <button className="btn btn-action" onClick={onLike}>
                <IcoMoon icon="like" color={comment.liked ? colors.pink : ""} />{" "}
                {comment.like_count || 0}
              </button>
              <button className="btn btn-action" onClick={onDislike}>
                <IcoMoon
                  icon="dislike"
                  color={comment.disliked ? colors.pink : ""}
                />{" "}
                {comment.dislikes || 0}
              </button>
              {/* <button className="btn btn-action">
                <IcoMoon icon="comment" /> {comment.child_comments?.length || 0}
              </button> */}
              {error && (
                <button className="btn btn-reply" onClick={onResend}>
                  Try again
                </button>
              )}
              <div className="ms-auto">
                <IcoMoon icon="time" /> {moment(data.creationDate ? data.creationDate : data.created_at).fromNow()}
              </div>
            </Stack>
          </div>
        )}
        {showEdit && (
          <div>
            {!!(previewImage || comment.image?.url) && (
              <Stack
                direction="horizontal"
                className="mt-2 mb-2 align-items-start"
              >
                <Image
                  src={previewImage || comment.image?.url}
                  height={100}
                  width={100}
                />
                <button className="btn" onClick={removeImage}>
                  <IcoMoon icon="close" />
                </button>
              </Stack>
            )}
            {visibleLink && (
              <InputStacked
                name="link"
                placeholder="Add link"
                defaultValue={comment.link}
                onChange={onDataChange}
              />
            )}
            <Stack direction="horizontal">
              <Input
                name="content"
                placeholder="Write somethings"
                className="flex-fill"
                value={comment.body||comment.content}
                onChange={onDataChange}
                autoComplete="off"
                onPressEnter={onEdit}
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
                  !(comment.body?.trim() || comment.image || comment.link)
                }
                onClick={onEdit}
              >
                {!loading && <IcoMoon icon="send" size={20} color="#fff" />}
                {loading && (
                  <LoadingOutlined style={{ fontSize: 18, marginLeft: 8 }} />
                )}
              </Button>
            </Stack>
          </div>
        )}
      </div>
      <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogDelete}
        message="Are you sure you want to delete this comment?"
        okText="Yes, I’m sure"
        onCancel={() => {
          setDialogDelete(false);
        }}
        onOk={onDeleteComment}
      />
    </div>
  );
}

export default CommentReplyItem;
