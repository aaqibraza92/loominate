import { Checkbox, message } from 'antd';
import React, { useEffect, useState, useCallback } from 'react';
import { Button, Carousel, Container, Row, Col } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import { useForm } from 'react-hook-form';
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import images from '../../assets/images/images';
import routes from '../../commons/constants/routes.constant';
import ButtonGradient from '../../components/button/ButtonGradient';
import IcoMoon from '../../components/icon/IcoMoon';
import InputStacked from '../../components/input/InputStacked';
import TermAndCondition from '../../components/view/TermAndCondition';
import Category from '../../models/category.model';
import {
  SignUpData,
  SignUpQuery,
  SignUpForm,
  GetSecurityCodeForm,
} from '../../models/signUp.model';
import loadingAction from '../../redux/actions/loading.action';
import categoryService from '../../services/category.service';
import userService from '../../services/user.service';
import utils from '../../utils';
import { WELCOME_MESSAGE } from '../../commons/constants/message.constant';
import { WELCOME_MESSAGE_DELAY } from '../../commons/constants/value.constant';
import signUpActions from '../../redux/actions/signUp.action';
import stringUtils from '../../utils/strings';

import './styles.scss';
import AlertModal from '../../components/AlertModal/AlertModal';
import authAction from '../../redux/actions/auth.action';
import localStorareUtils from '../../utils/localStorage';
import localStorageConstants from '../../commons/constants/storageKeys.constant';
import { IDPConfig } from '../../models/auth.model';
import { useRecoilState } from 'recoil';
import { tenantNameState } from '../../atoms/globalStates';

/**
 * Sign Up Page
 * @returns SignUpPage
 */

