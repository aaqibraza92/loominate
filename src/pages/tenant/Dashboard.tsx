import { Avatar, Upload } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Container,
  Dropdown,
  Row,
  Stack,
  Col,
  Button,
  Pagination,
  Form,
  Modal,
  DropdownButton,
} from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import IconChat from "../../assets/images/IconChat";
import IconClose from "../../assets/images/IconClose";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import colors from "../../commons/styles/colors";
import CompanySheet from "../../components/admin/CompanySheet";
import ButtonGradient from "../../components/button/ButtonGradient";
import DateRangePicker from "../../components/datetime/DateRangePicker";
import DesktopMenu from "../../components/desktopmenu/DesktopMenu";
import DesktopMyCommunity from "../../components/desktopmycommunity/DesktopMyCommunity";
import DesktopMyProfile from "../../components/desktopmyprofile/DesktopMyProfile";
import HeaderDesktop from "../../components/header/HeaderDesktop";
import IcoMoon from "../../components/icon/IcoMoon";
import InputStacked from "../../components/input/InputStacked";
import BottomNavBar from "../../components/navbar/BottomNavBar";
import NavBarAdmin from "../../components/navbar/NavBarAdmin";
import Company from "../../models/company.model";
import { PostView } from "../../models/post.model";
import User, { UserRole, UserView } from "../../models/user.model";
import companyService from "../../services/company.service";
import reportService from "../../services/report.service";
import InviteAdmin from "../admin/InviteAdmin";
import InviteAdminMod from "../admin/InviteAdminMod";
import { AdminsPending, Moderators, SpaceLists } from "../admin/temp";
import "./styles.scss";

const FILTERS = ["All time", "This week", "This month", "Select date"];

const options = ["sleepykitten2", "Laborden", "OfficeDesignnoob"];

const tabs = [
  { name: "SIGN IN", value: 0 },
  { name: "SIGN UP", value: 1 },
];

/**
 * Post Detail Page
 * @param props
 * @returns JSX.Element
 */
