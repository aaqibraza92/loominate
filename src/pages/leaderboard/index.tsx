import { Avatar, Skeleton, Tag, Col, Row } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Container,
  Stack,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { isMobile } from "react-device-detect";
import Div100vh, { use100vh } from "react-div-100vh";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { useRecoilState } from "recoil";
import images from "../../assets/images/images";
import { tenantNameState } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import DesktopCategory from "../../components/desktopcategory/DesktopCategory";
import DesktopHashtags from "../../components/desktophashtags/DesktopHashtags";
import DesktopMenu from "../../components/desktopmenu/DesktopMenu";
import HeaderDesktop from "../../components/header/HeaderDesktop";
import BottomNavBar from "../../components/navbar/BottomNavBar";
import { LeaderBoardData } from "../../models/leaderboard.model";
import Post from "../../models/post.model";
import User from "../../models/user.model";
import UserLeaderBoard from "../../models/user.model";
import leaderBoardService from "../../services/leaderboard.service";
import "./styles.scss";

/**
 * Post Detail Page
 * @param props
 * @returns JSX.Element
 */
function LeaderBoardPage(props: any) {
  const [tenant, setTenantName] = useRecoilState(tenantNameState);
  const params: any = useParams();
  const height = use100vh();
  const { id = null } = params;
  const history = useHistory();
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [leaderboards, setLeaderboards] = useState<UserLeaderBoard[]>([]);
  const [dataRequest, setDataRequest] = useState<LeaderBoardData>({
    page: 1,
    take: 30,
    timeline: "ALL",
    below: false,
  });
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const [top1, setTop1] = useState<User>();
  const [top2, setTop2] = useState<User>();
  const [top3, setTop3] = useState<User>();
  const [total, setTotal] = useState(0);
  const [btnToTop, setBtnToTop] = useState(false);
  const [btnMyRank, setBtnMyRank] = useState(false);
  const divTopRef: any = useRef(null);
  const divMyRankRef: any = useRef(null);
  const scrollRef: any = useRef();

  const getLeaderBoard = async () => {
    try {
      console.log("user is ", user);
      const tenantName: any = localStorage.getItem('tenantName')
      const rs = await leaderBoardService.getList(tenantName, dataRequest);
      const list = rs.data;
      console.log("list of leadboard is ", list);
      if (list.length > 0) {
        setTop1(list[0]);
      }
      if (list.length > 1) {
        setTop2(list[1]);
      }
      if (list.length > 2) {
        setTop3(list[2]);
      }
      if (dataRequest.page > 1) {
        setLeaderboards([...leaderboards, ...rs.leaderboards]);
      } else {
        setLeaderboards(
          rs.data.filter((x: any, i: number) => {
            if (i > 2 && user?.id === x.id) setBtnMyRank(true);
            return i > 2;
          })
        );
      }
      setTotal(rs.meta.total);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    setHasLoadMore(total > leaderboards.length + 3);
  }, [leaderboards, total]);

  
  const onProfileView = (userId: any, userName: any) => {
    // console.log('insideOnProfileViewPage', post.user?.userName!)
    // if (!!post?.user?.id && !post.isAnonymous) {
      history.push(routes.ViewProfilePage.replace(":id", userId+'/'+userName));
    // }
  };

  // The scroll listener
  const handleScroll = useCallback((e) => {
    if (e) {
      if (e.target.scrollTop > 200) setBtnToTop(true);
      else setBtnToTop(false);
    }
  }, []);

  useEffect(() => {
    if (scrollRef) {
      const div = scrollRef.current;
      div.addEventListener("scroll", handleScroll);
    }
  }, [scrollRef]);

  const scrollToTop = () => {
    if (divTopRef) {
      divTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToMyRank = () => {
    if (divMyRankRef) {
      divMyRankRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (dataRequest.page === 1) {
      setLoading(true);
    }
    getLeaderBoard();
  }, [dataRequest]);

  const onBack = () => {
    history.goBack();
  };

  const onGroupByChange = (value: any) => {
    setDataRequest({
      ...dataRequest,
      page: 1,
      timeline: value,
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

  return (
    <div className="m-screen leaderboard-dsktp article-padding-top">
      <HeaderDesktop />

      <Div100vh className="leaderboard-detail m-screen">
        <Container className="sign-in" style={isMobile ? { padding: 0 } : {}}>
          <Stack>
            <Row>
              <Col className="leaderboard-left" xl={5}>
                <div className="desktop-only">
                  <DesktopMenu />
                  <DesktopCategory />
                  <DesktopHashtags />
                </div>
              </Col>
              <Col className="leaderboard-left" xl={19}>
                <h4 className="desktop-only">Leaderboard</h4>
                <div className="top-three mb-3">
                  <Stack className="box-head">
                    <div className="bg-sky xmobile-only"></div>
                    <div className="box-info">
                      <Stack direction="horizontal" className="info">
                        <div
                          className={`col info-item ${
                            dataRequest.timeline === "ALL" && "active"
                          }`}
                          onClick={onGroupByChange.bind(null, "ALL")}
                        >
                          All Time
                        </div>
                        <div
                          className={`col info-item ${
                            dataRequest.timeline === "WEEK" && "active"
                          }`}
                          onClick={onGroupByChange.bind(null, "WEEK")}
                        >
                          This Week
                        </div>
                        <div
                          className={`col info-item ${
                            dataRequest.timeline === "MONTH" && "active"
                          }`}
                          onClick={onGroupByChange.bind(null, "MONTH")}
                        >
                          This Month
                        </div>
                      </Stack>
                    </div>
                    <Stack
                      direction="horizontal"
                      className="box-top-rank flex-fill"
                    >
                      <Stack className="align-items-center justify-content-center" onClick={() => onProfileView(top2?.userId, top2?.userName)}>
                        <div className="box-avatar">
                          <Avatar
                            className="avatar"
                            src={
                              top2?.avatarLink ||
                              images.AVATAR_KEYS[top2?.avatar || "avatar2"]
                            }
                          />
                        </div>
                        <p className="text-point">{top2?.points}</p>
                        <p className="text-username" >{top2?.userName}</p>
                      </Stack>
                      <Stack className="align-items-center justify-content-center top-1" onClick={() => onProfileView(top1?.userId, top1?.userName)}>
                        <div className="box-avatar">
                          <Avatar
                            className="avatar"
                            src={
                              top1?.avatarLink ||
                              images.AVATAR_KEYS[top1?.avatar || "avatar1"]
                            }
                          />
                        </div>
                        <p className="text-point">{top1?.points}</p>
                        <p className="text-username" >{top1?.userName}</p>
                      </Stack>
                      <Stack className="align-items-center justify-content-center" onClick={() => onProfileView(top3?.userId, top3?.userName)}>
                        <div className="box-avatar">
                          <Avatar
                            className="avatar"
                            src={
                              top3?.avatarLink ||
                              images.AVATAR_KEYS[top3?.avatar || "avatar3"]
                            }
                          />
                        </div>
                        <p className="text-point">{top3?.points}</p>
                        <p className="text-username" >{top3?.userName}</p>
                      </Stack>
                    </Stack>
                  </Stack>
                </div>
                <div className="leader-list">
                  <div
                    className="flex-fill rank-list"
                    style={{ height: `calc(${height}px - 320px)` }}
                    ref={scrollRef}
                  >
                    <div ref={divTopRef} className={`box-top-scroll`} />
                    <InfiniteScroll
                      dataLength={posts.length}
                      next={onLoadMore}
                      hasMore={hasLoadMore}
                      loader={<Skeleton avatar paragraph={{ rows: 0 }} />}
                    >
                      <Stack gap={4}>
                        {!loading &&
                          leaderboards?.map((item, index) => (
                            <>
                              <Stack
                                key={`leaderboard-${item.id}`}
                                direction="horizontal"
                                gap={2}
                                className={`align-items-center rank-item `}
                                onClick={() => onProfileView(item?.userId, item?.userName)}
                              >
                                {user?.id === item.id && (
                                  <div
                                    ref={divMyRankRef}
                                    style={{
                                      position: "absolute",
                                      top: `-20px`,
                                    }}
                                  ></div>
                                )}
                                <label className="text-rank">
                                  #{index + 4}
                                </label>
                                <Avatar
                                  src={
                                    item?.avatarLink ||
                                    images.AVATAR_KEYS[
                                      item.avatar || "avatar4"
                                    ]
                                  }
                                />
                                <span className="text-username">
                                  {item.userName}
                                </span>
                                {user?.id === item.id && (
                                  <Tag className="tag-outline">You</Tag>
                                )}
                                <span className="ms-auto text-point">
                                  {item.points} pt
                                  {item.points || 0 > 1 ? "s" : ""}
                                </span>
                              </Stack>
                            </>
                          ))}
                        {loading && <Skeleton avatar paragraph={{ rows: 0 }} />}
                      </Stack>
                    </InfiniteScroll>
                  </div>{" "}
                </div>
                <Stack className="align-items-center box-btn-scroll">
                  {btnToTop && (
                    <button className="btn btn-scroll" onClick={scrollToTop}>
                      go to the top
                    </button>
                  )}
                  {!btnToTop && btnMyRank && (
                    <button className="btn btn-scroll" onClick={scrollToMyRank}>
                      go to my rank
                    </button>
                  )}
                </Stack>
              </Col>
            </Row>
          </Stack>
        </Container>
        <BottomNavBar active="board" />
      </Div100vh>
    </div>
  );
}

export default LeaderBoardPage;
