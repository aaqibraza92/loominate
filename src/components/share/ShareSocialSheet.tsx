import ActionSheet, { ActionSheetRef } from "actionsheet-react";
import { Space } from "antd";
import { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrIcon, TumblrShareButton, TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from "react-share";
import colors from "../../commons/styles/colors";
import IcoMoon from "../icon/IcoMoon";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  open?: boolean;
  data?: any;
  url?: string;
  onClose?: any;
}

/**
 * ReportUserSheet Component
 * @param props
 * @returns JSX.Element
 */
function ShareSocialSheet(props: Props) {
  const dispatch = useDispatch();
  const ref: any = useRef<ActionSheetRef>();
  const { containerStyle, open, onClose, url = "" } = props;
  const [dataRequest, setDataRequest] = useState<any>({});
  const [reportSelected, setReportSelected] = useState("");
  const [dialogSuccess, setDialogSuccess] = useState(false);

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
    onSheetClose()
  };

  /**
   * Handle ActionSheet Close
   */
  const onSheetClose = () => {
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  const onReportSelect = (id: any) => {
    setReportSelected(id);
  };

  const onSubmit = () => {
    setDialogSuccess(true);
  };

  return (
    <ActionSheet
      ref={ref}
      onClose={onSheetClose}
      mouseEnable={false}
      touchEnable={false}
    >
      <Stack className="share-social-sheet">
        <Stack direction="horizontal">
          <Stack>
            <h6>Share post</h6>
            <p>Loominate</p>
          </Stack>
          <button className="btn" onClick={handleClose}>
            <IcoMoon icon="close" color={colors.mint} />
          </button>
        </Stack>
        <Space direction="horizontal">
          <FacebookShareButton url={url}>
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
          <FacebookMessengerShareButton url={url} appId="">
            <FacebookMessengerIcon size={32} round={true} />
          </FacebookMessengerShareButton>
          <TelegramShareButton url={url}>
            <TelegramIcon size={32} round={true} />
          </TelegramShareButton>
          <TwitterShareButton url={url}>
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
          <WhatsappShareButton url={url}>
            <WhatsappIcon size={32} round={true} />
          </WhatsappShareButton>
          <LineShareButton url={url}>
            <LineIcon size={32} round={true} />
          </LineShareButton>
          <EmailShareButton url={url}>
            <EmailIcon size={32} round={true} />
          </EmailShareButton>

          <LinkedinShareButton url={url}>
            <LinkedinIcon size={32} round={true} />
          </LinkedinShareButton>
          {/* <TumblrShareButton url={url}>
            <TumblrIcon size={32} round={true} />
          </TumblrShareButton> */}
        </Space>
      </Stack>
    </ActionSheet>
  );
}

export default ShareSocialSheet;
