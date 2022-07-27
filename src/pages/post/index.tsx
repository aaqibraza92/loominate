import { Avatar, Col, Row, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  Button,
  Container,
  Form,
  Nav,
  Stack,
} from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { Helmet } from "react-helmet-async";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { useRecoilState } from "recoil";
import IconSend from "../../assets/images/IconSend";
import images from "../../assets/images/images";
import { tenantNameState } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import CommentBottomBar from "../../components/comment/CommentBottomBar";
import CommentItem from "../../components/comment/CommentItem";
import DesktopCategory from "../../components/desktopcategory/DesktopCategory";
import DesktopCulture from "../../components/desktopculture/DesktopCulture";
import DesktopGuidelines from "../../components/desktopguidelines/DesktopGuidelines";
import DesktopHashtags from "../../components/desktophashtags/DesktopHashtags";
import DesktopMenu from "../../components/desktopmenu/DesktopMenu";
import DesktopMyCommunity from "../../components/desktopmycommunity/DesktopMyCommunity";
import DesktopMyProfile from "../../components/desktopmyprofile/DesktopMyProfile";
import DesktopOurPurpose from "../../components/desktopourpurpose/DesktopOurPurpose";
import HeaderDesktop from "../../components/header/HeaderDesktop";
import AppNavBar from "../../components/navbar";
import Initiative from "../../components/post/Initiative";
import PollComponent from "../../components/post/PollComponent";
import PostItem from "../../components/post/PostItem";
import Comment, { CommentPageData } from "../../models/comment.model";
import Post from "../../models/post.model";
import User from "../../models/user.model";
import postAction from "../../redux/actions/post.action";
import commentService from "../../services/comment.service";
import postService from "../../services/post.service";
import "./autoGrow.js"
import "./styles.scss";
import { log } from "console";
import ReactTextareaAutosize from "react-textarea-autosize";

/**
 * Post Detail Page
 * @param props
 * @returns JSX.Element
 */
