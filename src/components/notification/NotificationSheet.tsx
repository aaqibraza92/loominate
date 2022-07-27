import ActionSheet, { ActionSheetRef } from "actionsheet-react";
import { Switch } from "antd";
import { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Category from "../../models/category.model";
import User from "../../models/user.model";
import authAction from "../../redux/actions/auth.action";
import userService from "../../services/user.service";
import ButtonGradient from "../button/ButtonGradient";
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
 * NotificationSheet Component
 * @param props
 * @returns JSX.Element
 */
function NotificationSheet(props: Props) {
  const dispatch = useDispatch();
  const ref: any = useRef<ActionSheetRef>();
  const { containerStyle, open, onClose } = props;
  const user: User = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [allowNotify, setAllowNotify] = useState(user?.enable_notification);

  useEffect(() => {
    if (open) {
      handleOpen();
    } else {
      handleClose();
    }
  }, [open]);

  useEffect(() => {}, []);

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

  const onSwitchNotification = async (v: any) => {
    try {
      setAllowNotify(v);
      const rs = await userService.updateUser(user.id, {
        enable_notification: v,
      });
      dispatch(authAction.updateUser(rs.user));
    } catch (error) {
      setAllowNotify(!v);
    }
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
          <h3 className="title">Turn on Push Notifications?</h3>
          <p className="description">
            To get notifcations from{" "}
            <span className="highlight">Loominate</span> notifcations, you’ll
            need to turn them on in your IOS Settings. Here’s how:
          </p>
          <Stack direction="vertical" className="steps">
            <p>1. Tap 'Notifications'</p>
            <p>
              2. Turn on{" "}
              <Switch
                size="small"
                checked={allowNotify}
                onChange={onSwitchNotification}
              />{" "}
              'Allow Notifications' on
            </p>
          </Stack>
        </Stack>
        <Stack className="box-bottom" onClick={handleClose}>
          <ButtonGradient>BACK TO SETTINGS</ButtonGradient>
        </Stack>
      </Stack>
    </ActionSheet>
  );
}

export default NotificationSheet;
