export interface SignInQuery {
    username: string;
    password: string;
    device_type?: string;
    device_token?: string;
}