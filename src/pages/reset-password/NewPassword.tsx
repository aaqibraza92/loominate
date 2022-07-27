import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import ButtonGradient from "../../components/button/ButtonGradient";
import InputStacked from "../../components/input/InputStacked";
import authAction from "../../redux/actions/auth.action";
import userService from "../../services/user.service";
import utils from "../../utils";
import "./styles.scss";

/**
* NewPassword Page
* @param props
* @returns JSX.Element
*/
function NewPasswordPage(props: any) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { resetToken } = useSelector((state: any) => state.auth);
  const [error, setError] = useState<any>("");

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();

  useEffect(() => {
    if (!resetToken) {
      history.replace(routes.ResetPasswordPage);
    }
    register("password", {
      required: {
        value: true,
        message: "Password is required",
      },
      pattern: {
        value: utils.regexPassword(),
        message:
          "Password Minimum six characters, at least a lowercase letter, a uppercase and a digit",
      },
    });
    register("confirm_password", {
      required: {
        value: true,
        message: "Confirm Password is required",
      },
      pattern: {
        value: utils.regexPassword(),
        message:
          "Confirm Password Minimum six characters, at least a lowercase letter, a uppercase and a digit",
      },
    });
  }, []);

 /**
* 描述
* @date 2021-11-04
* @param { any} e
* @returns {any}
*/
 const onTextChange = (e: any) => {
    setValue(e.target.name, e.target.value, { shouldValidate: true });
  };

  const onSubmit = async (e: any) => {
    setError("");
    console.log(e);
    const data = { ...e };
    try {
      // const rs = await userService.changePassword(data, resetToken);
      // dispatch(authAction.removeResetPasswordToken());
      // history.replace(routes.SignInPage);
    } catch (error: any) {
      console.log(error);
      setError(error);
    }
  };
  return (
    <Container className="reset-password m-screen">
      <Stack className="v-head align-items-center justify-content-center">
        <img src={images.bannerRP2} />
      </Stack>
      <div className="card">
        <h3>Your code works! Set your new password</h3>
        {!!error && <p className="text-error">{error}</p>}
        <InputStacked
          name="password"
          label="New password"
          type="password"
          placeholder=""
          onChange={onTextChange}
          error={errors.password}
        />
        <InputStacked
          name="confirm_password"
          label="Confirm New password"
          type="password"
          placeholder=""
          onChange={onTextChange}
          error={errors.confirm_password}
        />
        <p className="text">You will be asked to login again after.</p>
        <div className="v-btn d-grid mt-auto">
          <ButtonGradient
            text="CONFIRM"
            style={{ marginBottom: 16 }}
            onClick={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </Container>
  );
}

export default NewPasswordPage;
