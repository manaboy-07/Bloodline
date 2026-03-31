import { Role } from "../enums/role.enum"

export type CurrentUser = {
   id: number;
  roleId: number;
  role: {
    id: number;
    name: string; // this is the string enum you want
  } | null;
}