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
import { Admins, AdminsPending, SpaceLists } from "./temp";
import "./styles.scss";
import { log } from "console";
import InviteAdmin from "./InviteAdmin";
import InviteAdminMod from "./InviteAdminMod";
import { Link } from "react-router-dom";

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
function DashboardPage(props: any) {
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
  const [success, setSuccess] = useState(false);
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
  const [newInvite, setNewInvite] = useState(false);

  const [spaceList, setSpaceList] = useState(SpaceLists);
  const [adminsLists, setAdminsLists] = useState(Admins);
  const [adminsPending, setAdminsPending] = useState(AdminsPending);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => {
    setShow1(true);
    setShow(false);
  };

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
  const onSuccess = () => {
    setSuccess(true);
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

  const removeAdmin = (id: any) => {
    setAdminsLists(adminsLists.filter((item) => item.id !== id));
  };

  const removeAdminPending = (id: any) => {
    setAdminsPending(adminsPending.filter((item) => item.id !== id));
  };

  if (!isAdmin) return <div></div>;

  return (
    <div className="m-screen dashboard-page dark-bg">
      <img src={images.DashboardBg} className="dashboard-bg" alt="Loominate" />
      <div className="position-relative">
        <HeaderDesktop />
        <NavBarAdmin />
        <Container>
          <Stack className="my-3" direction="horizontal" gap={3}>
            <div className="profile-persona" onClick={openEditProfile}>
              <img
                src={
                  user.avatarLink ||
                  images.AVATAR_KEYS[user?.avatar || "avatar1"]
                }
                alt="Avatar"
                className="profile-img"
              />
              <button className="btn btn-edit">
                <IcoMoon icon="edit" color={colors.primary} />
              </button>
            </div>
            <div>
              <h4 className="m-0" onClick={onProfileView}>
                {user.userName}
              </h4>
              <span className="small yellow-text">
                Joined {moment(user.creationDate).format("MMMM YYYY")}
              </span>
            </div>
          </Stack>
          <h1 className="my-5">ADMIN MAIN DASHBOARD</h1>
          <Row>
            <Col lg={6}>
              <Stack className="xbox-content">
                <Stack direction="horizontal">
                  <h6 className="title">All Spaces Report</h6>
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
                <Stack gap={3} className="mt-2 ">
                  <Stack
                    direction="horizontal"
                    className="box-summary box-item mt-3 ps-3"
                    gap={3}
                  >
                    <p className="text-number">{dataAnalytics.active_users}</p>
                    <p className="text-title">Active Users</p>
                  </Stack>
                  <Stack
                    direction="horizontal"
                    className="box-summary box-item ps-3"
                    gap={3}
                  >
                    <p className="text-number">{activeSpaces.length}</p>
                    <p className="text-title">Active Spaces</p>
                  </Stack>
                </Stack>
                <Row className="box-summary box-report mt-2">
                  <Stack
                    className="col-md-6 align-items-center box-item"
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
                    className="col-md-6 align-items-center box-item"
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
                    className="col-4 align-items-center box-item item-danger"
                    onClick={goToPostManagement.bind(null, PostView.hidden)}
                  >
                    <div className="report-item align-items-center">
                      <p className="text-number">
                        {dataAnalytics.hidden_posts}
                      </p>
                      <p className="text-title-sm">Hidden Content</p>
                    </div>
                  </Stack>
                  <Stack
                    className="col-md-4 align-items-center box-item item-danger"
                    onClick={goToUserManagement.bind(null, UserView.hidden)}
                  >
                    <div className="report-item align-items-center">
                      <p className="text-number">
                        {dataAnalytics.hidden_users}
                      </p>
                      <p className="text-title-sm">Hidden Users</p>
                    </div>
                  </Stack>
                  <Stack
                    className="col-4 align-items-center box-item item-danger"
                    onClick={goToUserManagement.bind(null, UserView.mute)}
                  >
                    <div className="report-item align-items-center flex-fill">
                      <p className="text-number">{dataAnalytics.muted_users}</p>
                      <p className="text-title-sm">Muted Users</p>
                    </div>
                  </Stack>
                </Row>
              </Stack>
              <Stack direction="horizontal" className="mt-5 invite-dd">
                <h6 className="title">All Admin ({adminsLists.length})</h6>

                {screenWidth > 767 ? (
                  <Dropdown className="ms-auto" autoClose="inside">
                    <Dropdown.Toggle variant="light" className="ms-auto btn">
                      <span onClick={(e) => setSuccess(false)}>
                        Invite New +
                      </span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                      <InviteAdmin/>
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
                    <span className="supadmin-box">Super Admin</span>
                    <br />
                    <span className="join">
                      Joined as admin on September 2021
                    </span>
                  </div>
                  <span className="ms-auto btn"></span>
                </Stack>

                {adminsLists &&
                  adminsLists.map((elem, ind) => {
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
                          <span className="admin-box">{elem?.type}</span>
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

                          <Dropdown.Menu>
                              <p>
                                <img src={images.Error} alt="" />
                              </p>
                              <p className="small">
                                Are you sure you want to delete SleepyKitten22
                                as Admin?{" "}
                              </p>
                              <div>
                                <Stack direction="horizontal" gap={3}>
                               
                                  <Dropdown.Item href="#"  className="btn btn-outline-secondary">
                                      Cancel
                                  </Dropdown.Item>

                                  <Dropdown.Item href="#" className="btn btn-outline-info" onClick={(e) => removeAdmin(elem.id)}>
                                      Delete as Admin
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
                <h6 className="title">
                  Invited Admins Pending Acceptance (
                  {adminsPending.length})
                </h6>
              </Stack>
              <Stack className="pb-2 pt-2 mb-4 mt-3" gap={3}>
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
                                    Delete as Admin
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
            <Col lg={1}></Col>
            <Col lg={5}>
              <Stack
                direction="horizontal"
                className="align-items-center invite-modal"
              >
                <h6 className="title">My Spaces ({activeSpaces.length})</h6>
                <Button
                  variant="light"
                  size="sm"
                  onClick={addCompany}
                  className="ms-auto mobile-only"
                >
                  + CREATE NEW SPACES
                </Button>

                <Button
                  variant="light"
                  size="sm"
                  className="ms-auto desktop-only"
                  onClick={handleShow}
                >
                  + CREATE NEW SPACES
                </Button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton></Modal.Header>
                  <Modal.Body>
                    <div className="text-center">
                      <img src={images.MonsterCompany} width="215" />
                    </div>
                    <div className="card mt-3">
                      <h3>Set up your company space</h3>
                      <InputStacked
                        name="name"
                        label="Company Name"
                        placeholder=""
                      />
                      <InputStacked
                        name="domain"
                        label="Email Domain (for e.g  google.com)"
                        placeholder=""
                      />
                      <div className="select-group">
                        <label htmlFor="industry">Industry</label>
                        <Form.Select
                          className=""
                          id="industry"
                          name="industry"
                          aria-label="Default select example"
                        >
                          <option>Select an industry</option>
                          <option value="1">
                            BANKING & FINANCIAL SERVICES
                          </option>
                          <option value="2">BARS & RESTAURANTS</option>
                          <option value="3">BEER, WINE & LIQUOR</option>
                        </Form.Select>
                      </div>
                      <br />
                      <p>Upload Company Logo</p>
                      <Upload
                        accept="image/png,image/jpeg"
                        maxCount={1}
                        fileList={[]}
                      >
                        <Button className="upload-icon">
                          <IcoMoon icon="upload" size={20} />
                        </Button>
                      </Upload>
                      <div className="v-btn d-grid mt-3">
                        <ButtonGradient
                          onClick={handleShow1}
                          text="CONFIRM"
                          style={{ marginBottom: 16 }}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>

                <Modal
                  show={show1}
                  onHide={handleClose1}
                  className="success-modal"
                >
                  <Modal.Header closeButton></Modal.Header>
                  <Modal.Body>
                    <p>
                      <img src={images.Polygon} alt="" />
                    </p>
                    Success! <br />A new Loominate space has been created for
                    Polygon Technology.
                  </Modal.Body>
                </Modal>
              </Stack>
              <Stack className="pb-2 pt-2 mt-3" gap={3}>
                {spaceList &&
                  spaceList.map((elem, ind) => {
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
                        <div className="middle-text-space">
                          <strong className="text-username">
                            {elem?.title}
                          </strong>
                          <span className="d-inline-block mx-2">|</span>{" "}
                          <span> {elem?.appUrl}</span>
                          <br />
                          <span className="small">
                            Created on {elem?.date}, {elem?.time}by
                            {elem?.user}
                          </span>
                        </div>
                        <Link to="/dashboard-tenant" className="ms-auto btn">
                          <IcoMoon
                            className=""
                            icon="chevron_right"
                            color={colors.primary}
                            size={24}
                          />
                        </Link>
                      </Stack>
                    );
                  })}
              </Stack>
              <Pagination className="mt-3 mx-auto">
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Next />
              </Pagination>
            </Col>
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

export default DashboardPage;
