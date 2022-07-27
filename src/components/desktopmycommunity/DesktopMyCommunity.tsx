import React from "react";
import {
  Button,
  Col,
  Container,
  Dropdown,
  Nav,
  Row,
  Stack,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import IconFeed from "../../assets/images/IconFeed";
import IconInitiatives from "../../assets/images/IconInitiatives";
import IconLeaderboard from "../../assets/images/IconLeaderboard";
import images from "../../assets/images/images";
import { tenantNameState } from "../../atoms/globalStates";
import IcoMoon from "../icon/IcoMoon";
import InputSearch from "../input/InputSearch";
import "./styles.scss";

const DesktopMyCommunity = () => {
  function gettenant() {
    const tenantName: any = localStorage.getItem("tenantName");
    return tenantName;
  }
  return (
    <div className="white-box">
      <h5>MY COMMUNITY</h5>
      <div className="my-community">
        <Stack direction="horizontal" gap={2}>
          <img src={images.avatarCompany} width={47} />{" "}
          <strong>{gettenant()}</strong>
        </Stack>
      </div>
    </div>
  );
};

export default DesktopMyCommunity;
