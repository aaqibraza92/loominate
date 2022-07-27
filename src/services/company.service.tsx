/* eslint-disable no-throw-literal */
import services, { HandleError } from ".";
import api from "../commons/constants/api.constant";
import Company, { CompanyFilter } from "../models/company.model";
import { SignUpCompanyData } from "../models/signUp.model";
import utils from "../utils";

const signUp = async (data?: SignUpCompanyData) => {
  try {
    const dataForm = utils.parseFormData(data);
    const rs = await services.post(`${api.COMPANY_SIGN_UP}`, dataForm);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getAll = async (params?: CompanyFilter) => {
  try {
    const rs = await services.get(
      `${api.COMPANY_GET_LIST}?${utils.objectToQuery(params)}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const create = async (data?: Company) => {
  try {
    const dataForm = utils.parseFormData(data);
    const rs = await services.post(`${api.COMPANY_SIGN_UP}`, dataForm);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const update = async (data?: Company) => {
  try {
    const dataForm = utils.parseFormData(data);
    const rs = await services.put(
      `${api.COMPANY_UPDATE.replace(":id", data?.id || '')}`,
      dataForm
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const companyService = {
  signUp,
  getAll,
  create,
  update
};
export default companyService;
