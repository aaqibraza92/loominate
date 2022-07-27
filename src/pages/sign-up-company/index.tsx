import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import ButtonGradient from "../../components/button/ButtonGradient";
import "./styles.scss";

/**
* SignUpCompany Page
* @param {any} props
* @returns {any}
*/
function SignUpCompanyPage(props: any) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { domain } = useSelector((state: any) => state.signUp);

  // useEffect(() => {
  //   if (!domain) {
  //     history.replace(routes.SignInPage);
  //     return;
  //   }
  // }, []);

  /**
   * Handle change step
   */
  const nextStep = () => {
    history.push(routes.SignUpCompanySpacePage);
  };

  return (
    <Container className="sign-up-company m-screen">
      <Stack className="v-head align-items-center justify-content-center">
        <img src={images.bannerSUC1} />
      </Stack>
      <div className="card">
        <h3>Enter verification code</h3>
        <p className="text">
          Your company <span className="highlight">{domain}</span> has not come
          up in our radar.
        </p>

        <p className="text">
          Would you like to to register a new space for your company on
          Loominate?
        </p>
        <div className="v-btn d-grid mt-auto">
          <ButtonGradient
            text="YES, REGISTER MY COMPANY"
            style={{ marginBottom: 16 }}
            onClick={nextStep}
          />
          <ButtonGradient bordered={true} text="SIGN IN WITH ANOTHER EMAIL" />
        </div>
      </div>
    </Container>
  );
}

export default SignUpCompanyPage;
