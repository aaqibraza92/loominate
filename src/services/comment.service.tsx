import services, { HandleError } from ".";
import api from "../commons/constants/api.constant";
import { CommentData, CommentPageData } from "../models/comment.model";
import utils from "../utils";

const getList = async (payload?: CommentPageData) => {
  try {
    const rs = await services.get(
      `${api.COMMENTS}?${utils.objectToQuery(payload)}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getAll = async (tenantName:string,payload?: any) => {
  try {
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/comment/content/id?${utils.objectToQuery(payload)}`
    );
    // console.log('get akll url comments', `${api.GATEWAY_BASE_URL}/${tenantName}/comment/content/id?${utils.objectToQuery(payload)}`)
    console.log('rs in get all comment', rs)
    return rs.data.data;
  } catch (e) {
    throw HandleError(e);
  }
};


const add = async (payload?: CommentData) => {
  try {
    console.log('in contentService body',payload)
    // const dataForm = utils.parseFormData(payload);
    const rs = await services.post(`${api.GATEWAY_BASE_URL}/comment`,payload);
    // const rs = await services.post('http://localhost:3005/comment',payload);
    console.log('comment result after post', rs)
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const edit = async (payload?: CommentData) => {
  try {
    const dataForm = utils.parseFormData(payload);
    const rs = await services.put(
      `${api.COMMENT_EDIT.replace(":id", payload?.id || "")}`,
      dataForm
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const deleteComment = async (id?: string) => {
  try {
    const rs = await services.delete(
      `${api.COMMENT_DELETE.replace(":id", id || "")}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const like = async (id?: string) => {
  try {
    const rs = await services.post(api.COMMENT_LIKE.replace(":id", id || ""));
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const unlike = async (id?: string) => {
  try {
    const rs = await services.post(api.COMMENT_UNLIKE.replace(":id", id || ""));
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const dislike = async (id?: string) => {
  try {
    const rs = await services.post(
      api.COMMENT_DISLIKE.replace(":id", id || "")
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const undislike = async (id?: string) => {
  try {
    const rs = await services.delete(
      api.COMMENT_UNDISLIKE.replace(":id", id || "")
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const commentService = {
  getList,
  add,
  edit,
  deleteComment,
  like,
  unlike,
  dislike,
  undislike,
  getAll,
};
export default commentService;
