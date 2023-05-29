import type mongoose from 'mongoose'
import BaseRepository from '../../../common/repositories/base.repository'
import { type IAuthenticationRepository, type User } from '../interfaces'

class AuthenticationRepository extends BaseRepository<User>
  implements IAuthenticationRepository {
  constructor (public readonly model: mongoose.Model<User & mongoose.Document>) {
    super(model)
  };

  public async findUserByEmail (email: string): Promise<User | null> {
    const user = await this.model.findOne({ email })
    return user as User
  };
};

export default AuthenticationRepository
