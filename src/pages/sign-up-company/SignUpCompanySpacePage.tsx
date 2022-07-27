import { Upload } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Stack from "react-bootstrap/Stack";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import images from "../../assets/images/images";
import routes from "../../commons/constants/routes.constant";
import ButtonGradient from "../../components/button/ButtonGradient";
import IcoMoon from "../../components/icon/IcoMoon";
import InputStacked from "../../components/input/InputStacked";
import { SignUpCompanyData } from "../../models/signUp.model";
import signUpAction from "../../redux/actions/signUp.action";
import companyService from "../../services/company.service";
import "./styles.scss";

/**
 * SignUpCompanySpace Page
 * @param {any} props
 * @returns {any}
 */
function SignUpCompanySpacePage(props: any) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { domain } = useSelector((state: any) => state.signUp);
  const {
    register,
    unregister,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [error, setError] = useState<any>("");

  useEffect(() => {
    // if (!domain) {
    //   history.replace(routes.SignInPage);
    //   return;
    // }
    register("name", {
      required: {
        value: true,
        message: "Company Name is required",
      },
    });
    register("industry", {
      required: {
        value: true,
        message: "Industry is required",
      },
    });
  }, []);

  /**
   * Handle input change
   * @param {React.ChangeEventHandler} ChangeEventHandler
   */
  const handleTextChange = (e: any) => {
    setValue(e.target.name, e.target.value, { shouldValidate: true });
  };

  /**
   * Handle File Change
   * @param {any} FileInfo
   */
  const handleFileChange = (info: any) => {
    if (!info.file) return;
    const file = info.file;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return setError(`${file.name} is not a image file`);
    }
  };

  /**
   * Handle submit
   * @param e
   */
  const onSubmit = async (e: any) => {
    setError("");
    try {
      const data: SignUpCompanyData = { ...e, domain };
      console.log(data);
      await companyService.signUp(data);
      history.push(routes.SignUpCompanyInvitePage);
      dispatch(signUpAction.clearData());
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="steps">
    <Container fluid className="sign-up-company-space m-screen">
      <Row>
          <Col xl={6}>
          <Stack className="v-head align-items-center justify-content-center">
          <img src={images.MonsterCompany} />
          </Stack>
          </Col>
          <Col xl={6}>

          <div className="card">
        <h3>Set up your company space</h3>
        {!!error && <p className="text-error">{error}</p>}
        <InputStacked
          name="name"
          label="Company Name"
          placeholder=""
          onChange={handleTextChange}
          error={errors.name}
        />
        <InputStacked
          name="domain"
          label="Email Domain (for e.g  google.com)"
          placeholder=""
          onChange={handleTextChange}
          error={errors.name}
        />
        <div className="select-group"><label htmlFor="industry">Industry</label>
        <Form.Select className="" id="industry" name="industry" aria-label="Default select example">
          <option>Select an industry</option>
          <option value="1">BANKING & FINANCIAL SERVICES</option>
          <option value="2">BARS & RESTAURANTS</option>
          <option value="3">BEER, WINE & LIQUOR</option>
        </Form.Select>
        </div>
        <br />
        <p>Upload Company Logo</p>
        <Upload
          onChange={handleFileChange}
          accept="image/png,image/jpeg"
          maxCount={1}
          fileList={[]}
        >
          <Button className="upload-icon">
            <IcoMoon icon="upload" size={20} />
          </Button>
        </Upload>
        <div className="v-btn d-grid mt-3">
          <ButtonGradient
            text="CONFIRM"
            style={{ marginBottom: 16 }}
            onClick={handleSubmit(onSubmit)}
          />
        </div> 
      </div>
          </Col>
      </Row>
    </Container>
    </div>
  );
}

export default SignUpCompanySpacePage;
