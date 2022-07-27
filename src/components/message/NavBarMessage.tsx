import { Avatar } from "antd";
import { useEffect, useState } from "react";
import { Container, Navbar, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import colors from "../../commons/styles/colors";
import User from "../../models/user.model";
import IcoMoon from "../icon/IcoMoon";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  type?: any;
  data?: any;
  hasBack?: boolean;
  handleBack?: any;
}

function NavBarMessage(props: Props) {
  const history = useHistory();
  const { containerStyle, hasBack, handleBack, data } = props;
  const { user = {} } = useSelector((state: any) => state.auth);
  const [visibleNotification, setVisibleNotification] = useState(false);
  const [recipient, setRecipient] = useState<User>({ ...data });
  const onBack = () => {
    if (handleBack) {
      handleBack();
    } else {
      history.goBack();
    }
  };
  useEffect(() => {
    console.log('inside navBarMessage', data)
  }, [])
  
  return (
    <Navbar bg="light" className="nav-bar-message">
      <Container>
        <Stack
          direction="horizontal"
          gap={1}
          className="align-items-center w-100"
        >
          <button className="btn btn-back" onClick={onBack}>
            <IcoMoon
              icon={hasBack ? "chevron_left" : "close"}
              size={24}
              color={colors.primary}
              className="icon"
            />
          </button>

          {hasBack && <h5 className="title flex-fill">Messages</h5>}
          {data && (
            <Stack
              direction="horizontal"
              className="flex-fill justify-content-center"
              gap={1}
            >
              <Avatar src={recipient?.avatarLink || images.AVATAR_KEYS[recipient?.avatar || "avatar1"]} />
              <h5 className="title">{recipient.username}</h5>
            </Stack>
          )}
          {/* <button className="btn">
            <IcoMoon
              icon="more"
              size={24}
              color={colors.primary}
            />
          </button> */}
        </Stack>
      </Container>
    </Navbar>
  );
}

export default NavBarMessage;
