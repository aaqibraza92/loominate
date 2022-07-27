import { LinkPreview } from "@dhaiwat10/react-link-preview";
import {
  Avatar,
  Dropdown,
  Image,
  Menu,
  notification,
  Radio,
  Space,
  Tag
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import ShowMoreText from "react-show-more-text";
import { useRecoilState } from "recoil";
import { ReactComponent as IconMoreWhite } from "../../assets/icons/more-white.svg";
import { ReactComponent as IconMore } from "../../assets/icons/more.svg";
import { ReactComponent as IconShare } from "../../assets/icons/share.svg";
import images from "../../assets/images/images";
import { flagFeedUpdate, hashFilterValue, karmaPoints, tenantNameState, wakeHastags } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import { types_points, source } from "../../karmaModule/dtos";
import { KamrmaValueGeneration } from "../../karmaModule/karmaTemplate";
import Post, {
  Poll,
  PostType,
  PostView,
  VOTE_INITIATIVE
} from "../../models/post.model";
import Report from "../../models/report.model";
import User, { UserRole } from "../../models/user.model";
import postAction from "../../redux/actions/post.action";
import postService from "../../services/post.service";
import reportService from "../../services/report.service";
import userService from "../../services/user.service";
import utils from "../../utils";
import AlertModal from "../AlertModal/AlertModal";
import DesktopShareDropdown from "../desktopsharedropdown/DesktopShareDropdown";
import IcoMoon from "../icon/IcoMoon";
import ModalConfirm, { ModalConfirmType } from "../modal/ModalConfirm";
import ReportContentSheet from "../report/ReportContentSheet";
import ShareSocialSheet from "../share/ShareSocialSheet";
import ActionSheetPost from "./ActionSheetPost";
import "./styles.scss";
var debounce = require('lodash.debounce');

interface Props {
  containerStyle?: any;
  view?: PostView;
  type?: PostType;
  data?: Post;
  onPostDeleted?: any;
  key?: any;
  report?: Report;
  isInReview?: boolean;
  likeInfoProp?: any;
  voteInfoProp?: any;
}

const MAX_WORD_DESCRIPTION = 30;

/**
 * Initiative Component
 * @param {Props} props
 * @returns JSX.Element
 */
function PollComponent(props: Props) {

  const [screenWidth, setScreenWidth] = useState(window.screen.width);
  const resizeScreen = () => {
    setScreenWidth(window.innerWidth);
  };
  useEffect(() => {
resizeScreen();
    window.addEventListener("resize", resizeScreen);
    return () => {
      window.removeEventListener("resize", resizeScreen);
    };
  });

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const user: User = useSelector((state: any) => state.auth.user);
  const [hidden, setHidden] = useState(false);
  const { update, postUpdate } = useSelector((state: any) => state.post);
  const {
    containerStyle,
    type,
    data = {},
    onPostDeleted,
    likeInfoProp,
    voteInfoProp,
    view,
    key = Date.now(),
    report,
    isInReview,
  } = props;
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post>(data);
  const [isMyPost, setIsMyPost] = useState(
    post?.user && user?.id === post.user?.id
  );
  const [dialogDelete, setDialogDelete] = useState(false);
  const [dialogCancelReviewing, setDialogCancelReviewing] = useState(false);
  const [dialogShare, setDialogShare] = useState(false);
  const [dialogConfirmVote, setDialogConfirmVote] = useState(false);
  const [pollId, setPollId] = useState();
  const [voteError, setVoteError] = useState<any>("");
  const [votesData, setVotesData] = useState<Poll[]>([]);
  const [voteForPercent, setVoteForPercent] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [urlShare, setUrlShare] = useState("");
  const [visibleEditPost, setVisibleEditPost] = useState(false);
  const [dialogReport, setDialogReport] = useState(false);
  const [expiredVote, setExpiredVote] = useState(false);
  const [voteTypeSelected, setVoteTypeSelected] = useState<string>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isViewDetail, setIsViewDetail] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  // const [post.user, setpostUser] = useState<User>()
  const [optionData, setOptionData] = useState<any>({})
  const [flagOpton, setFlagOpton] = useState(false)
  const [reactionIdState, setReactionIdState] = useState()
  const [wakeUpHashtagSearch, setWakeUpHashtagSearch] = useRecoilState(wakeHastags)
  const [hashTagFilter, setHashTagFilter] = useRecoilState(hashFilterValue)
  const [karmaPointState, setKarmaPointState] = useRecoilState(karmaPoints)
  const [flag_feed, setFlag_feed] = useRecoilState(flagFeedUpdate);
console.log('testINININ', post)
  useEffect(() => {
    console.log('user data check in post item', post)
    // if (hidden) return;
    // if (!isFirstLoad && data.id === post.id) {
      const tenantName: any = localStorage.getItem('tenantName')
      // const getUsers = async () => {
      //   let _userId: any = post?.userId
      // const rs = await userService.getUserById(tenantName, _userId);
      // setpostUser(rs)
      // };

    console.log('user data check in post item', post)
    const getOptiondata = async () => {
      try{
        const _optionData = await postService.getOptionData(tenantName, parseInt(post.id!))
        console.log('option data', _optionData)
        setOptionData(_optionData)
      } catch(err){
        console.log('error in get data option',err)
      }
    };

      setPost(data);
      console.log("inside useeffect of postItem",post.user)
      // setPost({ ...data });
      // likeInfoProp && likeInfoProp.length > 0 && likeInfoProp.map((item: any) => {
      //   if(post.id ==  item.contentId){
      //     if(item.type == 'DOWNVOTE'){
      //       post.is_disliked = true
      //     }
      //     else if(item.type == 'UPVOTE'){
      //       post.is_liked = true
      //     }
      //   }
      // })
    post.reactions && post.reactions.length > 0 && post.reactions[0].type == 'UPVOTE' ? post.is_liked = true : post.is_liked = false
    post.reactions && post.reactions.length > 0 && post.reactions[0].type == 'DOWNVOTE' ? post.is_disliked = true : post.is_disliked = false
    post.reactions && post.reactions.length > 0 ? setReactionIdState(post.reactions[0].id) : post.is_liked = false;
    post.cous && post.cous.length > 0 ? post.is_voted = true : post.is_voted = post.is_voted = false;

    // post.category && post.category.length > 0 ? post.categoryId = post.categories[0].id : post.categoryId =  null;
    post.categories && post.categories.length > 0 ? post.categoryId = post.categories[0].id : post.categoryId =  null;

      // voteInfoProp && voteInfoProp.length > 0 && voteInfoProp.map((item: any) => {
      //   if(user.id ==  item.userId && item.contentId == post.id){
      //    console.log("you have voted alredy", user.id)
      //    post.is_voted = true
      //   }
      // })
      // post
    // }
    // getUsers()
    getOptiondata();
  }, []);
  useEffect(() => {
    if (user) {
      console.log('insideUserCheck', user?.id === post.user?.id)
      setIsMyPost(user?.id === post.user?.id);
      setIsAdmin(user?.role === UserRole.ADMIN);
    }
    setUrlShare(
      `${process.env.REACT_APP_DOMAIN}${routes.PostPage.replace(
        ":id",
        post.id || ""
      )}`
    );
  }, [user]);
  useEffect(() => {
    setIsViewDetail(
      location.pathname === routes.PostPage.replace(":id", post?.id || "")
    );
    if (post.polls && post.polls.length) {
      const total = post.votes || 0;
      if (total > 0) {
        post.polls.map((item: any) => {
          item.percent = (item.count_voted / total) * 100;
        });
      }
      setVotesData([...post.polls]);
    }
    if (post.type === PostType.Initiative) {
      const voteFor = post.votes_for || 0;
      const voteAgainst = post.votes_against || 0;
      if (voteFor + voteAgainst === 0) {
      } else {
        const vote = Math.round((voteFor / (voteAgainst + voteFor)) * 100);
        setVoteForPercent(vote);
      }
      setTotalVotes(voteFor + voteAgainst);
    }

    if (post.closeDate) {
      const diff = moment(post.closeDate).diff(moment(), "days");
      setExpiredVote(diff < 0);
    }
    setIsFirstLoad(false);
    if (post) {
      setIsVoted(!!post.is_voted || !!post.user_voted);
    }
  }, [post]);
  useEffect(() => {
    if (update && update.id === post.id) {
      setPost({ ...update });
      dispatch(postAction.clear());
    }
  }, [update]);
  useEffect(() => {
    getOptiondata()
  }, [flagOpton])
  const [isVoted, setIsVoted] = useState(
    !!post?.is_voted || !!post?.user_voted
  );

  /**
   * Go to post detail page
   */
  const onComment = () => {
    if (post.id && !isViewDetail) {
      history.push(routes.PostPage.replace(":id", post.id));
    }
  };

  const onGoPostDetail = () => {
    if (isInReview) return;
    if (post.id && !isViewDetail) {
      let tempUrl =post.title?.replace(/ /g,"_");
      history.push(routes.PostPage.replace(":id", post.id+'/'+tempUrl));
    }
  };

  const onHashtagClick = (hashValue: string) => {
    console.log('postPageCheck', post.postPage)
    const tenantName: any = localStorage.getItem('tenantName')
    // if(post.postPage){
      history.push(routes.HomePage.replace(":tenant", tenantName));
    // }
    setHashTagFilter({name: 'hashtag', value: hashValue})
    setWakeUpHashtagSearch(!wakeUpHashtagSearch) 
  }

  /**
   * Handle like post
   */
  const onLike = async () => {
    const tenantName: any = localStorage.getItem('tenantName');
      console.log('post in inlike', post)
    if (post.is_disliked) {
      debouncedDislike();
    }
    if (!post.is_liked) {
      post.likes = (post.likes || 0) + 1;
      post.is_liked = true;
      setPost({ ...post });
      try {
          let body: any = {}
          body.tenant = tenantName
          body.thirdPerson = post.user?.id
          body.userId = user.id
          body.type = "UPVOTE"
          body.contentId = post.id
          body.karmaPoints = 1
          body.isAnonymous = post.isAnonymous
          const reactionId = await postService.upVote(body);
          const _karmaPoint: any = KamrmaValueGeneration(types_points.UPVOTE, source.POLL)
          if(user.id == post.user?.id && post.isAnonymous != true){
            setKarmaPointState(karmaPointState + _karmaPoint)
          }
          post.reactionId = reactionId
          setReactionIdState(reactionId)
          console.log('post after first like',post )
      } catch (error) {
        post.likes -= 1;
        // post.is_liked = false;
        setPost({ ...post });
      }
    } else {
      post.likes = (post.likes || 0) - 1;
      post.is_liked = false;
      let body: any = {}
      body.tenant = tenantName
      body.id = post.reactionId
      body.thirdPerson = post.user?.id
      body.userId = user.id
      body.type = "DOWNVOTE"
      body.contentId = post.id
      body.karmaPoints = 1;
      body.isAnonymous = post.isAnonymous
      setPost({ ...post });
      try {
        // const reactionId = await postService.downVote(body);
        // delete api 
        if(user.id == post.user?.id && post.isAnonymous != true){
          const _karmaPoint: any = KamrmaValueGeneration(types_points.UPVOTE, source.POST)
          setKarmaPointState(karmaPointState - _karmaPoint)
        }
        const deleteReaction = await postService.deleteReaction(
          reactionIdState,
          post.user?.id,
          "UPVOTE",
          post.isAnonymous,
          tenantName
        );
      } catch (error) {
        post.likes += 1;
        post.is_liked = true;
        setPost({ ...post });
      }
    }
    console.log('post after like', post)
    dispatch(postAction.updateLocal(post));
  };

  /**
   * Handle dislike post
   */
  const onDislike = async () => {
    const tenantName: any = localStorage.getItem('tenantName');
    if (post.is_liked) {
      debouncedLike();
    }
    if (!post.is_disliked) {
      post.dislikes = (post.dislikes || 0) + 1;
      post.is_disliked = true;
      setPost({ ...post });
      try {
        const body : any = {}
        body.tenant = tenantName
        body.thirdPerson = post.user?.id
            body.userId = user.id
        body.type = "DOWNVOTE"
        body.contentId = post.id
        body.karmaPoints = 1
        body.isAnonymous = post.isAnonymous
        const reactionId = await postService.upVote(body);
        const _karmaPoint: any = KamrmaValueGeneration(types_points.DOWNVOTE, source.POLL)
        console.log('karmaPointsCheckInPollDown', _karmaPoint)
        if(user.id == post.user?.id && post.isAnonymous != true){
          setKarmaPointState(karmaPointState + _karmaPoint)
        }
        setReactionIdState(reactionId)
      } catch (error) {
        post.dislikes -= 1;
        post.is_disliked = false;
        setPost({ ...post });
      }
    } else {
      post.dislikes = (post.dislikes || 0) - 1;
      post.is_disliked = false;
      setPost({ ...post });
      try {
        // await postService.undislike(post.id);
        // delete api
        if(user.id == post.user?.id && post.isAnonymous != true){
          const _karmaPoint: any = KamrmaValueGeneration(types_points.UPVOTE, source.POST)
          setKarmaPointState(karmaPointState + _karmaPoint)
        }
        const deleteReaction = await postService.deleteReaction(
          reactionIdState,
          post.user?.id,
          'DOWNVOTE',
          post.isAnonymous,
          tenantName
        );
      } catch (error) {
        post.dislikes += 1;
        post.is_disliked = true;
        setPost({ ...post });
      }
    }
    console.log('post after dislike', post)
    dispatch(postAction.updateLocal(post));
  };

  /**
   * Show delete dialog
   */
  const onVisibleDialogDelete = () => {
    setDialogDelete(true);
  };


  

  const onDeletePost = async () => {
    try {
      const tenantName: any = localStorage.getItem('tenantName');
      let body : any = {}
      body.id = post.id
      body.userId = post.user?.id
      body.tenant = tenantName
      console.log('body in delete final', body)
      body.type = post.type;
      await postService.deletePost(body);
      // await postService.deletePost(post.id);
      dispatch(postAction.deletePost(post.id));
      if (onPostDeleted) onPostDeleted();
    } catch (error: any) {
      notification.error({
        key: `${Date.now()}`,
        message: error,
      });
    }
    setDialogDelete(false);
    dispatch(postAction.updateLocal(post));
    setFlag_feed(!flag_feed)
  };

  const onEditPost = () => {
    console.log("clicked edit poll")
    setVisibleEditPost(true);
  };

  const onEditPostClose = () => {
    setVisibleEditPost(false);
  };

  /**
   * Handle menu click
   * @param {any} e
   */
  function handleMenuClick(e: any) {
    console.log("click", e);
    if (isMyPost) {
      switch (e.key) {
        case "share":
          onShareOpen();
          break;
        case "edit":
          onEditPost();
          break;
        case "delete":
          onVisibleDialogDelete();
          break;
      }
    } else {
      setTimeout(() => {
        switch (e.key) {
          case "view-profile":
            onProfileView();
            break;
          case "chat":
            onGoChat();
            break;
          case "report":
            onReportContent();
            break;
          case "delete":
            onVisibleDialogDelete();
            break;
        }
      }, 100);
    }
  }

  const onProfileView = () => {
    console.log('insideOnProfileViewPage', post.user?.userName!)
    if (!!post?.user?.id && !post.isAnonymous) {
      history.push(routes.ViewProfilePage.replace(":id", post.user?.id+'/'+post.user?.userName!));
    }
  };
  const onProfileReported = () => {
    if (!!report?.user) {
      history.push(
        routes.ViewProfilePage.replace(":id", report.user?.id || "")
      );
    }
  };

  
  const onViewCategory = () => {
    console.log("viewcatout", post);
    if (post?.categoryId) {
      console.log("viewcat", post);
      let tempUrl = post.categories[0].title!.replace(/ /g,"_");
      history.push(routes.CategoryPage.replace(":id", post.categoryId+'/'+tempUrl));
    }
  };

  const onReportContent = () => {
    setDialogReport(true);
  };

  const onReportClose = () => {
    setDialogReport(false);
  };

  const onShareOpen = () => {
    setDialogShare(true);
  };
  const onShareClose = () => {
    setDialogShare(false);
  };

  const onGoChat = () => {
    history.push(routes.MessageDetailPage.replace(":id", post?.user?.id || ""));
  };

  /**
   * Menu Component
   */
  const menu = isMyPost ? (
    <Menu
      key={`menu-owner-${post.id || Date.now()}`}
      className="post-menu"
      onClick={handleMenuClick}
    >
      <Menu.Item key="share">
        <button className="btn btn-menu">
          Share this{" "}
          {post.type === PostType.Poll
            ? "poll"
            : post.type === PostType.Initiative
            ? "initiative"
            : "post"}
        </button>
      </Menu.Item>
    

      
      {
        screenWidth > 1200 ?
       
        <Menu.Item key="edit" onClick={(e)=>  AlertModal.show(  <ActionSheetPost
          open={visibleEditPost}
          postData={post}
          type={post.type}
          onClose={onEditPostClose}
        />,"title",()=>{})}>
        <button className="btn btn-menu">
          Edit your{" "} 
          {post.type === PostType.Poll
            ? "poll"
            : post.type === PostType.Initiative
            ? "initiative"
            : "post"}
        </button>
      </Menu.Item>
        :
        <Menu.Item key="edit">
        <button className="btn btn-menu">
          Edit your{" "} 
          {post.type === PostType.Poll
            ? "poll"
            : post.type === PostType.Initiative
            ? "initiative"
            : "post"}
        </button>
      </Menu.Item>
      }

      <Menu.Item key="delete">
        <button className="btn btn-menu btn-dg">
          Delete this{" "}
          {post.type === PostType.Poll
            ? "poll"
            : post.type === PostType.Initiative
            ? "initiative"
            : "post"}
        </button>
      </Menu.Item>
    </Menu>
  ) : (
    <Menu
      key={`menu-${post.id}`}
      className="post-menu"
      onClick={handleMenuClick}
    >
      {!post.is_anonymous && (
        <Menu.Item key="view-profile">
          <button className="btn btn-menu">View author’s profile</button>
        </Menu.Item>
      )}
      {!post.is_anonymous && (
        <Menu.Item key="chat">
          <button className="btn btn-menu">Chat with author</button>
        </Menu.Item>
      )}
      {!isAdmin && post.isReported != true &&(
        <Menu.Item key="report">
          <button className="btn btn-menu btn-dg">Report content</button>
        </Menu.Item>
      )}
      {!isAdmin && post.isReported == true && (
        <Menu.Item key="">
          <p className="btn btn-menu btn-dg">You reported this content</p>
        </Menu.Item>
      )}
      {isAdmin && (
        <Menu.Item key="delete">
          <button className="btn btn-menu btn-dg">
            Delete this {" "}
            {post.type === PostType.Poll
              ? "poll"
              : type === PostType.Initiative
              ? "initiative"
              : "post"}
          </button>
        </Menu.Item>
      )}
    </Menu>
  );

  /**
   * Handle input poll change
   * @date 2021-11-04
   * @param {React.ChangeEventHandler} ChangeEventHandler
   */
  const onPollChange = (e: any) => {
    console.log('on poll change', e.target.value)
    setPollId(e.target.value);
  };

  /**
   * Handle vote
   */
   const getOptiondata = async () => {
    const tenantName: any = localStorage.getItem('tenantName');
    try{
      const _optionData = await postService.getOptionData(tenantName, parseInt(post.id!))
      console.log('option data updated', _optionData, _optionData.length)
      setOptionData(_optionData)
    } catch(err){
      console.log('error in get data option',err)
    }
  }
  const onVote = async () => {
    const tenantName: any = localStorage.getItem('tenantName');
    setVoteError("");
    // if (!pollId) {
    //   // setVoteError("Pl");
    //   return;
    // }
    if (post.closeDate) {
      const diff = moment(post.closeDate).diff(moment(), "days");
      console.log(diff);

      // setExpiredVote(diff < 0);
      // if (diff < 0) return;
    }
    // const poll = post.polls?.find((x) => x.id === pollId);
    // if (poll) {
      post.is_voted = true;
      post.votes = (post.votes || 0) + 1;
      // poll.count_voted += 1;
      try {
        setPost({ ...post });
        console.log('before call post', post)
        let body : any = {}
        body.thirdPerson = post.user?.id
        body.userId = user.id
        body.contentId = post.id
        body.optionId = pollId
        body.tenant = tenantName
        body.isAnonymous = post.isAnonymous
        console.log('before vote', body)
        getOptiondata()
        let rs = await postService.vote(body);
        const _karmaPoint: any = KamrmaValueGeneration(types_points.VOTE, source.POLL)
        if(user.id == post.user?.id && post.isAnonymous != true){
          setKarmaPointState(karmaPointState + _karmaPoint)
        }
        setFlagOpton(!flagOpton)
        // mouse1
        console.log('data from post vote result', rs)
        // mouse
      } catch (error) {
        // poll.count_voted -= 1;
        post.votes -= 1;
        post.is_voted = false;
        setPost({ ...post });
        setVoteError(error);
      }
    // }
    dispatch(postAction.updateLocal(post));
  };

  const onVoteFor = async () => {
    setDialogConfirmVote(true);
    setVoteTypeSelected("for");
    // if (post.closeDate) {
    //   const diff = moment(post.closeDate).diff(moment(), "days");
    //   setExpiredVote(diff < 0);
    //   if (diff < 0) return;
    // }
    // if (post.user_voted === VOTE_INITIATIVE.For) return;
    // if (post.type === PostType.Initiative) {

    // }
  };

  const onVoteAgainst = async () => {
    setDialogConfirmVote(true);
    setVoteTypeSelected("against");
  };

  const handleInitiativeVote = async () => {
    const tenantName: any = localStorage.getItem('tenantName');
    setDialogConfirmVote(false);
    if (post.closeDate) {
      const diff = moment(post.closeDate).diff(moment(), "days");
      setExpiredVote(diff < 0);
      if (diff < 0) return;
    }
    let postUpdate = { ...post };
    if (post.user_voted) return;
    if (post.type === PostType.Initiative) {
      if (voteTypeSelected === "against") {
        const voteFor =
          (post.votes_for || 0) -
          (post.user_voted === VOTE_INITIATIVE.For ? 1 : 0);
        const voteAgainst = (post.votes_against || 0) + 1;
        const vote = Math.round((voteFor / (voteAgainst + voteFor)) * 100);
        setVoteForPercent(vote);
        setPost({
          ...post,
          is_voted: true,
          user_voted: VOTE_INITIATIVE.Against,
          votes_for: voteFor,
          votes_against: voteAgainst,
        });
        postUpdate = {
          ...postUpdate,
          is_voted: true,
          user_voted: VOTE_INITIATIVE.Against,
          votes_for: voteFor,
          votes_against: voteAgainst,
        };
        try {
            let body : any = {}
            body.tenant = tenantName
            body.response = 'NEGATIVE'
            body.thirdPerson = post.user?.id
            body.userId = user.id
            body.contentId = post.id
          await postService.voteInitiative(body);
        } catch (error) {}
      } else {
        const voteFor = (post.votes_for || 0) + 1;
        const voteAgainst =
          (post.votes_against || 0) -
          (post.user_voted === VOTE_INITIATIVE.Against ? 1 : 0);
        const vote = Math.round((voteFor / (voteAgainst + voteFor)) * 100);
        setVoteForPercent(vote);
        setPost({
          ...post,
          is_voted: true,
          user_voted: VOTE_INITIATIVE.For,
          votes_for: voteFor,
          votes_against: voteAgainst,
        });
        postUpdate = {
          ...postUpdate,
          is_voted: true,
          user_voted: VOTE_INITIATIVE.For,
          votes_for: voteFor,
          votes_against: voteAgainst,
        };
        try {
            let body : any = {}
            body.tenant = tenantName
            body.response = 'POSITIVE'
            body.thirdPerson = post.user?.id
            body.userId = user.id
            body.contentId = post.id
          await postService.voteInitiative(body);
        } catch (error) {}
      }
    }
    setVoteTypeSelected(undefined);
    dispatch(postAction.updateLocal(postUpdate));
  };

  const updateReported = async (isHide: boolean) => {
    if (!report && view !== PostView.report) return;
    try {
      const data = {
        id: report?.id,
        approve: !isHide,
        hidden: isHide,
      };
      await reportService.updatePostReported(data);
      setHidden(true);
      notification.success({
        key: `${Date.now()}`,
        message: isHide ? "Hidden Success" : "Approved Success",
        duration: 2,
      });
    } catch (error) {}
  };

  const republish = async () => {
    if (!report && view !== PostView.hidden) return;
    try {
      await reportService.republishPost(post.id);
      setHidden(true);
      notification.success({
        key: `${Date.now()}`,
        message: "Republished!",
        duration: 2,
      });
    } catch (error) {}
  };

  const onCancelReview = () => {
    setDialogCancelReviewing(true);
  };

  const onCancelReviewPost = async () => {
    try {
      await postService.cancelReviewPost(post.id);
      setHidden(true);
      if (onPostDeleted) onPostDeleted();
    } catch (error: any) {
      notification.error({
        key: `${Date.now()}`,
        message: error,
      });
    }
    setDialogCancelReviewing(false);
    dispatch(postAction.updateLocal(post));
  };

  const onApproveReviewPost = async () => {
    try {
      await postService.approveReviewPost(post.id);
      setHidden(true);
    } catch (error: any) {
      notification.error({
        key: `${Date.now()}`,
        message: error,
      });
    }
  };

      /**
   * Debouncing Like and Dislike
   */
       const debouncedLike = debounce(onLike, 250)
       const debouncedDislike = debounce(onDislike, 250)

  // const  getUserId = () => {
  //   console.log('inside getuserbyid function')
  //   try {
  //     let username = userService.getById(tenant,post.user?.id);
  //     return username
  //   } catch (error: any) {
  //   console.log('error in getting username', error)
  //   }
  // };
  const onRemoveReviewPost = async () => {
    try {
      await postService.removeReviewPost(post.id);
      setHidden(true);
    } catch (error: any) {
      notification.error({
        key: `${Date.now()}`,
        message: error,
      });
    }
  };

  return (
    <>
      {!hidden && (
        <div key={`post-${post.id}`}>
          {view === PostView.report && (
            <div className="post-box-report">

              <Stack
                direction="horizontal"
                gap={2}
                className="align-items-center mb-2 mt-2"
              >
                <div onClick={onProfileReported}>
                  <Avatar
             src={
              // report?.user?.avatar ||
              images.AVATAR_KEYS[report?.user?.avatar || "avatar1"]
            }
                  />
                </div>
                <label className="text-user" onClick={onProfileReported}>
                  {report?.user?.userName} reported this{" "}
               poll
                </label>
                <div className="ms-auto">
                  <IcoMoon icon="time" /> {moment(post?.creationDate).fromNow()}
                </div>
              </Stack>
            </div>
          )}
          <div
            className={`post 
              box-initiative
             ${post.theme || ""}`}
          >
            <Stack
              className={`v-head`}
            >
              <Stack direction="horizontal">
      
              <Tag
                  className="category-name"
                  color="white"
                  onClick={onViewCategory}
                  // style={
                  //   post.category?.color === "#222222"
                  //     ? { color: "#222222" }
                  //     : {}
                  // }
                >
                  {/* {console.log("hehehe", post.categories[0].title)} */}
                  {post.categories && post.categories.length !==0 &&  post.categories[0].title
                    ? post.categories[0].title
                    : "General"}
                </Tag>
                
                <div className="flex-fill p-1" onClick={onGoPostDetail} />
                {view !== PostView.report && (
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
                )}
              </Stack>
              <Stack
                  direction="horizontal"
                  gap={2}
                  className="align-items-center mb-2 mt-2"
                >
                  <div onClick={onProfileView}>
                  <Avatar
                     src={
                      post.isAnonymous
                        ? images.avatarAnonymous
                        : isMyPost
                        ? user?.avatarLink ||
                          images.AVATAR_KEYS[user?.avatar || "avatar1"]
                        : post.user?.avatarLink ||
                          images.AVATAR_KEYS[post.user?.avatar || "avatar1"]
                    }
                    />
                  </div>
                  <label className="text-user" onClick={onProfileView}>
                    { post?.isAnonymous ? "Anonymous" : post.user && post.user.userName}
                  </label>

                  {user.id == post.user?.id! && <Tag className="tag-outline user-name">You</Tag>}
                  {post.user?.role === UserRole.ADMIN && (
                    <Tag color={colors.pink} onClick={onProfileView} className="user-name">
                      ADMIN
                    </Tag>
                  )}
                  <div className="flex-fill p-3" onClick={onGoPostDetail} />
                </Stack>
              <h5 className="text-title" onClick={onGoPostDetail}>
                {post.title}
              </h5>
              {/* <p className="text-description">
          
          </p> */}
              <ShowMoreText
                lines={3}
                more="See more"
                less="See less"
                className="text-description"
                anchorClass="btn-more"
                expanded={false}
                truncatedEndingComponent={"... "}
              >
                <span onClick={onGoPostDetail}>{post.description}</span>
              </ShowMoreText>
            </Stack>
            <Stack className="v-body">
              {!!post.options && post.options.length > 0 && (
                <Stack className="mt-3" gap={3}>
                  {(!!isVoted || expiredVote) &&
                   optionData.length>1 && optionData.map((p: any) => (
                      <Stack
                        gap={3}
                        key={`vote-${p.id}`}
                        onClick={onGoPostDetail}
                      >
                        <Stack direction="horizontal" className="v-vote">
                          <div
                            className="vote-value"
                            style={{ width: `${p.count || 0}%` }}
                          ></div>
                          <label>{p.title}</label>
                          <label className="ms-auto">{`${
                            Math.round((p.count || 0) * 100) / 100
                          }%`}</label>
                        </Stack>
                      </Stack>
                    ))}
                {(!!isVoted || expiredVote) &&
                   optionData.length<2 && optionData.map((p: any) => (
                    (p.id == pollId ? 
                      <Stack
                        gap={3}
                        key={`vote-1`}
                        onClick={onGoPostDetail}
                      >
                        <Stack direction="horizontal" className="v-vote">
                          <div
                            className="vote-value"
                            style={{ width: `${p.count || 0}%` }}
                          ></div>
                         <label>{p.title}</label> 
                          
                          <label className="ms-auto">{`${
                            Math.round((p.count || 0) * 10) / 10
                          }%`}</label>
                        </Stack>
                      </Stack>:    <Stack
                        gap={3}
                        key={`vote-1`}
                        onClick={onGoPostDetail}
                      >
                        <Stack direction="horizontal" className="v-vote">
                          <div
                            className="vote-value"
                            style={{ width: `${p.count || 0}%` }}
                          ></div>
                         <label>{p.title}</label> 
                          <label className="ms-auto">{`${
                            Math.round((p.count || 0) * 10) / 10
                          }%`}</label>
                        </Stack>
                      </Stack>)
                   ))}
                  {!!voteError && <p className="text-error"></p>}

                  <Stack gap={3}>
                    {!isVoted && !expiredVote && (
                      <Radio.Group onChange={onPollChange}>
                        <Space direction="vertical" className="w-100">
                          {post.options?.map((p: any) => {
                            return (
                              <Radio key={`option-${p.id}`} value={p.id}>
                                <span className="text-poll" >{p.title}</span>
                              </Radio>
                            );
                          })}
                        </Space>
                      </Radio.Group>
                    )}
                    <Stack direction="horizontal" gap={2}>
                      {!expiredVote && (
                        <Button
                          size="sm"
                          disabled={!pollId || isVoted}
                          onClick={onVote}
                          className={`btn-vote ${isVoted && "voted"}`}
                        >
                          {isVoted ? "Voted" : "Vote"}
                        </Button>
                      )}
                      <label className="text-votes">
                        {" "}
                        {post.votes || 0} member
                        {(post?.votes || 0) > 1 || (post?.votes || 0) == 0? "s have " : " has "}
                        voted
                      </label>
                    </Stack>
                  </Stack>
                </Stack>
              )}
              {!!post.type && post.closeDate && (
                <p className="text-poll-end mt-2 mb-2" onClick={onGoPostDetail}>
                  Poll {expiredVote ? "has ended" : "ends"} on{" "}
                  {moment(post.closeDate).format("LLL")}
                </p>
              )}
{/* commented code */}
                    {post?.hashTags && (
                <div className="hashtag mt-2">
                  {post.hashTags?.map((tag: any, i: any) => (
                    <label
                    className="label-haashtag"
                      key={`tag-${post.id}-${i}`}
                      onClick={() => onHashtagClick(tag.title.replace(
                        "#",
                        ""))}
                    >
                      {tag.title}{" "}
                    </label>
                  ))}
                </div>
              )}
             {!!post?.imageUrl && (
                <Image src={post.imageUrl} width={"100%"} className="mt-2" />
              )}
              {!!post.link && (
                <LinkPreview
                  url={utils.parseURL(post.link)}
                  width="100%"
                  className="mt-2"
                />
              )}
              <Stack direction="horizontal" gap={2} className="mt-2">
                {!isInReview && (
                  <>
                    <button className="btn-action" onClick={debouncedLike}>
                      <IcoMoon
                        icon="like"
                        color={post.is_liked ? colors.pink : ""}
                      />
                      {post.likes || 0}
                    </button>
                    <button className="btn-action" onClick={debouncedDislike}>
                      <IcoMoon
                        icon="dislike"
                        color={post.is_disliked ? colors.pink : ""} 
                      />{" "}
                      {post.dislikes || 0}
                    </button>
                    <button className="btn-action" onClick={onGoPostDetail}>
                      <IcoMoon icon="comment" /> {post.total_comments || 0}
                    </button>
                    <button className="btn-action mobile-only" onClick={onShareOpen}>
                      <IconShare />
                    </button>   
                    <DesktopShareDropdown/>
                    <div className="flex-fill p-2" onClick={onGoPostDetail} />
                  </>
                )}

                <div className="ms-auto" onClick={onGoPostDetail}>
                  <IcoMoon icon="time" /> {moment(post.creationDate).fromNow()}
                </div>
              </Stack>
            </Stack>
          </div>
          {/* have to check */}
          {view === PostView.report && (
            <div className="post-box-report">
              <Stack>
                <span className="text-reason">Reason:</span>
                <span className="text-content">{report?.why}</span>
              </Stack>
              <Stack direction="horizontal" gap={2} className="mt-3">
                <button
                  className="btn flex-fill btn-approve"
                  onClick={updateReported.bind(null, false)}
                >
                  Approve content
                </button>
                <button
                  className="btn flex-fill btn-hidden"
                  onClick={updateReported.bind(null, true)}
                >
                  Hide content
                </button>
              </Stack>
            </div>
          )}
          {view === PostView.hidden && (
            <div className="post-box-report">
              {!!post?.why_hidden && (
                <Stack>
                  <span className="text-reason">Reason:</span>
                  <span className="text-content">{post?.why_hidden}</span>
                </Stack>
              )}
              {!!post?.hidden_at && (
                <Stack>
                  <span className="text-reason">Hidden on:</span>
                  <span className="text-content">
                    {moment(post?.hidden_at).format("LLLL")}
                  </span>
                </Stack>
              )}
              <Stack direction="horizontal" gap={2} className="mt-3">
                <button
                  className="btn flex-fill btn-approve"
                  onClick={republish}
                >
                  Republish content
                </button>
              </Stack>
            </div>
          )}
          {isInReview && (
            <div className="post-box-report">
              <Stack direction="horizontal" gap={2} className="mt-1">
                {!isAdmin && (
                  <button
                    className={`btn flex-fill ${
                      post.in_review && "btn-cancel"
                    }`}
                    onClick={onCancelReview}
                  >
                    Cancel review and delete content
                  </button>
                )}
                {isAdmin && (
                  <>
                    <button
                      className="btn flex-fill btn-approve"
                      onClick={onApproveReviewPost.bind(null, false)}
                    >
                      Approve content
                    </button>
                    <button
                      className="btn flex-fill btn-hidden"
                      onClick={onRemoveReviewPost.bind(null, true)}
                    >
                      Remove content
                    </button>
                  </>
                )}
              </Stack>
            </div>
          )}
        </div>
      )}
      <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogDelete}
        message="Are you sure you want to delete this post?"
        okText="Yes, I’m sure"
        onCancel={() => {
          setDialogDelete(false);
        }}
        onOk={onDeletePost}
      />
      {dialogConfirmVote && (
        <ModalConfirm
          type={ModalConfirmType.Default}
          visible={dialogConfirmVote}
          renderIcon={<IcoMoon icon="hand" size={30} color={colors.mint} />}
          message={
            <>
              <span>Have your say! [use 2 points]</span>
              <br />
              <span>
                Join the debate and share your reasons in the comments
              </span>
            </>
          }
          okText="Yes, I’m sure"
          onCancel={() => {
            setDialogConfirmVote(false);
          }}
          onOk={handleInitiativeVote}
        />
      )}
      {visibleEditPost && 
      screenWidth < 1200 && 
        <Modal show={visibleEditPost} animation={false}>
          <ActionSheetPost
            open={visibleEditPost}
            postData={post}
            type={post.type}
            onClose={onEditPostClose}
          />
        </Modal>
      }
      {dialogShare && (
        <Modal show={dialogShare} animation={false}>
          <ShareSocialSheet
            open={dialogShare}
            onClose={onShareClose}
            url={urlShare}
          />
        </Modal>
      )}
      {dialogReport && (
        <Modal show={dialogReport} animation={false}>
          <ReportContentSheet
            open={dialogReport}
            onClose={onReportClose}
            data={post}
          />
        </Modal>
      )}
      <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogCancelReviewing}
        message="Are you sure you want to cancel review? Your content will be deleted and will not be saved for any further reviews."
        cancelText="Revise"
        okText="Yes, I’m sure"
        onCancel={() => {
          setDialogCancelReviewing(false);
        }}
        onOk={onCancelReviewPost}
      />
    </>
    // <>
    //   {!hidden && (
    //     <div key={`post-${post.id}`}>
    //       {view === PostView.report && (
            // <div className="post-box-report">
            //   <Stack
            //     direction="horizontal"
            //     gap={2}
            //     className="align-items-center mb-2 mt-2"
            //   >
            //     <div onClick={onProfileReported}>
            //       <Avatar
            //         src={
            //           report?.user?.avatar?.url ||
            //           images.AVATAR_KEYS[report?.user?.avatar_key || "avatar1"]
            //         }
            //       />
            //     </div>
            //     <label className="text-user" onClick={onProfileReported}>
            //       {report?.user?.username} reported this{" "}
            //       {post.type === PostType.Poll
            //         ? "poll"
            //         : type === PostType.Initiative
            //         ? "initiative"
            //         : "post"}
            //     </label>
            //     <div className="ms-auto">
            //       <IcoMoon icon="time" /> {moment(report?.created_at).fromNow()}
            //     </div>
            //   </Stack>
            // </div>
    //       )}
    //       <div
    //         className={`post ${
    //           post.type === PostType.Initiative && "box-initiative"
    //         } ${post.theme_type || ""}`}
    //       >
    //         <Stack
    //           className={`v-head ${
    //             post.type === PostType.Initiative && "initiative-bg"
    //           }`}
    //         >
    //           <Stack direction="horizontal">
    //             {post.type !== PostType.Initiative && (
    //               <Tag
    //                 className="category-name"
    //                 color={post.category?.color}
    //                 onClick={onViewCategory}
    //                 style={
    //                   post.category?.color === "#222222"
    //                     ? { color: "#222222" }
    //                     : {}
    //                 }
    //               >
    //                 {post.category?.name}
    //               </Tag>
    //             )}
    //             {post.type === PostType.Initiative && (
    //               <Tag className="tag-category" onClick={onViewCategory}>
    //                 {post.category?.name}
    //               </Tag>
    //             )}
    //             <div className="flex-fill p-1" onClick={onGoPostDetail} />
    //             {view !== PostView.report && (
    //               <Dropdown
    //                 overlay={menu}
    //                 placement="bottomRight"
    //                 className="ms-auto"
    //                 trigger={["click"]}
    //               >
    //                 <button className="btn">
    //                   {post.type === PostType.Initiative ? (
    //                     <IconMoreWhite />
    //                   ) : (
    //                     <IconMore />
    //                   )}
    //                 </button>
    //               </Dropdown>
    //             )}
    //           </Stack>
    //           {post.type !== PostType.Initiative && (
    //             <Stack
    //               direction="horizontal"
    //               gap={2}
    //               className="align-items-center mb-2 mt-2"
    //             >
    //               <div onClick={onProfileView}>
    //                 <Avatar
    //                   src={
    //                     post?.is_anonymous
    //                       ? images.avatarAnonymous
    //                       : post?.user?.avatar?.url ||
    //                         images.AVATAR_KEYS[
    //                           post?.user?.avatar_key || "avatar1"
    //                         ]
    //                   }
    //                 />
    //               </div>
    //               <label className="text-user" onClick={onProfileView}>
    //                 {post?.is_anonymous ? "Anonymous" : post.user?.username}
    //               </label>

    //               {isMyPost && <Tag className="tag-outline user-name">You</Tag>}
    //               {post.user?.is_role === UserRole.ADMIN && (
    //                 <Tag color={colors.pink} onClick={onProfileView} className="user-name">
    //                   ADMIN
    //                 </Tag>
    //               )}
    //               <div className="flex-fill p-3" onClick={onGoPostDetail} />
    //             </Stack>
    //           )}
    //           <h5 className="text-title" onClick={onGoPostDetail}>
    //             {post.title}
    //           </h5>
    //           {/* <p className="text-description">
          
    //       </p> */}
    //           <ShowMoreText
    //             lines={3}
    //             more="See more"
    //             less="See less"
    //             className="text-description"
    //             anchorClass="btn-more"
    //             expanded={false}
    //             truncatedEndingComponent={"... "}
    //           >
    //             <span onClick={onGoPostDetail}>{post.description}</span>
    //           </ShowMoreText>
    //         </Stack>
    //         <Stack className="v-body">
    //           {!!post.polls && post.polls.length > 0 && (
    //             <Stack className="mt-3" gap={3}>
    //               {(!!isVoted || expiredVote) &&
    //                 votesData.map((p) => (
    //                   <Stack
    //                     gap={3}
    //                     key={`vote-${p.id}`}
    //                     onClick={onGoPostDetail}
    //                   >
    //                     <Stack direction="horizontal" className="v-vote">
    //                       <div
    //                         className="vote-value"
    //                         style={{ width: `${p.percent || 0}%` }}
    //                       ></div>
    //                       <label>{p.title}</label>
    //                       <label className="ms-auto">{`${
    //                         Math.round((p.percent || 0) * 10) / 10
    //                       }%`}</label>
    //                     </Stack>
    //                   </Stack>
    //                 ))}
    //               {!!voteError && <p className="text-error"></p>}

    //               <Stack gap={3}>
    //                 {!isVoted && !expiredVote && (
    //                   <Radio.Group onChange={onPollChange}>
    //                     <Space direction="vertical" className="w-100">
    //                       {post.polls?.map((p) => {
    //                         return (
    //                           <Radio key={`option-${p.id}`} value={p.id}>
    //                             <span className="text-poll">{p.title}</span>
    //                           </Radio>
    //                         );
    //                       })}
    //                     </Space>
    //                   </Radio.Group>
    //                 )}
    //                 <Stack direction="horizontal" gap={2}>
    //                   {!expiredVote && (
    //                     <Button
    //                       size="sm"
    //                       disabled={!pollId || isVoted}
    //                       onClick={onVote}
    //                       className={`btn-vote ${isVoted && "voted"}`}
    //                     >
    //                       {isVoted ? "Voted" : "Vote"}
    //                     </Button>
    //                   )}
    //                   <label className="text-votes">
    //                     {" "}
    //                     {post.votes} member
    //                     {(post?.votes || 0) > 1 ? "s have " : " has "}
    //                     voted
    //                   </label>
    //                 </Stack>
    //               </Stack>
    //             </Stack>
    //           )}
    //           {post.type === PostType.Initiative && (
    //             <Stack className="v-vote-initiative" gap={3}>
    //               <div>{post.initiative_business}</div>
    //               <Stack direction="horizontal" gap={3}>
    //                 <span className="text-for">FOR</span>
    //                 <Stack
    //                   direction="horizontal"
    //                   className={`v-vote ${!totalVotes && "disable"}`}
    //                   onClick={onGoPostDetail}
    //                 >
    //                   <div
    //                     className="vote-value"
    //                     style={{
    //                       width: `${voteForPercent}%`,
    //                     }}
    //                   ></div>
    //                   <label>{`${voteForPercent}%`}</label>
    //                   <label className="ms-auto">{`${
    //                     totalVotes ? 100 - voteForPercent : 0
    //                   }%`}</label>
    //                 </Stack>
    //                 <span className="text-against">AGAINST</span>
    //               </Stack>
    //               {!isVoted && !expiredVote && (
    //                 <Stack direction="horizontal" gap={3}>
    //                   <button
    //                     className="btn flex-fill btn-for col-6"
    //                     onClick={onVoteFor}
    //                     disabled={post.user_voted === VOTE_INITIATIVE.For}
    //                   >
    //                     VOTE FOR
    //                   </button>
    //                   <button
    //                     className="btn flex-fill btn-against col-6"
    //                     onClick={onVoteAgainst}
    //                     disabled={post.user_voted === VOTE_INITIATIVE.Against}
    //                   >
    //                     VOTE AGAINST
    //                   </button>
    //                 </Stack>
    //               )}
    //               <label className="text-votes">
    //                 {(post.votes_for || 0) + (post.votes_against || 0)} member
    //                 {(post.votes_for || 0) + (post.votes_against || 0) > 1
    //                   ? "s have "
    //                   : " has "}
    //                 voted
    //               </label>
    //             </Stack>
    //           )}
    //           {/* {post.type === PostType.Initiative && (
    //             <Stack
    //               direction="horizontal"
    //               gap={2}
    //               className="align-items-center mb-2 mt-2"
    //               onClick={onProfileView}
    //             >
    //               <Avatar
    //                 src={
    //                   post.is_anonymous
    //                     ? images.avatarAnonymous
    //                     : post.user?.avatar?.url ||
    //                       images.AVATAR_KEYS[post.user?.avatar_key || "avatar1"]
    //                 }
    //               />
    //               <label className="text-user">
    //                 {post.is_anonymous ? "Anonymous" : post.user?.username}
    //               </label>
    //               started the initiative
    //             </Stack>
    //           )} */}
    //           {/* {!!post.type && post.closeDate && (
    //             <p className="text-poll-end mt-2 mb-2" onClick={onGoPostDetail}>
    //               Poll {expiredVote ? "has ended" : "ends"} on{" "}
    //               {moment(post.closeDate).format("LLL")}
    //             </p>
    //           )} */}

    //           {/* {post.hashtags && (
    //             <div className="hashtag mt-2">
    //               {post.tags?.map((tag, i) => (
    //                 <Link
    //                   key={`tag-${post.id}-${i}`}
    //                   to={`${routes.SearchPage}?hashtag=${tag.replace(
    //                     "#",
    //                     ""
    //                   )}`}
    //                 >
    //                   {tag}{" "}
    //                 </Link>
    //               ))}
    //             </div>
    //           )} */}
    //           {!!post.image.url && (
    //             <Image src={post.image.url} width={"100%"} className="mt-2" />
    //           )}
    //           {!!post.link && (
    //             <LinkPreview
    //               url={utils.parseURL(post.link)}
    //               width="100%"
    //               className="mt-2"
    //             />
    //           )}
    //           <Stack direction="horizontal" gap={2} className="mt-2">
    //             {!isInReview && (
    //               <>
    //                 <button className="btn-action" onClick={onLike}>
    //                   <IcoMoon
    //                     icon="like"
    //                     color={post.is_liked ? colors.pink : ""}
    //                   />
    //                   {post.likes || 0}
    //                 </button>
    //                 <button className="btn-action" onClick={onDislike}>
    //                   <IcoMoon
    //                     icon="dislike"
    //                     color={post.is_disliked ? colors.pink : ""} 
    //                   />{" "}
    //                   {post.dislikes || 0}
    //                 </button>
    //                 <button className="btn-action" onClick={onComment}>
    //                   <IcoMoon icon="comment" /> {post.total_comments || 0}
    //                 </button>
    //                 <button className="btn-action mobile-only" onClick={onShareOpen}>
    //                   <IconShare />
    //                 </button>   
    //                 <DesktopShareDropdown/>
    //                 <div className="flex-fill p-2" onClick={onGoPostDetail} />
    //               </>
    //             )}

    //             <div className="ms-auto" onClick={onGoPostDetail}>
    //               <IcoMoon icon="time" /> {moment(post.created_at).fromNow()}
    //             </div>
    //           </Stack>
    //         </Stack>
    //       </div>
    //       {view === PostView.report && (
    //         <div className="post-box-report">
    //           <Stack>
    //             <span className="text-reason">Reason:</span>
    //             <span className="text-content">{report?.why}</span>
    //           </Stack>
    //           <Stack direction="horizontal" gap={2} className="mt-3">
    //             <button
    //               className="btn flex-fill btn-approve"
    //               onClick={updateReported.bind(null, false)}
    //             >
    //               Approve content
    //             </button>
    //             <button
    //               className="btn flex-fill btn-hidden"
    //               onClick={updateReported.bind(null, true)}
    //             >
    //               Hide content
    //             </button>
    //           </Stack>
    //         </div>
    //       )}
    //       {view === PostView.hidden && (
    //         <div className="post-box-report">
    //           {!!post?.why_hidden && (
    //             <Stack>
    //               <span className="text-reason">Reason:</span>
    //               <span className="text-content">{post?.why_hidden}</span>
    //             </Stack>
    //           )}
    //           {!!post?.hidden_at && (
    //             <Stack>
    //               <span className="text-reason">Hidden on:</span>
    //               <span className="text-content">
    //                 {moment(post?.hidden_at).format("LLLL")}
    //               </span>
    //             </Stack>
    //           )}
    //           <Stack direction="horizontal" gap={2} className="mt-3">
    //             <button
    //               className="btn flex-fill btn-approve"
    //               onClick={republish}
    //             >
    //               Republish content
    //             </button>
    //           </Stack>
    //         </div>
    //       )}
    //       {isInReview && (
    //         <div className="post-box-report">
    //           <Stack direction="horizontal" gap={2} className="mt-1">
    //             {!isAdmin && (
    //               <button
    //                 className={`btn flex-fill ${
    //                   post.in_review && "btn-cancel"
    //                 }`}
    //                 onClick={onCancelReview}
    //               >
    //                 Cancel review and delete content
    //               </button>
    //             )}
    //             {isAdmin && (
    //               <>
    //                 <button
    //                   className="btn flex-fill btn-approve"
    //                   onClick={onApproveReviewPost.bind(null, false)}
    //                 >
    //                   Approve content
    //                 </button>
    //                 <button
    //                   className="btn flex-fill btn-hidden"
    //                   onClick={onRemoveReviewPost.bind(null, true)}
    //                 >
    //                   Remove content
    //                 </button>
    //               </>
    //             )}
    //           </Stack>
    //         </div>
    //       )}
    //     </div>
    //   )}
    //   <ModalConfirm
    //     type={ModalConfirmType.Danger}
    //     visible={dialogDelete}
    //     message="Are you sure you want to delete this post?"
    //     okText="Yes, I’m sure"
    //     onCancel={() => {
    //       setDialogDelete(false);
    //     }}
    //     onOk={onDeletePost}
    //   />
    //   {dialogConfirmVote && (
    //     <ModalConfirm
    //       type={ModalConfirmType.Default}
    //       visible={dialogConfirmVote}
    //       renderIcon={<IcoMoon icon="hand" size={30} color={colors.mint} />}
    //       message={
    //         <>
    //           <span>Have your say! [use 2 points]</span>
    //           <br />
    //           <span>
    //             Join the debate and share your reasons in the comments
    //           </span>
    //         </>
    //       }
    //       okText="Yes, I’m sure"
    //       onCancel={() => {
    //         setDialogConfirmVote(false);
    //       }}
    //       onOk={handleInitiativeVote}
    //     />
    //   )}
    //   {visibleEditPost && (
    //     <Modal show={visibleEditPost} animation={false}>
    //       <ActionSheetPost
    //         open={visibleEditPost}
    //         postData={post}
    //         type={post.type}
    //         onClose={onEditPostClose}
    //       />
    //     </Modal>
    //   )}
    //   {dialogShare && (
    //     <Modal show={dialogShare} animation={false}>
    //       <ShareSocialSheet
    //         open={dialogShare}
    //         onClose={onShareClose}
    //         url={urlShare}
    //       />
    //     </Modal>
    //   )}
    //   {dialogReport && (
    //     <Modal show={dialogReport} animation={false}>
    //       <ReportContentSheet
    //         open={dialogReport}
    //         onClose={onReportClose}
    //         data={post}
    //       />
    //     </Modal>
    //   )}
    //   <ModalConfirm
    //     type={ModalConfirmType.Danger}
    //     visible={dialogCancelReviewing}
    //     message="Are you sure you want to cancel review? Your content will be deleted and will not be saved for any further reviews."
    //     cancelText="Revise"
    //     okText="Yes, I’m sure"
    //     onCancel={() => {
    //       setDialogCancelReviewing(false);
    //     }}
    //     onOk={onCancelReviewPost}
    //   />
    // </>
  );
}

export default PollComponent;
