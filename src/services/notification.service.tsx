/* eslint-disable no-throw-literal */
import axios from "axios";
import services, { HandleError, localService } from ".";
import api from "../commons/constants/api.constant";
import { PageData } from "../models/page.model";
import utils from "../utils";

const tenantName = localStorage.getItem('tenantName')
const list = async (data?: PageData) => {
  try {
    const rs = await axios.get(`${api.NOTIFICATION_API}/notification/user?${utils.objectToQuery(data)}`,{headers : {tenantname : tenantName!}})
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getNotReadCount = async (userId : number) => {
  try {
    const rs = await axios.get(`${api.NOTIFICATION_API}/notification/count/user/${userId}`,{headers : {tenantname : tenantName!}})
    console.log("data noti", rs.data)
    return rs.data;
  } catch (error) {
    
  }
}

const read = async (data?: { read_all?: boolean; notification_ids?: string[] }) => {
  try {
    const dataForm = utils.parseFormData(data);
    // const rs = await services.post(`${api.NOTIFICATION_READ}`, dataForm);
    // return rs.data;
    return true
  } catch (e) {
    throw HandleError(e);
  }
};

const markRead =async (userId: number) => {
  try {
    await axios.post(`${api.NOTIFICATION_API}/notification/update`,{userId : userId},{headers : {tenantname : tenantName!}})
  } catch (error) {
    throw HandleError(error);
  }
}

const notificationService = {
  list,
  read,
  getNotReadCount,
  markRead
};
export default notificationService;
