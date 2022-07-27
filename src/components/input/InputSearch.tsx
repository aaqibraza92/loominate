import { Input, InputProps } from "antd";
import { useState } from "react";
import colors from "../../commons/styles/colors";
import IcoMoon from "../icon/IcoMoon";
import "./styles.scss";

interface Props extends InputProps {
  containerStyle?: any;
  label?: string;
  maxLength?: number;
  name?: string;
  error?: any;
  theme?: string;
  onSearch?: any;
}
/**
 * InputSearch Component
 * @param {Props} props
 * @returns {JSX.Element}
 */
function InputSearch(props: Props) {
  const { containerStyle, label, type, theme, onSearch, onChange } = props;
  const [keyword, setKeyword] = useState("");
  const onKeywordChange = (e: any) => {
    setKeyword(e.target.value);
    if (onChange) onChange(e);
  };
  return ( 
    <div className="input-search">
      <Input
        {...props}
        value={keyword}
        onChange={onKeywordChange}
        onPressEnter={onSearch?.bind(null, keyword)}
        suffix={
          <button
            className="btn btn-right"
            onClick={onSearch?.bind(null, keyword)}
          >
            <IcoMoon icon="search" color={colors.mint} size={24} />
          </button>
        }
      />
    </div>

    // <Form.Group className="input-search mb-3" style={containerStyle}>
    //   {!!label && <Form.Label>{label}</Form.Label>}
    //   <Form.Control {...props} />
    //   <button className="btn btn-right">
    //     <IcoMoon icon="search" color={colors.primary} size={24} />
    //   </button>
    // </Form.Group>
  );
}

export default InputSearch;
