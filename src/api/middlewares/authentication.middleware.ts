import { type NextFunction, type Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { type User, type DataStoredInToken, type RequestWithUser } from '../modules/authentication/interfaces'
import userModel from '../modules/authentication/models/user.model'
import { AuthenticationTokenMissingException, WrongAuthenticationTokenException } from '../modules/authentication/exceptions'

export function authenticationMiddleware (omitSecondFactor = false) {
  return async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const cookies = request.cookies
    if (cookies?.Authorization !== undefined) {
      const secret = process.env.JWT_SECRET ?? ''
      try {
        const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken
        const { _id: id, isSecondFactorAuthenticated } = verificationResponse
        const user = await userModel.findById(id)
        if (user !== null) {
          if (userHasSecondFactorAuthEnabled(omitSecondFactor, user, isSecondFactorAuthenticated)) {
            next(new WrongAuthenticationTokenException())
          } else {
            request.user = user
            next()
          }
        } else {
          next(new WrongAuthenticationTokenException())
        }
      } catch (error) {
        next(new WrongAuthenticationTokenException())
      }
    } else {
      next(new AuthenticationTokenMissingException())
    }
  }
}

function userHasSecondFactorAuthEnabled (omitSecondFactor: boolean, user: User, isSecondFactorAuthenticated: boolean) {
  return !omitSecondFactor && user.isTwoFactorAuthenticationEnabled !== undefined &&
    user.isTwoFactorAuthenticationEnabled &&
    !isSecondFactorAuthenticated
}
