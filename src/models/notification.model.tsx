import User from "./user.model";

export default interface Notification {
  id?: string;
  body?: string;
  action?: string;
  sender?: User;
  content?: string;
  points?: number;
  created_at?: string;
  updated_at?: string;

  creationDate?: string;
  modifiedDate?: string;
  notificationData? : string;
}
