/* eslint-disable no-throw-literal */
import api from "../commons/constants/api.constant";
import { MuteData } from "../models/mute.model";
import { PageData } from "../models/page.model";
import { ReportData } from "../models/report.model";
import { SignInQuery } from "../models/signIn.model";
import {
  SignUpData,
  SignUpQuery,
  SignUpForm,
  GetSecurityCodeForm,
} from "../models/signUp.model";
import utils from "../utils";
import services, {
  activityService,
  contentService,
  HandleError,
  localService,
  Userservices,
} from "./";

// const signIn = async (params?: SignInQuery) => {
//   try {
//     const rs = await services.post(
//       `${api.SIGN_IN}?${utils.objectToQuery(params)}`
//     );
//     return rs.data;
//   } catch (e) {
//     throw HandleError(e);
//   }
// };

const signUp = async (signUpForm: SignUpForm) => {
  try {
    // const form = utils.parseFormData(signUpForm);
    const rs = await services.post(
      `${api.SIGN_UP}`,
      JSON.stringify(signUpForm)
    );

    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const verifyOTP = async (email: string) => {
  try {
    const rs = await services.post(api.VERIFY_CODE, JSON.stringify({ email }));

    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getSecurityCode = async (securityCodeForm: GetSecurityCodeForm) => {
  try {
    const rs = await services.post(
      `${api.GET_SECURITY_CODE}`,
      JSON.stringify({ securityCodeForm })
    );
    console.log("result from sercirty code", rs.data);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getById = async (tenantName: string, id: any) => {
  try {
    console.log("inside user service for get by id");
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/user/${id}`
    );
    console.log("result from getByid", rs.data.userName);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getUser = async (tenant: string, username: any) => {
  try {
    console.log(
      "user url",
      `${api.GATEWAY_BASE_URL}/${tenant}/user/username/${username}`
    );
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenant}/user/username/${username}`
    );
    console.log("from get by username service", rs.data);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getUserById = async (tenant: any, userId: string) => {
  try {
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenant}/user/${userId}`
    );
    console.log("from get by id service", rs.data);
    return rs.data[0];
  } catch (e) {
    throw HandleError(e);
  }
};

const getCountPosts = async (tenant: string, userId: any) => {
  try {
    console.log("tenantname", tenant, userId);
    const headersRequest: any = {
      "Content-Type": "application/json",
      tenantname: tenant,
      query: `{"userId": ${userId}}`,
    };
    const rs = await contentService.get(`/content/count/postsbByParam`, {
      headers: headersRequest,
    });
    console.log("from get count for posts", rs.data.result);
    return rs.data.result;
  } catch (e) {
    console.log("error in count", e);
    throw HandleError(e);
  }
};

const getCountPoll = async (tenant: string, userId: string) => {
  try {
    console.log("tenantname", tenant, userId);
    const headersRequest: any = {
      "Content-Type": "application/json",
      tenantname: tenant,
      query: `{"type": "Poll", "userId": ${userId}}`,
    };
    const rs = await contentService.get(`/content/count/postsbByParam`, {
      headers: headersRequest,
    });
    console.log("from get count for posts", rs.data.result);
    return rs.data.result;
  } catch (e) {
    console.log("error in count", e);
    throw HandleError(e);
  }
};

const getCountInitiative = async (tenant: string, userId: string) => {
  try {
    console.log("tenantname", tenant, userId);
    const headersRequest: any = {
      "Content-Type": "application/json",
      tenantname: tenant,
      query: `{"type": "Initiatives", "userId": ${userId}}`,
    };
    const rs = await contentService.get(`/content/count/postsbByParam`, {
      headers: headersRequest,
    });
    console.log("from get count for posts", rs.data.result);
    return rs.data.result;
  } catch (e) {
    console.log("error in count", e);
    throw HandleError(e);
  }
};

const updateUser = async (tenantName?: string, data?: any) => {
  try {
    const headersRequest: any = {
      "Content-Type": "application/json",
      tenantname: tenantName,
    };
    const rs = await Userservices.put(api.UPDATE_USER, data, {
      headers: headersRequest,
    });
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const recentActivities = async (tenantName?: string, queryParams?: any) => {
  try {
    const rs = await services.get(
      `${
        api.GATEWAY_BASE_URL
      }/${tenantName}/activity/user?${utils.objectToQuery(
        queryParams
      )}`
    );
    // console.log('rs_out', rs.data.data)
    return rs.data.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const updateAvatar = async (id?: string, avatar?: any) => {
  try {
    const dataForm = utils.parseFormData({ avatar });
    const rs = await services.put(
      api.UPDATE_USER.replace(":id", id || ""),
      dataForm
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const removeUser = async (userId?: string) => {
  try {
    const rs = await services.delete(
      api.DELETE_USER.replace(":id", userId || "")
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const blockUser = async (userId?: string) => {
  try {
    const dataForm = utils.parseFormData({ user_id: userId });
    const rs = await services.post(api.BLOCK_USER, dataForm);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const unblockUser = async (userId?: string) => {
  try {
    // const dataForm = utils.parseFormData({ user_id: userId });
    const rs = await services.get(`${api.IS_BLOCKED_USER}/${userId}`, {
      // data: dataForm,
    });
    console.log({ rs });
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getUserByBlockedStatusFlag = async (
  blockerId?: string,
  blockedId?: string
) => {
  try {
    const data = { id: blockerId, idTwo: blockedId };
    const rs = await services.get(
      `${api.IS_BLOCKED_USER}?${utils.objectToQuery(data)}`
    );
    return rs.data.result[0];
  } catch (error) {}
};

const checkSecurityCode = async (userId?: string) => {
  try {
  } catch (e) {
    throw HandleError(e);
  }
};

const blockedUsers = async (data?: PageData) => {
  try {
    const rs = await services.get(
      `${api.BLOCKED_USERS}?${utils.objectToQuery(data)}`
    );
    console.log("data aaya bhai");
    console.log(rs.data.result);
    return rs.data.result;
  } catch (e) {
    throw HandleError(e);
  }
};

const userService = {
  signUp,
  verifyOTP,
  getSecurityCode,
  getUserById,
  getUser,
  updateUser,
  updateAvatar,
  removeUser,
  blockUser,
  unblockUser,
  blockedUsers,
  checkSecurityCode,
  getCountPosts,
  getCountInitiative,
  getCountPoll,
  getById,
  getUserByBlockedStatusFlag,
  recentActivities,
};

export default userService;
