import { LoadingOutlined } from "@ant-design/icons";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import { Avatar, Dropdown, Image, Input, Menu, Tag, Upload } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { Form } from "react-bootstrap/lib/Navbar";
import Linkify from "react-linkify";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import ReactTextareaAutosize from "react-textarea-autosize";
import { ReactComponent as IconMore } from "../../assets/icons/more.svg";
import IconSend from "../../assets/images/IconSend";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import Comment, { CommentData } from "../../models/comment.model";
import User, { UserRole } from "../../models/user.model";
import commentAction from "../../redux/actions/comment.action";
import commentService from "../../services/comment.service";
import utils from "../../utils";
import AlertModal from "../AlertModal/AlertModal";
import IcoMoon from "../icon/IcoMoon";
import InputStacked from "../input/InputStacked";
import ModalConfirm, { ModalConfirmType } from "../modal/ModalConfirm";
import CommentReplyItem from "./CommentReplyItem";
import CommentReplySheet from "./CommentReplySheet";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  postId: string;
  postOwner: number;
  data?: Comment;
  onCommentDeleted?: any;
  onUpdated?: any;
  isFirstSend?: boolean;
}
/**
 * CommentItem Component
 * @param {Props} props
 * @returns {JSX.Element}
 */
function CommentItem(props: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const { addNew } = useSelector((state: any) => state.comment);
  const { data = {}, postId, onCommentDeleted, isFirstSend, onUpdated, postOwner } = props;
  console.log("data inside comment item");
  console.log({data})
  const [comment, setComment] = useState<Comment | undefined>({ ...data });
  const [dataRequest, setDataRequest] = useState<Comment | undefined>({
    ...data,
  });
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [dialogReply, setDialogReply] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>(comment?.image?.url);
  const [dialogDelete, setDialogDelete] = useState(false);
  const [visibleLink, setVisibleLink] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('user in comment comp', user)
    if (user) {
      setIsOwner(user?.id === comment?.userId);
    }
  }, [user]);

  const sendComment = async (data?: any) => {
    const tenantName = localStorage.getItem('tenantName')
    if (user.muted) return;
    setLoading(true);
    try {
      setComment({ ...data });
      const dataRequest: CommentData = { ...comment };
      let body: any = {}
      body.userId = user.id;
      body.tenant = tenantName
      body.contentId = postId;
      body.thirdPerson = postOwner
      // body.body = 
      console.log('inside add comment test',onUpdated, data)
      const rs = await commentService.add(data || dataRequest);
      setComment({ ...rs.comments, isSend: false });
      if (onUpdated) onUpdated({ ...rs.comments, isSend: false });
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
    if (!isFirstSend) {
      setComment({ ...data });
    }
  }, [data]);

  useEffect(() => {
    setIsAdmin(comment?.user?.role === UserRole.ADMIN);
  }, [comment]);

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

  const onResend = () => {
    sendComment();
  };

  const onReplyComment = () => {
    setDialogReply(true);
  };
  const onReply = (reply: Comment) => {
    console.log('in comment item check reply', reply)
    if (comment && reply) {
      if(comment.comments){
        comment.comments = [{ ...reply }, ...comment?.comments];
      }else {
        comment.comments = [{ ...reply }];
      };
      console.log('commment child components',comment);

      setComment({ ...comment });
      if (onUpdated) onUpdated({ ...comment });
    }
  };

  const onReplyUpdated = (index: number, data: any) => {
    if (comment?.child_comments) {
      comment.child_comments[index] = { ...data, isSend: false };
      console.log(comment.child_comments);
      setComment({ ...comment });
      if (onUpdated) onUpdated({ ...comment });
    }
  };

  
  const onReplyComment2 = () => {
    return (
      AlertModal.show(<CommentReplySheet
        open={dialogReply}
        data={comment}
        postId={postId}
        onClose={() => {
          setDialogReply(false);
        }}
        onSubmit={onReply}
      />)
    )

  }

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
    if (!(comment?.body?.trim() || comment?.image || comment?.link)) return;
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

  const onGoChat = () => {
    history.push(
      routes.MessageDetailPage.replace(":id", comment?.user?.id || "")
    );
  };

  const menu = isOwner ? (
    <Menu
      key={`menu-owner-`}
      className="comment-menu"
      onClick={handleMenuClick}
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

  if (!comment) return <></>;

  return (
    <div>
      <div className="comment-item">
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
          {isAdmin && <Tag color={colors.pink}>ADMIN</Tag>}
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
            <p className="text-content">{comment.body}</p>
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
              <button className="btn btn-action">
                <IcoMoon icon="comment" /> {comment.child_comments?.length || 0}
              </button>
              {error && (
                <button className="btn btn-reply" onClick={onResend}>
                  Try again
                </button>
              )}
              {!error && !user.muted && (
                <>
                <button className="btn mobile-only btn-reply" onClick={onReplyComment}>
                  Reply
                </button>
                <button className="btn desktop-only btn-reply" onClick={onReplyComment2}>
                  Reply
                </button>
                </>
              )}
              <div className="ms-auto">
                <IcoMoon icon="time" /> {moment(comment.creationDate).fromNow()}
              </div>
            </Stack>
            {/* <div className="reply-wrapper desktop-only">
              
                     
                        <ReactTextareaAutosize
                            minRows={0}
                            maxRows={6}
                            placeholder="Reply"
                            className="comment-textarea"
                            />

             
                      <Button
                        variant="success"
                        size="sm"
                      ><IconSend />
                      </Button>
            </div> */}
          </div>
        )}
        {showEdit && (
          <div className="mt-2">
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
                value={comment.content}
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
                  !(comment.content?.trim() || comment.image || comment.link)
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
      <Stack>
        {comment.comments && comment.comments.map((item: any, index: number) => (
          <CommentReplyItem
            key={`reply-${item.id}-${index}`}
            data={item}
            isFirstSend={index === 0}
            postOwner = {postOwner}
            onUpdated={(data: any) => onReplyUpdated(index, data)}
          />
        ))}
      </Stack>
      {dialogReply && (
        <CommentReplySheet
          open={dialogReply}
          data={comment}
          postId={postId}
          onClose={() => {
            setDialogReply(false);
          }}
          onSubmit={onReply}
        />
      )}
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

export default CommentItem;
