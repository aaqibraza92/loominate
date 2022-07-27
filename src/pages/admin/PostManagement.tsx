import { Col, Row, Skeleton } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Container, Dropdown, Stack } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";
import routes from "../../commons/constants/routes.constant";
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
import NavBarAdmin from "../../components/navbar/NavBarAdmin";
import PostItem from "../../components/post/PostItem";
import ViewEmpty from "../../components/view/ViewEmpty";
import Post, { PostView } from "../../models/post.model";
import Report, { ReportFilter } from "../../models/report.model";
import User, { UserRole } from "../../models/user.model";
import postService from "../../services/post.service";
import reportService from "../../services/report.service";
import "./styles.scss";

const FILTERS = ["All time", "This week", "This month", "Select date"];

/**
 * Post Detail Page
 * @param props
 * @returns JSX.Element
 */
function PostManagementPage(props: any) {
  const params: any = useParams();
  const search: any = useLocation().search;
  const { id = null } = params;
  const history = useHistory();
  const dispatch = useDispatch();
  const [view, setView] = useState<any>(
    new URLSearchParams(search).get("view") || ""
  );
  const [title, setTitle] = useState(
    view === PostView.hidden
      ? "Hidden Content"
      : view === PostView.review
      ? "Content in review"
      : "Reported Content"
  );
  const user: User = useSelector((state: any) => state.auth.user);
  const [filterSelected, setFilterSelected] = useState(FILTERS[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [dataRequest, setDataRequest] = useState<ReportFilter>({
    page: 1,
    per_page: 10,
  });
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const [dialogDateRange, setDialogDateRange] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (user) {
      setIsAdmin(user?.role === UserRole.ADMIN);
      if (user.role !== UserRole.ADMIN) {
        history.replace(routes.HomePage);
      }
    }
  }, [user]);

  const getReports = async () => {
    try {
      const rs = await reportService.getPosts(dataRequest);
      if (dataRequest.page > 1) {
        setReports([...reports, ...rs.reports]);
      } else {
        setReports([...rs.reports]);
      }
      setHasLoadMore(rs.meta.total > reports.length + rs.reports.length);
      setTotal(rs.meta.total);
    } catch (error) {}
    setLoading(false);
  };

  const getHiddenPosts = async () => {
    try {
      const rs = await reportService.getHiddenPosts(dataRequest);
      if (dataRequest.page > 1) {
        setReports([...reports, ...rs.reports]);
      } else {
        setReports([...rs.reports]);
      }
      setHasLoadMore(rs.meta.total > reports.length + rs.reports.length);
    } catch (error) {}
    setLoading(false);
  };

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

  useEffect(() => {
    if (view === PostView.review) {
      getPostInReview();
    } else if (view === PostView.hidden) {
      getHiddenPosts();
    } else {
      getReports();
    }
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

  const onAdminSearch = (keywords: string) => {
    setDataRequest({
      ...dataRequest,
      page: 1,
      keywords,
    });
  };

  if (!isAdmin) return <div></div>;

  return (
    <div className="m-screen dashboard-page">
    <HeaderDesktop/>
      <NavBarAdmin hasBack onSearch={onAdminSearch} />
      <InfiniteScroll
        dataLength={reports.length}
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
              
      <Stack className="box-content">
        <Stack direction="horizontal">
          <h6 className="title">
            {title} {total > 0 ? `(${total})` : ""}
          </h6>
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
                  reports.map((item: Report) => {
                    if (view === PostView.hidden) {
                      return (
                        <PostItem
                          key={`post-${item?.id}`}
                          data={item || {}}
                          view={view}
                          // report={item}
                        />
                      );
                    }
                    return item.post ? (
                      <PostItem
                        key={`post-${item?.id}`}
                        data={item.post || {}}
                        view={view}
                        report={item}
                      />
                    ) : (
                      <></>
                    );
                  })}
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
              {!loading && !(reports.length || posts.length) && (
                <ViewEmpty message="No posts" />
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
      {/* <BottomNavBar /> */}
    </div>
  );
}

export default PostManagementPage;
