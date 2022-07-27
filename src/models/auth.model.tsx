export interface IDPConfig {
  authority: string;
  client_id: string;
  response_type: string;
  scope: string;
  pool_id?: string;
  redirect_uri: string;
  post_logout_redirect_uri?: string;
  silent_redirect_uri?: string;
}
