import { useEffect, useState } from "react";
import { Row, Stack } from "react-bootstrap";
import Div100vh from "react-div-100vh";
import { useSelector } from "react-redux";
import images from "../../assets/images/images";
import User, { UserRole } from "../../models/user.model";
import "./styles.scss";

interface Props {}

function Loading(props: Props) {
  const { visible, message, username } = useSelector(
    (state: any) => state.loading
  );
  const user: User = useSelector((state: any) => state.auth.user);
  const [isAdmin, setIsAdmin] = useState(user?.role === UserRole.ADMIN);
  useEffect(() => {
    if (user) {
      setIsAdmin(user?.role === UserRole.ADMIN);
    }
  }, [user]);
  // if (!visible) return <div></div>;
  return (
    <Div100vh
      className={`m-screen view-loading ${visible && "show"} ${
        isAdmin && "bg-admin"
      }`}
    >
      <div className="bg-sky"></div>
      <div>
        <div>
          <Row className="justify-content-center monster">
            <img src={isAdmin ? images.monsterKungpaoKitty : images.monsterPinkHorn} alt="loomer" className="loomer" />
          </Row>
          <Stack className="align-items-center">
            <p className="text">Hold on tight,</p>
            <p className="text text-yellow">{username}</p>
            <p className="text mt-5">
              {message || "Welcome to the community!"}
            </p>
          </Stack>
        </div>
      </div>
    </Div100vh>
  );
}

export default Loading;
