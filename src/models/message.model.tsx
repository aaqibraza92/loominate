import User from "./user.model";

export default interface Message {
  id?: string;
  sender?: User;
  recipient?: User;
  is_read?: boolean;
  message?: string;
  message_type?: number;
  image?: string;
  roomId?: string;
  created_at?: string;
  updated_at?: string;
  body?: string;
  modifiedDate?: string;
  receiver?: number;
}
