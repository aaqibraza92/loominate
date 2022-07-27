import { message } from "antd";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import ButtonGradient from "../../components/button/ButtonGradient";
import HeaderDesktop from "../../components/header/HeaderDesktop";
import IcoMoon from "../../components/icon/IcoMoon";
import BottomNavBar from "../../components/navbar/BottomNavBar";
import User from "../../models/user.model";
import "./styles.scss";

/**
 * SignUpCompanyInvite Page
 * @param {any} props
 * @returns {any}
 */
function InvitePeersPage(props: any) {
  const history = useHistory();
  const user: User = useSelector((state: any) => state.auth.user);
  const [referralCode, setReferralCode] = useState(user?.referral);
  const [link, setLink] = useState(
    `${process.env.REACT_APP_DOMAIN}${routes.SignInPage}?referral=${referralCode}`
  );

  /**
   * Back Sign In page
   * @date 2021-11-04
   */
  const onContinue = () => {
    history.push(routes.SignInPage);
  };

  const handleCopy = () => {
    message.success({
      content: <label className="message">Link Copied!</label>,
      icon: <IcoMoon icon="link" className="icon" color="#fff" size={18} />,
      duration: 2,
      className: "top-message",
    });
  };

  return (
    <>
    <HeaderDesktop/>
      <Container className="invite-peers m-screen">
        
    <Row>    
    <Col xl={6}>      
    <Stack className="v-head align-items-center justify-content-center">
          <img src={images.bannerSUC3} />
        </Stack>
    </Col>
    <Col xl={6}>      
    <div className="card">
          <h3>Invite Users, Earn Points</h3>
          <p className="text">
            Have your peers join the company space by sending out your{" "}
            <strong>referral link.</strong>
          </p>
          <div className="box-link mb-3">{link}</div>
          <CopyToClipboard text={link} onCopy={handleCopy}>
            <ButtonGradient className="mt-2">Copy link</ButtonGradient>
          </CopyToClipboard>

          <p className="text mt-4">
            If any of your peers join your space from the link you sent, you
            will earn <span className="highlight">Karma points</span>. You can
            convert your <span className="highlight">Karma points</span> into{" "}
            <span className="highlight-mint">Loomi Tokens</span> or promotional
            vouchers.
          </p>
        </div>
    </Col>
    </Row>
      </Container>
      <BottomNavBar />
    </>
  );
}

export default InvitePeersPage;
