import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import ButtonGradient from "../../components/button/ButtonGradient";
import InputStacked from "../../components/input/InputStacked";
import authAction from "../../redux/actions/auth.action";
import userService from "../../services/user.service";
import "./styles.scss";

/**
 * ResetPassword Page
 * @param {any} props
 * @returns JSX.Element
 */
function ResetPasswordPage(props: any) {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [error, setError] = useState<any>("");

  useEffect(() => {
    register("code", {
      required: {
        value: true,
        message: "Code is required",
      },
    });
  }, []);

  /**
   * Handle code change
   * @param { any} e
   * @returns {React.ChangeEventHandler} ChangeEventHandler
   */
  const onCodeChange = (e: any) => {
    setValue("code", e.target.value, { shouldValidate: true });
  };
  
  /**
   * Check SecurityCode 
   */
  const onSubmit = async (e: any) => {
    try {
      // const rs = await userService.checkSecurityCode({ security_code: e.code });
      // console.log(rs);
      // dispatch(authAction.addResetPasswordToken(rs.user.auth_token));
      // history.push(routes.NewPasswordPage);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="m-screen desktop-wrapper">
    <Container className="reset-password m-screen">
      
    <Row>
    <Col xl={6}>       
    <Stack className="v-head align-items-center justify-content-center">
        <img src={images.bannerRP1} alt="" />
      </Stack>   
    </Col>
    <Col xl={6}>   
    
    <div className="card">
      <div className="v-content">
        <h3 className="text-center">Remember your security code?</h3>
        <InputStacked
          name="code"
          label="5-digit code"
          placeholder="Example: S3V5R"
          maxLength={5}
          onChange={onCodeChange}
          error={errors.code}
        />
        {!!error && <p className="text-error">{error}</p>}
        <p className="text">
          Can’t remember the security code? <br />
          <span className="highlight">Try logging in again</span>
        </p>
        <div className="v-btn d-grid mt-auto">
          <ButtonGradient
            text="CONFIRM"
            style={{ marginBottom: 16 }}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>   
      </div>
    </Col>
    </Row>
    </Container>
    </div>
  );
}

export default ResetPasswordPage;