function PostPage(props: any) {
  const params: any = useParams();
  const { id = null } = params;
  const history = useHistory();
  const user: User = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const { addNew } = useSelector((state: any) => state.comment);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComments, setNewComments] = useState<Comment[]>([]);
  const [likeInfoState, setlikeInfoState] = useState({})
  const [commentBody, setCommentBody] = useState('')
  const [flag_comment, setflag_comment] = useState(false)
  const [voteInfoState, setVoteInfoState] = useState({})

  const [dataCommentPage, setDataCommentPage] = useState<CommentPageData>({
    page: 1,
    per_page: 10,
    post_id: id,
    comment_type: "post",
  });
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const urlShare = `${process.env.REACT_APP_DOMAIN}${routes.PostPage.replace(
    ":id",
    id || ""
  )}`;

  const bottomRef: any = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  useEffect(() => {
    const getPost = async () => {
      const tenantName: any = localStorage.getItem("tenantName");
      // setLoading(true);
      try {
        const rs = await postService.detail(tenantName, params?.id, user.id);
        console.log("get by id rs", rs);
        rs.postPage = true
        rs.reactions && rs.reactions.length > 0 && rs.reactions[0].type == 'UPVOTE' ? rs.is_liked = true : rs.is_liked = false
        rs.reactions && rs.reactions.length > 0 && rs.reactions[0].type == 'DOWNVOTE' ? rs.is_disliked = true : rs.is_disliked = false
        rs.cous && rs.cous.length > 0 ? rs.is_voted = true : rs.is_voted = rs.is_voted = false;
    
        // const rs_likeInfo = await postService.getLikeInfo(tenantName, parseInt(user.id!));
        // const rs_voteInfo = await postService.getVoteInfo(tenantName,parseInt(user.id!));
        // setlikeInfoState(rs_likeInfo);
        // console.log('voteinfo in feed page', rs_voteInfo)
        //   rs.voteInfo = rs_voteInfo
        //   setVoteInfoState(rs_voteInfo)
        // console.log('check in rs for vote info', rs.rs_likeInfo)
        // rs.map(async (item: any) => {
        // const rs_countLikes = await postService.countUpVote(tenantName, rs.id);
        // const rs_countDisLikes = await postService.countDownVote(
        //   tenantName,
        //   rs.id
        // );
        // const rs_CountComment = await postService.countComment_byId(tenantName,{ id: rs.id });

        // console.log('countVote in index', rs_countIniVote)
        // item.votes_for = rs_countIniVote
        // rs.likes = rs_countLikes;
        // rs.dislikes = rs_countDisLikes;
        // rs.likeInfo = rs_likeInfo;
        // rs.total_comments = rs_CountComment
        console.log('before')
        if (rs.type == "Initiative") {
          const rs_countIniVote = await postService.countIniVote(
            tenantName,
            rs.id
          );
          rs.votes_for = rs_countIniVote;
        }
        if (rs.type == "Poll") {
          const rs_countIniVote = await postService.countIniVote(
            tenantName,
            rs.id
          );
          rs.votes = rs_countIniVote;
        }
        console.log("rs check", rs);
        // setgetAllResult(rs)
        // })
        setPost(rs);
      } catch (error) {
        console.log('error in get post by id', error)
      }
      setLoading(false);
    };
    getPost();
  }, []);

  const onSend = async () => {
    const tenantName: any = localStorage.getItem("tenantName");
    let body: any = {};
    body.tenant = tenantName;
    body.userId = user.id;
    body.thirdPerson =  post?.user?.id;
    body.contentId = post?.id;
    // body.comment = 3
    body.body = commentBody;
    const rs = await commentService.add(body);
    setCommentBody("");
    console.log("rs from comment add", rs);
    console.log("all comments: ", comments);
    if (rs.id) {
      setCommentBody("");
      getComment();
      // let updatedCommentList = comments;
      // updatedCommentList.push(rs);
      // setComments(updatedCommentList);
      // // getComment();
    }
  };
  useEffect(() => {
    getComment();
  }, [dataCommentPage]);

  useEffect(() => {
    if(flag_comment)
    getComment();

  }, [flag_comment]);

 

  useEffect(()=>{

    // $(".auto-gen-height").keyup(function(){
    //           var totalHeight = $(this).prop('scrollHeight') - parseInt($(this).css('padding-top')) - parseInt($(this).css('padding-bottom'));
    //           console.log("totalHeight"+totalHeight);
    //     $(this).css({'height':totalHeight});
    //    });
},[]);

  useEffect(() => {
    if (addNew) {
      setComments([{ ...addNew }, ...comments]);
      // scrollToBottom();
      setPost({ ...post, total_comments: (post?.total_comments || 0) + 1 });
      dispatch(
        postAction.updateLocal({
          ...post,
          total_comments: (post?.total_comments || 0) + 1,
        })
      );
    }
  }, [addNew]);

  /* comment get request */
  const getComment = async () => {
    const tenantName: any = localStorage.getItem("tenantName");
    try {
      console.log("post id in commet", id);
      const rs = await commentService.getAll(tenantName, {
        take: 20,
        order: "ASC",
        id: params?.id,
      });
      if (dataCommentPage.page > 1) {
        setComments([...comments, ...rs]);
      } else {
        console.log("comments rs", rs);
        setComments([...rs]);
      }
      setHasLoadMore(rs.meta.total > comments.length);
    } catch (error) {}
  };

  /**
   * Handle loadmore
   */
  const onLoadMore = () => {
    dataCommentPage.page = (dataCommentPage.page || 1) + 1;
    setDataCommentPage({
      ...dataCommentPage,
    });
  };

  const onPostDeleted = () => {
    setPost(undefined);
  };

  const goToHome = () => {
    history.push(routes.HomePage);
  };

  if (loading) return <div></div>;

  // if (!post) {
  //   return (
  //     <div className="box-empty" onClick={goToHome}>
  //       Post not found
  //       <Button className="mt-3">Go to home</Button>
  //     </div>
  //   );
  // }

  const onUpdated = (index: number, data: any) => {
    console.log("POST_PAGE", data);
    comments[index] = { ...data };
    setComments([...comments]);
  };
  


  return (
    <div>
      <HeaderDesktop />
      <Helmet>
        <title>{post?.title}</title>
        <meta property="og:url" content={urlShare} />
        <meta property="og:title" content={post?.title} />
        <meta property="og:site_name" content= {post?.title}/>
        <meta property="og:description" content={post?.content} />
        <meta property="og:image" content="" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@loominate" />
        <meta name="twitter:creator" content="@loominate" />
      </Helmet>
      <InfiniteScroll
        className="post-detail m-screen"
        dataLength={comments.length}
        next={onLoadMore}
        hasMore={hasLoadMore}
        loader={<Skeleton avatar paragraph={{ rows: 3 }} />}
      >
        <AppNavBar hasBack />
        <div ref={bottomRef} />
        <Container style={isMobile ? { padding: 0 } : {}}>
          <Row gutter={16}>
            <Col xl={5}>
              <div className="desktop-only">
                <DesktopMenu />
                <DesktopCategory />
                <DesktopHashtags />
              </div>
            </Col>
            <Col span={24} xl={12}>
              <Breadcrumb className="desktop-only">
              <Breadcrumb.Item
                 href={"/"}
                >
                  My Feed
                </Breadcrumb.Item>
                <Breadcrumb.Item active>{post && post.title}</Breadcrumb.Item>
              </Breadcrumb>

              {post && post.type == "Post" && (
                <PostItem data={post} />
              )}
              {post && post.type == "Initiative" && (
                <Initiative data={post} />
              )}
              {post && post.type == "Poll" && (
                <PollComponent data={post} />
              )}
              <div className="anony-option">
              <Form.Select aria-label="Default select example">
                <option>Comment as {user.userName}</option>
                <option>Comment as Anonymous</option>
              </Form.Select>
              </div>
              <div className="comment-wrapper xdesktop-only">
                <div className="post-comment">
                  <Stack direction="horizontal" gap={3}>
                    <Avatar
                      src={user.avatarLink? user.avatarLink :  images.AVATAR_KEYS[user?.avatar || "avatar2"]}
                      // width={44}
                      className="comment-avatar"
                      alt="Loominate"
                    />
                    <Form className="comment-input">
                      <Form.Group className="mb-0" controlId="formBasicEmail">
                     
                        <ReactTextareaAutosize
                            minRows={0}
                            maxRows={6}
                            placeholder="Add a Comment"
                            onChange={(e) => setCommentBody(e.target.value)}
                            value={commentBody}
                            className="comment-textarea"
                            />
                      </Form.Group>

             
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => onSend()}
                      >
                        POST <IconSend />
                      </Button>
                    </Form>
                  </Stack>
                </div>
              </div>
              {/* <Nav
                variant="pills"
                defaultActiveKey="/home"
                className="mt-3 comment-filter"
              >
                <Nav.Item>
                  <Nav.Link href="/home">Recommended</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-1">Hot</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-1">Recent</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-1">Most Upvotes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-1">Most Downvotes</Nav.Link>
                </Nav.Item>
              </Nav> */}
              <Stack gap={3} className="mt-3 pb-3 v-comment">
                {comments.length === 0 && (
                  <h3 className="no-comment">Be the first to leave a reply</h3>
                )}
                {comments.map((item, i) => (
                  <CommentItem
                    key={`comment-${i}`}
                    data={item}
                    postOwner = {parseInt(post?.user?.id!)}
                    postId={id || ""}
                    onUpdated={(data: any) => onUpdated(i, data)}
                    isFirstSend={i === 0}
                  />
                ))}
              </Stack>
            </Col>
            <Col xl={7}>
              <div className="desktop-only">
                <DesktopMyCommunity />
                <DesktopMyProfile />
                <DesktopOurPurpose />
                <DesktopGuidelines />
                <DesktopCulture />
              </div>
            </Col>
          </Row>
        </Container>

        {/* <CommentBottomBar postId='1' /> */}
      </InfiniteScroll>
    </div>
    // <div>

    //   <HeaderDesktop/>
    //   <Helmet>
    //     <title>{post.title}</title>
    //     <meta property="og:url" content={urlShare} />
    //     <meta property="og:title" content={post.title} />
    //     <meta property="og:site_name" content={post.title} />
    //     <meta property="og:description" content={post.description} />
    //     <meta property="og:image" content={post.image.thumb.url} />
    //     <meta property="og:locale" content="en_US" />
    //     <meta property="og:type" content="article" />

    //     <meta name="twitter:card" content="summary" />
    //     <meta name="twitter:site" content="@loominate" />
    //     <meta name="twitter:creator" content="@loominate" />
    //   </Helmet>
    //   <InfiniteScroll
    //     className="post-detail m-screen"
    //     dataLength={comments.length}
    //     next={onLoadMore}
    //     hasMore={hasLoadMore}
    //     loader={<Skeleton avatar paragraph={{ rows: 3 }} />}
    //   >
    //     <AppNavBar hasBack />
    //     <div ref={bottomRef} />
    //     <Container style={isMobile ? { padding: 0 } : {}}>
    //       <Row gutter={16}>
    //         <Col xl={5}>
    //         <div className="desktop-only">
    //             <DesktopMenu />
    //             <DesktopCategory />
    //             <DesktopHashtags />
    //             </div>
    //         </Col>
    //         <Col span={24} xl={12}>

    //         <Breadcrumb className="desktop-only">
    //             <Breadcrumb.Item href="/">My Feeds</Breadcrumb.Item>
    //             <Breadcrumb.Item active>{post.title}</Breadcrumb.Item>
    //           </Breadcrumb>

    //           {post && <PostItem data={post} onPostDeleted={onPostDeleted} />}
    //           <div className="comment-wrapper desktop-only">
    //             <div className="post-comment">
    //               <Stack direction="horizontal" gap={3}>
    //               <img src={images.avatar1} width={44} className="comment-avatar" alt="Loominate" />
    //               <Form className="comment-input">
    //               <Form.Group className="mb-0" controlId="formBasicEmail">
    //                 <Form.Control type="text" placeholder="Add a Comment" />
    //               </Form.Group>
    //               <Button variant="success" type="submit" size="sm">
    //                 POST <IconSend/>
    //               </Button>
    //             </Form>
    //               </Stack>
    //             </div>
    //           </div>
    //           <Nav variant="pills" defaultActiveKey="/home" className="mt-3 comment-filter">
    //             <Nav.Item>
    //               <Nav.Link href="/home">Recommended</Nav.Link>
    //             </Nav.Item>
    //             <Nav.Item>
    //               <Nav.Link eventKey="link-1">Hot</Nav.Link>
    //             </Nav.Item>
    //             <Nav.Item>
    //               <Nav.Link eventKey="link-1">Recent</Nav.Link>
    //             </Nav.Item>
    //             <Nav.Item>
    //               <Nav.Link eventKey="link-1">Most Upvotes</Nav.Link>
    //             </Nav.Item>
    //             <Nav.Item>
    //               <Nav.Link eventKey="link-1">Most Downvotes</Nav.Link>
    //             </Nav.Item>
    //           </Nav>
    //           <Stack gap={3} className="mt-3 pb-3 v-comment">
    //             {comments.length === 0 && (
    //               <h3 className="no-comment">Be the first to leave a reply</h3>
    //             )}
    //             {comments.map((item, i) => (
    //               <CommentItem
    //                 key={`comment-${i}`}
    //                 data={item}
    //                 postId={id || ""}
    //                 onUpdated={(data: any) => onUpdated(i, data)}
    //                 isFirstSend={i === 0}
    //               />
    //             ))}
    //           </Stack>
    //         </Col>
    //         <Col xl={7}>
    //         <div className="desktop-only">
    //           <DesktopMyCommunity />
    //             <DesktopMyProfile/>
    //             <DesktopOurPurpose/>
    //             <DesktopGuidelines/>
    //             <DesktopCulture/>
    //             </div>
    //         </Col>
    //       </Row>
    //     </Container>

    //     {post?.id && <CommentBottomBar postId={post.id} />}
    //   </InfiniteScroll>
    // </div>
  );
}

export default PostPage;
