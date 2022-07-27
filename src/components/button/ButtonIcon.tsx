import { ButtonProps } from "react-bootstrap";
import { Button } from "react-bootstrap";
import IcoMoon from "../icon/IcoMoon";
import "./styles.scss";

interface Props extends ButtonProps {
  containerStyle?: any;
  text?: string;
  name?: string;
  error?: any;
  bordered?: boolean;
}

/**
 * ButtonIcon Component
 * @param {Props} props
 * @returns JSX.Element
 */
function ButtonIcon(props: Props) {
  const { text, bordered = false } = props;
  return (
    <Button
      {...props}
      variant="none"
      className={`btn-gradient ${bordered && "bordered"}`}
    >
      <IcoMoon icon="upload" size={24} color="#fff" />
    </Button>
  );
}

export default ButtonIcon;
