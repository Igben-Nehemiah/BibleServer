import mongoose from "mongoose";
import BaseRepository from "../../../common/repositories/base.repository";
import User from "../interfaces/user.interface";
import IAuthenticationRepository from "../interfaces/authentication-repository.interface";


class AuthenticationRepository extends BaseRepository<User> 
    implements IAuthenticationRepository {
    constructor(public readonly model:  mongoose.Model<User & mongoose.Document>) {
        super(model);
    }

    public async findUserByEmail(email: string) : Promise<User | null> {
        const user = await this.model.findOne({email});
        return user as User;
    }
}


export default AuthenticationRepository;