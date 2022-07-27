import ActionSheet, { ActionSheetRef } from "actionsheet-react";
import { useEffect, useRef, useState } from "react";
import { Dropdown, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Category from "../../models/category.model";
import Company from "../../models/company.model";
import InviteAdmin from "./InviteAdmin";
import companyService from "../../services/company.service";
import "./styles.scss";

interface Props {
  containerStyle?: any;
  open?: boolean;
  onClose?: any;
  data?: Company;
  onUpdated?: any;
  onCreated?: any;
  isModerate?: boolean;

}

const dataDefault: Category = {
  title: "",
};

/**
 * CompanySheet Component
 * @param props
 * @returns JSX.Element
 */
function InviteAdminMod(props: Props) {


  
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

  const [okClose,setOkClose]=useState(false);

  const handleOkClick=()=>{

  }
  const getOkClick=(val: any)=>{
    if(val===true){
      onSheetClose();
    }
  }

  

    
  

  return (
    <ActionSheet
      ref={ref}
      onClose={onSheetClose}
      mouseEnable={false}
      touchEnable={false}
    >
      
      <Dropdown.Item
        href="#"
        style={{ padding: "20px"}}
      >
        <InviteAdmin ifClick={getOkClick} />
      </Dropdown.Item>
    </ActionSheet>
  );
}

export default InviteAdminMod;
