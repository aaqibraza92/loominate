import { Modal, ModalProps, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { use100vh } from "react-div-100vh";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import images from "../../assets/images/images";
import colors from "../../commons/styles/colors";
import Notification from "../../models/notification.model";
import { PageData } from "../../models/page.model";
import User from "../../models/user.model";
import notificationService from "../../services/notification.service";
import IcoMoon from "../icon/IcoMoon";
import NotificationItem from "./NotificationItem";
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
 * ModalConfirm Component
 * @param { Props} props
 * @returns JSX.Element
 */
function NotificationModal(props: Props) {
  const { visible, onClose } = props;
  const [isVisible, setIsVisible] = useState(visible);
  const [loading, setLoading] = useState(true);
  const user: User = useSelector((state: any) => state.auth.user);
  const [dataRequest, setDataRequest] = useState<PageData>({
    page: 1,
    per_page: 10,
    id: user.id
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasLoadMore, setHasLoadMore] = useState(false);
  const height = use100vh();
  const [haftHeight, setHaftHeight] = useState((height || 0) * 0.8);

  const getNotifications = async () => {
    if (dataRequest.page === 1) {
      setLoading(true);
    }

    try {
      const rs = await notificationService.list(dataRequest);
      setHasLoadMore(
        rs.meta.itemCount > notifications.length + rs.data.length
      );
      if (dataRequest.page > 1) {
        setNotifications([...notifications, ...rs.data]);
      } else {
        setNotifications(() => [...rs.data]);
      }

    } catch (error) {}
    setLoading(false);
  };

  useEffect( () =>{
    getNotifications();
  },[])
  useEffect(() => {
    if (visible) {
      getNotifications();
    }
  }, [dataRequest, visible]);

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
   * Handle loadmore
   */
  const onLoadMore = () => {
    dataRequest.page = (dataRequest.page || 1) + 1;
    setDataRequest({
      ...dataRequest,
    });
  };

  return (
    <Modal
      className="notification-modal"
      visible={isVisible}
      centered
      footer={null}
      afterClose={onClose}
      closeIcon={<IcoMoon icon="close" color={colors.mint} size={30} />}
      onCancel={handleCancel}
    >
      <h3 className="text-title">Notifications</h3>
      <Stack id="scrollableNotification" className="notification-list">
        {!loading && notifications.length > 0 && (
          <InfiniteScroll
            dataLength={notifications.length}
            next={onLoadMore}
            hasMore={hasLoadMore}
            loader={<Skeleton avatar paragraph={{ rows: 2 }} />}
            scrollableTarget="scrollableNotification"
          >
            {notifications.map((item) => (
              <NotificationItem key={`${item.id}`} data={item} />
            ))}
          </InfiniteScroll>
        )}
        {!loading && !notifications.length && (
          <Stack className="flex-fill align-items-center justify-content-center">
            <img className="logo-empty" src={images.chatEmpty} />
            <p className="text-empty">
              No notifications found!
              <br />
              Start your post, poll or initiative.
            </p>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}

export default NotificationModal;
