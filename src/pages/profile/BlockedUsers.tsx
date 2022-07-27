import { Col, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import routes from "../../commons/constants/routes.constant";
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
import BlockedUserItem from "../../components/user/BlockedUserItem";
import ViewEmpty from "../../components/view/ViewEmpty";
import { FeedFilter } from "../../models/feed.filter.model";
import User from "../../models/user.model";
import userService from "../../services/user.service";
import "./styles.scss";

/**
 * BlockedUsers Page
 * @param props
 * @returns JSX.Element
 */
function BlockedUsersPage(props: any) {
  const params: any = useParams();
  const { id = null } = params;
  const history = useHistory();
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User>();
  const [dialogReport, setDialogReport] = useState(false);
  const [dialogBlock, setDialogBlock] = useState(false);
  const [dialogDeleteUser, setDialogDeleteUser] = useState(false);
  const [dialogMute, setDialogMute] = useState(false);
  const [blockRequesting, setBlockRequesting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const [dataRequest, setDataRequest] = useState<FeedFilter>({
    page: 1,
    per_page: 10,
    id: '3'
  });
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    // if (!user?.id) return;
    try {
      const rs = await userService.blockedUsers(dataRequest);
      if (dataRequest.page > 1) {
        setUsers([...users, ...rs]);
      } else {
        setUsers([...rs]);
      }
      setHasLoadMore(rs.meta.total > users.length + rs.users.length);
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    if (dataRequest.page === 1) {
      setLoading(true);
    }
    getUsers();
  }, [dataRequest]);

  const goToHome = () => {
    history.push(routes.HomePage);
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
    <div className="profile-detail m-screen">
    <HeaderDesktop/>
      <AppNavBar hasBack />
      <Container style={isMobile ? { padding: 0 } : {}}>
        <InfiniteScroll
          style={{ overflowX: "hidden" }}
          dataLength={users.length}
          next={onLoadMore}
          hasMore={hasLoadMore}
          loader={<Skeleton avatar paragraph={{ rows: 3 }} />}
        >
          <Row gutter={16}>
            <Col xl={5}>              
            <div className="desktop-only">
                <DesktopMenu />
                <DesktopCategory />
                <DesktopHashtags />
                </div>
            </Col>
            <Col span={24} xl={12}>
          <div>
            <Stack
              direction="horizontal"
              className="v-filter align-items-center mb-3 mt-2"
            >
              <h4>Blocked Users</h4>
            </Stack>
          </div>
              <Stack gap={2}>
                {!loading && users.map((item: User) => {
                  return (
                    <BlockedUserItem key={`user-${item?.id}`} data={item} />
                  );
                })}
              </Stack>
              {loading && users.length === 0 && <ViewEmpty message="No Users" />}
            </Col>
            <Col xl={7}>
                <div className="desktop-only">
                <DesktopMyCommunity />
                {/* <DesktopMyProfile/> */}
                <DesktopOurPurpose/>
                <DesktopGuidelines/>
                <DesktopCulture/>
                </div>
              </Col>
          </Row>
        </InfiniteScroll>
      </Container>
    </div>
  );
}

export default BlockedUsersPage;
