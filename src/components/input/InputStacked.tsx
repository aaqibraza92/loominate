import { useState } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';
import { ReactComponent as IconEye } from '../../assets/icons/eye.svg';
import './styles.scss';

interface Props extends FormControlProps {
  containerStyle?: any;
  containerClass?: any;
  label?: string;
  maxLength?: number;
  name?: string;
  error?: any;
  errors?: any;
  suffix?: any;
  type?: string;
}

/**
 * InputStacked Component
 * @param {Props} props
 * @returns JSX.Element
 */
function InputStacked(props: Props) {
  const {
    containerStyle,
    label,
    name,
    type,
    error,
    errors,
    suffix,
    containerClass,
  } = props;
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  /**
   * Handle show password
   * @date 2021-11-04
   */

  return (
    <Form.Group
      className={`input-stacked mb-4 ${containerClass}`}
      style={containerStyle}
    >
      {!!label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        {...props}
        type={!isPasswordVisible && type === 'password' ? 'password' : 'text'}
        autoComplete="off"
      />
      {type === 'password' && (
        <IconEye
          className="secure-icon"
          onClick={() => setPasswordVisibility((prevState) => !prevState)}
        />
      )}
      {suffix && <span className="box-suffix">{suffix}</span>}
      {!!error && <p className="text-error">{error.message}</p>}
      {!!errors && name && (
        <p className="text-error">{errors[name]?.message}</p>
      )}
    </Form.Group>
  );
}

export default InputStacked;
