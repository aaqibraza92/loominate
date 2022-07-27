/* eslint-disable no-throw-literal */
import services, { contentService, HandleError, localService } from ".";
import api from "../commons/constants/api.constant";
import { PageData } from "../models/page.model";
import { PostData } from "../models/post.model";
import utils from "../utils";

const getAll = async (tenantName: string,payload?: any, userId?: number, ids?: any) => {
        console.log('ids in service', ids)
        let data = {categoryIds : ids}
        const headersRequest = {
            'Content-Type': 'application/json',
            data : JSON.stringify(data)
          };

          console.log('headerValue', headersRequest)
  const rs = await services.get(
    `${api.GATEWAY_BASE_URL}/${tenantName}/content/user/${userId}?${utils.objectToQuery(payload)}`,  { headers: headersRequest }

    // `${api.GATEWAY_BASE_URL}/${tenantName}/content/user/${userId}`
    // `${api.GATEWAY_BASE_URL}/${tenantName}/content/`

  );
  console.log('getAllApi',     `${api.GATEWAY_BASE_URL}/${tenantName}/content/user/${userId}?${utils.objectToQuery(payload)}`)

  console.log('api call of getall post service', `${api.GATEWAY_BASE_URL}/${tenantName}/content/?${utils.objectToQuery(payload)}`)
  try {
    console.log('rs from postService', rs.data.data)
    return rs.data.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getAllSearch = async (tenantName: string,payload?: any) => {
  const rs = await services.get(
    `${api.GATEWAY_BASE_URL}/${tenantName}/content/?${utils.objectToQuery(payload)}`
    // `${api.GATEWAY_BASE_URL}/${tenantName}/content/`

  );
  try {
    console.log('rs from postService', rs.data)
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const contentByHastag = async (tenantName: string,userId: number,hashValue: string,payload?: any) => {
  console.log('hashvalue in postService', hashValue)
  const rs = await services.get(
    `${api.GATEWAY_BASE_URL}/${tenantName}/content/user/hashTitle/${userId}/${hashValue}?${utils.objectToQuery(payload)}`
  );
  try {
    
    console.log('hashtag url', `${api.GATEWAY_BASE_URL}/${tenantName}/content/user/hashTitle/${userId}/${hashValue}?${utils.objectToQuery(payload)}`)
    console.log('rs from getContentHaastag', rs)
    return rs.data.data;
  } catch (e) {
    console.log('error in get contentByHashtags', e)
  }
};
const getAllBySearch =async (tenantName:string, payload?: any) => {
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/search/?${utils.objectToQuery(payload)}`
    )
    return rs.data;
}

const countComment_byId = async (tenantName: string,payload?: any) => {
  const rs = await services.get(
    `${api.GATEWAY_BASE_URL}/${tenantName}/comment/content/id?${utils.objectToQuery(payload)}`
  );
    console.log('rs from count comment meta data', rs.data.meta.itemCount)
    return rs.data.meta.itemCount;
};

const detail = async (tenantName: string,id?: number,userId?: any) => {
  try {
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/content/${id}/${userId}`

    );
    console.log('getData by id', rs)
    return rs.data[0];
  } catch (e) {
    throw HandleError(e);
  }
};

const create = async (data?: PostData) => {
  try {
    // const dataForm = utils.parseFormData(data);
    const rs = await services.post(api.POST, data);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const update = async (data: any) => {
  try {
     await services.post(api.PUT, data);
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${data.tenant}/content/${data.id}`
    );
    return rs.data[0] 
  } catch (e) {
    throw HandleError(e);
  }
};

const deletePost = async (body: any) => {
  try {
    console.log('data in delete post', body)
    // const dataForm: any = utils.parseFormData(body);
    // console.log({dataForm})
    // console.log('dataform in delete',dataForm)
    const rs = await services.post(api.DELETE, body);

    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const cancelReviewPost = async (postId?: string) => {
  try {
    
    const rs = await services.delete(
      api.POST_CANCEL_REVIEW.replace(":id", postId || "")
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const approveReviewPost = async (postId?: string) => {
  try {
    const rs = await services.put(
      api.POST_APPROVE_REVIEW.replace(":id", postId || "")
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const removeReviewPost = async (postId?: string) => {
  try {
    const rs = await services.delete(
      api.POST_REMOVE_REVIEW.replace(":id", postId || "")
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const upVote = async (payload?: string) => {
  try {
    const rs = await services.post(
      `${api.GATEWAY_BASE_URL}/reaction/`, payload
    );
    return rs.data.result.id;
  } catch (e) {
    throw HandleError(e);
  }
};

const deleteReaction = async (id?: number, thirdPerson?: string, type?: string ,isAnonymous?: boolean ,tenantName?: string) => {
  try {
    let body: any = {}
    body.tenant = tenantName;
    body.id = id;
    body.thirdPerson = thirdPerson;
    body.type = type;
    body.isAnonymous = isAnonymous;
    console.log('inside delete reaction service', body)
    const rs = await services.post(
      `${api.GATEWAY_BASE_URL}/delete/reaction/`, body
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getLikeInfo = async (tenantName: string,id?: number) => {
  try {
    console.log('likeinfo function', tenantName,id)
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/vote/getReactionByUserId/${id}`
    );
    console.log('likeinfo from postservice', rs.data)
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};


const getVoteInfo = async (tenantName: string,id?: number) => {
  try {
    console.log('vote function', tenantName,id)
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/vote/getOptionActionByUserId/${id}`
    );
    console.log('vote info from postservice', rs.data)
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};
const getOptionData1 = async (tenantName?: string,contentId?: number) => {
  try {
    // console.log('api option data', `${api.GATEWAY_BASE_URL}/${tenantName}/vote/getResult/${contentId}`)
    const rs= await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/vote/getResult/${contentId}`
    );
    // console.log( 'check option result',rs.data)
    return rs.data;
  } catch (e) {
    console.log('error in post service', e)
  }
};
const downVote = async (payload?: string) => {
  try {
    const rs = await services.put(
      `${api.GATEWAY_BASE_URL}/reaction/`, payload
    );
    return rs.data.result.id;
  } catch (e) {
    throw HandleError(e);
  }
};

const countUpVote = async (tenantName?: string,contentId?: string) => {
  try {
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/reaction/countByContentId/${contentId}`
    );
    // console.log('ressult in ',rs)
    return rs.data.result[0].upVotes;
  } catch (e) {
    throw HandleError(e);
  }
};


const getOptionData = async (tenantName?: string,contentId?: number) => {
  try {
    // console.log('api option data', `${api.GATEWAY_BASE_URL}/${tenantName}/vote/getResult/${contentId}`)
    const rs= await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/vote/getResult/${contentId}`
    );
    // console.log( 'check option result',rs.data.result.voteResult)
    return rs.data.result.voteResult;
  } catch (e) {
    console.log('error in post service', e)
  }
};

const countDownVote = async (tenantName?: string,contentId?: string) => {
  try {
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/reaction/countByContentId/${contentId}`
    );
    console.log('api url', `${api.GATEWAY_BASE_URL}/${tenantName}/reaction/countByContentId/${contentId}`)
    console.log('inside count down vote post service', rs.data.result[0].downVotes, contentId)
    return rs.data.result[0].downVotes;
  } catch (e) {
    throw HandleError(e);
  }
};

const countComment = async (tenantName?: string,commentId?: string) => {
  try {
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/reaction/countByCommentId/${commentId}`
    );
    // console.log('api url', `${api.GATEWAY_BASE_URL}/${tenantName}/reaction/countByContentId/${contentId}`)
    console.log('inside count down vote post service', rs.data.result[0].downVotes, commentId)
    return rs.data.result[0].downVotes;
  } catch (e) {
    throw HandleError(e);
  }
};

const countIniVote = async (tenantName?: string,contentId?: string) => {
  try {
  console.log('url for count Vote ini', `${api.GATEWAY_BASE_URL}/${tenantName}/vote/getResult/${contentId}`)
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/vote/getResult/${contentId}`
    );
    // console.log('api url', `${api.GATEWAY_BASE_URL}/${tenantName}/reaction/countByContentId/${contentId}`)
    console.log('inside count comment post service',rs.data.result.totalVotes , contentId)
    return rs.data.result.totalVotes;
  } catch (e) {
    throw HandleError(e);
  }
};

const unlike = async (id?: string) => {
  try {
    const rs = await services.delete(api.POST_UNLIKE.replace(":id", id || ""));
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

// const dislike = async (id?: string) => {
//   try {
//     const rs = await services.(api.POST_DISLIKE.replace(":id", id || ""));
//     return rs.data;
//   } catch (e) {
//     throw HandleError(e);
//   }
// };

const undislike = async (id?: string) => {
  try {
    const rs = await services.delete(
      api.POST_UNDISLIKE.replace(":id", id || "")
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const vote = async (data: any) => {
  try {
    // const dataForm = utils.parseFormData({ poll_id });
    const rs = await services.post(api.VOTE, data);
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const voteInitiative = async (body: any) => {
  try {
    const rs = await services.post(
      `${api.GATEWAY_BASE_URL}/vote`, body
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const getPostInReview = async (payload?: PageData) => {
  try {
    const rs = await services.get(
      `${api.POST_IN_REVIEW}?${utils.objectToQuery(payload)}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};


const postService = {
  detail,
  getAll,
  create,
  update,
  deletePost,
  countComment_byId,
  getOptionData,
  cancelReviewPost,
  approveReviewPost,
  removeReviewPost,
  upVote,
  unlike,
  undislike,
  vote,
  voteInitiative,
  getPostInReview,
  countComment,
  countUpVote,
  countDownVote,
  countIniVote,
  downVote,
  getLikeInfo,
  deleteReaction,
  getVoteInfo,
  getOptionData1,
  getAllBySearch,
  getAllSearch,
  contentByHastag,
};
export default postService;
