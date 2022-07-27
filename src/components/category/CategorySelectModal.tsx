import { Checkbox, Modal, ModalProps } from "antd";
import { useEffect, useState } from "react";
import { Container, Dropdown, Stack } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { catIds, flagFeedUpdate, wakeCats, wakeGetCat } from "../../atoms/globalStates";
import { CATEGORY_ORDERS } from "../../commons/constants/category.constant";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import Category from "../../models/category.model";
import User, { UserRole } from "../../models/user.model";
import authAction from "../../redux/actions/auth.action";
import feedAction from "../../redux/actions/feed.action";
import categoryService from "../../services/category.service";
import userService from "../../services/user.service";
import IcoMoon from "../icon/IcoMoon";
import ModalConfirm from "../modal/ModalConfirm";
import AppNavBar from "../navbar";
import AddCategorySheet from "./AddCategorySheet";
import "./styles.scss";

interface Props extends ModalProps {
  visible?: boolean;
  loading?: boolean;
  selected?: any;
  onClose?: any;
  idsProp?: any;
}

/**
 * CategorySelectModal Component
 * @param { Props} props
 * @returns JSX.Element
 */
function CategorySelectModal(props: Props) {
  const { visible, onClose, idsProp } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { categoriesSelected } = useSelector((state: any) => state.feed);
  const user: User = useSelector((state: any) => state.auth.user);
  const [isVisible, setIsVisible] = useState(visible);
  const [sortingSelected, setSortingSelected] = useState(CATEGORY_ORDERS[0]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [wakeCatState, setwakeCatState] = useRecoilState(wakeCats)
  const [flag_feed, setFlag_feed] = useRecoilState(flagFeedUpdate);
  const [categoryIds, setCategoryIds] = useRecoilState<any>(catIds)
  const [selectedFlag, setSelectedFlag] = useState(false)
  const [catFlagGetAll, setCatFlagGetAll] = useRecoilState(wakeGetCat)

  // useEffect(() => {
  //   if (categoriesSelected.length > 0) {
  //     // setSelectedIds([...categoriesSelected.map((x: any) => x.id)]);
  //     // setSelectedCategories([...categoriesSelected]);
  //     // categories.map((item: any) => {
  //     //   item.selected = selectedIds.indexOf(item.id) > -1;
  //     // });
  //     // setCategories([...categories]);
  //   }
  // }, []);
  const getUserDetails = async () => {
    const tenantName: any = localStorage.getItem('tenantName')
    let user_rs: any = await userService.getUser(tenantName, user.userName)
    console.log('getUserById', user_rs)
    console.log('getUserByIdReduxs', user)

    const ids: any = user_rs.categories && user_rs.categories.map((x: any) => {
      x.selected = true;
      return x.id || "";
    });
    // setCategoryIds(ids)
    console.log('ids from mobileCatids', ids)
    setFlag_feed(!flag_feed)
    setSelectedIds([...ids]);
    user_rs.categories && setSelectedCategories(user_rs.categories)
    setSelectedFlag(true)
    // user.user_categories = [...selectedCategories];
    // dispatch(authAction.updateUser(user));
  }
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
    
    console.log('testProp', idsProp)

      console.log('selected categories', selectedCategories)
    // }
    getUserDetails();
  }, []);

  useEffect(() => {
    getUserDetails();
  }, [catFlagGetAll, idsProp])
  

  useEffect(() => {
    const getCategories = async () => {
      try {
        const tenantName: any = localStorage.getItem('tenantName')
        const rs = await categoryService.getAll(tenantName,{ order:'DESC' });
        console.log('getAllCategoriesMobile', rs)
        rs.map((item: any, i : any) => {
          console.log('sompare123', item.id, selectedIds[i])
          item.selected = idsProp[i] == item.id ? true : false ;
        });
        if(selectedIds){
          if (selectedIds.length > 0) {
            rs.map((item: any) => {
              item.selected = selectedIds.indexOf(item.id) > -1;
            });
          }
          if (selectedIds.length === rs.length) {
            setSelectAll(true);
          }
        }
        setCategories([...rs]);
      } catch (error) {}
    };
    getCategories();
  }, [dataRequest, idsProp]);

  useEffect(() => {
    console.log('catSelected', selectedIds)
  }, [])
  

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
      // categoryService.follow(category?.id);
      categoryService.followOne(category?.id,user.id, tenantName);

    } else {
      catIdsSelected.splice(i, 1);
      selectedCategories.splice(i, 1);
      catsSelected = [...selectedCategories];
      if (selectAll) {
        setSelectAll(false);
      }
      // categoryService.unfollow(category?.id);
      categoryService.unfollowOne(category?.id,user.id, tenantName);

    }
    setSelectedCategories([...catsSelected]);
    console.log('selectedIds',selectedIds)
    setSelectedIds([...catIdsSelected]);
    setCategories([...categories]);
    setwakeCatState(!wakeCatState)
  };

  const triggerFeed = () => {
    localStorage.setItem('catIds', JSON.stringify(selectedIds) )
    setCategoryIds(selectedIds)
    setFlag_feed(!flag_feed)
    setwakeCatState(!wakeCatState)
  }

  const onBack = () => {
    triggerFeed()
    dispatch(feedAction.updateCategoriesSelected(selectedCategories));
    user.user_categories = [...selectedCategories];
    dispatch(authAction.updateUser(user));
    if (onClose) onClose(selectedCategories);
    setIsVisible(false);
  setSelectedFlag(false)
  };

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
      // await categoryService.followMany(ids);
      const tenantName: any = localStorage.getItem('tenantName')
      await categoryService.followMany(ids, user.id, tenantName);
      setwakeCatState(!wakeCatState)
    } else {
      categories.map((item) => (item.selected = false));
      const ids: string[] = categories.map((x: any) => x.id);
      // await categoryService.unfollowMany(ids);
      const tenantName: any = localStorage.getItem('tenantName')
      await categoryService.unfollowMany(ids, user.id, tenantName);
      setwakeCatState(!wakeCatState)
      setSelectedIds([]);
      setSelectedCategories([]);
      setCategories([...categories]);
    }
  };

  const onViewCategory = (category: any) => {
    // history.push(routes.CategoryPage.replace(":id", categoryId));
    let tempUrl = category.title?.replace(/ /g,"_");
    history.push(routes.CategoryPage.replace(":id", category.id+'/'+tempUrl));
    setIsVisible(false);
  };

  const onAddCategory = () => {
    setDialogAddCategory(true);
  };

  const onCategoryAdded = (data?: any) => {
    setDialogSuccess(true);
    categories.push(data);
    setCategories(categories);
  };

  return (
    <Modal
      className="category-select-modal"
      visible={isVisible}
      centered
      closable={false}
      footer={null}
      afterClose={onClose}
      onCancel={handleCancel}
    >
      <AppNavBar hasBack handleBack={onBack} />
      <Container style={isMobile ? { padding: 0 } : {}}>
        <Stack direction="horizontal" gap={2} className="box-selected">
          {selectedCategories.map((item: Category) => (
            <button
              key={item.id}
              className="btn"
              style={{ backgroundColor: "#222222" }}
              onClick={onViewCategory.bind(null, item || "")}
            >
              <div style={{ color: "#fff" }}>{item.title}</div>
            </button>
          ))}
        </Stack>
        <Stack
          direction="horizontal"
          className="align-items-center box-option mb-2"
        >
          <h4 className="text-option">Customise Topics</h4>
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
          {selectedFlag && categories.map((item) => (
            <Stack
              key={`category-${item.id}`}
              direction="horizontal"
              className={`category-item ${item.selected && "selected"}`}
              onClick={onSelectCategory.bind(null, item)}
            >
              {item.title}
            </Stack>
          ))}
        </Stack>
      </Container>

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
      <ModalConfirm
        visible={dialogSuccess}
        message="Category added! Users can now post under this category."
        cancelText={null}
        onOk={() => {
          setDialogSuccess(false);
        }}
      />
    </Modal>
  );
}

export default CategorySelectModal;
