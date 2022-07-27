import { Col, Row, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Container, Dropdown, Stack } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import Div100vh from "react-div-100vh";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useRecoilState } from "recoil";
import images from "../../assets/images/images";
import { tenantNameState } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import CategorySelectModal from "../../components/category/CategorySelectModal";
import IcoMoon from "../../components/icon/IcoMoon";
import InputSearch from "../../components/input/InputSearch";
import AppNavBar from "../../components/navbar";
import BottomNavBar from "../../components/navbar/BottomNavBar";
import NavBarAdmin from "../../components/navbar/NavBarAdmin";
import PostItem from "../../components/post/PostItem";
import ViewEmpty from "../../components/view/ViewEmpty";
import Category from "../../models/category.model";
import { FeedFilter } from "../../models/feed.filter.model";
import Post, { PostType } from "../../models/post.model";
import { UserRole } from "../../models/user.model";
import feedAction from "../../redux/actions/feed.action";
import categoryService from "../../services/category.service";
import postService from "../../services/post.service";
import "./styles.scss";

const FILTERS = [
  {
    name: "All",
    value: null,
  },
  {
    name: "Recommended",
    value: "Recommended",
  },
  {
    name: "Hot",
    value: "Hot",
  },
  {
    name: "Recent",
    value: "Recent",
  },
  {
    name: "Trending Categories",
    value: "Trending",
  },
];

/**
 * Feed Page
 * @param props
 * @returns JSX.Element
 */
function InitiativesPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { initiatives: dataPosts } = useSelector((state: any) => state.feed);
  const { auth_token, user } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tenantName, setTenantName] = useRecoilState(tenantNameState);

  const [dataRequest, setDataRequest] = useState<FeedFilter>({
    page: 1,
    per_page: 10,
    keywords: "",
    post_type: PostType.Initiative,
  });
  const [filterSelected, setFilterSelected] = useState(FILTERS[0]);
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const [visibleCategory, setVisibleCategory] = useState(false);
  const postTopRef: any = useRef(null);

  // const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const scrollToTop = () => {
    if (postTopRef) {
      postTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // const getPosts = async () => {
  //   if (!auth_token) return;
  //   try {
  //     const rs = await postService.getAll(tenantName,dataRequest);
  //     if (dataRequest.page > 1) {
  //       dispatch(feedAction.setInitiatives([...posts, ...rs.posts]));
  //     } else {
  //       dispatch(feedAction.setInitiatives([...rs.posts]));
  //     }
  //     setHasLoadMore(rs.meta.total > posts.length);
  //   } catch (error) {}
  //   setLoading(false);
  // };

  useEffect(() => {
    setPosts(dataPosts);
  }, [dataPosts]);

  useEffect(() => {
    if (dataRequest.page === 1) {
      setLoading(true);
    }
    // getPosts();
  }, [dataRequest, auth_token]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const rs = await categoryService.getAll({ page: 1, per_page: 100 });
        setCategories(rs.categories);
      } catch (error) {}
    };
    getCategories();
  }, []);

  /**
   * Handle search posts
   * @param {React.ChangeEventHandler} ChangeEventHandler
   */
  const onSearch = (keywords: any) => {
    console.log(keywords);

    setDataRequest({
      ...dataRequest,
      keywords,
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

  /**
   * Handle filter posts
   * @param {string} data
   */
  const onFilterChange = (data: any) => {
    setFilterSelected(data);
    setDataRequest({
      ...dataRequest,
      page: 1,
      order: data.value,
    });
  };

  const onVisibleCategory = () => {
    setVisibleCategory(true);
  };
  const onHideCategory = (categories: any) => {
    setVisibleCategory(false);
    // if (categories) {
    //   setSelectedCategories([...categories]);
    // }
  };

  const onViewCategory = (categoryId: string) => {
    history.push(routes.CategoryPage.replace(":id", categoryId));
  };

  const onAdminSearch = (keywords: string) => {
    // const keywords = e.target.value;
    setDataRequest({
      ...dataRequest,
      keywords,
    });
  };

  return (
    <div>
      {user?.role !== UserRole.ADMIN && <AppNavBar />}
      {user?.role === UserRole.ADMIN && (
        <NavBarAdmin onSearch={onAdminSearch} />
      )}
      <Div100vh id="scrollableDiv" className="m-screen initiative">
        <div
          ref={postTopRef}
          className={`box-top-scroll ${
            user?.role === UserRole.ADMIN && "admin"
          }`}
        />
        <InfiniteScroll
          dataLength={posts.length}
          next={onLoadMore}
          hasMore={hasLoadMore}
          loader={<Skeleton avatar paragraph={{ rows: 3 }} />}
          scrollableTarget="scrollableDiv"
        >
          <Container>
            {user?.role !== UserRole.ADMIN && (
              <InputSearch
                placeholder="Search anything..."
                onSearch={onSearch}
              />
            )}
            <Stack className="v-filter mt-3" gap={2}>
              <Stack direction="horizontal" className="align-items-center mb-3">
                <h4>Initiatives</h4>
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
                        onClick={onFilterChange.bind(null, item)}
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
              <Col xl={5}></Col>
              <Col span={24} xl={14}>
                <Stack gap={2}>
                  {posts.map((item: Post) => {
                    return <PostItem key={item.id} data={item} />;
                  })}
                  {loading && <Skeleton avatar paragraph={{ rows: 3 }} />}
                </Stack>
                {!loading && posts.length === 0 && (
                  <ViewEmpty message="No Initiatives" />
                )}
              </Col>
              <Col xl={5}></Col>
            </Row>
          </Container>
        </InfiniteScroll>
      </Div100vh>
      <button className="btn btn-scroll-top" onClick={scrollToTop}>
        <IcoMoon icon="short_up" color="#fff" size={26} />
      </button>
      <CategorySelectModal visible={visibleCategory} onClose={onHideCategory} />
      <BottomNavBar active="initiatives" />
    </div>
  );
}

export default InitiativesPage;