function DashboardTenant(props: any) {
  const [screenWidth, setScreenWidth] = useState(window.screen.width);
  const resizeScreen = () => {
    setScreenWidth(window.innerWidth);
  };
  useEffect(() => {
    resizeScreen();
    window.addEventListener("resize", resizeScreen);
    return () => {
      window.removeEventListener("resize", resizeScreen);
    };
  });

  const params: any = useParams();
  const { id = null } = params;
  const history = useHistory();
  const dispatch = useDispatch();
  const user: User = useSelector((state: any) => state.auth.user);
  const [filterSelected, setFilterSelected] = useState(FILTERS[0]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSpaces, setActiveSpaces] = useState<Company[]>([]);
  const [unactiveSpaces, setUnactiveSpaces] = useState<Company[]>([]);
  const [tabSpaceSelected, setTabSpaceSelected] = useState(0);
  const [dialogDateRange, setDialogDateRange] = useState(false);
  const [dataFilter, setDataFilter] = useState<any>({
    from_date: null,
    to_date: null,
  });
  const [dataAnalytics, setDataAnalytics] = useState({
    reported_posts: 0,
    reported_users: 0,
    hidden_posts: 0,
    hidden_users: 0,
    muted_users: 0,
    active_users: 0,
  });
  const [dialogCompany, setDialogCompany] = useState(false);
  const [companySelected, setCompanySelected] = useState<Company | undefined>(
    undefined
  );
  const [spaceList, setSpaceList] = useState(SpaceLists);
  const [moderators, setModerators] = useState(Moderators);
  const [adminsPending, setAdminsPending] = useState(AdminsPending);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [success,setSuccess]=useState(false);
  const [newInvite, setNewInvite] = useState(false);
  const [show1, setShow1] = useState(false);

  const removeAdminPending = (id: any) => {
    setAdminsPending(adminsPending.filter((item) => item.id !== id));
  };

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);
  useEffect(() => {
    if (user) {
      setIsAdmin(user?.role === UserRole.ADMIN);
      if (user.role !== UserRole.ADMIN) {
        history.replace(routes.HomePage);
      }
    }
  }, [user]);

  useEffect(() => {
    if (companySelected) {
      setDialogCompany(true);
    }
  }, [companySelected]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggling = () => setIsOpen(!isOpen);

  var onOptionClicked = (value: any) => {
    setSelectedOption(value);
    setIsOpen(false);

    console.log("sel", value);
  };

  const removeAdmin = (id: any) => {
    setModerators(moderators.filter((item) => item.id !== id));
  };

  useEffect(() => {
    // const getAnalytics = async () => {
    //   try {
    //     const rs = await reportService.getAnalytics(dataFilter);
    //     setDataAnalytics({ ...rs });
    //   } catch (error) {}
    // };
    // const getActiveSpaces = async () => {
    //   try {
    //     const rs = await companyService.getAll({
    //       ...dataFilter,
    //       unactive: false,
    //     });
    //     setActiveSpaces(rs.companies);
    //   } catch (error) {}
    // };
    // const getUnactiveSpaces = async () => {
    //   try {
    //     const rs = await companyService.getAll({
    //       ...dataFilter,
    //       unactive: true,
    //     });
    //     setUnactiveSpaces(rs.companies);
    //   } catch (error) {}
    // };
    // getActiveSpaces();
    // getUnactiveSpaces();
    // getAnalytics();
  }, [dataFilter]);

  /**
   * Handle filter
   * @param {string} value
   */
  const onFilterChange = (value: string) => {
    setFilterSelected(value);
    switch (value) {
      case "Select date":
        setDialogDateRange(true);
        break;
      case "This week":
        setDataFilter({
          from_date: moment().startOf("week").toDate(),
          to_date: moment().endOf("week").toDate(),
        });
        break;
      case "This month":
        setDataFilter({
          from_date: moment().startOf("month").toDate(),
          to_date: moment().endOf("month").toDate(),
        });
        break;
      case "All time":
        setDataFilter({
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
    setDataFilter({
      from_date: moment(data.startDate).startOf("day").format(),
      to_date: moment(data.endDate).endOf("day").format(),
    });
  };

  const goToPostManagement = (view?: any) => {
    try {
      history.push({
        pathname: routes.PostManagementPage,
        search: `?view=${view}`,
      });
    } catch (error) {}
  };

  const goToUserManagement = (view?: any) => {
    try {
      history.push({
        pathname: routes.UserManagementPage,
        search: `?view=${view}`,
      });
    } catch (error) {}
  };

  const displayFilter = () => {
    if (filterSelected === "Select date") {
      if (!dataFilter.from_date) return "Select date";
      const isADay =
        moment(dataFilter.to_date).format("YYYY-MM-DD") ===
        moment(dataFilter.from_date).format("YYYY-MM-DD");
      if (isADay) {
        return moment(dataFilter.from_date).format("LL");
      } else {
        return `${moment(dataFilter.from_date).format("LL")} - ${moment(
          dataFilter.to_date
        ).format("LL")}`;
      }
    }
    return filterSelected;
  };

  const addCompany = () => {
    setCompanySelected(undefined);
    setDialogCompany(true);
  };

  const onCompanySelected = (item: any) => {
    setCompanySelected(item);
  };

  const onCompanyUpdated = (data: any) => {
    const i = activeSpaces.findIndex((x) => x.id === data.id);
    if (i > -1) {
      activeSpaces[i] = { ...data };
      setActiveSpaces(activeSpaces);
    }
  };
  const [dialogEditProfile, setDialogEditProfile] = useState(false);
  const openEditProfile = async (info: any) => {
    setDialogEditProfile(true);
  };
  const closeEditProfile = async (info: any) => {
    setDialogEditProfile(false);
  };
  const onCompanyCreated = (data: any) => {
    activeSpaces.push({ ...data });
    setActiveSpaces(activeSpaces);
  };

  const onFeedSpace = (space: any) => {
    history.push(routes.FeedSpacePage.replace(":id", space.id));
  };
  const onProfileView = () => {
    // console.log('insideOnProfileViewPage', post.user?.userName!)
    // if (!!post?.user?.id && !post.isAnonymous) {
    history.push(
      routes.ViewProfilePage.replace(":id", user?.id + "/" + user.userName!)
    );
    // }
  };
  if (!isAdmin) return <div></div>;


  const addModerator=()=>{
    setNewInvite(false);
    
  }

  return (
    <div className="m-screen dashboard-page ">
      <div className="position-relative">
        <HeaderDesktop />
        <NavBarAdmin />
        <Container>
          <Row>
            <Col lg={3}></Col>
            <Col lg={6}>
              <div className="tenant-profile">
                <DesktopMyCommunity />
              </div>
              <Stack className="xbox-content">
                <Stack direction="horizontal">
                  <h6 className="title">The R Agency Dashboard</h6>
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
                <Stack gap={3} className="mt-2">
                  <Stack
                    direction="horizontal"
                    className="box-summary box-item mt-3 ps-3"
                    gap={3}
                  >
                    <p className="text-number">{dataAnalytics.active_users}</p>
                    <p className="text-title">Active Users</p>
                  </Stack>
                </Stack>
                <Row className="box-summary box-report mt-2">
                  <Stack
                    className="col-md-4 align-items-center box-item"
                    onClick={goToUserManagement.bind(null, UserView.report)}
                  >
                    <div className="report-item align-items-center">
                      <p className="text-number">
                        {dataAnalytics.reported_users}
                      </p>
                      <p className="text-title">Reported Users</p>
                    </div>
                  </Stack>
                  <Stack
                    className="col-md-4 align-items-center box-item item-danger"
                    onClick={goToPostManagement.bind(null, PostView.hidden)}
                  >
                    <div className="report-item align-items-center">
                      <p className="text-number">
                        {dataAnalytics.hidden_posts}
                      </p>
                      <p className="text-title-sm">Removed Users</p>
                    </div>
                  </Stack>
                  <Stack
                    className="col-md-4 align-items-center box-item item-danger"
                    onClick={goToUserManagement.bind(null, UserView.mute)}
                  >
                    <div className="report-item align-items-center flex-fill">
                      <p className="text-number">{dataAnalytics.muted_users}</p>
                      <p className="text-title-sm">Muted Users</p>
                    </div>
                  </Stack>
                </Row>

                <Stack gap={3} className="mt-2">
                  <Stack
                    direction="horizontal"
                    className="box-summary box-item ps-3"
                    gap={3}
                  >
                    <p className="text-number">{activeSpaces.length}</p>
                    <p className="text-title">Categories</p>
                  </Stack>
                </Stack>

                <Stack gap={3} className="mt-3">
                  <Stack
                    direction="horizontal"
                    className="box-summary box-item ps-3"
                    gap={3}
                  >
                    <p className="text-number">{activeSpaces.length}</p>
                    <p className="text-title">Published Content</p>
                  </Stack>
                </Stack>

                <Row className="box-summary box-report mt-2">
                  <Stack
                    className="col-md-4 align-items-center box-item"
                    onClick={goToPostManagement.bind(null, PostView.report)}
                  >
                    <div className="report-item align-items-center">
                      <p className="text-number">
                        {dataAnalytics.reported_posts}
                      </p>
                      <p className="text-title">Reported Content</p>
                    </div>
                  </Stack>
                  <Stack
                    className="col-md-4 align-items-center box-item"
                    onClick={goToUserManagement.bind(null, UserView.report)}
                  >
                    <div className="report-item align-items-center">
                      <p className="text-number">
                        {dataAnalytics.reported_users}
                      </p>
                      <p className="text-title">Content in Review</p>
                    </div>
                  </Stack>
                  <Stack
                    className="col-md-4 align-items-center box-item item-danger"
                    onClick={goToUserManagement.bind(null, UserView.mute)}
                  >
                    <div className="report-item align-items-center flex-fill">
                      <p className="text-number">{dataAnalytics.muted_users}</p>
                      <p className="text-title-sm">Removed Content</p>
                    </div>
                  </Stack>
                </Row>
              </Stack>
              
              <Stack direction="horizontal" className="mt-5 invite-dd">
                <h6 className="title">Moderators ({moderators.length})</h6>
                {screenWidth > 767 ? (
                  <Dropdown className="ms-auto" autoClose="inside">
                    <Dropdown.Toggle variant="light" className="ms-auto btn">
                      <span onClick={(e) => addModerator()}>
                       Invite New +
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                      <InviteAdmin initialState={newInvite}  isModerate={true}/>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <>
                    <button
                      className="btn ms-auto btn btn-light"
                      onClick={(e) => setNewInvite(!newInvite)}
                    >
                     Invite New +
                    </button>

                    <InviteAdminMod
                      isModerate={true}
                      open={newInvite}
                      data={companySelected}
                      onClose={() => {
                        setNewInvite(false);
                      }}
                    />
                  </>
                )}

               
              </Stack>
              <Stack className="pb-2 pt-2 mt-3" gap={3}>
                <Stack
                  direction="horizontal"
                  className="align-items-center box-summary box-user pb-2 pt-2"
                  gap={2}
                >
                  <div>
                    <Avatar src={images.avatar1} size={44} />
                  </div>
                  <div className="middle-text">
                    <strong className="text-username">Mookingbird</strong>
                    <span className="you-box">You</span>
                    <span className="mod-box">Mod</span>
                    <br />
                    <span className="join">
                      Joined as admin on September 2021
                    </span>
                  </div>
                  <span className="ms-auto btn"></span>
                </Stack>

                <Stack
                  direction="horizontal"
                  className="align-items-center box-summary box-user pb-2 pt-2"
                  gap={2}
                >
                  <div>
                    <Avatar src={images.avatar2} size={44} />
                  </div>
                  <div className="middle-text">
                    <strong className="text-username">Sleepykitten22</strong>
                    <span className="admin-box">Admin</span>
                    <br />
                    <span className="join">
                      Joined as admin on September 2021
                    </span>
                  </div>

                  <button className="ms-auto p-0 btn">
                    <IconChat />
                  </button>
                </Stack>

                {moderators &&
                  moderators.map((elem, ind) => {
                    return (
                      <Stack
                        key={ind}
                        direction="horizontal"
                        className="align-items-center box-summary box-user pb-2 pt-2"
                        gap={2}
                      >
                        <div>
                          <Avatar src={elem?.img} size={44} />
                        </div>
                        <div className="middle-text">
                          <strong className="text-username">
                            {elem?.title}
                          </strong>
                          <span
                            className={`${
                              elem?.type === "Mod" ? "mod-box" : "admin-box"
                            }`}
                          >
                            {elem?.type}
                          </span>
                          <br />
                          <span className="join">
                            Joined as admin on {elem?.date}
                          </span>
                        </div>

                        <button className="ms-auto p-0 btn">
                          <IconChat />
                        </button>
                        <Dropdown align="end"
                          className="delete-dialog">
                          <Dropdown.Toggle   variant="success"
                            id="dropdown-basic">
                          <IconClose />
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="text-center ">
                            <p>
                              <img src={images.Error} alt="" />
                            </p>
                            <p className="small">
                              Are you sure you want to delete SleepyKitten22 as
                              Admin?{" "}
                            </p>
                            <div>
                              
                              <Stack direction="horizontal" gap={3}>
                                <Dropdown.Item href="#" className="btn btn-outline-secondary">
                                    Cancel
                                </Dropdown.Item>

                                <Dropdown.Item href="#" className="btn btn-outline-info" onClick={(e) => removeAdmin(elem.id)}>
                                    Delete as Modurator
                                </Dropdown.Item>
                              </Stack>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>

                   
                      </Stack>
                    );
                  })}
              </Stack>

              <Stack direction="horizontal" className="mt-5">
                <h6 className="title">Moderators - Pending acceptance (2)</h6>
              </Stack>
              <Stack className="pb-2 pt-2 mt-3" gap={3}>
                {adminsPending &&
                  adminsPending.map((elem, ind) => {
                    return (
                      <Stack
                        key={ind}
                        direction="horizontal"
                        className="align-items-center box-summary box-user pb-2 pt-2"
                        gap={2}
                      >
                        <div>
                          <Avatar src={images.avatar2} size={44} />
                        </div>
                        <div className="middle-text">
                          <strong className="text-username">
                            {" "}
                            {elem?.title}
                          </strong>
                          <span className="pending-box">{elem?.type}</span>
                          <br />
                          <span className="join">
                            Joined as admin on {elem?.date}
                          </span>
                        </div>

                        <button className="ms-auto p-0 btn">
                          <IconChat />
                        </button>
                        <Dropdown align="end"
                          className="delete-dialog">
                          <Dropdown.Toggle   variant="success"
                            id="dropdown-basic">
                          <IconClose />
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="text-center ">
                            <p>
                              <img src={images.Error} alt="" />
                            </p>
                            <p className="small">
                              Are you sure you want to delete SleepyKitten22 as
                              Admin?{" "}
                            </p>
                            <div>
                              <Stack direction="horizontal" gap={3}>
                                <Dropdown.Item href="#" className="btn btn-outline-secondary">
                                    Cancel
                                </Dropdown.Item>

                                <Dropdown.Item href="#" className="btn btn-outline-info" onClick={(e) => removeAdminPending(elem.id)}>
                                    Delete as Modurator
                                </Dropdown.Item>
                              </Stack>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>


                      </Stack>
                    );
                  })}
              </Stack>
            </Col>
            <Col lg={3}></Col>
          </Row>
        </Container>
        <DateRangePicker
          visible={dialogDateRange}
          onCancel={() => setDialogDateRange(false)}
          onSelected={onDateRangeChange}
        />
        {dialogCompany && (
          <CompanySheet
            open={dialogCompany}
            data={companySelected}
            onClose={() => {
              setDialogCompany(false);
              setCompanySelected(undefined);
            }}
            onUpdated={onCompanyUpdated}
            onCreated={onCompanyCreated}
          />
        )}
        <BottomNavBar active={"dashboard"} />
      </div>
    </div>
  );
}

export default DashboardTenant;
