import ActionSheet, { ActionSheetRef } from "actionsheet-react";
import { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Category from "../../models/category.model";
import ButtonGradient from "../button/ButtonGradient";
import InputStacked from "../input/InputStacked";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  open?: boolean;
  onClose?: any;
}

const dataDefault: Category = {
  name: "",
};

/**
 * HelpSupportSheet Component
 * @param props
 * @returns JSX.Element
 */
function HelpSupportSheet(props: Props) {
  const dispatch = useDispatch();
  const ref: any = useRef<ActionSheetRef>();
  const { containerStyle, open, onClose } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      handleOpen();
    } else {
      handleClose();
    }
  }, [open]);

  /**
   * Handle ActionSheet open
   */
  const handleOpen = () => {
    ref.current.open();
  };

  /**
   * Handle ActionSheet close
   */
  const handleClose = () => {
    ref.current.close();
    onSheetClose();
  };

  /**
   * Handle ActionSheet Close
   */
  const onSheetClose = () => {
    ref.current.close();
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  return (
    <ActionSheet
      ref={ref}
      onClose={onSheetClose}
      mouseEnable={false}
      touchEnable={false}
    >
      <Stack className="notification-setting-sheet">
        <Stack className="main">
          <h3 className="title">Need help & support?</h3>
          <InputStacked className="input-title" placeholder="Name" />
          <InputStacked className="input-title" placeholder="Your email" />
          <InputStacked
            className="input-title"
            placeholder="Choose an option"
          />
          <InputStacked
            className="input-title"
            as="textarea"
            placeholder="Tell us how we can help :)"
          />
        </Stack>
        <Stack className="box-bottom" onClick={handleClose}>
          <ButtonGradient>Send</ButtonGradient>
        </Stack>
      </Stack>
    </ActionSheet>
  );
}

export default HelpSupportSheet;
