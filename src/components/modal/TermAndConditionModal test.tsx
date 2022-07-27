import { Modal, ModalProps } from "antd";
import { useEffect, useState } from "react";
import TermAndCondition from "../view/TermAndCondition";
import "./styles.scss";

export enum ModalConfirmType {
  Default = "",
  Danger = "danger",
}

interface Props extends ModalProps {
  visible?: boolean;
  onClose?: any;
}

/**
 * ModalConfirm Component
 * @param { Props} props
 * @returns JSX.Element
 */
function TermAndConditionModal(props: Props) {
  const { visible, onClose } = props;
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);
  const handleOk = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleCancel = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <Modal
      className="term-and-condition-modal"
      visible={isVisible}
      centered
      footer={null}
      afterClose={onClose}
      onCancel={handleCancel}
    >
      <p className="c1">
        <span className="c6 c9">TERMS OF SERVICE</span>
      </p>
      <TermAndCondition />
    </Modal>
  );
}

export default TermAndConditionModal;
