export interface IUser {
  name: string;
  username: string;
  password: string;
  token?: string;
}

export interface IUserDB extends IUser {
  _id: string;
}