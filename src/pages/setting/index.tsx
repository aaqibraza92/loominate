import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import colors from "../../commons/styles/colors";
import DesktopCategory from "../../components/desktopcategory/DesktopCategory";
import DesktopCulture from "../../components/desktopculture/DesktopCulture";
import DesktopGuidelines from "../../components/desktopguidelines/DesktopGuidelines";
import DesktopHashtags from "../../components/desktophashtags/DesktopHashtags";
import DesktopMenu from "../../components/desktopmenu/DesktopMenu";
import DesktopMyCommunity from "../../components/desktopmycommunity/DesktopMyCommunity";
import DesktopMyProfile from "../../components/desktopmyprofile/DesktopMyProfile";
import DesktopOurPurpose from "../../components/desktopourpurpose/DesktopOurPurpose";
import HeaderDesktop from "../../components/header/HeaderDesktop";
import IcoMoon from "../../components/icon/IcoMoon";
import CompanyGuideModal from "../../components/modal/CompanyGuideModal";
import FAQsModal from "../../components/modal/FAQsModal";
import TermAndConditionModal from "../../components/modal/TermAndConditionModal";
import AppNavBar from "../../components/navbar";
import BottomNavBar from "../../components/navbar/BottomNavBar";
import NotificationSheet from "../../components/notification/NotificationSheet";
import User from "../../models/user.model";
import "./styles.scss";

const SETTINGS_MENU = [
  {
    key: "notification",
    title: "Push Notification",
  },
  {
    key: "faq",
    title: "FAQs",
  },
  {
    key: "terms",
    title: "Terms of Use",
  },
  {
    key: "guidelines",
    title: "Community Guidelines",
  },
];

/**
 * SettingsPage Page
 * @param props
 * @returns JSX.Element
 */
function SettingsPage(props: any) {
 
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
  const [loading, setLoading] = useState(true);
  const [dialogGuide, setDialogGuide] = useState(false);
  const [dialogTnC, setDialogTnC] = useState(false);
  const [dialogFAQs, setDialogFAQs] = useState(false);
  const [dialogNotify, setDialogNotify] = useState(false);

  const onOpenGuide = () => {
    setDialogGuide(true);
  };
  const onOpenTnC = () => {
    if(screenWidth > 1200){
      history.push("/terms-of-use");
    }else{
      setDialogTnC(true);
    }
    
    
  };
  const onOpenFAQs = () => {
    setDialogFAQs(true);
  };
  const onOpenNotify = () => {
    setDialogNotify(true);
  };

  const onMenuClick = (index: number) => {
    switch (index) {
      case 0:
        onOpenNotify();
        break;
      case 1:
        onOpenFAQs();
        break;
      case 2:
        onOpenTnC();
        break;
      case 3:
        onOpenGuide();
        break;
      default:
        break;
    }
  };

  return (
    <div className="settings-page m-screen">
      <HeaderDesktop />
      <AppNavBar />
      <Container style={isMobile ? { padding: 0 } : {}}>

        <Row gutter={16}>
          <Col xl={5}>
            <div className="desktop-only">
              <DesktopMenu />
              <DesktopCategory />
              <DesktopHashtags />
            </div>
          </Col>
          <Col span={24} xl={12}>

            <Stack
              direction="horizontal"
              className="v-title align-items-center mb-3 mt-2"
            >
              <h4>App Settings</h4>

            </Stack>

            <Stack className="mb-3">
                {SETTINGS_MENU.map((item, index) => (

                  <Stack
                    key={`option-${index}`}
                    direction="horizontal"
                    className="box-item"
                    onClick={onMenuClick.bind(null, index)}
                  >
                    <span>{item.title}</span>
                    <IcoMoon
                      icon="chevron_right"
                      size={24}
                      color={colors.mint}
                      className="ms-auto"
                    />
                  </Stack>
                ))}
              </Stack>

            <Stack direction="horizontal" className="box-item">
              <span>Version</span>
              <span className="ms-auto text-right">v1.0.0</span>
            </Stack>
           

          </Col>
          <Col xl={7}>
            <div className="desktop-only">
              <DesktopMyCommunity />
              <DesktopMyProfile />
              <DesktopOurPurpose />
              <DesktopGuidelines />
              <DesktopCulture />
            </div>
          </Col>
        </Row>


      </Container>
      <CompanyGuideModal
        visible={dialogGuide}
        onClose={() => setDialogGuide(false)}
      />

      <TermAndConditionModal
        visible={dialogTnC}
        onClose={() => setDialogTnC(false)}
      />
      <FAQsModal visible={dialogFAQs} onClose={() => setDialogFAQs(false)} />
      <NotificationSheet
        open={dialogNotify}
        onClose={() => setDialogNotify(false)}
      />

      <BottomNavBar />
    </div>
  );
}

export default SettingsPage;
