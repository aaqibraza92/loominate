/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import userService from './user.service';

export const URL_SERVER = `${process.env.REACT_APP_API_URL}`;
export const LOCAL_URL_SERVER = `${process.env.REACT_APP_API_URL_LOCAL}`;

export const TENANT_URL_SERVER = `${process.env.REACT_APP_TENANT_API_URL}`;
export const USER_URL_SERVER = `${process.env.REACT_APP_USER_API_URL}`;

export const ACTIVITY_SERVICE = `https://activity.loominate.org`;





console.log(URL_SERVER);

/**
 * Config api request
 */

const services = axios.create({
  baseURL: URL_SERVER,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const localService = axios.create({
  baseURL: LOCAL_URL_SERVER,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const Userservices = axios.create({
  baseURL: USER_URL_SERVER,
});

export const activityService = axios.create({
  baseURL: ACTIVITY_SERVICE,
});


export const contentService = axios.create({
  baseURL: 'https://content.loominate.org',
});

export const tenantServices = axios.create({
  baseURL: TENANT_URL_SERVER,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// services.defaults.headers.common.Accept = 'application/json';
// services.defaults.headers.common['Content-Type'] = 'application/json';
services.defaults.timeout = 60000;

// services.interceptors.response.use(function (response) {
//   console.log("AXIOS_RESPONSE", response);
//   return response;
// }, function (error) {
//   console.log("AXIOS_RESPONSE", error);
//   return Promise.reject(error);
// });

export const setAuthorization = (token: any) => {
  if (!token) {
    return;
  }
  services.defaults.headers.common.Authorization = `Bearer ${token}`;

};



export const HandleError = (e: any) => {
  return e?.response
    ? e.response.data?.error || e.response.data.errors
    : e.error || 'Cannot connect to server';
};

export default services;
