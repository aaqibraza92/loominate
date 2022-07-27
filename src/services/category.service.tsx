/* eslint-disable no-throw-literal */
import services, { HandleError, localService, Userservices } from ".";
import api from "../commons/constants/api.constant";
import { PageData } from "../models/page.model";
import utils from "../utils";
import userService from "./user.service";

const getAll = async (tenant :any,params?: any) => {
  try {
    const headersRequest = {
      'Content-Type': 'application/json',
      tenantname: tenant,
    };
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenant}/category/?${utils.objectToQuery(params)}`,
    );
    console.log('url: ', `${api.GATEWAY_BASE_URL}/${tenant}/category/?${utils.objectToQuery(params)}`)
    console.log('getall categories in cat service',rs)
    return rs.data.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const detail = async (tenant: string ,body?: any) => {
  try {
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenant}/category/id?${utils.objectToQuery(body)}`,
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};


const contentByCategory = async (tenant: string ,userId: number, id: number, payload: any) => {
  try {
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenant}/content/user/category/${userId}/${id}/?${utils.objectToQuery(payload)}`,
    );
    console.log('data from bhaskars api', rs)
    return rs.data.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const create = async (body: any) => {
  try {
    // const dataForm = utils.parseFormData(data);
    const rs = await services.post(`${api.GATEWAY_BASE_URL}/category/`, body);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const update = async (data?: any) => {
  try {
    const dataForm = utils.parseFormData(data);
    const rs = await services.put(
      `${api.CATEGORY_DETAIL.replace(":id", data.id)}`,
      dataForm
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const follow = async (id?: string) => {
  try {
    const dataForm = utils.parseFormData({ category_id: id });
    const rs = await services.post(api.CATEGORY_FOLLOW, dataForm);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const unfollow = async (id?: string) => {
  try {
    const dataForm = utils.parseFormData({ category_id: id });
    const rs = await services.delete(api.CATEGORY_UNFOLLOW, {
      data: dataForm,
    });
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const followMany = async (ids?: string[], userId?: any, tenantName?: any) => {
  try {
    const headersRequest = {
      'Content-Type': 'application/json',
      tenantname: tenantName,
    };
    const dataForm = { userId: userId ,categoryIds: ids };
    const rs = await Userservices.post(`/user/addCategory`, dataForm , { headers: headersRequest });
    console.log('rs from add cat', rs)
    return rs;
  } catch (e) {
    throw HandleError(e);
  }
};

const followOne = async (id?: string, userId?: any, tenantName?: any) => {
  try {
    const headersRequest = {
      'Content-Type': 'application/json',
      tenantname: tenantName,
    };
    const dataForm = { userId: userId ,categoryIds: [id] };
    const rs = await Userservices.post(`/user/addCategory`, dataForm , { headers: headersRequest });
    console.log('rs from add cat single', rs)
    return rs;
  } catch (e) {
    throw HandleError(e);
  }
};

const unfollowOne = async (id?: string, userId?: any, tenantName?: any) => {
  try {
    const headersRequest = {
      'Content-Type': 'application/json',
      tenantname: tenantName,
    };
    const dataForm = { userId: userId ,categoryIds: [id] };
    const rs = await Userservices.post(`/user/deleteCategory`, dataForm , { headers: headersRequest });
    console.log('rs from add cat single', rs)
    return rs;
  } catch (e) {
    throw HandleError(e);
  }
};

const unfollowMany = async (ids?: string[], userId?: any, tenantName?: any) => {
  try {
    const headersRequest = {
      'Content-Type': 'application/json',
      tenantname: tenantName,
    };
    const dataForm = { userId: userId ,categoryIds: ids };
    const rs = await Userservices.post(`/user/deleteCategory`, dataForm , { headers: headersRequest });
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const categoryService = {
  getAll,
  detail,
  follow,
  unfollow,
  followMany,
  unfollowMany,
  create,
  update,
  contentByCategory,
  unfollowOne,
  followOne
};
export default categoryService;