// const ForthStep = () => {
//   return (
//     <>
//       <button
//         onClick={() => {
//           AlertModal.hide();
//         }}
//       >
//         Cancel
//       </button>
//       <button onClick={() => {}}>Okay</button>
//     </>
//   );
// };
const ForthStep = (props: any) => {
  
  const handleStep = ()=>{
    props.step(4);
    AlertModal.hide();
  }
  return (
    <>
    <div className="confirm-popup text-center p-3">
    <h3 className="title mb-4">I have recorded my security code.</h3>
      <Button onClick={() => { AlertModal.hide() }} variant="secondary" size="lg">
        Cancel
      </Button> &nbsp; 
      <Button onClick={handleStep} variant="primary">
      Confirm
      </Button>
      </div>
    </>
  );
}
function SignUpStepPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const search: any = useLocation().search;
  const referralCode: string =
    new URLSearchParams(search).get('referral') || '';
  const {
    register,
    unregister,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { email, username, password } = useSelector(
    (state: any) => state.signUp
  );
  const { user, userManager } = useSelector((state: any) => state.auth);
  const { loading } = useSelector((state: any) => state.loading);
  const [step, setStep] = useState(0);
  const [ifNextStep, setifNextStep] = useState(false);
  const [categorySelected, setCategorySelected] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<any>('');
  const [avatarSelected, setAvatarSelected] = useState('avatar1');
  const [agreeTerm, setAgreeTerm] = useState(false);
  const [tenant, setTenantName] = useRecoilState(tenantNameState);

  // Email Verification Code
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [inputEmailVerificationCode, setInputEmailVerificationCode] =
    useState('');

  // Security Code
  const [securityCode, setSecurityCode] = useState('');
  const [isSecurityCodeVisible, setSecurityCodeVisibility] = useState(false);

  const getEmailVerificationCode = useCallback(async () => {
    try {
      const rs = await userService.verifyOTP(email);

      setEmailVerificationCode(rs.code);
    } catch (error) {
      console.error(error);
    }
  }, [email]);

  const handleSuggestedUsername = useCallback(() => {
    const suggestedUsername = stringUtils.makeFirstCharUppercase(
      email?.split('@')[0] || ''
    );

    dispatch(signUpActions.updateSignUpInfo('username', suggestedUsername));
  }, [dispatch, email]);

  const getSecurityCode = useCallback(async (_user:any, _tenant: string) => {
    try {
      console.log('user in getsecuritycode 1', _user, _tenant)
      const securityCodeForm: GetSecurityCodeForm = {
        email: _user?.email,
        id: _user?.id,
        name: _tenant,
      };
      console.log('user in securityCodeForm', securityCodeForm)

      const rs = await userService.getSecurityCode(securityCodeForm);

      setSecurityCode(rs.code);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  /**
   * Get Email Verification Code
   */
  useEffect(() => {
    // if (!email) {
    //   history.replace(routes.SignInPage);
    //   return;
    // }

    // const getCategories = async () => {
    //   try {
    //     const rs = await categoryService.getAll({ page: 1, per_page: 100 });
    //     setCategories(rs.categories);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    if (email) {
      getEmailVerificationCode();
      handleSuggestedUsername();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  /**
   * Register form rules
   */
  useEffect(() => {
    //console.log("ifNextStep", ifNextStep);

    setError("");
   
    switch (step) {
      case 0: // Verification Code
        register("code", {
          required: {
            value: true,
            message: "Code is required",
          },
        });
        break;
      case 1: // Profile persona
        unregister("code");
          register("username", {
            required: {
              value: ifNextStep && ifNextStep ? true : false,
              message: "Username is required",
            },
            minLength: {
              value: 6,
              message: "Username is too short (minimum is 6 characters)",
            },
          });
          register("password", {
            required: {
              value: ifNextStep && ifNextStep ? true : false,
              message: "Password is required",
            },
            pattern: {
              value: utils.regexPassword(),
              message:
                "Password Minimum six characters, at least a lowercase letter, a uppercase and a digit",
            },
          });
        break;
      default: // Step 2,3,4: no rules
        break;
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step,ifNextStep]);

  /**
   * Handle code change
   * @param {React.ChangeEventHandler} ChangeEventHandler
   */
  const onCodeChange = (otp: any) => {
    // setValue("code", e.target.value, { shouldValidate: true });
    // setCode(e.target.value);
    setValue('code', otp, { shouldValidate: true });
    setInputEmailVerificationCode(otp);
  };

  const onSignUpInfoChange = useCallback(
    (key: string, val: string) => {
      dispatch(signUpActions.updateSignUpInfo(key, val));
    },
    [dispatch]
  );

  // Update form state while changing inputs
  useEffect(() => {
    setValue('username', username, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  /**
   * Handle next step
   */
  const goToNextStep = useCallback(
    () => setStep((prevStep) => prevStep + 1),
    []
  );

  /**
   * Verify Code
   */
  const verifyEmailVericationCode = useCallback(
    (e: any) => {
      try {
        const code = e.code;
        goToNextStep();
        if (code !== emailVerificationCode) {
          message.error({
            content: (
              <label className="message">Email verification failed</label>
            ),
            icon: (
              <IcoMoon icon="dislike" className="icon" color="#fff" size={18} />
            ),
            duration: 3,
            className: 'top-message-error',
          });

          return;
        }

        // const rs = await userService.verifyOTP(email, { code, email });
        // setVerifyId(rs.verify_id);
        message.success({
          content: (
            <label className="message">Email verification successful</label>
          ),
          icon: <IcoMoon icon="like" className="icon" color="#fff" size={18} />,
          duration: 3,
          className: 'top-message',
        });

        // goToNextStep(); verification by-passed
      } catch (error) {
        console.error(error);

        return false;
      } finally {
        setValue('code', '');
        setInputEmailVerificationCode('');
      }
    },
    [emailVerificationCode, goToNextStep, setValue]
  );

  /**
   * Handle sign up
   */
  const handleSignUp = useCallback(async () => {
    const tenantName: any = localStorage.getItem('tenantName')
    try {
      dispatch(loadingAction.setLoading(true));

      const signUpForm: SignUpForm = {
        email,
        username,
        password,
        avatar: avatarSelected,
        categories: [],
      };
console.log('called signup api', signUpForm)
      const { user } = await userService.signUp(signUpForm);
      console.log('after calling signup form', user)

      // localStorareUtils.setValue(
      //   localStorageConstants.IDP_CONFIG,
      //   user.idpConfig
      // );

     // const parsedConfig = JSON.parse(user.idpConfig);
      // const idpConfigParams: IDPConfig = {
      //   authority: parsedConfig.authority,
      //   client_id: parsedConfig.poolId,
      //   redirect_uri: 'https://ha',
      //   response_type: parsedConfig.responseType,
      //   scope: parsedConfig.scope,
      // };
      console.log('user data before dispatch', user)
      dispatch(authAction.setUser(user));
      getSecurityCode(user,tenantName);
      goToNextStep();
  
      // // set OIDC's user manager instance
      // dispatch(authAction.setUserManager(idpConfigParams));
    } catch (error) {
      setError(error);
    }
  }, [avatarSelected, dispatch, email, password, username]);

  // Handle loading user after userManager instance is set up
  useEffect(() => {
    if (userManager) {
      dispatch(
        authAction.loadUser(
          userManager,
          () => goToNextStep(), // next step callback
          () =>
            // error callback
            message.error({
              content: (
                <label className="message">Error while signing up</label>
              ),
              icon: (
                <IcoMoon
                  icon="dislike"
                  className="icon"
                  color="#fff"
                  size={18}
                />
              ),
              duration: 3,
              className: 'top-message-error',
            })
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userManager]);

  const redirectToSignInPage = useCallback(() => {
    const tenantName: any = localStorage.getItem('tenantName')
    dispatch(
      loadingAction.visible(
        user?.username || '',
        WELCOME_MESSAGE,
        WELCOME_MESSAGE_DELAY
      )
    );

    history.replace(`${routes.redirectHomePage}/${tenantName}`);
  }, [dispatch, history, user]);

  /**
   * Handle next step for signing up process
   */
   const getCategories = async (tenant: any) => {
    try {
    const tenantName: any = localStorage.getItem('tenantName')
      const rs = await categoryService.getAll(tenant,{ take: 20, order:'ASC' });
      console.log('category result = ', rs.data)
      setCategories(rs.data);
    } catch (error) {
      console.log(error)
    }
  };
  const onNext = useCallback(() => {
    setifNextStep(true);
    const getStep =(val:any) => {
      setStep(val);
    }
    setError('');
    switch (step) {
      case 0:
        handleSubmit(verifyEmailVericationCode)();
        break;
      case 1:
        handleSubmit(goToNextStep)();
        break;
      case 2:
        if (agreeTerm) {
          handleSignUp();
        }
        break;
      case 3:
        AlertModal.show(<ForthStep step={getStep} />, '', () => {});
    const tenantName: any = localStorage.getItem('tenantName')
        getCategories(tenantName)
         //setStep(step + 1);
        break;
      case 4:
        // TODO: update categories
        redirectToSignInPage();
        break;
      default:
        break;
    }
    
    if (step >= 3) {
      return;
    }
  }, [
    agreeTerm,
    goToNextStep,
    handleSignUp,
    handleSubmit,
    redirectToSignInPage,
    step,
    verifyEmailVericationCode,
  ]);

  const goToPrevStep = useCallback(
    () => setStep((nextStep) => nextStep - 1),
    []
  );

  const onBack = useCallback(() => {
    setifNextStep(false);
    const getStep =(val:any) => {
      setStep(val);
    }
    setError('');
    switch (step) {
      case 0:
        handleSubmit(goToPrevStep)();
        break;
      case 1:
        handleSubmit(goToPrevStep)();
        break;
      case 2:
          handleSubmit(goToPrevStep)();
        break;
      case 3:
        handleSubmit(goToPrevStep)();
    const tenantName: any = localStorage.getItem('tenantName')
        getCategories(tenantName)
         //setStep(step + 1);
        break;
      case 4:
        // TODO: update categories
        redirectToSignInPage();
        break;
      default:
        break;
    }
    if (step >= 3) {
      return;
    }
  }, [
    agreeTerm,
    goToNextStep,
    handleSignUp,
    handleSubmit,
    redirectToSignInPage,
    step,
    verifyEmailVericationCode,
  ]);

  /**
   * Handle categories selected
   * @date 2021-11-04
   * @param {string} categoryId
   */
  const onCategorySelected = (value: string) => {
    const index = categorySelected.indexOf(value);
    if (index < 0) {
      categorySelected.push(value);
    } else {
      categorySelected.splice(index, 1);
    }
    console.log(categorySelected);
    setCategorySelected([...categorySelected]);
  };

  const onAvatarSelect = (index: number) => {
    setAvatarSelected(`avatar${index}`);
  };

  const onTogglingSecurityCodeVisibility = useCallback(() => {
    setSecurityCodeVisibility(!isSecurityCodeVisible);
  }, [isSecurityCodeVisible]);

  return (
    <div className="steps">
      <Container
        fluid
        className={`m-screen sign-up-steps ${step === 4 && "bg-gradient-app"}`}
      >
        {console.log("wow", ifNextStep)}
        <Row>
          <Col xl={6}>
            {step < 2 && (
              <Stack className="v-head align-items-center justify-content-center">
                <img src={step === 0 ? images.MonsPot : images.banderGuide} />
              </Stack>
            )}
            {step === 2 && (
              <Stack className="v-head align-items-center justify-content-center">
                <img src={images.banderGuide} />
              </Stack>
            )}
            {step === 3 && (
              <Stack className="v-head align-items-center justify-content-center">
                <img src={images.bannerSecure} />
              </Stack>
            )}
            {step === 4 && (
              <Stack className="v-head align-items-start justify-content-center">
                <img src={images.bannerCategory} />
              </Stack>
            )}
          </Col>
          <Col xl={6}>
            <Stack className="card">
              <Carousel
                activeIndex={step}
                className="v-steps flex-fill"
                interval={null}
                touch={false}
                controls={false}
                indicators={step < 5}
              >
                {/* Step 0 - Verify Email*/}
                {/* <Carousel.Item>
                <h3>Well, hello there! It seems like you’re the first one here from @theragency.com!</h3>
                <p className="text">
                Your company @theragency.com has not come up in our radar.
                </p>
                <p>Would you like to to register a new space for your company for free and start chatting with your coworkers?</p>
                <p><strong>YES, PROCEED TO SIGN UP MY ACCOUNT AND set up MY organisation chat space!</strong></p>
                
              </Carousel.Item> */}
                {/* Step 0 - Verify Email*/}
                <Carousel.Item>
                  <h3>Enter verification code</h3>
                  <p className="text">
                    Please type in the 4-digit numeric{" "}
                    <span className="highlight">verification</span> code you’ve
                    received in your email below.{" "}
                    <span className="highlight">
                      The verification code is case sensitive.
                    </span>
                  </p>
                  <Stack className="align-items-center mb-3 box-otp">
                    <OtpInput
                      inputStyle="otp-input"
                      value={inputEmailVerificationCode}
                      onChange={onCodeChange}
                      numInputs={4}
                      separator={<span>&nbsp;&nbsp;&nbsp;</span>}
                      hasErrored={errors.code}
                    />
                    {!!errors.code && (
                      <p className="text-error">{errors.code.message}</p>
                    )}
                  </Stack>
                  {!!error && <p className="text-error">{error}</p>}
                  <p className="text">
                    Check your work email for this verification code.{" "}
                    <span className="highlight">
                      If you do not see it in your inbox within two minutes,
                      please check your spam folder.
                    </span>{" "}
                  </p>
                </Carousel.Item>
                {/* Step 1 - Profile Personna*/}
                <Carousel.Item>
                  <h3>Setup your online profile</h3>
                  <Stack>
                    <div className="edit-profile-modal">
                      <InputStacked
                        name="username"
                        label="Username"
                        placeholder="john..."
                        value={username}
                        onChange={(e) =>
                          onSignUpInfoChange("username", e.target.value)
                        }
                      />
                      {!!errors.username && (
                        <p className="text-error">{errors.username.message}</p>
                      )}
                      <InputStacked
                        name="password"
                        label="Password"
                        placeholder="****"
                        type="password"
                        value={password}
                        onChange={(e) =>
                          onSignUpInfoChange("password", e.target.value)
                        }
                      />
                      {!!errors.password && (
                        <p className="text-error">{errors.password.message}</p>
                      )}
                      <br />
                      <p className="">Choose an avatar</p>
                      <div className="box-avatar-list mb-5 p-0">
                        {images.AVATARS.map((image: any, i) => (
                          <div className="avatar-item" key={i}>
                            <label
                              className={`${
                                avatarSelected === `avatar${i + 1}` &&
                                "selected"
                              }`}
                            >
                              <img
                                src={image}
                                alt={`avatar${i}`}
                                onClick={onAvatarSelect.bind(null, i + 1)}
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Stack>
                </Carousel.Item>
                {/* Step 2 - Terms */}
                <Carousel.Item>
                  <h3>Terms of Use</h3>
                  <div className="box-term">
                    <TermAndCondition />
                  </div>
                  <Stack className="my-3">
                    <Checkbox
                      checked={agreeTerm}
                      onChange={() => setAgreeTerm(!agreeTerm)}
                    >
                      I’ve read and agree with the Terms of Use
                    </Checkbox>
                  </Stack>
                </Carousel.Item>
                {/* Step 3 - Security Code*/}
                <Carousel.Item>
                  <h3>
                    Keep your security code safe. Don’t get locked out of
                    Loominate!
                  </h3>
                  <p className="text">
                    We suggest that you screenshot the{" "}
                    <span className="highlight">code</span> below and save{" "}
                    <span className="highlight">it</span> somewhere safe. Your
                    security code is case sensitive.
                  </p>
                  <div className="d-flex flex-column ">
                    {!!securityCode && (
                      <div className="v-security">
                        {securityCode.split("").map((c, i) => (
                          <div className="security-box" key={`security-${i}`}>
                            {isSecurityCodeVisible && <span>{c}</span>}
                            {!isSecurityCodeVisible && (
                              <div className="hide-box" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      variant="none"
                      className="btn-security-code"
                      onClick={onTogglingSecurityCodeVisibility}
                    >
                      {isSecurityCodeVisible ? "Hide" : "Show"} security code
                    </Button>
                  </div>
                  <p className="text pb-4">
                    Shall anything <span className="highlight">happen</span> to
                    your account, you will be able to reset your password by
                    entering your security code.
                  </p>
                </Carousel.Item>
                {/* Step 4 - Category*/}
                {/* <Carousel.Item>
                  <h3>One last thing...</h3>
                  <p className="text">
                    We’d like to tailor your post feed according to topics and
                    causes that you strongly believe in.
                    <br />
                    <br />
                    Could you highlight which of the following topic is relevant
                    to you?
                  </p>
                  {!!error && <p className="text-error">{error}</p>}
                  <Stack className="v-category">
                    {categories?.map((item: any, i) => (
                      <Button
                        key={`category-${i}`}
                        variant=""
                        className={`btn-category ${
                          categorySelected.indexOf(item.id) > -1 && 'selected'
                        }`}
                        onClick={onCategorySelected.bind(null, item.id, item.value)}
                      >
                        {item.title}
                      </Button>
                      
                    ))}
                  </Stack>
                </Carousel.Item> */}
                {/* Step 5 - Category*/}
                <Carousel.Item>
                  <h3>
                    Congratulations! <br />
                    You’re now a member of the Airbus employee Loominati.
                  </h3>
                  <p className="text">
                    As a member, you can now trade battle stories with colleagues, share passions, vote on initiatives and join missions to drive positive culture and bottom-up change in Airbus.
                    <br />
                    <br />
                    Start using your space now!
                  </p>
                </Carousel.Item>
              </Carousel>
              {/* Button Next */}
              <div className={step === 4 ? "nxt-btn-wrap-last nxt-btn-wrap" : "nxt-btn-wrap" && step === 0 ? "nxt-btn-wrap-first nxt-btn-wrap" : "nxt-btn-wrap"}>
                <Stack direction="horizontal" gap={3}>
                {step === 0 && (
                  <ButtonGradient className="btn-outline">
                    SIGN IN WITH ANOTHER EMAIL
                  </ButtonGradient>
                )}
                {step > 0 && step! !== 4 && <ButtonGradient className="btn-outline" onClick={onBack}><IcoMoon icon="short_left" color="#fff" size={22} /></ButtonGradient>}
                <ButtonGradient
                  className="btn-next ms-auto"
                  style={step < 4 ? {} : { width: `auto` }}
                  onClick={onNext}
                  disabled={
                    (step === 2 && !agreeTerm && true) ||
                    (step === 3 && !agreeTerm) ||
                    (step === 3 && !isSecurityCodeVisible)
                  }
                  loading={ifNextStep && step === 2 ? loading : false}
                >
                  {step === 0 && "YES, REGISTER MY COMPANY"}
                  {step === 3 && "screenshot done!"}
                  {step < 3 && step! !== 0 && (
                    <IcoMoon icon="short_right" color="#fff" size={22} />
                  )}
                  {step === 4 && "LET’s start"}
                </ButtonGradient>{" "}
                
                
                </Stack>
              </div>
            </Stack>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SignUpStepPage;
