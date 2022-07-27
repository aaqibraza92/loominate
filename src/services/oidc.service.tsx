import { UserManager } from 'oidc-client';

const getUser = (userManager: UserManager) => userManager.getUser();

const services = {
  getUser,
};

export default services;
