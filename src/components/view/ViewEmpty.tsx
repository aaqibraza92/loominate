import { Stack } from "react-bootstrap";
import images from "../../assets/images/images";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  message?: string;
}

function ViewEmpty(props: Props) {
  const { message } = props;
  return (
    <Stack className="view-empty flex-fill align-items-center justify-content-center">
      <img className="logo-empty" src={images.iconEmpty} />
      <p className="text-empty">{message}</p>
    </Stack>
  );
}

export default ViewEmpty;
