import React, { useEffect, useState } from "react";
import {
  ButtonGroup,
  Container,
  Form,
  ToggleButton,
  Row,
  Col,
} from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import ButtonGradient from "../../components/button/ButtonGradient";
import InputStacked from "../../components/input/InputStacked";
import CompanyGuideModal from "../../components/modal/CompanyGuideModal";
import { SignInQuery } from "../../models/signIn.model";
import { UserRole } from "../../models/user.model";
import authAction from "../../redux/actions/auth.action";
import loadingAction from "../../redux/actions/loading.action";
import signUpAction from "../../redux/actions/signUp.action";
import userService from "../../services/user.service";
import utils from "../../utils";
import { useQuery } from "../../hooks/useLink";

import "./styles.scss";
import signUpService from "../../services/signUp.service";
import { karmaPoints, tenantNameState } from "../../atoms/globalStates";
import { useRecoilState } from "recoil";




const options = ["Airbus", "Polygon", "Shopee"];

const tabs = [
  { name: "SIGN IN", value: 0 },
  { name: "SIGN UP", value: 1 },
];

/**
 * Sign In Page
 */
function SignInPage() {
 
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggling = () => setIsOpen(!isOpen);

  var onOptionClicked=(value: any)=>{
    setSelectedOption(value);
    setIsOpen(false);

    console.log("sel",value);
  }


  const history = useHistory();
  const dispatch = useDispatch();
  const isSigningIn = useQuery().get("isSigningIn");
  const search: any = useLocation().search;
  const referralCode: string =
    new URLSearchParams(search).get("referral") || "";
  const {
    isAuthenticationBeingChecked,
    requesting,
    isAuthenticated,
    user,
    authError,
  } = useSelector((state: any) => state.auth);
  const { email } = useSelector((state: any) => state.signUp);
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  // const [tabSelect, setTabSelect] = useState(isSigningIn ? 0 : 1);
  // const user: User = useSelector((state: any) => state.auth.user);

  const [tabSelect, setTabSelect] = useState(0);
  const [error, setError] = useState("");
  const [tenantName, setTenantName] = useRecoilState(tenantNameState);
  const [loading, setLoading] = useState(false);
  const [__tenant, setTEST] = useState("false");
  const [karmaPointsState, setkarmaPointsState] = useState(karmaPoints)
  const [dataRequest, setDataRequest] = useState<SignInQuery>({
    username: "",
    password: "",
  });
  const [visibleTerm, setVisibleTerm] = useState(false);
  const [dialogGuide, setDialogGuide] = useState(false);

  // useEffect(() => {
  //   if (!isAuthenticationBeingChecked && !isAuthenticated) {
  //     dispatch(authAction.logout());
  //   }
  // }, [isAuthenticationBeingChecked]);

  useEffect(() => {
    // let _tenantName = window.location.pathname.substring(8);
    // setTenantName(_tenantName);
    if (authError) {
      setError('Incorrect username or password');
      setValue("password", "");
      setDataRequest({
        ...dataRequest,
        password: "",
      });
    }
    if (isAuthenticated) {
      if (user?.role === UserRole.ADMIN) {
        dispatch(
          loadingAction.visible(
            user.username,
            "We’re redirecting you to the administrator feed.",
            3000
          )
        );
      } else {
        dispatch(
          loadingAction.visible(
            user.username,
            "Welcome back to your community!",
            3000
          )
        );
      }
      if (user?.role !== UserRole.ADMIN) {
        history.replace(routes.HomePage);
      } else {
        history.replace(routes.DashboardPage);
      }
    }
  }, [isAuthenticated, authError]);

  useEffect(() => {
    setError("");
  }, [tabSelect]);

  useEffect(() => {
    register("email", {
      required: {
        value: tabSelect === 1,
        message: "Email is required.",
      },
      pattern: {
        value: utils.regexEmail(),
        message: "Email is not valid.",
      },
    });
    register("username", {
      required: {
        value: tabSelect == 0,
        message: "Username is required.",
      },
    });
    register("password", {
      required: {
        value: tabSelect == 0,
        message: "Password is required.",
      },
    });
  }, [register, tabSelect]);

  /**
   * Handle check email before sign up
   * @param {any} e
   */
  const goSignUp = async (e: any) => {
    setLoading(true);
    console.log("tenant name", tenantName);

    try {
      // await userService.checkEmail(email);
      dispatch(signUpAction.addEmail(e.email));
      if (referralCode) {
        history.push(`${routes.SignUpPage}?referral=${referralCode}`);
      } else {
        // const emailObject: any = {
        //   email: email,
        // };
        // const rs = await signUpService.verify(emailObject);
        history.push(routes.SignUpPage);
      }
    } catch (error: any) {
      console.log(error);
      setError(error);
    }
    setLoading(false);
  };

  /**
   * Handle input changed
   * @param {React.ChangeEventHandler} e
   */
  const handleTextChange = (e: any) => {
    let value: string = e.target.value;
    switch (e.target.name) {
      case "email": {
        value = value?.toLowerCase();
        var domain = value.substring(value.lastIndexOf("@") + 1);
        var poolname = domain.substring(0, domain.lastIndexOf("."));
        setTenantName(poolname);
        localStorage.setItem("tenantName", poolname);
        break;
      }
      default:
        break;
    }
    setValue(e.target.name, value, { shouldValidate: true });
    setDataRequest({
      ...dataRequest,
      [e.target.name]: value,
    });
  };

  /**
   * Handle sign in
   * @param {username, password}
   */
  const onSignIn = async (e: any) => {
    setLoading(true)
    setError("");
    const data: SignInQuery = { ...e };
    try {
      // let _tenantName = window.location.pathname.substring(8);

      const _tenantName = window.location.host.split('.')[0]

    // setTenantName(_tenantName);

    setTenantName(_tenantName);

    localStorage.setItem('tenantName', _tenantName)

      dispatch(authAction.signIn(data.username, data.password, _tenantName));

    console.log('tenantname from url domain', _tenantName)

      dispatch(authAction.signIn(data.username, data.password, _tenantName));
    setLoading(false)
    // console.log('userCheckinSignin', 
    // setkarmaPointsState(user.karmaPoints);
    } catch (error: any) {}
  };

  const onOpenGuide = () => {
    setDialogGuide(true);
  };
  const onCloseGuide = () => {
    setDialogGuide(false);
  };

  return (
    <div className="m-screen dark-bg-dsktp">
      <Container fluid className="sign-in bg-gradient-app">
        <Row>
          <Col className="login-left" xl={6}>
            <img src={images.SpaceBg} className="space-bg" alt="Loominate" />
            <Stack className="v-head align-items-center login-content justify-content-center">
              <img src={images.logo} className="logo" alt="Loominate" />
              <p className="header">Your Workplace Community!</p>
              <div className="text-center">
                <img
                  src={images.threeMonsters}
                  className="threeMonsters my-5"
                  alt="Three Monsters"
                />
                {/* <h4 className="text-white my-3">Download the app for more exclusive content</h4>
        <div className="button-group">
        <Link to="/" className=""><img src={images.appStore} className="appStore" alt="App Store" /></Link>
        <Link to="/" className=""><img src={images.playStore} className="playStore" alt="Play Store" /></Link>
        </div> */}
              </div>
            </Stack>
          </Col>
          <Col xl={6}>
            <div className="card">
              <ButtonGroup className="v-tab">
                {tabs.map((tab, idx) => (
                  <ToggleButton
                    className={`${tabSelect === tab.value && "active"}`}
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant=""
                    name="radio"
                    value={tab.value}
                    checked={tabSelect === tab.value}
                    onChange={(e) => setTabSelect(idx)}
                  >
                    {tab.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
              {tabSelect === 0 && (
                <Form className="v-content d-flex flex-column flex-fill">
                  <div className="v-control">
                    <h3 className="text-center">Sign in to your space</h3>
                    <div className="select-space">
                    <div className="dropDownContainer">
        <div className="DropDownHeader" onClick={toggling}>
        <span><img width="36" src={images.avatarCompany} alt="" /> {selectedOption || "AirBus"}</span> <img width="12" src={images.ArrowDown} alt="" />
        </div>
        {isOpen && (
          <div className="DropDownListContainer">
            <ul className="DropDownList">
              {options.map(option => (
                <li className="ListItem" onClick={()=>onOptionClicked(option)} key={Math.random()}>
               <img width="36" src={images.avatarCompany} alt="" />   {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p>Can’t find your organisation? Sign up <a href="#">here</a>.</p>
    </div>
                    {!!error && <p className="text-error">{error}</p>}
                    <InputStacked
                      name="username"
                      label="Username"
                      placeholder="Your pseudonym"
                      onChange={handleTextChange}
                      error={errors.username}
                    />
                    <InputStacked
                      name="password"
                      label="Password"
                      placeholder="****"
                      type="password"
                      value={dataRequest.password}
                      onChange={handleTextChange}
                      error={errors.password}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSubmit(onSignIn)();
                        }
                      }}
                    />
                    <Link to="/reset-password" className="btn-forgot">
                      Forgot password?
                    </Link>
                  </div>

                  <div className="v-btn d-grid ">
                    <ButtonGradient
                      onClick={handleSubmit(onSignIn)}
                      loading={requesting}
                    >
                      NEXT
                    </ButtonGradient>
                  </div>
                </Form>
              )}
              {tabSelect === 1 && (
                <div className="v-content d-flex flex-column flex-fill">
                  <div className="v-control">
                    <h3 className="text-center">Join the community</h3>
                    <InputStacked
                      name="email"
                      label="Work email"
                      placeholder="example: john@theragency.com"
                      onChange={handleTextChange}
                      error={errors.email}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSubmit(goSignUp)();
                        }
                      }}
                    />
                    {!!error && <p className="text-error">{error}</p>}
                    <p className="text">
                      Your email is only used to verify that you belong to the
                      Organisation. It will not be connected to your username to
                      ensure your identity is kept safe.{" "}
                      <span className="highlight" onClick={onOpenGuide}>
                        Read more on our site.
                      </span>
                    </p>
                    <h3 className="text-center">Why join Loominate?</h3>
                    <p className="text">
                      Join Loominate to trade battle stories, share passions,
                      launch initiatives and be a part of the mission to drive
                      positive culture and change in your organisation!
                    </p>
                  </div>

                  <div className="v-btn mt-auto d-grid">
                    <ButtonGradient
                      onClick={handleSubmit(goSignUp)}
                      loading={loading}
                    >
                      VERIFY WORK EMAIL
                    </ButtonGradient>
                    {/* </Link> */}
                  </div>
                </div>
              )}
            </div>
            <CompanyGuideModal visible={dialogGuide} onClose={onCloseGuide} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignInPage;
