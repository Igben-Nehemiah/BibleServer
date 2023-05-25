import { IBaseRepository } from "../../../common/interfaces";
import { User } from "./user.interface";

export interface IAuthenticationRepository extends IBaseRepository<User> {
    findUserByEmail(email: string) : Promise<User | null>
};