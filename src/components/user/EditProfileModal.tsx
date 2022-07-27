import { Avatar, Modal, ModalProps, Upload } from "antd";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRecoilState } from "recoil";
import images from "../../assets/images/images";
import { tenantNameState } from "../../atoms/globalStates";
import colors from "../../commons/styles/colors";
import Notification from "../../models/notification.model";
import User from "../../models/user.model";
import authAction from "../../redux/actions/auth.action";
import uploadService from "../../services/upload.service";
import userService from "../../services/user.service";
import ButtonGradient from "../button/ButtonGradient";
import IcoMoon from "../icon/IcoMoon";
import InputStacked from "../input/InputStacked";
import "./styles.scss";

export enum ModalConfirmType {
  Default = "",
  Danger = "danger",
}

interface Props extends ModalProps {
  visible?: boolean;
  type?: ModalConfirmType;
  icon?: string;
  message?: string;
  loading?: boolean;
  onClose?: any;
}

/**
 * EditProfileModal Component
 * @param { Props} props
 * @returns JSX.Element
 */
function EditProfileModal(props: Props) {
  const { visible, onClose } = props;
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(visible);
  const [loading, setLoading] = useState(false);
  const user: User = useSelector((state: any) => state.auth.user);
  const [dataRequest, setDataRequest] = useState<User>({
    avatar: user?.avatar,
    avatar_key: user?.avatar_key,
    description: user.description,
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<any>(user?.avatarLink);
  const [avatarSelected, setAvatarSelected] = useState<any>(
    user?.avatarLink ? undefined : user?.avatar
  );

  useEffect(() => {}, []);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleOk = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 200);
  };

  /**
   * Handle file change
   * @param {any} FileInfo
   */
  const uploadImage = async (options: any) => {
    const { onSuccess, onError, file } = options;
    try {
      //Todo : Upload to aws
      console.log(file.uid);
      console.log("file info")
      console.log("inside uploading profile page")
      uploadService.uploadFile(file).then((res) => {
        console.log({ res });
        setDataRequest({
          ...dataRequest,
          avatarLink: res,
        });
      });

      onSuccess("Ok");
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const handleAvatarChange = async (info: any) => {
    const file = info.file.originFileObj;
    console.log("edit profile avatar")
    setPreviewAvatar(URL.createObjectURL(file));
    setAvatarSelected(undefined);
    setDataRequest({
      ...dataRequest,
      avatar: undefined,
    });
  };

  const onAvatarSelect = (index: number) => {
    console.log("avatar selecting");
    const avatar: any = `avatar${index}`;
    setAvatarSelected(`avatar${index}`);
    setPreviewAvatar(undefined);
    setDataRequest({
      ...dataRequest,
      avatar: avatar,
    });
  };

  /**
   * Handle input change
   * @param {React.ChangeEventHandler} ChangeEventHandler
   */
  const onDataChange = (e: any) => {
    setDataRequest({
      ...dataRequest,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const body: any = {};
      if (dataRequest.avatarLink) {
        body.avatarLink = dataRequest.avatarLink;
        body.avatar = null;
      }
      if (dataRequest.description) {
        body.aboutMe = dataRequest.description;
      }
      if(dataRequest.avatar){
        body.avatar = dataRequest.avatar;
        body.avatarLink = null;
      }
      body.id = user.id;
      console.log("body", body);
      const tenantName: any = localStorage.getItem("tenantName");
      console.log({body})
      const rs = await userService.updateUser(tenantName, body);
      console.log("response from update", rs);
      dispatch(authAction.updateUser(rs));
      handleCancel();
    } catch (error) {}
    setLoading(false);
  };

  return (
    <Modal
      className="edit-profile-modal"
      visible={isVisible}
      centered
      footer={null}
      afterClose={onClose}
      closeIcon={<IcoMoon icon="close" color={colors.mint} size={30} />}
      onCancel={handleCancel}
    >
      <Stack direction="vertical" className="align-items-center">
        <Stack direction="horizontal" gap={2} className="align-self-center">
          <Upload
            customRequest={uploadImage}
            className="box-avatar"
            accept="image/jpeg,image/png"
            maxCount={1}
            fileList={[]}
            onChange={handleAvatarChange}
          >
            <Avatar
              src={
                previewAvatar ||
                images.AVATAR_KEYS[dataRequest?.avatar || "avatar1"]
              }
              size={100}
              className="v-avatar"
            />
            {/* {loading && (
              <div className="box-loading">
                <LoadingOutlined
                  style={{ fontSize: 30, color: colors.mint }}
                  spin
                />
              </div>
            )} */}
            <button className="btn btn-edit">
              <IcoMoon icon="edit" color={colors.primary} />
            </button>
          </Upload>
        </Stack>
        <Stack>
          <p className="text-header-avatar">Choose an avatar</p>
          <div className="box-avatar-list">
            {images.AVATARS.map((image: any, i) => (
              <div className="avatar-item">
                <label
                  className={`${
                    avatarSelected === `avatar${i + 1}` && "selected"
                  }`}
                >
                  <img
                    src={image}
                    alt={`avatar${i}`}
                    onClick={onAvatarSelect.bind(null, i + 1)}
                  />
                </label>
              </div>
            ))}
          </div>
        </Stack>
        <Stack className="p-3">
          <span>{`${dataRequest?.description?.length || 0}/300`}</span>
          <InputStacked
            name="description"
            className="description"
            as="textarea"
            placeholder={user.aboutMe ? user.aboutMe : "Write About Yourself"}
            defaultValue={user.aboutMe || ''}
            maxLength={300}
            value={dataRequest.description}
            onChange={onDataChange}
          />
          <ButtonGradient loading={loading} onClick={onSubmit}>
            Save
          </ButtonGradient>
        </Stack>
      </Stack>
    </Modal>
  );
}

export default EditProfileModal;
