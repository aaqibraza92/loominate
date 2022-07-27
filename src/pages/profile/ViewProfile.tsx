import {
  Avatar,
  Col,
  Dropdown,
  Menu,
  message,
  notification,
  Row,
  Skeleton,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Container,
  Dropdown as BTDropdown,
  Stack,
} from "react-bootstrap";
import { isMobile } from "react-device-detect";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { useRecoilState } from "recoil";
import { ReactComponent as IconMore } from "../../assets/icons/more.svg";
import images from "../../assets/images/images";
import { feedFilter, hashFilterValue, tenantNameState, wakeHastags } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import DesktopCategory from "../../components/desktopcategory/DesktopCategory";
import DesktopCulture from "../../components/desktopculture/DesktopCulture";
import DesktopGuidelines from "../../components/desktopguidelines/DesktopGuidelines";
import DesktopHashtags from "../../components/desktophashtags/DesktopHashtags";
import DesktopMenu from "../../components/desktopmenu/DesktopMenu";
import DesktopMyCommunity from "../../components/desktopmycommunity/DesktopMyCommunity";
import DesktopMyProfile from "../../components/desktopmyprofile/DesktopMyProfile";
import DesktopOurPurpose from "../../components/desktopourpurpose/DesktopOurPurpose";
import HeaderDesktop from "../../components/header/HeaderDesktop";
import IcoMoon from "../../components/icon/IcoMoon";
import ModalConfirm, {
  ModalConfirmType,
} from "../../components/modal/ModalConfirm";
import AppNavBar from "../../components/navbar";
import Initiative from "../../components/post/Initiative";
import PollComponent from "../../components/post/PollComponent";
import PostItem from "../../components/post/PostItem";
import MuteUserSheet from "../../components/report/MuteUserSheet";
import ReportUserSheet from "../../components/report/ReportUserSheet";
import ViewEmpty from "../../components/view/ViewEmpty";
import { FeedFilter } from "../../models/feed.filter.model";
import Post from "../../models/post.model";
import User, { UserRole } from "../../models/user.model";
import { Userservices } from "../../services";
import postService from "../../services/post.service";
import userService from "../../services/user.service";
import "./styles.scss";

const FILTERS = [
  {
    name: "Recent",
    value: "All",
    sortLikes: 'content.id',
  },
  // {
  //   name: "All",
  //   value: "All",
  // },
  // {
  //   name: "Recommended",
  //   value: "Recommended",
  // },
  // {
  //   name: "Hot",
  //   value: "Hot",
  // },
  // {
  //   name: "Trending Categories",
  //   value: "Trending",
  // },
  // {
  //   name:"Most Upvote",
  //   value:"Most Upvote",
  //   sortLikes: 'content.likes',
  // },
  // {
  //   name:"Most Downvote",
  //   value:"Most Downvote",
  //   sortLikes: 'content.dislikes',
  // },
  {
    name: "Posts",
    value: "Post",
  },
  {
    name: "Polls",
    value: "Poll",
  },
  {
    name: "Initiatives",
    value: "Initiative",
  },
];

/**
 * Post Detail Page
 * @param props
 * @returns JSX.Element
 */
