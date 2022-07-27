import IcomoonReact from "icomoon-react";
import iconSet from "./selection.json";

interface Props {
  color?: string;
  size?: string | number;
  icon: string;
  className?: string;
  style?: React.CSSProperties;
  [x: string]: any;
}
/**
* IcoMoon Component
* @param {Props} props
* @returns {JSX.Element}
*/
function IcoMoon(props: Props) {
  return <IcomoonReact iconSet={iconSet} size={16} {...props} />;
}

export default IcoMoon;
