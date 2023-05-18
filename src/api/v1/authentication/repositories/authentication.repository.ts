import mongoose from "mongoose";
import BaseRepository from "../../common/repositories/base.repository";
import User from "../interfaces/user.interface";


class AuthenticationRepository extends BaseRepository<User>{
    constructor(public readonly model:  mongoose.Model<User & mongoose.Document>) {
        super(model);
    }

    public async findUserByEmail(email: string) : Promise<User | null> {
        const user = await this.model.findOne({email});

        return user as User;
    }
}


export default AuthenticationRepository;