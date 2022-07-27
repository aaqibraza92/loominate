import { UserManager } from 'oidc-client';
import { IDPConfig } from '../models/auth.model';

const handleIDPConfig = (config: IDPConfig) => {
  return new UserManager(config);
};

const utils = {
  handleIDPConfig,
};

export default utils;
