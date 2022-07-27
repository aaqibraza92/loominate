import { Avatar, Col, Row, Skeleton } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Container, Dropdown, Nav, Stack } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import Div100vh from "react-div-100vh";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import CategorySelectModal from "../../components/category/CategorySelectModal";
import DesktopMenu from "../../components/desktopmenu/DesktopMenu";
import DesktopCategory from "../../components/desktopcategory/DesktopCategory";
import IcoMoon from "../../components/icon/IcoMoon";
import InputSearch from "../../components/input/InputSearch";
import ModalConfirm from "../../components/modal/ModalConfirm";
import AppNavBar from "../../components/navbar";
import BottomNavBar from "../../components/navbar/BottomNavBar";
import NavBarAdmin from "../../components/navbar/NavBarAdmin";
import PostItem from "../../components/post/PostItem";
import ViewEmpty from "../../components/view/ViewEmpty";
import Category from "../../models/category.model";
import { FeedFilter } from "../../models/feed.filter.model";
import Post from "../../models/post.model";
import User, { UserRole } from "../../models/user.model";
import feedAction from "../../redux/actions/feed.action";
import categoryService from "../../services/category.service";
import postService from "../../services/post.service";
import "./styles.scss";
import DesktopHashtags from "../../components/desktophashtags/DesktopHashtags";
import DesktopMyCommunity from "../../components/desktopmycommunity/DesktopMyCommunity";
import DesktopMyProfile from "../../components/desktopmyprofile/DesktopMyProfile";
import DesktopOurPurpose from "../../components/desktopourpurpose/DesktopOurPurpose";
import DesktopGuidelines from "../../components/desktopguidelines/DesktopGuidelines";
import DesktopCulture from "../../components/desktopculture/DesktopCulture";
import PlusIcon from "../../assets/images/PlusIcon";
import AlertModal from "../../components/AlertModal/AlertModal";
import CreatePostTrigger from "../../components/createpost/CreatePostTrigger";
import images from "../../assets/images/images";
import { Link } from "react-router-dom";
import HelpSupportSheet from "../../components/support/HelpSupportSheet";
import { homedir } from "os";
import authAction from "../../redux/actions/auth.action";
import { categoriesState, catIds, feedFilter, flagFeedUpdate, hashFilterValue, karmaPoints, notReadNotification, tenantNameState, wakeCats, wakeGetCat, wakeHastags } from "../../atoms/globalStates";
import { useRecoilState } from "recoil";
import storageKeys from "../../commons/constants/storageKeys.constant";
import Initiative from "../../components/post/Initiative";
import PollComponent from "../../components/post/PollComponent";
import NotificationDesktop from "../../components/notification/NotificationDesktop"
import moment from "moment";
import utils from "../../utils";
import userService from "../../services/user.service";
import { flushSync } from "react-dom";
import notificationService from "../../services/notification.service";
import api from "../../commons/constants/api.constant";
import HeaderDesktop from "../../components/header/HeaderDesktop";
// Recommended, Hot, Recent, Trending, Posts, Polls, Initiatives

const FILTERS = [
  {
    name: "Recent",
    value: "All",
    sortLikes: 'content.id',
  },
  {
    name:"Most Upvoted",
    value:"Most Upvoted",
    sortLikes: 'content.likes',
  },
  {
    name:"Most Downvote",
    value:"Most Downvote",
    sortLikes: 'content.dislikes',
  },
];

/**
 * Feed Page
 * @param props
 * @returns JSX.Element
 */
