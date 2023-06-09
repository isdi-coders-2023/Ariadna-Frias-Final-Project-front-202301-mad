import { Festival } from "../../festivals/models/festival";

export type ProtoUser = {
  email: string;
  password: string;
  name: string;
  surname: string;
  favoriteFestival: Festival[];
  token?: string;
};

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  favoriteFestival: Festival[];
  token?: string;
};

export type ServerResp = {
  results: User[];
  token: string;
};
