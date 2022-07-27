import { couldStartTrivia } from 'typescript';
import services, { HandleError, localService } from '.';
import api from '../commons/constants/api.constant';
import { PageData } from '../models/page.model';
import utils from '../utils';

const getList = async (tenantName: string,payload?: any) => {
  try {
    console.log('get list url = ', `${api.GATEWAY_BASE_URL}/${tenantName}/chat/userId/?${utils.objectToQuery(payload)}`)
    const rs = await localService.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/chat/userId/?${utils.objectToQuery(payload)}`
    );
    console.log('getchat list', rs)
    return rs;
  } catch (e) {
    throw HandleError(e);
  }
};

const getAll = async (tenantName:string,payload?: any) => {
  try {
    // console.log('chat get all url', `${api.GATEWAY_BASE_URL}/${tenantName}/msg/chat/id?${utils.objectToQuery(payload)}`)
    const rs = await services.get(
      `${api.GATEWAY_BASE_URL}/${tenantName}/msg/chat/id?${utils.objectToQuery(payload)}`
    );
    // console.log('get akll url comments', `${api.GATEWAY_BASE_URL}/${tenantName}/comment/content/id?${utils.objectToQuery(payload)}`)
    console.log('rs in msg by chatId', rs.data)
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};


const getRoomFirebase = async (recipientId: string) => {
  try {
    const rs = await services.get(
      `${api.CHAT_GET_ROOM_FIREBASE}?${utils.objectToQuery({
        recipient_id: recipientId,
      })}`
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const sendMessage = async (recipientId: string, data?: any) => {
  try {
    const dataForm = utils.parseFormData(data);
    console.log(data);
    console.log(dataForm);
    const rs = await services.post(
      `${api.CHAT_SEND_MESSAGE}?${utils.objectToQuery({
        recipient_id: recipientId,
      })}`,
      dataForm
    );
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const deleteChat = async (body: any) => {
  try {
    const rs = await services.post(api.CHAT_DELETE, body);
    console.log('rs from delete chat', rs)
    return rs.data;
  } catch (e) {
    throw HandleError(e);
  }
};

const chatService = {
  getList,
  getRoomFirebase,
  sendMessage,
  deleteChat,
  getAll,
};
export default chatService;
