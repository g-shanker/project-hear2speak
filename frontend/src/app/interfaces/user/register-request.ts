import { UserRole } from "./user-role";

export interface RegisterRequest {

    username: string;
    password: string;
    role: UserRole;

}