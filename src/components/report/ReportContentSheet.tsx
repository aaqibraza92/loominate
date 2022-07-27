import { ExclamationOutlined } from "@ant-design/icons";
import ActionSheet, { ActionSheetRef } from "actionsheet-react";
import { Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRecoilState } from "recoil";
import { brotliCompressSync } from "zlib";
import { flagFeedUpdate } from "../../atoms/globalStates";
import Post, { PostType } from "../../models/post.model";
import { ReportData } from "../../models/report.model";
import postAction from "../../redux/actions/post.action";
import reportService from "../../services/report.service";
import ButtonGradient from "../button/ButtonGradient";
import ModalConfirm from "../modal/ModalConfirm";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  type?: any;
  open?: boolean;
  onClose?: any;
  data?: any;
}

const REPORT_OPTIONS = [
  {
    id: "1",
    title: "Professionally irrelevant or spam",
    message: "User repeatedly publishes and spams feeds with the same...",
  },
  {
    id: "2",
    title: "Excessive vulgarity",
    message: "User is repeatedly using  rude and offensive words. ",
  },
  {
    id: "3",
    title: "Slur or stereotype",
    message: "User uses socially and/or culturally sensitive content such...",
  },
];

/**
 * ReportContentSheet Component
 * @param props
 * @returns JSX.Element
 */
function ReportContentSheet(props: Props) {
  const dispatch = useDispatch();
  const ref: any = useRef<ActionSheetRef>();
  const { type = PostType.Post, containerStyle, open, onClose, data } = props;
  const [reportSelected, setReportSelected] = useState("");
  const [dialogSuccess, setDialogSuccess] = useState(false);
  const [flag_feed, setFlag_feed] = useRecoilState(flagFeedUpdate);
  const [dataRequest, setDataRequest] = useState<ReportData>({
    // report_user_id: data?.user?.id,
    post_id: data?.id,
    why: "",
  });
  const user: any = useSelector((state: any) => state.auth.user);

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
  };

  /**
   * Handle ActionSheet Close
   */
  const onSheetClose = () => {
    handleClose();
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  const onReportSelect = (option: any) => {
    setReportSelected(option.id);
    setDataRequest({
      ...dataRequest,
      why: option.title,
    });
  };

  const onTextChange = (e: any) => {
    setDataRequest({
      ...dataRequest,
      why: e.target.value,
    });
  };

  const onSubmit = async () => {
 
    try {
      console.log('data from on submit report',data);
      // let data: any = {}
      let tenantName = localStorage.getItem('tenantName');
      data.userId = data.user.id;
      data.id = dataRequest.post_id;
      data.tenant = tenantName;
      data.isReported = true;
      data.reportData = {};
      data.reportData.userId = user.id;
      data.reportData.contentId = dataRequest.post_id;
      data.reportData.message = dataRequest.why;
      const contentResult = await reportService.send(data);
      // data.title = 'testupdate90'
      setFlag_feed(!flag_feed)
      console.log('update data result', contentResult,flag_feed)
      // dispatch(postAction.update(data))
      setDialogSuccess(true);
      return true
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ActionSheet
      ref={ref}
      onClose={onSheetClose}
      mouseEnable={false}
      touchEnable={false}
    >
      <Stack className="report-user-sheet">
        <Stack
          direction="horizontal"
          className="v-title align-items-center mb-3"
          gap={2}
        >
          <div className="icon-danger">
            <ExclamationOutlined style={{ fontSize: 16, color: "#fff" }} />
          </div>
          <h3>Help us understand</h3>
        </Stack>
        <p>Why are you reporting this content?</p>
        <Stack direction="vertical" className="" gap={3}>
          {REPORT_OPTIONS.map((item, index) => (
            <button
              key={`rp-${index}`}
              className={`btn btn-item ${
                reportSelected === item.id && "active"
              }`}
              onClick={onReportSelect.bind(null, item)}
            >
              <p className="title">{item.title}</p>
              <p className="message">{item.message}</p>
            </button>
          ))}
        </Stack>
        <div className="box-other">
          <p className="title">Other</p>
          <Input.TextArea placeholder="Type your reason here" name="why" onChange={onTextChange} />
        </div>
        <ButtonGradient onClick={onSubmit}>SUBMIT REPORT</ButtonGradient>
      </Stack>
      <ModalConfirm
        visible={dialogSuccess}
        message="Thank you for reporting this post"
        cancelText={null}
        onOk={() => {
          setDialogSuccess(false);
          onSheetClose();
        }}
      />
    </ActionSheet>
  );
}

export default ReportContentSheet;
