import { PageData } from "./page.model";

export default interface Company {
  id?: string;
  name?: string;
  industry?: string;
  domain?: string;
  logo?: any;
  active?: boolean;
  is_publish?: boolean;
  is_system?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyFilter extends PageData {
  from_date?: string;
  to_date?: string;
  unactive?: boolean;
}