function FeedPage() {
  const [onSearchSubmit, setOnSearchSubmit] = useState(false);
  const params: any = useParams();
  const { id = null } = params;
  const history = useHistory();
  const dispatch = useDispatch();
  const { poolData } = useSelector((state: any) => state.auth);
  let { posts: dataPosts, searchUsers: dataUsers, categoriesSelected } = useSelector(
    (state: any) => state.feed
  );
  const user: User = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cat, setCat] = useRecoilState(categoriesState);
  const [getAllResult, setgetAllResult] = useState<Post[]>([]);
  const [flag_feed, setFlag_feed] = useRecoilState(flagFeedUpdate);
  const [dataRequest, setDataRequest] = useState<FeedFilter>({
    page: 1,
    per_page: 10,
    order: FILTERS[0].value,
    keywords: "",
    ...(user?.role === UserRole.ADMIN && !!id ? { company_id: id } : {}),
  });
  const [filterSelected, setFilterSelected] = useState(FILTERS[0]);
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const [visibleCategory, setVisibleCategory] = useState(false);
  const [btnToTop, setBtnToTop] = useState(false);
  const [dialogComingSoon, setDialogComingSoon] = useState(false);
  const postTopRef: any = useRef(null);
  const scrollRef: any = useRef();
  const [feedFilterState, setFeedFilter] = useRecoilState(feedFilter);
  const [countState, setcountState] = useState(5);
  const [countPosts, setcountPosts] = useState(0);
  const [likeInfoState, setlikeInfoState] = useState({});
  const [voteInfoState, setVoteInfoState] = useState({});
  const [filterState, setFilterState] = useState('All')
  const [flagNoPosts, setFlagNoPosts] = useState(false)
  const [flagNoPostString, setFlagNoPostsString] = useState('Oops...No more posts')
  const [wakeUpHashtagSearch, setWakeUpHashtagSearch] = useRecoilState(wakeHastags)
  const [hashTagFilter, setHashTagFilter] = useRecoilState(hashFilterValue)
  const [categoryIds, setCategoryIds] = useRecoilState(catIds)
  const [karmaPointsState, setKarmaPoints] = useRecoilState(karmaPoints)
  const [wakeCatState, setwakeCatState] = useRecoilState(wakeCats)
  const [selectedCatState, setselectedCatState] = useState([]);
  const [catFlagGetAll, setCatFlagGetAll] = useRecoilState(wakeGetCat)
  const [catIdsState, setCatIdsState] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useRecoilState(
    notReadNotification
  );
  // The scroll listener
  const handleScroll = useCallback((e) => {
    if (e) {
      if (e.target.scrollTop > 200) setBtnToTop(true);
      else setBtnToTop(false);
    }
  }, []);

  const tenantName = localStorage.getItem('tenantName')
  let  eventSource : EventSource;
  const eventName = user.id+"_"+tenantName;

  const getNotificationsNotReadCout = async () =>{
    let count = await notificationService.getNotReadCount(2)
    console.log("juju", count)
    setUnreadNotifications(count);
  }
  useEffect( () => {
   getNotificationsNotReadCout();
   eventSource  = new EventSource(`${api.NOTIFICATION_EVENT_API}/${user.id}?tenantname=${tenantName}`);
  eventSource.addEventListener(
   eventName, function(e) {
      const counter = parseInt(e.data);
      setUnreadNotifications(counter);
    });

    eventSource.onmessage = (e) =>{
      setUnreadNotifications(parseInt(e.data))
    }
  
    eventSource.onerror = (e) =>{
      // console.log("Error in notificatin event: ", e);
      // eventSource.close();
    } 
  }, []);

  useEffect(() => {
    console.log('filertCheck')
    let _filter: any = {};
    _filter.sortLikes = filterSelected.sortLikes
    _filter.name = filterSelected.name
    _filter.value = feedFilterState.value
    console.log('filterValueCheck', _filter)
    onFilterChange(_filter)
    console.log('inside useefect of polls', feedFilterState)
  }, [feedFilterState]);

  useEffect(() => {
    if (scrollRef) {
      const div = scrollRef.current;
      div.addEventListener("scroll", handleScroll);
    }
  }, [scrollRef]);

  
  useEffect(() => {
    console.log('insideFeedwakeUp')
    getUserDetails();
  }, [wakeCatState]);

  const getUserDetails = async () => {
    const tenantName: any = localStorage.getItem('tenantName')
    let user_rs: any = await userService.getUser(tenantName, user.userName)
    user_rs.categories && setselectedCatState(user_rs.categories)
    console.log('userCatInFeed',  user_rs.categories)
  }


  useEffect(() => {
    console.log('useeffect of hashtag', hashTagFilter)
    setcountPosts(0)
    setFlag_feed(!flag_feed)
  }, [wakeUpHashtagSearch]);

  const scrollToTop = () => {
    if (postTopRef) {
      postTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
console.log('flagfeedCheck', flag_feed)
  useEffect(() => {
    setPosts([])
    getPosts()
    // dataPosts = []
    setcountState(5)
    
    console.log('dataposts in feed change', dataPosts)
    console.log('dataPosts in useffect', dataPosts)
    console.log('flag_feed',flag_feed)
  }, [flag_feed]);

  const getPosts = async (search?: boolean, keyword?: string) => {
    // if (!auth_token) return;
    setFlagNoPosts(false)
    try {
      const tenantName: any = localStorage.getItem("tenantName");
      console.log("tenant name in feed", tenantName)
      let rs: any;

      // let users: any;
      console.log("search inside getPosts", onSearchSubmit)
      if (search && keyword?.length !== 0) {
        setHashTagFilter({name: '', value: ''})
        const result = await postService.getAllBySearch(tenantName, {
          take: 20,
          order: "DESC",
          searchValue: keyword,
          id: user.id
        });
        rs = result.content;
        // users = result.users;
        console.log("calling search", rs)
      } else if(hashTagFilter.name == 'hashtag') {
        rs = await postService.contentByHastag(tenantName,parseInt(user.id!),hashTagFilter.value,{  order: "DESC", take: 5, skip: 0 , filter: filterState});
        console.log('inside hashtag condition', rs)
        if(rs.length < 1 ) {
          setFlagNoPosts(true)
          setFlagNoPostsString('Oops.....No posts yet')
        }
      } 
      else {
        setHashTagFilter({name: '', value: ''})

        const ids: any = user.categories && user.categories.map((x: any) => {
          x.selected = true;
          return x.id || "";
        });
        console.log('idsssrecoil', categoryIds)
        let _ids = localStorage.getItem('catIds')
        let tempIds = ''
        console.log('idsLocal', _ids)
        if(_ids){
          tempIds = JSON.parse(_ids)
        } else {
          tempIds = ids
        }
        console.log('tempId', tempIds)
        console.log('checkOrderFilter', filterSelected)
        rs = await postService.getAll(tenantName,{  order: "DESC", take: 5, skip: 0,  orderFilter: filterSelected.sortLikes, filter: filterState},parseInt(user.id!), tempIds);
        setOnSearchSubmit(false)
        console.log("calling all", rs)
        if(rs.length < 1 ) {
          setFlagNoPosts(true)
          setFlagNoPostsString('Oops.....No posts yet')
        }
      }
      console.log("search inside getPosts", onSearchSubmit)
      // if (dataRequest.page > 1) {
      //   // console.log('posts from if feed page', rs.data[0])
      //   dispatch(feedAction.setPosts([...posts, ...rs]));
      // } else {
      // let count = 0;
      // const rs_likeInfo = await postService.getLikeInfo(tenantName, parseInt(user.id!));
      // console.log("likeinfo in feed page", rs_likeInfo);
      // rs.likeInfo = rs_likeInfo;
      // setlikeInfoState(rs_likeInfo);
      // const rs_voteInfo = await postService.getVoteInfo(tenantName, parseInt(user.id!));
      // console.log("voteinfo in feed page", rs_voteInfo);
      // rs.voteInfo = rs_voteInfo;
      // setVoteInfoState(rs_voteInfo);
      // console.log("check in rs for vote info", rs.rs_voteInfo);
      // rs.map(async (item: any) => {
      //   count++;
      //   setcountPosts(count);
      //   const rs_countLikes = await postService.countUpVote(
      //     tenantName,
      //     item.id
      //   );
      //   const rs_countDisLikes = await postService.countDownVote(
      //     tenantName,
      //     item.id
      //   );
      //   const rs_CountComment = await postService.countComment_byId(
      //     tenantName,
      //     { id: item.id }
      //   );

      //   console.log("countupVote in index", rs_countLikes, item.id);
      //   console.log("countdownVote in index", rs_countDisLikes, item.id);
      //   console.log("countComment in index", rs_CountComment, item.id);
      //   // item.votes_for = rs_countIniVote
      //   item.likes = rs_countLikes;
      //   item.dislikes = rs_countDisLikes;
      //   item.total_comments = rs_CountComment;
        // item.likeInfo = rs_likeInfo;
      //   if (item.type == "Initiative") {
      //     const rs_countIniVote = await postService.countIniVote(
      //       tenantName,
      //       item.id
      //     );
      //     item.votes_for = rs_countIniVote;
      //     console.log("initiative count", rs_countIniVote);
      //   }
      //   if (item.type == "Poll") {
      //     const rs_countIniVote = await postService.countIniVote(
      //       tenantName,
      //       item.id
      //     );
      //     item.votes = rs_countIniVote;
      //   }
      //   console.log("rs check", rs);
      //   // dispatch(feedAction.setPosts(rs));
      //   setgetAllResult(rs);
      // });
      // rs.map((item: any) => {
      //   item.likes = 80
      //   item.dislikes = 90;
      // })
      console.log("rs before dispatch", rs);
      dispatch(feedAction.setPosts([...rs]));
      // dispatch(feedAction.setUsers([...users]));
      // setSearchUsers([...users])
      // }
      console.log('posts from dispatch', posts)
      // setHasLoadMore(rs.meta.take > posts?.length + rs.posts?.length);
    } catch (error) {
      console.log("error from get posts", error);
    }
    setLoading(false);
  };

  const onProfileView = () => {
    // console.log('insideOnProfileViewPage', post.user?.userName!)
    // if (!!post?.user?.id && !post.isAnonymous) {
      history.push(routes.ViewProfilePage.replace(":id", user?.id+'/'+user.userName!));
    // }
  };


  const getPostsNext = async (search?: boolean, keyword?: string) => {
    // setFlagNoPosts(true)
    setFlagNoPosts(false)

    console.log('count next' , countState)
    console.log('hastagFilterNext', hashTagFilter)
    // if (!auth_token) return;
    try {
      const tenantName: any = localStorage.getItem("tenantName");
      let rs: any;
      // let users: any;
      console.log("search inside getPosts next", onSearchSubmit)
      if (onSearchSubmit) {
      setHashTagFilter({name: '', value: ''})
        const result = await postService.getAllBySearch(tenantName, {
          take: 20,
          skip: countState,
          order: "DESC",
          searchValue: keyword,
          id: user.id
        });
        rs = result.content;
        // users = result.users;
        console.log('')
        if(rs.length == 0) {
          console.log('inside rs.length', rs.length)
          setFlagNoPosts(true)
        }
        console.log("calling search")
      }else if(hashTagFilter.name == 'hashtag') {
        if(posts){
          if(posts.length > 4)
          
          rs = await postService.contentByHastag(tenantName,parseInt(user.id!),hashTagFilter.value,{  order: "DESC", take: 5, skip: countState , filter: filterState});
          console.log('inside hashtag condition', rs)
          if(rs.length == 0 ) {
            // do nothing
            console.log('do nothing')
            console.log('inside rs.length', rs.length)
            setFlagNoPosts(true)
          }
          else{
            setcountState(countState + 5)
          }
        }

      }
      else {
        console.log('inside else next', hashTagFilter)
        console.log('userreduxCat',  user.user_categories)
        setHashTagFilter({name: '', value: ''})
        // let user_rs: any = await userService.getUser(tenantName, user.userName)
        // console.log('getUserById', user_rs)
        console.log('getUserByIdReduxsInFeed', user)

        const ids: any = user.categories && user.categories.map((x: any) => {
          x.selected = true;
          return x.id || "";
        });

        console.log('catIds',ids)
        let _ids = localStorage.getItem('catIds')
        let tempIds = ''
        console.log('idsLocal', _ids)
        if(_ids){
          tempIds = JSON.parse(_ids)
        } else {
          tempIds = ids
        }
        rs = await postService.getAll(tenantName,{  order: "DESC", take: 5, skip: countState , orderFilter: filterSelected.sortLikes, filter: filterState},parseInt(user.id!),tempIds);
        setOnSearchSubmit(false)
        console.log("calling all next", rs)
        
        if(rs.length == 0) {
          console.log('inside rs.length', rs.length)
          setFlagNoPosts(true)
        }
        setcountState(countState + 5)
      }
      console.log("search inside getPosts next", onSearchSubmit)
      console.log("rs before dispatch next", rs);
      dispatch(feedAction.setPosts([...posts,...rs]));
      // setPosts([...rs])
      // dispatch(feedAction.setUsers([...users]));
      // setSearchUsers([...users])
      // }
      console.log('posts from dispatch next', posts)
      // setHasLoadMore(rs.meta.take > posts?.length + rs.posts?.length);
    } catch (error) {
      console.log("error from get posts next", error);
    }
    setLoading(false);
  };

  function fun(item: any, _filter: any) {
    // console.log('flagvaluefilter', feedFilterState)
    // console.log("item in fun", item);
    // if (filterSelected.name == "Polls") {
      if (item.type == "Poll") {
        return (
          <PollComponent
            key={`post-${item?.id}`}
            data={item}
            likeInfoProp={likeInfoState}
            voteInfoProp={voteInfoState}
          />
        );
      }
    // }
    // if (filterSelected.name == "Initiatives") {
      if (item.type == "Initiative") {
        return (
          <Initiative
          key={`post-${item?.id}`}
            data={item}
            likeInfoProp={likeInfoState}
            voteInfoProp={voteInfoState}
          />
        );
      }
    // }
    // item.likeInfo = posts?.likeInfo;
    //  console.log('like info in fun', likeInfo)
    // if (filterSelected.name == "Posts") {
      if (item.type == "Post") {
        return (
          <PostItem
            key={`post-${item?.id}`}
            data={item}
            likeInfoProp={likeInfoState}
          />
        );
      }
    // }
    if (filterSelected.name === "Most Upvoted" || filterSelected.name === "Most Downvoted") {
      // if(item.type == 'Post') {
        console.log('inside upvote downvote filter')
      if (item.type == "Post") {
        return (
          <PostItem
            key={`post-${item?.id}`}
            data={item}
            likeInfoProp={likeInfoState}
          />
        );
      }
      if (item.type == "Initiative") {
        return (
          <Initiative
            key={`post-${item?.id}`}
            data={item}
            likeInfoProp={likeInfoState}
            voteInfoProp={voteInfoState}
          />
        );
      }
      if (item.type == "Poll") {
        return (
          <PollComponent
            key={`post-${item?.id}`}
            data={item}
            likeInfoProp={likeInfoState}
            voteInfoProp={voteInfoState}
          />
        );
      }
      // }
    }
    // if(item.type == 'Post') {
    //   return (<PostItem key={`post-${item?.id}`} data={item} />)
    // }
  }

  function funState(item: any, _filter: any) {
    console.log('flagvaluefilter', feedFilterState)
    console.log("item in fun", item);
    if (filterSelected.name == "Polls") {
      if (item.type == "Poll") {
        return (
          <PollComponent
            key={`post-${item?.id}`}
            data={item}
            likeInfoProp={likeInfoState}
            voteInfoProp={voteInfoState}
          />
        );
      }
    }
  }


 

  useEffect(() => {
    // if (posts!.length > 0 && posts![0]?.id !== dataPosts[0]?.id) {
    //   setTimeout(() => {
    //     scrollToTop();
    //   }, 500);
    // }
    console.log('dataPostChange', posts)
    // wordList => [...wordList, ...msg]
    // posts.concat(dataPosts)
    // my change
    // if(onSearchSubmit) {
    //   console.log('search check in usePosts', dataPosts)
    //   setPosts(dataPosts)
    // }else {
    //   setPosts(posts => [...posts, ...dataPosts]);
    // }
    // setPosts()
    setPosts(posts => [...dataPosts]);
    console.log('posts after update in useeffect', posts)
  }, [dataPosts]);

  // useEffect(() =>{
  //   setSearchUsers([...dataUsers])
  // },[dataUsers])

  useEffect(() => {
    if (dataRequest.page === 1) {
      setLoading(true);
      setPosts([]);
    }
    // getPosts();
  }, []);

  // useEffect(() => {
  //      getPosts();
  // }, [onSearchSubmit]);

  // useEffect(() => {
  //   if (dataRequest.page === 1) {
  //     setLoading(true);
  //     // setPosts([]);
  //   }
  //   getPosts();
  // }, [dataRequest]);

  useEffect(() => {
    setDataRequest({
      ...dataRequest,
      page: 1,
    });
    console.log('categoriesSelectedcheck',categoriesSelected)
  }, [categoriesSelected]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const tenantName = localStorage.getItem("tenantName");
        const rs = await categoryService.getAll(tenantName, {
          take: 20,
          order: "ASC",
        });
        setCategories(rs);
        setCat(rs);
      } catch (error) {}
    };
    getCategories();
  }, []);

  /**
   * Handle search posts
   * @param {React.ChangeEventHandler} ChangeEventHandler
   */
  const onSearch = (keywords: any) => {
    if(keywords.length !==0)
    setOnSearchSubmit(true);
    console.log("after setting ", onSearchSubmit)
    setDataRequest({
      ...dataRequest,
      page: 1,
      keywords: keywords,
    });
    console.log({ dataRequest });
    getPosts(true, keywords)
    
  };

  const onAdminSearch = (keywords: string) => {
    // const keywords = e.target.value;
    setDataRequest({
      ...dataRequest,
      page: 1,
      keywords: keywords,
    });
  };

  /**
   * Handle loadmore
   */
  const onLoadMore = () => {
    dataRequest.page = (dataRequest.page || 1) + 1;
    setDataRequest({
      ...dataRequest,
    });
  };

  const onOpenComingSoon = () => {
    setDialogComingSoon(true);
  };

  /**
   * Handle filter posts
   * @param {string} value
   */
  const onFilterChange = (data: any, check?: boolean) => {
    console.log('ReadFilterChange', data)
    console.log('filterCheck2222', data)
    if(check){

    } else {
    data.value = feedFilterState.value
    }
    console.log('checkBeforeSettingFilter', data)
    setFilterSelected(data);
    setHashTagFilter({name: '', value: ''})
    setFilterState(data.value)
    setFlag_feed(!flag_feed)
  };

  const onVisibleCategory = () => {
    console.log('selectedIdsin =Feed')
    // let _idsa: any = localStorage.getItem('catIds')
    // let _ids = JSON.parse(_idsa)
    const idsTemp: any = user.categories && user.categories.map((x: any) => {
      x.selected = true;
      return x.id || "";
    });
    console.log('idsList', idsTemp)
    flushSync(() => {
      setCatIdsState(idsTemp);
    });
    // setCatIdsState(idsTemp)
    setCatFlagGetAll(!catFlagGetAll)
    setVisibleCategory(true);
  };
  const onHideCategory = (categories: any) => {
    setVisibleCategory(false);
    // if (categories) {
    //   setSelectedCategories([...categories]);
    // }
  };

  const onOpenNotification = async () => {
    try {
      notificationService.markRead(parseInt(user.id!))
      setUnreadNotifications(0);
    } catch (error) {}
  };

  const onViewCategory = (category: any) => {
    let tempUrl = category.title?.replace(/ /g,"_");
    history.push(routes.CategoryPage.replace(":id", category.id+'/'+tempUrl));
  };

  const loggedOut = () => {
    // let _poolData: any = localStorage.getItem('poolData')
    // _poolData = JSON.parse(_poolData)
    // console.log('_pooldata', _poolData)

    // const _poolData = {
    //   UserPoolId: poolData.userPoolId,
    //   ClientId: poolData.clientId,
    // };

    console.log("pooldata redux", poolData);
    // let _poolData = JSON.parse(poolData)
    // console.log('pooldata redux parse', _poolData)
    setKarmaPoints(0)
    dispatch(authAction.Logout(poolData));

    // history.push('/');
  };

  return (
    <div>
   
      <HeaderDesktop/>
      {user?.role !== UserRole.ADMIN && <AppNavBar />}
      {user?.role === UserRole.ADMIN && (
        <NavBarAdmin onSearch={onAdminSearch} />
      )}
      <Div100vh id="scrollableDiv" className="m-screen feed" ref={scrollRef}>
          <div
            ref={postTopRef}
            className={`box-top-scroll ${
              user?.role === UserRole.ADMIN && "admin"
            }`}
          />
          <Container className="mobile-only">
            {user?.role !== UserRole.ADMIN && (
              <InputSearch
                placeholder="Search anything..."
                onSearch={onSearch}
              />
            )}
            <Stack className="v-filter mobile-only mt-3" gap={2}>
              <Stack direction="horizontal" gap={2} className="v-btn-list ">
                <Button variant="light" onClick={onVisibleCategory}>
                  <IcoMoon icon="plus" color="#03C5CC" size={20} />
                </Button>
                {selectedCatState && selectedCatState
                  .sort((a: any, b: any) => {
                    var textA = a.title.toUpperCase();
                    var textB = b.title.toUpperCase();
                    return textA < textB ? -1 : textA > textB ? 1 : 0;
                  })
                  .map((item: Category) => (
                    <button
                      key={item.id}
                      className="btn"
                      style={{ backgroundColor: "#222222" }}
                      onClick={onViewCategory.bind(null, item || "")}
                    >
                      <div style={{ color: "#fff" }}>{item.title}</div>
                    </button>
                   ))} 
                {/* {selectedCategories.length === 0 && <p></p>} */}
              </Stack>
              <Stack direction="horizontal" className="align-items-center mb-3">
                {hashTagFilter.name != 'hashtag' ? (onSearchSubmit ? (
                  <h4>Search results for "{dataRequest.keywords}"</h4>
                ) : (
                  <h4>My Feed</h4> )
                ) : (<h4>Search results for hashtag "{hashTagFilter.value}"</h4>) }
                <Dropdown className="ms-auto">
                  <Dropdown.Toggle variant="light" className="btn-dropdown" >
                    {filterSelected.name}{" "}
                    <IcoMoon icon="chevron_down" color={colors.mint} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {FILTERS.map((item: any) => (
                      <Dropdown.Item
                        key={`filter-${item.value}`}
                        className={`btn-dropdown-item ${
                          item.value === filterSelected.value && "selected"
                        }`}
                        onClick={onFilterChange.bind(null, item, false)}
                      >
                        {item.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Stack>
            </Stack>
          </Container>
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
                <div className="desktop-only">
                  <div
                    className="create-post white-box"
                    onClick={() =>
                      AlertModal.show(<CreatePostTrigger />, "", () => {}, "lg")
                    }
                  >
                    <Stack direction="horizontal">
                      <span>Post Something...</span>
                      <PlusIcon />
                    </Stack>
                  </div>
                  <Stack direction="horizontal">
                    {onSearchSubmit && hashTagFilter.name !== 'hashtag' ? (
                      <h4>Search results for "{dataRequest.keywords}"</h4>
                    ) : (
                     hashTagFilter.name == 'hashtag' ?   <h4>Search results for hashtag "{hashTagFilter.value}"</h4> : <h4>My Feed</h4>
                    )}
                    <Dropdown className="ms-auto">
                      <Dropdown.Toggle variant="light" className="btn-dropdown">
                        {filterSelected.name}{" "}
                        <IcoMoon icon="chevron_down" color={colors.mint} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {FILTERS.map((item: any) => (
                          <Dropdown.Item
                            key={`filter-${item.value}`}
                            className={`btn-dropdown-item ${
                              item.value === filterSelected.value && "selected"
                            }`}
                            onClick={onFilterChange.bind(null, item, false)}
                          >
                            {item.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Stack>
                </div>

                {/* {onSearchSubmit ? (
                  <></>
                ) : (
                  <div className="white-box">
                    <Nav variant="pills" defaultActiveKey="/home">
                      <Nav.Item>
                        <Nav.Link href="/home">All</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="link-1">New</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="link-1">Trending</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                )}
                {onSearchSubmit && (
                  <div className="main-filter px-2 pt-0 pb-4">
                    <Nav variant="pills" defaultActiveKey="/home">
                      <Nav.Item>
                        <Nav.Link href="/home">All</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="link-1">Posts</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="link-1">Authors</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
                )} */}
        <InfiniteScroll
          dataLength={posts.length}
          next={getPostsNext}
          hasMore={true}
          loader={flagNoPosts ? <ViewEmpty message={flagNoPostString} />: <Skeleton avatar paragraph={{ rows: 3 }} />}
          scrollableTarget="scrollableDiv"
        >
                <Stack gap={3}>
                  {!loading &&
                    posts?.map((item: Post) => {
                      return fun(item, filterSelected);
                    })}
                  {/* {loading && <Skeleton avatar paragraph={{ rows: 3 }} />} */}
                </Stack>
                </InfiniteScroll>
                
                {onSearchSubmit && (
                  <div className="author-result">
                    <Row gutter={16}>
                      {console.log("search result user")}
                      {console.log({onSearchSubmit})}
                      {console.log({searchUsers})}
                      {searchUsers.map( (user : User )=>{
                        return (
                          <Col xs={12}>
                         <div className="white-box my-2">
                           <Stack
                             className="my-0"
                             direction="horizontal"
                             gap={3}
                           >
                             <div className="profile-persona">
                               <Avatar
                                 src={user.avatarLink ? user.avatarLink : images.AVATAR_KEYS[user?.avatar || "avatar2"]}
                                 alt="Avatar"
                                 className="profile-img"
                               />
                             </div>
                             <div>
                               <h4 className="m-0">{user.userName}</h4>
                               <span className="small">
                               Joined {moment(user.creationDate).format("MMMM YYYY")}
                               </span>
                             </div>
                           </Stack>
                         </div>
                       </Col>
                        )
                         
                      })}
                    </Row>
                  </div>
                )}
                {/* {!loading && !posts?.length && <ViewEmpty message="No Posts" />} */}
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
      
      </Div100vh>
      {btnToTop && (
        <button className="btn btn-scroll-top" onClick={scrollToTop}>
          <IcoMoon icon="short_up" color="#000" size={26} />
        </button>
      )}
      <CategorySelectModal visible={visibleCategory} onClose={onHideCategory} idsProp={catIdsState} />
      <ModalConfirm
        visible={dialogComingSoon}
        message="Coming soon"
        cancelText={null}
        onOk={() => {
          setDialogComingSoon(false);
        }}
      />
      <BottomNavBar active={"home"} />
    </div>
  );
}

export default FeedPage;
