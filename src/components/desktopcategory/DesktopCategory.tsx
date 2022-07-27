import Checkbox from 'antd/lib/checkbox/Checkbox';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Dropdown, Modal, Nav, Row, Stack } from 'react-bootstrap'
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import IconFeed from '../../assets/images/IconFeed';
import IconInitiatives from '../../assets/images/IconInitiatives';
import IconLeaderboard from '../../assets/images/IconLeaderboard';
import images from '../../assets/images/images'
import { catIds, flagFeedUpdate, tenantNameState } from '../../atoms/globalStates';
import { CATEGORY_ORDERS } from '../../commons/constants/category.constant';
import routes from '../../commons/constants/routes.constant';
import colors from '../../commons/styles/colors';
import Category from '../../models/category.model';
import { FeedFilter } from '../../models/feed.filter.model';
import Post from '../../models/post.model';
import User, { UserRole } from '../../models/user.model';
import authAction from '../../redux/actions/auth.action';
import feedAction from '../../redux/actions/feed.action';
import categoryService from '../../services/category.service';
import postService from '../../services/post.service';
import userService from '../../services/user.service';
import AddCategorySheet from '../category/AddCategorySheet';
import CategorySelectModal from '../category/CategorySelectModal';
import IcoMoon from '../icon/IcoMoon';
import InputSearch from '../input/InputSearch';
import "./styles.scss";

/**
 * CategorySelectModal Component
 * @param { Props} props
 * @returns JSX.Element
 */
