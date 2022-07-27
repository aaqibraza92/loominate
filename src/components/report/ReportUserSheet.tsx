import { ExclamationOutlined } from "@ant-design/icons";
import ActionSheet, { ActionSheetRef } from "actionsheet-react";
import { Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { PostType } from "../../models/post.model";
import { ReportData } from "../../models/report.model";
import User from "../../models/user.model";
import reportService from "../../services/report.service";
import ButtonGradient from "../button/ButtonGradient";
import ModalConfirm from "../modal/ModalConfirm";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  type?: any;
  open?: boolean;
  onClose?: any;
  data?: User;
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
 * ReportUserSheet Component
 * @param props
 * @returns JSX.Element
 */
function ReportUserSheet(props: Props) {
  const dispatch = useDispatch();
  const ref: any = useRef<ActionSheetRef>();
  const { type = PostType.Post, containerStyle, open, onClose, data } = props;
  const [user, setUser] = useState<User>({ ...data });
  const [dataRequest, setDataRequest] = useState<ReportData>({
    report_user_id: user.id,
    why: "",
  });
  const [reportSelected, setReportSelected] = useState("");
  const [dialogSuccess, setDialogSuccess] = useState(false);

  useEffect(() => {
    setUser({ ...data });
  }, [data]);

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
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  /**
   * Handle ActionSheet Close
   */
  const onSheetClose = () => {
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
      await reportService.send(dataRequest);
      setDialogSuccess(true);
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
        <p>Why are you reporting this user?</p>
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
          <Input.TextArea
            placeholder="Type your reason here"
            name="why"
            onChange={onTextChange}
          />
        </div>
        <ButtonGradient onClick={onSubmit}>SUBMIT REPORT2</ButtonGradient>
      </Stack>
      <ModalConfirm
        visible={dialogSuccess}
        message="Thank you for reporting this user"
        cancelText={null}
        onOk={() => {
          setDialogSuccess(false);
          handleClose();
        }}
      />
    </ActionSheet>
  );
}

export default ReportUserSheet;
