import { Checkbox, Modal, ModalProps } from "antd";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import Div100vh from "react-div-100vh";
import { useDispatch, useSelector } from "react-redux";
import images from "../../assets/images/images";
import User from "../../models/user.model";
import authAction from "../../redux/actions/auth.action";
import userService from "../../services/user.service";
import ButtonGradient from "../button/ButtonGradient";
import TermAndCondition from "../view/TermAndCondition";
import "./styles.scss";

interface Props extends ModalProps {
  visible?: boolean;
  loading?: boolean;
  selected?: any;
  onClose?: any;
}

/**
 * CategorySelectModal Component
 * @param { Props} props
 * @returns JSX.Element
 */
function CompanyGuideModal(props: Props) {
  const { visible, onClose } = props;
  const user: User = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleCancel = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleAgree = async () => {
    handleCancel();
    try {
      if (!user?.agreed_community_guidelines) {
        const rs = await userService.updateUser(user.id, {
          agreed_community_guidelines: true,
        });
        dispatch(authAction.updateUser(rs.user));
      }
    } catch (error) {}
  };

  return (
    <Modal
      className="company-guide-modal"
      zIndex={1200}
      visible={isVisible}
      centered
      closable={false}
      footer={null}
      afterClose={onClose}
      onCancel={handleCancel}
    >
      <Div100vh>
        <Stack className="v-head align-items-center justify-content-center">
          <img src={images.banderGuide} />
        </Stack>
        <div className="card">
          <h3 className="text-title">Terms of Use</h3>
          <TermAndCondition />
        </div>
        <Stack className="box-bottom" >
          <div className="mb-3">
            <Checkbox
            // checked={user.agreed_terms_of_use}
            // onChange={() => setAgreeTerm(!agreeTerm)}

          >
            I’ve read and agree with the Terms of Use
          </Checkbox>
          </div>
          
          <ButtonGradient onClick={handleAgree}>I UNDERSTAND THE TERMS OF USE</ButtonGradient>
        </Stack>
      </Div100vh>
    </Modal>
  );
}

export default CompanyGuideModal;
