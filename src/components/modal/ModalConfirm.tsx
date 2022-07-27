import { ExclamationOutlined } from "@ant-design/icons";
import { Modal, ModalProps } from "antd";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import IcoMoon from "../icon/IcoMoon";
import "./styles.scss";

export enum ModalConfirmType {
  Default = "",
  Danger = "danger",
}

interface Props extends ModalProps {
  visible?: boolean;
  type?: ModalConfirmType;
  icon?: string;
  message?: any;
  loading?: boolean;
  renderIcon?: any;
  renderContent?: any;
  btnOkDisabled?: any;
  zIndex?: number;
}

/**
 * ModalConfirm Component
 * @param { Props} props
 * @returns JSX.Element
 */
function ModalConfirm(props: Props) {
  const {
    visible,
    zIndex = 1100,
    message,
    type,
    okText = "OK",
    cancelText = "Cancel",
    icon = "check",
    renderIcon,
    renderContent,
    btnOkDisabled = false,
  } = props;
  const [modalShow, setModalShow] = useState(visible);
  useEffect(() => {
    setModalShow(visible);
  }, [visible]);
  const {
    /**
     * Set default event
     */
    onCancel = () => {
      setModalShow(false);
    },

    /**
     * Set default event
     */
    onOk = () => {
      setModalShow(false);
    },
  } = props;

  return (
    <Modal
      width="80vw"
      style={{ maxWidth: 500 }}
      zIndex={zIndex}
      centered
      visible={modalShow}
      closable={false}
      className="app-modal-confirm"
      footer={null}
      destroyOnClose={true}
    >
      <Stack className="align-items-center v-body">
        {!renderIcon && (
          <div
            className={`v-icon ${type === ModalConfirmType.Danger && "danger"}`}
          >
            {type === ModalConfirmType.Danger && (
              <ExclamationOutlined style={{ fontSize: 20, color: "#fff" }} />
            )}
            {!type && <IcoMoon icon={icon} size={24} color="#fff" />}
          </div>
        )}
        {!!renderIcon && renderIcon}
        {!!message && <p className="mt-3 message">{message}</p>}
        {renderContent}
      </Stack>
      <Stack direction="horizontal" className="v-footer">
        {!!cancelText && (
          <button className="btn flex-fill" onClick={onCancel}>
            {cancelText}
          </button>
        )}
        {!!okText && (
          <button
            className="btn btn-ok flex-fill"
            onClick={onOk}
            disabled={btnOkDisabled}
          >
            {okText}
          </button>
        )}
      </Stack>
    </Modal>
  );
}

export default ModalConfirm;