function ViewProfilePage(props: any) {
  const params: any = useParams();
  const { id = null } = params;
  const history = useHistory();
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const [filterSelected, setFilterSelected] = useState(FILTERS[0]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User>();
  const [dialogReport, setDialogReport] = useState(false);
  const [dialogBlock, setDialogBlock] = useState(false);
  const [dialogDeleteUser, setDialogDeleteUser] = useState(false);
  const [dialogMute, setDialogMute] = useState(false);
  const [blockRequesting, setBlockRequesting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const [tenantName, setTenantName] = useRecoilState(tenantNameState);
  const [countPost, setCountPost] = useState();
  const [countPoll, setCountPoll] = useState();
  const [countIni, setCountIni] = useState()
  const [dataRequest, setDataRequest] = useState<FeedFilter>({
    page: 1,
    per_page: 10,
    order: FILTERS[0].value,
    user_id: id,
    voted_by_user: true,
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [countState, setCountState] = useState(0);
  const [flagNoPosts, setFlagNoPosts] = useState(false) 
  const [flagNoPostString, setFlagNoPostsString] = useState('Oops...No more recent activities')
  const [onSearchSubmit, setOnSearchSubmit] = useState(false);
  const [hashTagFilter, setHashTagFilter] = useRecoilState(hashFilterValue)
  const [feedFilterState, setFeedFilter] = useRecoilState(feedFilter);
  const [filterState, setFilterState] = useState('All')
  const [flag_feed, setFlag_feed] = useState(true);

  // const getPosts = async () => {
  //   if (!user?.id) return;
  //   try {
  //     const rs = await postService.getAll(tenantName, dataRequest);
  //     if (dataRequest.page > 1) {
  //       setPosts([...posts, ...rs.posts]);
  //     } else {
  //       setPosts([...rs.posts]);
  //     }
  //     setHasLoadMore(rs.meta.total > posts.length);
  //   } catch (error) {}
  // };

  const getCount = async () => {
    let tenantName: any = localStorage.getItem('tenantName');
    let user_rs: any = await userService.getUser(tenantName, user.userName);
    let count_feed: any = await userService.getCountPosts(tenantName, user?.id);
    console.log('count result in profile', count_feed)
    setCountPost(count_feed.Post)
    setCountPoll(count_feed.Poll)
    setCountIni(count_feed.Initiative)
  }

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    getCount()
  }, [])

  useEffect(() => {
    // getPosts();
  }, [dataRequest]);

  useEffect(() => {
    setPosts([])
    getPosts()
    // dataPosts = []
    setCountState(5)
    
    // console.log('dataposts in feed', dataPosts)
    // console.log('dataPosts in useffect', dataPosts)
    console.log('flag_feed',flag_feed)
  }, [flag_feed]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        console.log("fetching user profile");
        const tenantName = localStorage.getItem('tenantName')
        const rs = await userService.getUserById(tenantName, id);
        console.log('get used by id status',{ rs });
        setProfile(rs);
      } catch (error) {}
      setLoading(false);
    };
    getProfile();
  }, [id]);

  useEffect(() => {
    setIsAdmin(user?.role === UserRole.ADMIN);
  }, [user]);

  const onGoChat = () => {
    history.push(routes.MessageDetailPage.replace(":id", profile?.id || ""));
  };

  /**
   * Handle filter posts
   * @param {string} value
   */
   const onFilterChange = (data: any) => {
    console.log('ReadFilterChange', data)
    console.log('filterCheck2222', data)
    // data.value = feedFilterState.value
    console.log('checkBeforeSettingFilter', data)
    setFilterSelected(data);
    setHashTagFilter({name: '', value: ''})
    setFilterState(data.value)
    setFlag_feed(!flag_feed)
  };

  const onBlockUser = () => {
    setDialogBlock(true);
  };

  const handleBlockUser = async () => {
    setDialogBlock(false);
    try {
      if (profile?.isBlocked) {
        await userService.unblockUser(profile?.id);
        if (profile) {
          profile.isBlocked = false;
          setProfile({ ...profile });
        }
        message.success({
          content: <label className="message">User Unblocked</label>,
          icon: (
            <IcoMoon icon="profile" className="icon" color="#fff" size={18} />
          ),
          duration: 2,
          className: "top-message",
        });
      } else {
        await userService.blockUser(profile?.id);
        if (profile) {
          profile.is_blocked = true;
          setProfile({ ...profile });
        }
        message.success({
          content: <label className="message">User Blocked</label>,
          icon: (
            <IcoMoon icon="profile" className="icon" color="#fff" size={18} />
          ),
          duration: 2,
          className: "top-message",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onReportUser = () => {
    setDialogReport(true);
  };

  const onReportClose = () => {
    setDialogReport(false);
  };

  const onMuteUser = () => {
    setDialogMute(true);
  };

  const onMuteClose = () => {
    setDialogMute(false);
  };

  const onRemoveUser = () => {
    setDialogDeleteUser(true);
  };

  const handleRemoveUser = async () => {
    try {
      await userService.removeUser(profile?.id);
      message.success({
        content: <label className="message">User Removed</label>,
        icon: (
          <IcoMoon icon="profile" className="icon" color="#fff" size={18} />
        ),
        duration: 0,
        className: "top-message",
      });
      setProfile(undefined);
    } catch (error: any) {
      console.log(error);

      notification.error({
        key: `${Date.now()}`,
        message: error,
      });
    }
    setDialogDeleteUser(false);
  };

  /**
   * Menu Component
   */
  const menu = !isAdmin ? (
    <Menu key={`menu`} className="profile-detail-menu">
      <Menu.Item key="view-profile">
        <button className="btn btn-menu" onClick={onBlockUser}>
          {profile?.isBlocked ? "Unblock User" : "Block User"}
        </button>
      </Menu.Item>
      <Menu.Item key="report">
        <button className="btn btn-menu btn-dg" onClick={onReportUser}>
          Report user
        </button>
      </Menu.Item>
    </Menu>
  ) : (
    <Menu key={`menu`} className="profile-detail-menu">
      <Menu.Item key="view-profile">
        <button className="btn btn-menu" onClick={onMuteUser}>
          Mute user
        </button>
      </Menu.Item>
      <Menu.Item key="report">
        <button className="btn btn-menu btn-dg" onClick={onRemoveUser}>
          Remove user
        </button>
      </Menu.Item>
    </Menu>
  );

  const goToHome = () => {
    history.push(routes.HomePage);
  };
  if (!loading && !profile) {
    return (
      <div className="box-empty" onClick={goToHome}>
        User not found
        <Button className="mt-3">Go to home</Button>
      </div>
    );
  }

  /**
   * Handle loadmore
   */
  const onLoadMore = () => {
    dataRequest.page = (dataRequest.page || 1) + 1;
    setDataRequest({
      ...dataRequest,
    });
  };

    /**
   * set local state to result from the api call for getting the recent activities
   */ 
  const getPosts = async () => {
    console.log('inside get posts')
    console.log('countCkeckCat', countState)
    try {
      const tenantName: string | any = localStorage.getItem('tenantName')
      const rs = await userService.recentActivities(tenantName,{  order: "DESC", take: 5, skip: 0, id: id, filter: filterState })
      console.log('rs_in', rs)
      setPosts([...rs]);
      if(rs.length < 5 ) {
        setFlagNoPosts(true)
      }
      if(rs.length < 1 ) {
        setFlagNoPostsString('Oops.....No posts yet')
      }
      console.log('resultfromgetPosts', rs)
    } catch (error) {
      console.log('errorInGetPostCategory',error);
    }
  };

  const getPostsNext = async (search?: boolean, keyword?: string) => {
    // setFlagNoPosts(true)
    setFlagNoPosts(false)

    console.log('count next in category' , countState)
    console.log('hastagFilterNext', hashTagFilter)
    // if (!auth_token) return;
    try {
      const tenantName: any = localStorage.getItem("tenantName");
      let rs: any;
      // let users: any;
      console.log("search inside getPosts next", onSearchSubmit)
      // if(hashTagFilter.name == 'hashtag') {
      //   if(posts){
      //     if(posts.length > 4)
          
      //     rs = await postService.contentByHastag(tenantName,parseInt(user.id!),hashTagFilter.value,{  order: "DESC", take: 5, skip: countState , filter: filterState});
      //     console.log('inside hashtag condition', rs)
      //     if(rs.length == 0 ) {
      //       // do nothing
      //       console.log('do nothing')
      //       console.log('inside rs.length', rs.length)
      //       setFlagNoPosts(true)
      //     }
      //     else{
      //       setCountState(countState + 5)
      //     }
      //   }

      // }
      // else {
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
        rs = await userService.recentActivities(tenantName,{  order: "DESC", take: 5, skip: countState, id: id, filter: filterState })
        setOnSearchSubmit(false)
        console.log("calling all next", rs)
        
        if(rs.length == 0) {
          console.log('inside rs.length', rs.length)
          setFlagNoPosts(true)
        }
        setCountState(countState + 5)
      // }
      console.log("search inside getPosts next recent", onSearchSubmit)
      console.log("rs before dispatch next recent", rs);
      // setPosts([...rs]);
      setPosts(posts => [...posts, ...rs]);


      // setPosts([...rs])
      // dispatch(feedAction.setUsers([...users]));
      // setSearchUsers([...users])
      // }
      console.log('posts from dispatch next recent recent', posts)
      // setHasLoadMore(rs.meta.take > posts?.length + rs.posts?.length);
    } catch (error) {
      console.log("error from get posts next", error);
    }
    setLoading(false);
  };

  /**
   * filter components based on the item type
   */ 
  function fun(_item: any, _filter: any) {
    // console.log('flagvaluefilter', feedFilterState)
    // console.log("item in fun", item);
    // if (filterSelected.name == "Polls") {
    const item = _item.content
      if (item.type == "Poll") {
        return (
          <PollComponent
            key={`post-${_item?.id}`}
            data={item}
          />
        );
      }
    // }
    // if (filterSelected.name == "Initiatives") {
      if (item.type == "Initiative") {
        return (
          <Initiative
          key={`post-${_item?.id}`}
            data={item}
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
            key={`post-${_item?.id}`}
            data={item}
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
            key={`post-${_item?.id}`}
            data={item}
          />
        );
      }
      if (item.type == "Initiative") {
        return (
          <Initiative
            key={`post-${_item?.id}`}
            data={item}
          />
        );
      }
      if (item.type == "Poll") {
        return (
          <PollComponent
            key={`post-${_item?.id}`}
            data={item}
          />
        );
      }
      // }
    }
    // if(item.type == 'Post') {
    //   return (<PostItem key={`post-${item?.id}`} data={item} />)
    // }
  }

  return (
    <div className="profile-detail m-screen">
      <HeaderDesktop />
      <AppNavBar hasBack />
      <Container style={isMobile ? { padding: 0 } : {}}>
          {!loading && (
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
                  My Profile
                </Breadcrumb.Item>
                <Breadcrumb.Item active>john123</Breadcrumb.Item>
              </Breadcrumb>

                {profile && (
                  <Stack className="v-profile-info" gap={3}>
                    <Stack direction="horizontal" gap={2}>
                      <Avatar
                        src={
                          profile?.avatarLink||
                          images.AVATAR_KEYS[profile?.avatar || "avatar1"]
                        }
                        size="large"
                        className="v-avatar"
                      />
                      <div className="flex-fill">
                        <h3 className="text-username">{profile.userName}</h3>
                        <p className="text-join">
                          Joined on {moment(profile.creationDate).format("LL")}
                        </p>
                      </div>
                      <Button className="btn-chat" onClick={onGoChat}>
                        <IcoMoon icon="sms" size={20} color="#fff" />
                      </Button>
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
                    <Row className="stat-desc">
                      <Col md={24} lg={12}>
                    {profile.aboutMe && (
                      <p className="text-description">{profile.aboutMe}</p>
                    )}                        
                      </Col>
                      <Col md={24} lg={12}>
                        
                    <Stack
                      direction="horizontal"
                      className="box-statistic"
                      gap={3}
                    >
                      <div className="box-point">
                        <p className="text text-point">{profile.karmaPoints}</p>
                        <p className="text">Karma Points</p>
                      </div>
                      <Stack
                        direction="horizontal"
                        gap={2}
                        className="box-count flex-fill align-items-content"
                      >
                        <div className="flex-fill">
                          <p className="text text-number">
                            {countPost || "0"}
                          </p>
                          <p className="text">Posts</p>
                        </div>
                        <div className="flex-fill">
                          <p className="text text-number">
                            {countPoll || "0"}
                          </p>
                          <p className="text">Polls</p>
                        </div>
                        <div className="flex-fill">
                          <p className="text text-number">
                            {countIni || "0"}
                          </p>
                          <p className="text">Initiatives</p>
                        </div>
                      </Stack>
                    </Stack>
                      </Col>
                    </Row>
                    <Stack direction="horizontal" className="btn-group">
                    <Button variant="link">REPUBLISH USER</Button> <Button variant="link">REMOVE USER</Button>
                    </Stack>
                    <Stack direction="horizontal" className="btn-group">
                    <Button variant="link">UNMUTE USER</Button> <Button variant="link">REMOVE USER</Button>
                    </Stack>
                    <Stack direction="horizontal" className="btn-group">
                    <Button variant="link">REPUBLISH USER</Button>
                    </Stack>
                  </Stack>
                )}

                {profile && !profile?.isBlocked && (
                  <div>
                    <Stack
                      direction="horizontal"
                      className="v-filter align-items-center mb-3"
                    >
                      <h4>Recent Activities</h4>
                      <BTDropdown className="ms-auto">
                        <BTDropdown.Toggle
                          variant="light"
                          className="btn-dropdown"
                        >
                          {filterSelected.name}{" "}
                          <IcoMoon icon="chevron_down" color={colors.mint} />
                        </BTDropdown.Toggle>
                        <BTDropdown.Menu>
                          {FILTERS.map((item: any) => (
                            <BTDropdown.Item
                              key={`filter-${item.value}`}
                              className={`btn-dropdown-item ${
                                item.value === filterSelected.value &&
                                "selected"
                              }`}
                              onClick={onFilterChange.bind(null, item)}
                            >
                              {item.name}
                            </BTDropdown.Item>
                          ))}
                        </BTDropdown.Menu>
                      </BTDropdown>
                    </Stack>
                  </div>
                )}
                {profile?.isBlocked && (
                  <Stack className="align-items-center justify-content-center text-blocked">
                    Unblock user to view recent activities
                  </Stack>
                )}
          <InfiniteScroll
          style={{ overflowX: "hidden" }}
          dataLength={posts.length}
          next={getPostsNext}
          hasMore={true}
          loader={flagNoPosts ? <ViewEmpty message={flagNoPostString} />: <Skeleton avatar paragraph={{ rows: 3 }} />}
          // scrollableTarget="scrollableDiv"
        >
                <Stack gap={2}>
                {!loading &&
                    posts?.map((item: Post) => {
                      return fun(item, filterSelected);
                    })}
                </Stack>
        </InfiniteScroll>

              </Col>
              <Col xl={7}>
                <div className="desktop-only">
                  <DesktopMyCommunity />
                  {/* <DesktopMyProfile/> */}
                  <DesktopOurPurpose />
                  <DesktopGuidelines />
                  <DesktopCulture />
                </div>
              </Col>
            </Row>
          )}
        {/* </InfiniteScroll> */}
      </Container>

      {dialogReport && (
        <ReportUserSheet
          open={dialogReport}
          onClose={onReportClose}
          data={profile}
        />
      )}
      {dialogMute && (
        <MuteUserSheet open={dialogMute} onClose={onMuteClose} data={profile} />
      )}
      <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogBlock}
        message={
          profile?.is_blocked
            ? `Are you sure you want to unblock this user?`
            : `Are you sure you want to block this user? To unblock, please go to
        Menu > Blocked Users.`
        }
        okText="Yes, I’m sure"
        onCancel={() => {
          setDialogBlock(false);
        }}
        onOk={handleBlockUser}
      />
      <ModalConfirm
        type={ModalConfirmType.Danger}
        visible={dialogDeleteUser}
        message="Are you sure you want to remove this user?"
        okText="Yes, I’m sure"
        onCancel={() => {
          setDialogDeleteUser(false);
        }}
        onOk={handleRemoveUser}
      />
    </div>
  );
}

export default ViewProfilePage;
