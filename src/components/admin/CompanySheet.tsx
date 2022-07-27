import ActionSheet, { ActionSheetRef } from "actionsheet-react";
import { Image, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import { Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Category from "../../models/category.model";
import Company from "../../models/company.model";
import InviteAdmin from "../../pages/admin/InviteAdmin";
import companyService from "../../services/company.service";
import ButtonGradient from "../button/ButtonGradient";
import IcoMoon from "../icon/IcoMoon";
import InputStacked from "../input/InputStacked";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  open?: boolean;
  onClose?: any;
  data?: Company;
  onUpdated?: any;
  onCreated?: any;
}

const dataDefault: Category = {
  title: "",
};

/**
 * CompanySheet Component
 * @param props
 * @returns JSX.Element
 */
function CompanySheet(props: Props) {
  const dispatch = useDispatch();
  const ref: any = useRef<ActionSheetRef>();
  const { containerStyle, open, onClose, data, onUpdated, onCreated } = props;
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<any>(data?.logo?.url);
  const [isEdit, setIsEdit] = useState(!!data?.id);
  const [dataRequest, setDataRequest] = useState<Company>({
    ...data,
  });
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: data,
  });

  useEffect(() => {
    register("name", {
      required: {
        value: true,
        message: "Name is required",
      },
    });
    register("domain", {
      required: {
        value: true,
        message: "Domain is required",
      },
    });
    register("industry", {
      required: {
        value: true,
        message: "Industry is required",
      },
    });
    // register("logo", {
    //   required: {
    //     value: true,
    //     message: "Logo is required",
    //   },
    // });
  }, [register]);

  useEffect(() => {
    setDataRequest({ ...data });
    setPreviewImage(data?.logo?.url);
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

  /**
   * Handle input change
   * @param {React.ChangeEventHandler} ChangeEventHandler
   */
  const onDataChange = (e: any) => {
    setValue(e.target.name, e.target.value, { shouldValidate: true });
    setDataRequest({
      ...dataRequest,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle File Change
   * @param {any} FileInfo
   */
  const handleFileChange = (info: any) => {
    if (!info.file) return;
    const file = info.file;
    setValue("logo", file.originFileObj);
    setPreviewImage(URL.createObjectURL(file.originFileObj));
  };

  const onSubmit = async (e: any) => {
    setLoading(true);
    try {
      if (data) {
        if (e.logo?.url) e.logo = null;
        const rs = await companyService.update(e);
        if (onUpdated) onUpdated(rs.companies);
        onSheetClose();
      } else {
        e.is_publish = true;
        e.is_system = false;
        const rs = await companyService.create(e);
        if (onCreated) onCreated(rs.companies);
        onSheetClose();
      }
    } catch (error) {}
    setLoading(false);
  };

  return (
    <ActionSheet
      ref={ref}
      onClose={onSheetClose}
      mouseEnable={false}
      touchEnable={false}
    >

      <Stack className="company-sheet">
        <Stack className="main">
          <h3 className="title">Set up company space</h3>
          <InputStacked
            label="Company Name"
            name="name"
            value={dataRequest.name}
            onChange={onDataChange}
            errors={errors}
          />
          <InputStacked
            label="Domain"
            name="domain"
            value={dataRequest.domain}
            onChange={onDataChange}
            errors={errors}
          />
          <InputStacked
            label="Industry"
            name="industry"
            value={dataRequest.industry}
            onChange={onDataChange}
            errors={errors}
          />
          <p>Upload Company Logo</p>
          {!!previewImage && (
            <Image
              height={100}
              width={100}
              src={previewImage}
              className="mb-2"
            />
          )}
          <Upload
            onChange={handleFileChange}
            accept="image/png,image/jpeg"
            maxCount={1}
            fileList={[]}
          >
            <button className="btn btn-upload mt-2">
              <IcoMoon icon="upload" size={25} color="#fff" />
            </button>
          </Upload>
        </Stack>
        <Stack className="box-bottom" onClick={handleSubmit(onSubmit)}>
          <ButtonGradient loading={loading}>Save</ButtonGradient>
        </Stack>
      </Stack>
    </ActionSheet>
  );
}

export default CompanySheet;
