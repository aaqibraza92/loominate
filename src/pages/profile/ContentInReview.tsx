import { Col, Row, Skeleton } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Container, Dropdown, Stack } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import colors from "../../commons/styles/colors";
import DateRangePicker from "../../components/datetime/DateRangePicker";
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
import InputSearch from "../../components/input/InputSearch";
import AppNavBar from "../../components/navbar";
import BottomNavBar from "../../components/navbar/BottomNavBar";
import NavBarAdmin from "../../components/navbar/NavBarAdmin";
import PostItem from "../../components/post/PostItem";
import ViewEmpty from "../../components/view/ViewEmpty";
import Post from "../../models/post.model";
import User, { UserRole } from "../../models/user.model";
import postService from "../../services/post.service";
import "./styles.scss";

const FILTERS = ["All time", "This week", "This month", "Select date"];

/**
 * ContentInReview Page
 * @param props
 * @returns JSX.Element
 */
function ContentInReviewPage(props: any) {
  const user: User = useSelector((state: any) => state.auth.user);
  const [filterSelected, setFilterSelected] = useState(FILTERS[0]);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [dataRequest, setDataRequest] = useState<any>({
    page: 1,
    per_page: 10,
    user_id: user?.role === UserRole.ADMIN ? undefined : user.id,
  });
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const [dialogDateRange, setDialogDateRange] = useState(false);
  const [isAdmin, setIsAdmin] = useState(user?.role === UserRole.ADMIN);

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    const getPostInReview = async () => {
      try {
        const rs = await postService.getPostInReview(dataRequest);
        if (dataRequest.page > 1) {
          setPosts([...posts, ...rs.posts]);
        } else {
          setPosts([...rs.posts]);
        }
        setHasLoadMore(rs.meta.total > posts.length + rs.posts.length);
      } catch (error) {}
      setLoading(false);
    };
    getPostInReview();
  }, [dataRequest]);

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
   * Handle filter
   * @param {string} value
   */
  const onFilterChange = (value: string) => {
    setFilterSelected(value);
    dataRequest.page = 1;
    switch (value) {
      case "Select date":
        setDialogDateRange(true);
        break;
      case "This week":
        setDataRequest({
          ...dataRequest,
          from_date: moment().startOf("week").format(),
          to_date: moment().endOf("week").format(),
        });
        break;
      case "This month":
        setDataRequest({
          ...dataRequest,
          from_date: moment().startOf("month").format(),
          to_date: moment().endOf("month").format(),
        });
        break;
      case "All time":
        setDataRequest({
          ...dataRequest,
          from_date: null,
          to_date: null,
        });
        break;
      default:
        break;
    }
  };

  const onDateRangeChange = (data: any) => {
    setDialogDateRange(false);
    setDataRequest({
      ...dataRequest,
      page: 1,
      from_date: moment(data.startDate).startOf("day").format(),
      to_date: moment(data.endDate).endOf("day").format(),
    });
  };

  const displayFilter = () => {
    if (filterSelected === "Select date") {
      if (!dataRequest.from_date) return "Select date";
      const isADay =
        moment(dataRequest.to_date).format("YYYY-MM-DD") ===
        moment(dataRequest.from_date).format("YYYY-MM-DD");
      if (isADay) {
        return moment(dataRequest.from_date).format("LL");
      } else {
        return `${moment(dataRequest.from_date).format("LL")} - ${moment(
          dataRequest.to_date
        ).format("LL")}`;
      }
    }
    return filterSelected;
  };

  /**
   * Handle search posts
   * @param {React.ChangeEventHandler} ChangeEventHandler
   */
  const onSearch = (keywords: any) => {
    setDataRequest({
      ...dataRequest,
      page: 1,
      keywords,
    });
  };

  const onAdminSearch = (keywords: string) => {
    setDataRequest({
      ...dataRequest,
      page: 1,
      keywords,
    });
  };

  return (
    <div className="m-screen content-in-review-page">      
      <HeaderDesktop/>
      {user?.role !== UserRole.ADMIN && <AppNavBar />}
      {user?.role === UserRole.ADMIN && (
        <NavBarAdmin onSearch={onAdminSearch} />
      )}
      <InfiniteScroll
      className="article-padding-top"
        dataLength={posts.length}
        next={onLoadMore}
        hasMore={hasLoadMore}
        loader={<Skeleton avatar paragraph={{ rows: 3 }} />}
        scrollableTarget="scrollableDiv"
      >
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
              
      <Stack
        className={`box-content ${user?.role === UserRole.ADMIN && "admin"}`}
      >
        {user?.role !== UserRole.ADMIN && (
          <InputSearch placeholder="Search anything..." onSearch={onSearch} />
        )}
        <Stack direction="horizontal" className="mt-2">
          <h6 className="title">Content in review</h6>
          <Dropdown className="ms-auto">
            <Dropdown.Toggle variant="light" className="btn-dropdown">
              {displayFilter()}{" "}
              <IcoMoon icon="chevron_down" color={colors.primary} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {FILTERS.map((item: string) => (
                <Dropdown.Item
                  key={item}
                  className={`btn-dropdown-item ${
                    item === filterSelected && "selected"
                  }`}
                  onClick={onFilterChange.bind(null, item)}
                >
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Stack>
      </Stack>
              <Stack gap={2}>
                {!loading &&
                  posts.map((item: Post) => {
                    return (
                      <PostItem
                        key={`post-${item?.id}`}
                        data={item || {}}
                        isInReview={true}
                      />
                    );
                  })}
              </Stack>
              {!loading && !posts.length && (
                <div className="mt-5">
                <ViewEmpty message="No posts in review found!" />
                </div>
              )}
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
      </InfiniteScroll>
      <DateRangePicker
        visible={dialogDateRange}
        onCancel={() => setDialogDateRange(false)}
        onSelected={onDateRangeChange}
      />
      <BottomNavBar />
    </div>
  );
}

export default ContentInReviewPage;
