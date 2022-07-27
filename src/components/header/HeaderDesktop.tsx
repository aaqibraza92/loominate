import React, { useEffect, useState } from 'react';
import { Container, Dropdown, Stack } from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import images from '../../assets/images/images';
import InputSearch from '../input/InputSearch';
import { Col, Row, Skeleton } from 'antd';
import './styles.scss';
import Avatar from 'antd/lib/avatar/avatar';
import AlertModal from '../AlertModal/AlertModal';
import HelpSupportSheet from '../support/HelpSupportSheet';
import NotificationDesktop from '../notification/NotificationDesktop';
import User, { UserRole } from "../../models/user.model";
import routes from '../../commons/constants/routes.constant';
import feedAction from '../../redux/actions/feed.action';
import { useDispatch, useSelector } from 'react-redux';
import { feedFilter, flagFeedUpdate, hashFilterValue, karmaPoints, notReadNotification } from '../../atoms/globalStates';
import notificationService from '../../services/notification.service';
import authAction from '../../redux/actions/auth.action';
import { useRecoilState } from 'recoil';
import { FeedFilter } from '../../models/feed.filter.model';
import postService from '../../services/post.service';

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

const HeaderDesktop = () => {
  const params: any = useParams();
  const { id = null } = params;
  const [feedFilterState, setFeedFilter] = useRecoilState(feedFilter);
  const [loading, setLoading] = useState(false);
  const [flagNoPosts, setFlagNoPosts] = useState(false);
  const [flagNoPostString, setFlagNoPostsString] = useState('Oops...No more posts')
  const [unreadNotifications, setUnreadNotifications] = useRecoilState(
    notReadNotification
  );
  const [onSearchSubmit, setOnSearchSubmit] = useState(false);
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
  useEffect(() => {
    console.log('filertCheck')
    let _filter: any = {};
    _filter.sortLikes = filterSelected.sortLikes
    _filter.name = filterSelected.name
    _filter.value = feedFilterState.value
    console.log('filterValueCheck', _filter)
    onFilterChange(_filter)
  }, [feedFilterState]);

  const history = useHistory();
  const dispatch = useDispatch();
  const { poolData } = useSelector((state: any) => state.auth);
  const [filterState, setFilterState] = useState('All');
  const [hashTagFilter, setHashTagFilter] = useRecoilState(hashFilterValue)
  const [flag_feed, setFlag_feed] = useRecoilState(flagFeedUpdate);
  const [karmaPointsState, setKarmaPoints] = useRecoilState(karmaPoints)
  const user: User = useSelector((state: any) => state.auth.user);

  const [dataRequest, setDataRequest] = useState<FeedFilter>({
    page: 1,
    per_page: 10,
    order: FILTERS[0].value,
    keywords: "",
    ...(user?.role === UserRole.ADMIN && !! id ? { company_id: id } : {}),
  });
  const getNotificationsNotReadCout = async () =>{
    let count = await notificationService.getNotReadCount(2);
    setUnreadNotifications(count);
  }

  const [filterSelected, setFilterSelected] = useState(FILTERS[0]);
  const onOpenNotification = async () => {
    try {
      notificationService.markRead(parseInt(user.id!))
      setUnreadNotifications(0);
    } catch (error) {}
  };



  const loggedOut = () => {
    setKarmaPoints(0)
    dispatch(authAction.Logout(poolData));
  };

  const onProfileView = () => {
      history.push(routes.ViewProfilePage.replace(":id", user?.id+'/'+user.userName!));
    // }
  };

  const getPosts = async (search?: boolean, keyword?: string) => {
    setFlagNoPosts(false)
    try {
      const tenantName: any = localStorage.getItem("tenantName");
      console.log("tenant name in feed", tenantName)
      let rs: any;

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
      console.log("search inside getPosts", onSearchSubmit);
      dispatch(feedAction.setPosts([...rs]));
      // setHasLoadMore(rs.meta.take > posts?.length + rs.posts?.length);
    } catch (error) {
      console.log("error from get posts", error);
    }
    setLoading(false);
  };

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


  const onMenuClick = (filter: any) => {
    console.log("filter",filter);
    const tenantName: any = localStorage.getItem('tenantName');
      history.push(routes.HomePage.replace(":tenant", tenantName));
    setFeedFilter(filter)
  }

  return (
    <div className="desktop-nav">
    <Container>
      <Row gutter={16}>
        <Col xl={5}>
          <Link to="/">
            <img src={images.logo} className="logo" alt="Loominate" />
          </Link>
        </Col>
        <Col xl={12}>
          {user?.role !== UserRole.ADMIN && (
            <InputSearch
              placeholder="Search anything in feed..."
              onSearch={onSearch}
            />
          )}
        </Col>
        <Col xl={7}>
          <Stack direction="horizontal" gap={3}>
            <Link to="/messages" className="ms-auto">
              <img
                src={images.Message}
                className="top-icon"
                alt="Message"
              />
            </Link>

            <Dropdown className="notification">
              <Dropdown.Toggle
                className="menu-dropdown"
                variant="success"
                id="notification"
              >
                <img
                  src={images.Notification}
                  className="top-icon"
                  alt="Notification"
                  onClick={onOpenNotification}
                />
                 {!!unreadNotifications && unreadNotifications > 0 && (
                <span className="text-count">{unreadNotifications}</span>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Stack>
                  <h5>Notifications</h5>
                </Stack>
                <NotificationDesktop/>
                
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="regular-user">
              <Dropdown.Toggle
                className="menu-dropdown"
                variant="success"
                id="top-avatar"
              >
                <Avatar
                 src={user.avatarLink? user.avatarLink : images.AVATAR_KEYS[user?.avatar || "avatar1"]}
                  className="top-avatar"
                  alt="Avatar"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Stack className="mx-3 my-1" direction="horizontal" onClick={onProfileView} gap={3}>
                  <Avatar
                    src={user.avatarLink? user.avatarLink : images.AVATAR_KEYS[user?.avatar || "avatar2"]}
                    className="avatar-sm"
                    alt="Avatar"
                  />
                  <div className="dd-profile-info">
                    <strong>{user.userName}</strong>
                    <br />
                    <Link to="/" className="small">
                      My Profile
                    </Link>
                  </div>
                </Stack>
                
                <Dropdown.Item>
                  <Stack direction="horizontal" gap={3} onClick={() => onMenuClick({name: 'All', value: 'All'})}>
                    <img
                      src={images.IconFeed}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>My FEED</span>
                  </Stack>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/leaderboard">
                  <Stack direction="horizontal" gap={3}  onClick={() =>onFilterChange.bind(null, 'Leaderboard')}>
                    <img
                      src={images.IconLeaderboard}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>LEADERBOARD</span>
                  </Stack>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Stack direction="horizontal" gap={3} onClick={() => onMenuClick({name: 'Initiatives', value: 'Initiative'})} >
                    <img
                      src={images.IconInitiatives}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>INITIATIVES</span>
                  </Stack>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/invite-peers">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconPeers}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Invite Peers</span>
                  </Stack>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/post-management?view=report">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconLabel}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Content in Review</span>
                  </Stack>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/user-management?view=report">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconClose}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Blocked Users</span>
                  </Stack>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/settings">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconSettings}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Settings</span>
                  </Stack></Link>
                </Dropdown.Item>
                <Dropdown.Item href="#/action-3">
                  <Stack
                    onClick={() =>
                      AlertModal.show(
                        <HelpSupportSheet />,
                        "title",
                        () => {}
                      )
                    }
                    direction="horizontal"
                    gap={3}
                  >
                    <img
                      src={images.IconHelp}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Help & Support</span>
                  </Stack>
                </Dropdown.Item>
                <Dropdown.Item href="#">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconLogout}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span onClick={() => loggedOut()}>LOG OUT</span>
                  </Stack>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown className="admin-user">
              <Dropdown.Toggle
                className="menu-dropdown"
                variant="success"
                id="top-avatar"
              >
                <Avatar
                 src={user.avatarLink? user.avatarLink : images.AVATAR_KEYS[user?.avatar || "avatar1"]}
                  className="top-avatar"
                  alt="Avatar"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Stack className="mx-3 my-1" direction="horizontal" onClick={onProfileView} gap={3}>
                  <Avatar
                    src={user.avatarLink? user.avatarLink : images.AVATAR_KEYS[user?.avatar || "avatar2"]}
                    className="avatar-sm"
                    alt="Avatar"
                  />
                  <div className="dd-profile-info">
                    <strong>{user.userName}</strong>
                    <br />
                    <Link to="/" className="small">
                      My Profile
                    </Link>
                  </div>
                </Stack>
                <hr />
                
                <Dropdown.Item>
                  <Stack direction="horizontal" gap={3} onClick={() => onMenuClick({name: 'All', value: 'All'})}>
                    <img
                      src={images.avatarCompany}
                      className="icon-sm"
                      alt="Avatar"
                      width="24"
                    />
                    <span>Airbus FEED </span>
                  </Stack>
                </Dropdown.Item>
                <div className="inset">
                <Dropdown.Item>
                  <Link to="/dashboard-tenant">
                  <Stack direction="horizontal" gap={3}>
                    <span className="text-primary">Airbus Dashboard</span>
                  </Stack></Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/post-management?view=report">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconLabel}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Reported Content</span>
                  </Stack></Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/user-management?view=mute">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconLabel}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Muted Users</span>
                  </Stack></Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/user-management?view=hidden">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconLabel}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Removed Users</span>
                  </Stack></Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/leaderboard">
                  <Stack direction="horizontal" gap={3}  onClick={() =>onFilterChange.bind(null, 'Leaderboard')}>
                    <img
                      src={images.IconLeaderboard}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>LEADERBOARD</span>
                  </Stack></Link>
                </Dropdown.Item>
                </div>
                <hr />
                <div className="row">
                  <div className="col-6">
                <Dropdown.Item>
                  <Link to="/dashboard">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconDashboard}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Admin Dashboard</span>
                  </Stack></Link>
                </Dropdown.Item>
                </div>
                  <div className="col-6">
                <Dropdown.Item>
                  <Link to="/settings">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconSettings}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Settings</span>
                  </Stack></Link>
                </Dropdown.Item>
                
                </div>
                  <div className="col-6">
                <Dropdown.Item href="#/action-3">
                  <Stack
                    direction="horizontal"
                    gap={3}
                  >
                    <img
                      src={images.IconHelp}
                      className="icon-sm hidden"
                      alt="Avatar"
                    />
                    <span>LOOMINATE SPACE</span>
                  </Stack>
                </Dropdown.Item>
                </div>
                  <div className="col-6">

                <Dropdown.Item href="#/action-3">
                  <Stack
                    onClick={() =>
                      AlertModal.show(
                        <HelpSupportSheet />,
                        "title",
                        () => {}
                      )
                    }
                    direction="horizontal"
                    gap={3}
                  >
                    <img
                      src={images.IconHelp}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span>Help & Support</span>
                  </Stack>
                </Dropdown.Item>
                </div>
                </div>
                <hr />
                <Dropdown.Item href="#">
                  <Stack direction="horizontal" gap={3}>
                    <img
                      src={images.IconLogout}
                      className="icon-sm"
                      alt="Avatar"
                    />
                    <span onClick={() => loggedOut()} className="text-danger">LOG OUT</span>
                  </Stack>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Stack>
        </Col>
      </Row>
    </Container>
  </div>
  );
};

export default HeaderDesktop;
