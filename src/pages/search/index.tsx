import { Skeleton } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Container, Dropdown, Stack } from "react-bootstrap";
import Div100vh from "react-div-100vh";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { useRecoilState } from "recoil";
import { tenantNameState } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import CategorySelectModal from "../../components/category/CategorySelectModal";
import IcoMoon from "../../components/icon/IcoMoon";
import InputSearch from "../../components/input/InputSearch";
import ModalConfirm from "../../components/modal/ModalConfirm";
import PostItem from "../../components/post/PostItem";
import Category from "../../models/category.model";
import { FeedFilter } from "../../models/feed.filter.model";
import Post from "../../models/post.model";
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
  {
    name: "Posts",
    value: "Posts",
  },
  {
    name: "Polls",
    value: "Polls",
  },
  {
    name: "Initiatives",
    value: "Initiatives",
  },
];

/**
 * Search Page
 * @param props
 * @returns JSX.Element
 */
function SearchPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const search: any = useLocation().search;
  const hashtag: string = new URLSearchParams(search).get("hashtag") || "";
  console.log('hash check',hashtag);
  const { searchPosts: dataPosts, categoriesSelected } = useSelector(
    (state: any) => state.feed
  );
  const { auth_token, user } = useSelector((state: any) => state.auth);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataRequest, setDataRequest] = useState<FeedFilter>({
    page: 1,
    per_page: 10,
    order: FILTERS[0].value,
    hashtags: `#${hashtag}`,
    keywords: "",
  });
  const [filterSelected, setFilterSelected] = useState(FILTERS[0]);
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const [visibleCategory, setVisibleCategory] = useState(false);
  const [btnToTop, setBtnToTop] = useState(false);
  const [dialogComingSoon, setDialogComingSoon] = useState(false);
  const [total, setTotal] = useState(0);
  const postTopRef: any = useRef(null);
  const scrollRef: any = useRef();
  const [tenantName, setTenantName] = useRecoilState(tenantNameState);

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
  // const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
// hashtagPage
  const scrollToTop = () => {
    if (postTopRef) {
      postTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getPosts = async () => {
    // if (!auth_token) return;
    try {
      const rs = await postService.getAllSearch(tenantName,dataRequest);
      console.log('inside search request of hashtags', rs)
      if (dataRequest.page > 1) {
        dispatch(feedAction.setSearchPosts([...posts, ...rs.data]));
      } else {
        dispatch(feedAction.setSearchPosts([...rs.data]));
      }
      setTotal(rs.meta.itemCount);
      setHasLoadMore(rs.meta.itemCount > posts.length);
    } catch (error) {}
  };

  useEffect(() => {
    if (posts.length > 0 && posts[0]?.id !== dataPosts[0]?.id) {
      setTimeout(() => {
        scrollToTop();
      }, 500);
    }
    console.log('get post hashtags', dataPosts)
    setPosts(dataPosts);
  }, [dataPosts]);

  useEffect(() => {
    getPosts();
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
    console.log('dataposts in indea', dataPosts)
    // const keywords = e.target.value;
    setDataRequest({
      ...dataRequest,
      keywords,
    });
  };

  const onAdminSearch = (keywords: string) => {
    // const keywords = e.target.value;
    setDataRequest({
      ...dataRequest,
      keywords,
    });
  };

  const onBack = () => {
    history.goBack();
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
  const onFilterChange = (data: any) => {
    setFilterSelected(data);
    setDataRequest({
      ...dataRequest,
      page: 1,
      order: data.value,
    });
    // switch (data.value) {
    //   case PostType.Post:
    //   case PostType.Poll:
    //   case PostType.Initiative:
    //     setDataRequest({
    //       ...dataRequest,
    //       page: 1,
    //       post_type: data.value,
    //     });
    //     break;

    //   default:
    //     onOpenComingSoon();
    //     break;
    // }
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

  return (
    <div>
      <Div100vh
        id="scrollableDiv"
        className="m-screen feed-search"
        ref={scrollRef}
      >
        <InfiniteScroll
          dataLength={posts.length}
          next={onLoadMore}
          hasMore={hasLoadMore}
          loader={<Skeleton avatar paragraph={{ rows: 3 }} />}
          scrollableTarget="scrollableDiv"
        >
          <div ref={postTopRef} className={`box-top-scroll`} />
          <Container>
            <Stack direction="horizontal" className="align-items-center">
              <button className="btn" onClick={onBack}>
                <IcoMoon icon="chevron_left" size={24} />
              </button>
              <div className="flex-fill">
                <InputSearch
                  placeholder="Search anything......"
                  onSearch={onSearch}
                />
              </div>
            </Stack>
            <Stack className="v-filter" gap={2}>
              {/* <Stack direction="horizontal" gap={2} className="v-btn-list">
                <Button variant="light" onClick={onVisibleCategory}>
                  <IcoMoon icon="plus" color="#03C5CC" size={20} />
                </Button>
                {categoriesSelected.map((item: Category) => (
                  <button
                    key={item.id}
                    className="btn"
                    style={{ backgroundColor: item.color }}
                    onClick={onViewCategory.bind(null, item?.id || "")}
                  >
                    <div>{item.name}</div>
                  </button>
                ))}
              </Stack> */}
              <Stack
                direction="horizontal"
                className="align-items-center mb-3 mt-3"
              >
                <h4 className="text-result">Results ({total})</h4>
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
          <Stack gap={2}>
            {posts.map((item: Post) => {
              return <PostItem key={`post-${item?.id}`} data={item} />;
            })}
          </Stack>
        </InfiniteScroll>
      </Div100vh>
      {btnToTop && (
        <button className="btn btn-scroll-top" onClick={scrollToTop}>
          <IcoMoon icon="short_up" color="#000" size={26} />
        </button>
      )}
      <CategorySelectModal visible={visibleCategory} onClose={onHideCategory} />
      <ModalConfirm
        visible={dialogComingSoon}
        message="Coming soon"
        cancelText={null}
        onOk={() => {
          setDialogComingSoon(false);
        }}
      />
      {/* <BottomNavBar active="home" /> */}
    </div>
  );
}

export default SearchPage;
