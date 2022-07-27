/* eslint-disable no-throw-literal */
import services, { HandleError } from ".";
import api from "../commons/constants/api.constant";
import { MuteData } from "../models/mute.model";
import { PageData } from "../models/page.model";
import Post from "../models/post.model";
import { ReportData } from "../models/report.model";
import utils from "../utils";

const send = async (data?: ReportData) => {
  try {
    // const dataForm = utils.parseFormData(data);
    console.log('to be updated data', data )
    const rs = await services.post(api.PUT, data);
    console.log('result from contentUpdate', rs.data.result)
    return rs.data.result;
  } catch (e) {
    throw HandleError(e);
  }
};

const getAnalytics = async (data?: any) => {
  try {
    const rs = await services.get(
      `${api.REPORT_GET_ANALYTICS}?${utils.objectToQuery(data)}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getPosts = async (data?: PageData) => {
  try {
    const rs = await services.get(
      `${api.REPORT_GET_POSTS}?${utils.objectToQuery(data)}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getHiddenPosts = async (data?: PageData) => {
  try {
    const rs = await services.get(
      `${api.REPORT_GET_HIDDEN_POSTS}?${utils.objectToQuery(data)}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const updatePostReported = async (data?: ReportData) => {
  try {
    const dataForm = utils.parseFormData(data);
    const rs = await services.put(
      `${api.REPORT_UPDATE_REPORTED_POST.replace(":id", data?.id || "")}`,
      dataForm
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const republishPost = async (id?: string) => {
  try {
    const rs = await services.put(
      `${api.REPORT_REPUBLISH_POST.replace(":id", id || "")}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getUsers = async (data?: PageData) => {
  try {
    const rs = await services.get(
      `${api.REPORT_GET_USERS}?${utils.objectToQuery(data)}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getHiddenUsers = async (data?: PageData) => {
  try {
    const rs = await services.get(
      `${api.REPORT_GET_HIDDEN_USERS}?${utils.objectToQuery(data)}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const updateUserReported = async (data?: ReportData) => {
  try {
    const dataForm = utils.parseFormData(data);
    const rs = await services.put(
      `${api.REPORT_UPDATE_REPORTED_USER.replace(":id", data?.id || "")}`,
      dataForm
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const republishUser = async (id?: string) => {
  try {
    const rs = await services.put(
      `${api.REPORT_REPUBLISH_USER.replace(":id", id || "")}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getMuteUsers = async (data?: PageData) => {
  try {
    const rs = await services.get(
      `${api.MUTE_GET_USERS}?${utils.objectToQuery(data)}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const muteUser = async (data?: MuteData) => {
  try {
    const dataForm = utils.parseFormData(data);
    const rs = await services.post(`${api.MUTE_USER}`, dataForm);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const updateMuteUser = async (data?: Post) => {
  try {
    // const dataForm = utils.parseFormData(data);
    console.log('to be updated data', data )
    const rs = await services.post(api.PUT, data);
    console.log('result from contentUpdate', rs)
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const reportService = {
  send,
  getAnalytics,
  getPosts,
  getHiddenPosts,
  updatePostReported,
  republishPost,
  getUsers,
  getHiddenUsers,
  getMuteUsers,
  updateUserReported,
  republishUser,
  muteUser,
  updateMuteUser,
};
export default reportService;
