import { useEffect } from "react";
import { Container, Navbar, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import routes from "../../commons/constants/routes.constant";
import storageKeys from "../../commons/constants/storageKeys.constant";
import colors from "../../commons/styles/colors";
import { setAuthorization } from "../../services";
import localStorage from "../../utils/localStorage";
import IcoMoon from "../icon/IcoMoon";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  type?: any;
}

function NavBarBack(props: Props) {
  const history = useHistory();
  const { containerStyle } = props;
  const { user = {} } = useSelector((state: any) => state.auth);
  useEffect(() => {
    const token = localStorage.getValue(storageKeys.ACCESS_TOKEN);
    console.log("TOKEN", token);
    if (token) {
      setAuthorization(token);
    }
  }, []);

  const onBack = () => {
    history.replace(routes.HomePage);
  };
  return (
    <Navbar bg="light" className="nav-bar-back">
      <Container>
        <Stack
          direction="horizontal"
          gap={2}
          className="align-items-center mb-2 w-100"
        >
          <button className="btn btn-back" onClick={onBack}>
            <IcoMoon icon="chevron_left" size={20} className="icon" />
            Back
          </button>
          <button className="btn ms-auto">
            <IcoMoon icon="sms" size={24} color={colors.primary} />
          </button>
          <button className="btn">
            <IcoMoon icon="notification" size={24} color={colors.primary} />
          </button>
        </Stack>
      </Container>
    </Navbar>
  );
}

export default NavBarBack;
