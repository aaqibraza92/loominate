import React, { useEffect, useState } from "react";
import { Col, Container, Dropdown, Nav, Row, Stack } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import IconFeed from "../../assets/images/IconFeed";
import IconInitiatives from "../../assets/images/IconInitiatives";
import IconLeaderboard from "../../assets/images/IconLeaderboard";
import IconPoll from "../../assets/images/IconPoll";
import images from "../../assets/images/images";
import { feedFilter } from "../../atoms/globalStates";
import routes from "../../commons/constants/routes.constant";
import InputSearch from "../input/InputSearch";
import { useLocation } from "react-router-dom";
import "./styles.scss";

const DesktopMenu = () => {
  const location = useLocation();

  const [feedFilterState, setFeedFilter] = useRecoilState(feedFilter);
  const [roleType, setRoleType] = useState("All");
  const history = useHistory();
  const navigation = localStorage.getItem("navi");

  useEffect(() => {
    if(location.pathname==="/leaderboard"){
      localStorage.setItem("navi", "leaderboard");
    }else{
    }
  
  }, [navigation]);

  const onMenuClick = (filter: any) => {
    setRoleType(filter.value);
    localStorage.setItem("navi", filter.value);
    const tenantName: any = localStorage.getItem("tenantName");
    history.push(routes.HomePage.replace(":tenant", tenantName));
    setFeedFilter(filter);
  };

  return (
    <div className="white-box">
      <ul style={{paddingLeft:"0px",listStyle: "none"}}>
      <li>
          <Link to="#" className={`nav-link ${navigation === "All" && "active"}`}
           onClick={() =>
            onMenuClick({ name: "All", value: "All" })
          }>
          <Stack direction="horizontal" gap={3}>
          <IconFeed />
              <span>My FEED</span>
          </Stack>
          </Link>
        </li>
        <li>
          <Link to="/leaderboard"  className={`nav-link ${location.pathname === "/leaderboard" && "active"}`}>
          <Stack direction="horizontal" gap={3}>
          <IconLeaderboard />
              <span>LEADERBOARD</span>
          </Stack>
          </Link>
        </li>
        <li>
          <Link to="#" className={`nav-link ${navigation === "Initiative" && "active"}`}
           onClick={() =>
            onMenuClick({ name: "Initiatives", value: "Initiative" })
          }>
          <Stack direction="horizontal" gap={3}>
            <IconInitiatives />
            <span>INITIATIVES</span>
          </Stack>
          </Link>
        </li>
        <li>
          <Link to="#" className={`nav-link ${navigation === "Poll" && "active"}`}
          onClick={() => onMenuClick({ name: "Polls", value: "Poll" })}>
          <Stack direction="horizontal" gap={3}>
            <IconPoll />
            <span>POLLS</span>
          </Stack>
          </Link>
        </li>
      </ul>
{/* 
      <Nav defaultActiveKey="1" className="flex-column">
        <Nav.Link
          eventKey={1}
          onClick={() => onMenuClick({ name: "All", value: "All" })}
        >
          <Stack direction="horizontal" gap={3}>
            <IconFeed />
            <span>My FEED</span>
          </Stack>
        </Nav.Link>

        <Nav.Link
          eventKey={2}
          className={`${location.pathname === "/leaderboard" ? "active" : ""}`}
          href={"/leaderboard"}
        >
          <Stack direction="horizontal" gap={3}>
            <IconLeaderboard />
            <span>LEADERBOARD</span>
          </Stack>
        </Nav.Link>
        <Nav.Link
          className={`${roleType === "Initiative" && "active"}`}
          eventKey={3}
          onClick={() =>
            onMenuClick({ name: "Initiatives", value: "Initiative" })
          }
        >
          <Stack direction="horizontal" gap={3}>
            <IconInitiatives />
            <span>INITIATIVES</span>
          </Stack>
        </Nav.Link>
        <Nav.Link
          className={`${roleType === "Poll" && "active"}`}
          eventKey={4}
          onClick={() => onMenuClick({ name: "Polls", value: "Poll" })}
        >
          <Stack direction="horizontal" gap={3}>
            <IconPoll />
            <span>POLLS</span>
          </Stack>
        </Nav.Link>
      </Nav> */}
    </div>
  );
};

export default DesktopMenu;
