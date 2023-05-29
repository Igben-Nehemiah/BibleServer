import { type Request } from 'express'
import { type User } from './user.interface'

export interface RequestWithUser extends Request {
  user?: User
}
