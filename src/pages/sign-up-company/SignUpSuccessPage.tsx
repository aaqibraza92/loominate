import React, { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import ButtonGradient from "../../components/button/ButtonGradient";
import IcoMoon from "../../components/icon/IcoMoon";
import "./styles.scss";

/**
 * SignUpCompanyInvite Page
 * @param {any} props
 * @returns {any}
 */
function SignUpSuccessPage(props: any) {
  const history = useHistory();

  /**
   * Back Sign In page
   * @date 2021-11-04
   */
  const onContinue = () => {
    history.push(routes.SignInPage);
  };

  return (
    <div className="steps">
    <Container className="sign-up-company-space m-screen">
      {/* <Stack className="v-head align-items-center justify-content-center">
        <img src={images.bannerSUC3} />
      </Stack>
      <div className="card">
        <h3>Invite Users, Earn Points</h3>
        <p className="text">
          Have your peers join the company space by sending out your referral
          link.
        </p>
        <Row>
          <Col className="col-content-center">
            <div className="box-circle bg-yellow">
              <IcoMoon icon="link" color="#fff" />
            </div>
            <p>Copy Link</p>
          </Col>
          <Col className="col-content-center">
            <div className="box-circle bg-pink">
              <IcoMoon icon="sms" color="#fff" />
            </div>
            <p>Send SMS</p>
          </Col>
          <Col className="col-content-center">
            <div className="box-circle bg-mint">
              <IcoMoon icon="email" color="#fff" />
            </div>
            <p>Email</p>
          </Col>
        </Row>
        <p className="text">
          If any of your peers join your space from the link you sent, you will
          earn <span className="highlight">Karma points</span>. You can convert
          your <span className="highlight">Karma points</span> into Loomi Tokens
          or promotional vouchers.
        </p>
        <div className="v-btn d-grid mt-auto">
          <ButtonGradient
            text="CONFIRM"
            style={{ marginBottom: 16 }}
            onClick={onContinue}
          />
        </div>
      </div> */}
       <Row>
          <Col xl={6}>
          <Stack className="v-head align-items-center justify-content-center">
          <img src={images.MonsterSuccess} />
          </Stack>
          </Col>
          <Col xl={6}>

          <div className="card">
        <h3>Congratulations!<br />You are now a moderator of your company space.</h3>
        
        <div className="invite-link">
         <div className="term-text small my-3">
         As a moderator, you will be able to manage categories, review content, receive reports from your users and more.<br /><br />
        Start managing your space now!
          </div>
        <div className="v-btn d-grid mt-3">
          <ButtonGradient
            text="LET???s start"
            style={{ marginBottom: 16 }}
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

export default SignUpSuccessPage;