const DesktopCategory = (props: any) => {
  const { visible, onClose } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { categoriesSelected } = useSelector((state: any) => state.feed);
  const user: User = useSelector((state: any) => state.auth.user);
  const [sortingSelected, setSortingSelected] = useState(CATEGORY_ORDERS[0]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isVisible, setIsVisible] = useState(visible);
  const [dataRequest, setDataRequest] = useState({
    page: 1,
    per_page: 100,
    order: CATEGORY_ORDERS[0],
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([
    ...categoriesSelected?.map((x: any) => x.id),
  ]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    ...categoriesSelected,
  ]);
  const [selectAll, setSelectAll] = useState(false);
  const [dialogAddCategory, setDialogAddCategory] = useState(false);
  const [dialogSuccess, setDialogSuccess] = useState(false);
  const [catopener, setcatopener] = useState(false);
  const [categoryIds, setCategoryIds] = useRecoilState<any>(catIds)
  const [flag_feed, setFlag_feed] = useRecoilState(flagFeedUpdate);

  // const [flagSelectedAll, setFlagSelectedAll] = useState(false)
  useEffect(() => {
    // if (categoriesSelected.length > 0) {
      // setSelectedIds([...categoriesSelected.map((x: any) => x.id)]);
      // setSelectedCategories([...categoriesSelected]);
      // categories.map((item: any) => {
      //   item.selected = selectedIds.indexOf(item.id) > -1;
      // });
      // setCategories([...categories]);

      // user.categories && user.categories.map((item: any) => {
      //   item.se
      // })

      const getUserDetails = async () => {
        const tenantName: any = localStorage.getItem('tenantName')
        let user_rs: any = await userService.getUser(tenantName, user.userName)
        console.log('getUserById', user_rs)
        console.log('getUserByIdReduxs', user)

        const ids: any = user_rs.categories && user_rs.categories.map((x: any) => {
          x.selected = true;
          return x.id || "";
        });
        setCategoryIds(ids)
        console.log('ids from dektopCatids', ids)
        setFlag_feed(!flag_feed)
        setSelectedIds([...ids]);
        user_rs.categories && setSelectedCategories(user_rs.categories)
        // user.user_categories = [...selectedCategories];
        // dispatch(authAction.updateUser(user));
      }
      


      console.log('selected categories', selectedCategories)
    // }
    getUserDetails();
  }, []);

  const onViewCategory = (id: any, title: any) => {
      let tempUrl = title.replace(/ /g,"_");
      history.push(routes.CategoryPage.replace(":id", id+'/'+tempUrl));
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const tenantName: any = localStorage.getItem('tenantName')
        console.log('userTest in DeaktopCategories', user)
      console.log('selected categories 2', selectedCategories)
        
        const rs = await categoryService.getAll(tenantName,{ order:'DESC' });
        if (selectedIds.length > 0) {
          rs.data.map((item: any) => {
            item.selected = selectedIds.indexOf(item.id) > -1;
          });
        }
        console.log('inside desktop categrories', rs)
        if (selectedIds.length === rs.length) {
          setSelectAll(true);
        }
        setCategories([...rs]);
        if(rs.length  == selectedCategories.length) {
          console.log('not comming here?')
          setSelectAll(true);
        }
        else {
          setSelectAll(false)
        }
      } catch (error) {
        console.log('error in cat', error)
      }
    };
    getCategories();
  }, [dataRequest]);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);
  const handleOk = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleCancel = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const onSortingChange = (value: string) => {
    setSortingSelected(value);
    setDataRequest({
      ...dataRequest,
      order: value,
    });
  };

  const onSelectCategory = async (category: Category = {}) => {
    const tenantName = localStorage.getItem('tenantName')
    category.selected = !category.selected;
    const i = selectedIds.indexOf(category?.id || "");
    let catsSelected = selectedCategories;
    let catIdsSelected = selectedIds;
    if (i < 0) {
      catIdsSelected = [category?.id || "", ...selectedIds];
      catsSelected = [{ ...category }, ...selectedCategories];
      if (catIdsSelected.length === categories.length) {
        setSelectAll(true);
      }
      categoryService.followOne(category?.id,user.id, tenantName);
    } else {
      catIdsSelected.splice(i, 1);
      selectedCategories.splice(i, 1);
      catsSelected = [...selectedCategories];
      if (selectAll) {
        setSelectAll(false);
      }
      categoryService.unfollowOne(category?.id,user.id, tenantName);
    }
    console.log('formatForCats', catsSelected)
    setSelectedCategories([...catsSelected]);
    console.log('selected categories 3', selectedCategories)
    setSelectedIds([...catIdsSelected]);
    setCategories([...categories]);
  };

  const onBack = () => {
    dispatch(feedAction.updateCategoriesSelected(selectedCategories));
    user.user_categories = [...selectedCategories];
    dispatch(authAction.updateUser(user));
    if (onClose) onClose(selectedCategories);
    setIsVisible(false);
  };

  const triggerFeed = () => {
    localStorage.setItem('catIds', JSON.stringify(selectedIds) )
    setCategoryIds(selectedIds)
    setFlag_feed(!flag_feed)
  }

  const onSelectAllChange = async (e: any) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      const ids: string[] = categories.map((x) => {
        x.selected = true;
        return x.id || "";
      });
      setSelectedIds([...ids]);
      setSelectedCategories([...categories]);
      setCategories([...categories]);
      const tenantName = localStorage.getItem('tenantName')
      await categoryService.followMany(ids, user.id, tenantName);
    } else {
      categories.map((item) => (item.selected = false));
      const ids: string[] = categories.map((x: any) => x.id);
      const tenantName: any = localStorage.getItem('tenantName')
      await categoryService.unfollowMany(ids, user.id, tenantName);
      setSelectedIds([]);
      setSelectedCategories([]);
      setCategories([...categories]);
    }
  };

  const onAddCategory = () => {
    setDialogAddCategory(true);
  };

  const onCategoryAdded = (data?: any) => {
    setDialogSuccess(true);
    categories.push(data);
    setCategories(categories);
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const doneFunc=()=>{
    setcatopener(false);
    handleClose();
  }
  return (
    <div className="white-box">
      <h5>CATEGORIES</h5>
         <div className="cat-list">
               
                    <div className="box-selected">
                    {selectedCategories && selectedCategories.map((item: Category) => (
                      <button
                        key={item.id}
                        className="btn"
                        style={{ backgroundColor: "#222222" }}
                        onClick={(e) => onViewCategory(item.id, item.title)}
                      >
                        <div style={{ color: "#fff" }}>{item.title}</div>
                      </button>
                    ))}
                  </div>
                {/* <Button variant="light" onClick={handleShow}>
                  <IcoMoon icon="plus" color="#03C5CC" size={20} /> Select Categories
                </Button> */}
                <br />
                <Modal className="cat-modals" show={show} onHide={handleClose}>
        <Modal.Body>
        <div className='select-topic-dd'>
                  
                  <Stack
                    direction="horizontal"
                    className="align-items-center box-option mb-2"
                  >
                    <h5 className="text-option">Topics</h5>
                    <Dropdown className="ms-auto">
                      <Dropdown.Toggle variant="light" className="btn-dropdown">
                        {sortingSelected}{" "}
                        <IcoMoon icon="chevron_down" color={colors.mint} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {CATEGORY_ORDERS.map((item: string) => (
                          <Dropdown.Item
                            key={item}
                            className={`btn-dropdown-item ${
                              item === sortingSelected && "selected"
                            }`}
                            onClick={onSortingChange.bind(null, item)}
                          >
                            {item}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Stack>
                  <div className="categories-items">
                  <Stack>
                    {user?.role === UserRole.ADMIN && (
                      <button className="btn btn-add-category" onClick={onAddCategory}>
                        <IcoMoon icon="plus" color={colors.mint} />
                        Add New Category
                      </button>
                    )}
                    <div className="box-select-all">
                      <Checkbox
                        defaultChecked={false}
                        className="ms-auto"
                        checked={selectAll}
                        onChange={onSelectAllChange}
                      >
                        Select all categories
                      </Checkbox>
                    </div>
                    <div className="cat-items">
                    {categories.map((item) => (
                      <Stack
                        key={`category-${item.id}`}
                        direction="vertical"
                        className={`category-item ${item.selected && selectedCategories && "selected"}`}
                        // className={`category-item`}
                        onClick={onSelectCategory.bind(null, item)}
                      >
                        {item.title}
                      </Stack>
                      
                    ))}
                    </div>
                  </Stack>
                  </div >
                  <div onClick={triggerFeed}>
                  <Button onClick={()=>doneFunc()} className='mt-2' variant='primary'>DONE</Button>
                  </div>
                </div>
        </Modal.Body>
      </Modal>
                  
              
               

      {dialogAddCategory && (
        <AddCategorySheet
          categories={categories}
          open={dialogAddCategory}
          onClose={() => {
            setDialogAddCategory(false);
          }}
          onSuccess={onCategoryAdded}
        />
      )}

            
              </div>
</div>
  )
}

export default DesktopCategory