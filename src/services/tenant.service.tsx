/* eslint-disable no-throw-literal */
import services, { HandleError, tenantServices } from ".";
import api from "../commons/constants/api.constant";
import utils from "../utils";



const tenantData = async (_tenantName?: string) => {
  try {
    console.log('tenant inside tenat', _tenantName)
    const rs = await tenantServices.get(`${api.TENANT}/${_tenantName}`);
    console.log('res in get tenant',rs)
    return rs.data[0];
  } catch (e) {
    console.log('error in get tenant',e)
    throw HandleError(e);
  }
};


const tenantService = {
    tenantData,
};
export default tenantService;
