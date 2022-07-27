import { LoadingOutlined } from "@ant-design/icons";
import ActionSheet, { ActionSheetRef } from "actionsheet-react";
import { Image, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Category from "../../models/category.model";
import categoryService from "../../services/category.service";
import IcoMoon from "../icon/IcoMoon";
import InputStacked from "../input/InputStacked";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  type?: any;
  open?: boolean;
  categories?: any[];
  onClose?: any;
  data?: any;
  onSuccess?: any;
}

const dataDefault: Category = {
  title: "",
};

/**
 * AddCategorySheet Component
 * @param props
 * @returns JSX.Element
 */
function AddCategorySheet(props: Props) {
  const dispatch = useDispatch();
  const ref: any = useRef<ActionSheetRef>();
  const { containerStyle, open, onClose, data, onSuccess, categories } = props;
  const [dataRequest, setDataRequest] = useState<any>({
    ...dataDefault,
    ...data,
  });
  const [previewImage, setPreviewImage] = useState<any>();
  const [loading, setLoading] = useState(false);

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues: data });

  useEffect(() => {
    if (open) {
      handleOpen();
    } else {
      handleClose();
    }
  }, [open]);

  useEffect(() => {
    register("name", {
      required: {
        value: true,
        message: "Name is required",
      },
      validate: (value: any) => {
        return !!categories?.find((x) => x.name == value)
          ? "Category is existed!"
          : true;
      },
    });
    register("logo", {
      required: {
        value: true,
        message: "Logo is required",
      },
    });
  }, [register]);

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
    ref.current.close();
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  const onDataChange = (e: any) => {
    setValue(e.target.name, e.target.value, { shouldValidate: true });
    setDataRequest({
      ...dataRequest,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle file change
   * @param {any} FileInfo
   */
  const handleFileChange = (info: any) => {
    if (!info.file) return;
    const file = info.file.originFileObj;
    setValue("logo", file, { shouldValidate: true });
    setPreviewImage(URL.createObjectURL(file));
    setDataRequest({
      ...dataRequest,
      image: file,
    });
  };
  const removeImage = () => {
    setPreviewImage(undefined);
    setDataRequest({
      ...dataRequest,
      image: null,
    });
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const tenantName = localStorage.getItem('tenantName')
      let body: any = {}
      body.tenant = tenantName;
      body.title = dataRequest.name;
      console.log('datarequest.title', body, 'datarequest', dataRequest)
      const rs = await categoryService.create(body);
      console.log('result from add categories', rs.result)
      onSheetClose();
      if (onSuccess) onSuccess(rs.result);
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
      <Stack className="add-category-sheet">
        <h3>Add New Category</h3>
        {!!previewImage && (
          <Stack direction="horizontal" className="mt-2 mb-2 align-items-start">
            <Image height={100} width={100} src={previewImage} />
            <button className="btn" onClick={removeImage}>
              <IcoMoon icon="close" />
            </button>
          </Stack>
        )}
        {errors.logo && (
          <span className="text-error">{errors.logo.message}</span>
        )}
        <Stack direction="horizontal" className="align-items-start">
          <InputStacked
            name="name"
            placeholder="What’s your new category called?"
            containerClass="flex-fill me-3"
            onChange={onDataChange}
            errors={errors}
          />
          <Upload
            accept="image/png,image/jpeg"
            maxCount={1}
            fileList={[]}
            onChange={handleFileChange}
          >
            <button className="btn">
              <IcoMoon icon="image" size={20} />
            </button>
          </Upload>
          <Button
            className="btn-send ms-auto"
            onClick={handleSubmit(onSubmit)}
            disabled={!dataRequest.name}
          >
            {!loading && <IcoMoon icon="send" size={20} color="#fff" />}
            {loading && (
              <LoadingOutlined style={{ fontSize: 18, marginLeft: 8 }} />
            )}
          </Button>
        </Stack>
      </Stack>
    </ActionSheet>
  );
}

export default AddCategorySheet;
