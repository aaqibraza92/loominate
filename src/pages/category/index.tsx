import { Col, Row, Skeleton } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Breadcrumb, Container, Stack } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { useRecoilState } from "recoil";
import Div100vh from "react-div-100vh";
import images from "../../assets/images/images";
import { tenantNameState } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import ButtonGradient from "../../components/button/ButtonGradient";
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
import Initiative from "../../components/post/Initiative";
import PollComponent from "../../components/post/PollComponent";
import PostItem from "../../components/post/PostItem";
import ViewEmpty from "../../components/view/ViewEmpty";
import Category from "../../models/category.model";
import { FeedFilter } from "../../models/feed.filter.model";
import Post, { PostType } from "../../models/post.model";
import User, { UserRole } from "../../models/user.model";
import feedAction from "../../redux/actions/feed.action";
import categoryService from "../../services/category.service";
import postService from "../../services/post.service";
import "./styles.scss";
 
/**
 * Post Detail Page
 * @param props
 * @returns JSX.Element
 */
function CategoryPage(props: any) {
  const params: any = useParams();
  const { id = null } = params;
  const scrollRef: any = useRef();
  const history = useHistory();
  const user: User = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const { categoriesSelected } = useSelector((state: any) => state.feed);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category>();
  const [posts, setPosts] = useState<Post[]>([]);
  // const [tenantName, setTenantName] = useRecoilState(tenantNameState);
  const [countState, setCountState] = useState(5);
const [flagNoPosts, setFlagNoPosts] = useState(false)
const [flagNoPostString, setFlagNoPostsString] = useState('Oops...No more posts')
  const [dataRequest, setDataRequest] = useState<FeedFilter>({
    page: 1,
    per_page: 10,
    keywords: "",
    category_id: id,
  });
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const [postTypeSelected, setPostTypeSelected] = useState<
    PostType | undefined
  >(undefined);
  const [btnToTop, setBtnToTop] = useState(false);
  const postTopRef: any = useRef(null);
 
  useEffect(() => {
    getCategory();
  }, [id]);
 
  useEffect(() => {
    getCategory();
    console.log("rendering page cat");
  }, []);
 
  // const handleScroll = useCallback((e) => {
  //   if (e) {
  //     if (e.target.scrollTop > 200) setBtnToTop(true);
  //     else setBtnToTop(false);
  //   }
  // }, []);
 
  // useEffect(() => {
  //   if (scrollRef) {
  //     const div = scrollRef.current;
  //     div.addEventListener("scroll", handleScroll);
  //   }
  // });
 
  const getCategory = async () => {
    setLoading(true);
    const tenantName: string | any = localStorage.getItem('tenantName')
    try {
      const rs = await categoryService.detail(tenantName, {  id: id });
      console.log('getCatById', rs.data[0])
     
      setCategory(rs.data[0]);
      // setPosts(rs.data[0].contents);
      console.log('post from categories', rs.data[0].contents)
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
 
  // useEffect(() => {
  //   setPosts([])
  //   // getPosts()
  //   console.log('dataPosts in useffect', dataPosts)
  //   console.log('flag_feed',flag_feed)
  // }, [flag_feed]);
 
  // useEffect(() => {
  //   getPosts();
  // }, []);
 
  useEffect(() => {
    setCountState(5)
    setFlagNoPostsString('Oops...No more posts')
    getPosts();
   
  }, [])
 
  const getPosts = async () => {
    console.log('inside get posts')
    console.log('countCkeckCat', countState)
    try {
      const tenantName: string | any = localStorage.getItem('tenantName')
      const rs = await categoryService.contentByCategory(tenantName,parseInt(user.id!),parseInt(id!),{  order: "DESC", take: 5, skip: 0 })
      setPosts([...rs]);
      if(rs.length < 5 ) {
        setFlagNoPosts(true)
      }
      if(rs.length < 1 ) {
        setFlagNoPostsString('Oops.....No posts yet')
      }
      console.log('resultfromgetPosts', rs)
      // if (dataRequest.page > 1) {
      //   setPosts([...posts, ...rs]);
      // } else {
      //   setPosts([...rs]);
      // }
      // setHasLoadMore(rs.meta.total > posts.length);
    } catch (error) {
      console.log('errorInGetPostCategory',error);
    }
  };
  function fun(item: any, _filter?: any) {
 
    if(item.type == "Post") {
      return <PostItem  key={`post-${item?.id}`} data={item} />
    }
    if(item.type == "Initiative") {
      return <Initiative  key={`post-${item?.id}`} data={item} />
    }
    if(item.type == "Poll") {
      return <PollComponent  key={`post-${item?.id}`} data={item} />
    }
   
   
  }
 
  const goBackHome = () => {
    history.push(routes.HomePage);
  }
  const scrollToTop = () => {
    if (postTopRef) {
      postTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
 
  const onFollow = async () => {
    const follow = category?.if_followed;
    try {
      if (!follow) {
        await categoryService.follow(id);
        setCategory({
          ...category,
          if_followed: true,
        });
        if (!categoriesSelected.find((x: any) => x.id === category?.id)) {
          categoriesSelected.push({ ...category });
        }
      } else {
        await categoryService.unfollow(id);
        setCategory({
          ...category,
          if_followed: false,
        });
        const iCate = categoriesSelected.findIndex(
          (x: any) => x.id === category?.id
        );
        if (iCate > -1) {
          categoriesSelected.splice(iCate, 1);
        }
      }
      dispatch(feedAction.updateCategoriesSelected(categoriesSelected));
    } catch (error) {
      setCategory({
        ...category,
        if_followed: follow,
      });
    }
  };
  const getPostsNext = async (search?: boolean, keyword?: string) => {
    console.log('count next' , countState)
    try {
      const tenantName: any = localStorage.getItem("tenantName");
      let rs: any;
      let users: any;
      rs = await categoryService.contentByCategory(tenantName,parseInt(user.id!),parseInt(id!),{  order: "DESC", take: 5, skip: countState })
      console.log("rs before dispatch next cat", rs);
      if(rs.length == 0) {
        setFlagNoPosts(true)
      }

 
      setCountState(countState + 5)
      setPosts(posts => [...posts, ...rs]);
      console.log('posts from dispatch cat next', posts)
    } catch (error) {
      console.log("error from get posts cat next", error);
    }
    setLoading(false);
  };
 
  const onBack = () => {
    history.goBack();
  };
 
 
  const onPostTypeChange = (type: PostType) => {
    if (type === postTypeSelected) {
      setPostTypeSelected(undefined);
      setDataRequest({
        ...dataRequest,
        page: 1,
        post_type: undefined,
      });
    } else {
      setPostTypeSelected(type);
      setDataRequest({
        ...dataRequest,
        page: 1,
        post_type: type,
      });
    }
  };
 
 
  return (
    <div>
      {/* <Div100vh id="scrollableDiv" className="m-screen feed" ref={scrollRef}> */}
      {/* <div
            ref={postTopRef}
            className={`box-top-scroll-cat`}
          /> */}
      <HeaderDesktop/>
      {/* <InfiniteScroll
        className="category-detail m-screen article-padding-top"
        dataLength={posts.length}
        next={getPostsNext}
        hasMore={true}
        loader={<Skeleton avatar paragraph={{ rows: 3 }} />}
      > */}
     
        {!loading && (
          <Container className="category-detail m-screen article-padding-top" style={isMobile ? { padding: 0 } : {}}>
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
                <Breadcrumb.Item href={`/`}>My Feed</Breadcrumb.Item>
                <Breadcrumb.Item active>{category?.title}</Breadcrumb.Item>
              </Breadcrumb>
            <Stack
              className="box-head"
              style={{
                background: `linear-gradient(180deg, rgba(0, 0, 0, 0.6) 7.2%, rgba(0, 0, 0, 0) 51.37%, rgba(0, 0, 0, 0.6) 92%), url(${
                  category?.imageUrl || images.categoryDefault
                }), #F553A3`,
                backgroundSize: "cover",
              }}
            >
              <div className="mt-auto box-info">
                <Stack direction="horizontal" gap={2}>
                  <button className="btn btn-back" onClick={onBack}>
                    <IcoMoon
                      icon="chevron_left"
                      size={28}
                      className="icon"
                      color="#fff"
                    />
                  </button>
 
                  <h3 className="text-title">{category?.title}</h3>
                  <ButtonGradient
                    className="btn-follow"
                    onClick={onFollow}
                  >
                    {category?.if_followed ? "FOLLOWING" : "FOLLOW"}
                  </ButtonGradient>
                </Stack>
                <Stack direction="horizontal" className="info mt-3">
                  <div
                    className={`info-item ${
                      postTypeSelected === PostType.Post && "active"
                    }`}
                    onClick={onPostTypeChange.bind(null, PostType.Post)}
                  >
                    {category?.count_posts} Posts
                  </div>
                  <div
                    className={`info-item ${
                      postTypeSelected === PostType.Poll && "active"
                    }`}
                    onClick={onPostTypeChange.bind(null, PostType.Poll)}
                  >
                    {category?.count_polls} Polls
                  </div>
                  <div
                    className={`info-item ${
                      postTypeSelected === PostType.Initiative && "active"
                    }`}
                    onClick={onPostTypeChange.bind(null, PostType.Initiative)}
                  >
                    {category?.count_initiatives} Initiatives
                  </div>
                </Stack>
              </div>
            </Stack>
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
                      return fun(item);
                    })}
                </Stack>
           </InfiniteScroll>
 
              </Col>
              <Col xl={7}>      
              <div className="desktop-only">        
              <DesktopMyCommunity />
                <DesktopMyProfile/>
                <DesktopOurPurpose/>
                <DesktopGuidelines/>
                <DesktopCulture/>
                </div>
              </Col>
            </Row>
          </Container>
        )}
                {/* </InfiniteScroll> */}
                {/* </Div100vh> */}
                {/* {btnToTop && (
        <button className="btn btn-scroll-top" onClick={scrollToTop}>
          <IcoMoon icon="short_up" color="#000" size={26} />
        </button>
      )} */}
    </div>
  );
}
 
export default CategoryPage;
 
 

