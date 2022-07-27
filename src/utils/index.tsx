/* eslint-disable no-useless-escape */

import Post from "../models/post.model";

/**
 * Get regex email
 */
const regexEmail = () => {
  return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/;
};
/**
 * Get regex password
 */
const regexPassword = () => {
  return /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;
};

/**
 * regex HashTag
 */
const regexHashTag = () => {
  return /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,30})(\b|\r)/;
};

/**
 * Convert object to query string
 * @param {Object} obj
 * @returns {string}
 */
const objectToQuery = (obj: any) => {
  try {
    if (!obj) return "";
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p) && obj[p] !== null && obj[p] !== undefined) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  } catch (error) {
    return "";
  }
};

/**
 * parse FormData form Object
 * @date 2021-11-04
 * @param {Object} obj
 * @returns {FormData}
 */
const parseFormData = (obj: any) => {
  try {
    const data = new FormData();
    Object.keys(obj).forEach((key) => {
      if (obj[key] !== null && obj[key] !== undefined) {
        if (typeof obj[key] === "object") {
          if (obj[key].type && obj[key].size) {
            data.append(key, obj[key]);
          } else {
            data.append(key, JSON.stringify(obj[key]));
          }
        } else {
          data.append(key, obj[key]);
        }
      }
    });
    return data;
  } catch (error) {
    return null;
  }
};

/**
 * Get security code
 * @param { number} length
 * @returns {string}
 */
const getSecurityCode = (length: number) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Get domain from email
 * @param {string} email
 * @returns {string}
 */
const getEmailDomain = (email: string) => {
  return email.substring(email.lastIndexOf("@") + 1);
};

const parseURL = (url: string) => {
  return url.indexOf("http://") > -1 || url.indexOf("https://") > -1
    ? url
    : `https://${url}`;
};


const upVoteDesc = ( a: Post, b : Post ) =>{
  if ( (a.likes || 0) < (b.likes || 0 )){
    return 1;
  }
  if ((a.likes || 0) > (b.likes || 0 ) ){
    return -1;
  }
  return 0;
}

const downVoteDesc = ( a: Post, b : Post ) =>{
  if ( (a.dislikes || 0) < (b.dislikes || 0 )){
    return 1;
  }
  if ((a.dislikes || 0) > (b.dislikes || 0 ) ){
    return -1;
  }
  return 0;
}


const upVoteAesc = ( a : Post, b : Post) =>{
  if ( (a.likes || 0) < (b.likes || 0 )){
    return -1;
  }
  if ((a.likes || 0) > (b.likes || 0 ) ){
    return 1;
  }
  return 0;
}

const utils = {
  regexEmail,
  regexPassword,
  regexHashTag,
  objectToQuery,
  parseFormData,
  getSecurityCode,
  getEmailDomain,
  parseURL,
  upVoteDesc,
  upVoteAesc,
  downVoteDesc
};
export default utils;
