import User from "./user.model";

export default interface Chat {
  id?: string;
  sender?: User;
  recipient?: User;
  room_type?: number;
  latest_message?: string;
  identifier?: string;
  is_read?: boolean;
  unread_count?: number;
  firebase_link?: string;
  created_at?: string;
  updated_at?: string;
  modifiedDate?: string;
  lastActivityOn?: any;
  user2_userName?: string;
  user1_userName?: string;
  user2_id?: string;
  user1_id?: string;
  msg_body?: string;
  chat_id?: string;
  user2_avatarLink?: string;
  user1_avatarLink?: string;
  user1_avatar?: string;
  user2_avatar?: string;
  userName1: string;
  avatarLink1: string;
  avatar1: string;
  avatar2: string;
  userName2:string;
  avatarLink2:string;
  id1: number;
  msg_deliveryTime?: any;
}
