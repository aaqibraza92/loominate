import { LoadingOutlined } from "@ant-design/icons";
import { Button, ButtonProps } from "react-bootstrap";
import "./styles.scss";

interface Props extends ButtonProps {
  containerStyle?: any;
  containerClass?: string;
  text?: string;
  name?: string;
  error?: any;
  bordered?: boolean;
  loading?: boolean;
  className?: string;
}

/**
 * ButtonGradient Component
 * @param {Props} props
 * @returns JSX.Element
 */
function ButtonGradient(props: Props) {
  const { text, bordered, loading = false, disabled, className } = props;
  return (
    <Button
      {...props}
      className={`btn-gradient ${bordered && "bordered"} ${className}`}
      disabled={disabled || loading}
    >
      {!bordered && !props.children && text}
      {bordered && !props.children && <div className="bg-bordered">{text}</div>}
      {props.children}
      {loading && <LoadingOutlined style={{ fontSize: 24, marginLeft: 8 }} />}
    </Button>
  );
}

export default ButtonGradient;
