/* eslint-disable no-throw-literal */
import services, { HandleError } from ".";
import api from "../commons/constants/api.constant";
import utils from "../utils";



const signUp = async (data?: any) => {
  try {
    const dataForm = utils.parseFormData(data);
    const rs = await services.post(`${api.SIGN_UP}`, dataForm);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const verify = async (data?: any) => {
    try {
      const dataForm = utils.parseFormData(data);
      const rs = await services.post(`${api.VERIFY_CODE}`, data);
      return rs;
    } catch (e) {
      throw HandleError(e);
    }
  };



const signUpService = {
    signUp,
    verify
};
export default signUpService;
