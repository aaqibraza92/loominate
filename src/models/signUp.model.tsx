export interface SignUpQuery {
  username?: string;
  password?: string;
  email?: string;
  referral_code?: string;
}

export interface SignUpData {
  verify_id?: string;
  security_code?: string;
  username?: string;
  email?: string;
  avatar?: any;
  avatar_key?: string;
  categories?: string;
  referral_code?: string;
}

export interface SignUpCompanyData {
  name?: string;
  industry?: string;
  domain?: string;
  logo?: string;
}

export interface SignUpForm {
  email: string;
  username: string;
  password: string;
  avatar: string;
  categories:
    | [
        {
          title: string;
        }
      ]
    | [];
}

export interface GetSecurityCodeForm {
  id: Number;
  email: string;
  name: string;
}
