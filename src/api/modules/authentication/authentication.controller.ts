/* eslint-disable @typescript-eslint/no-unused-vars */

import * as express from 'express';
import type IController from '../../common/controller/controller.interface';
import type AuthenticationService from './authentication.service';
import { HttpException } from '../../common/errors/custom-error';
import { NotAuthorised, Ok } from '../../common/responses';
import { type RequestWithUser } from './interfaces';
import {
  authenticationMiddleware,
  validationMiddleware,
} from '../../middlewares';
import { WrongAuthenticationTokenException } from './exceptions';
import { CreateUserDto, LoginDto, TwoFactorAuthenticationDto } from './dtos';

class AuthenticationController implements IController {
  public router = express.Router();
  public path = '/auth';

  constructor(private readonly authService: AuthenticationService) {
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginDto),
      this.logIn as express.RequestHandler
    );
    this.router.post(
      `${this.path}/signup`,
      validationMiddleware(CreateUserDto),
      this.registerUser as express.RequestHandler
    );
    this.router.post(
      `${this.path}/logout`,
      this.logout as express.RequestHandler
    );
    this.router.post(
      `${this.path}/2fa/generate`,
      authenticationMiddleware,
      this.generateTwoFactorAuthenticationCode as express.RequestHandler
    );
    this.router.post(
      `${this.path}/2fa/turn-on`,
      validationMiddleware(TwoFactorAuthenticationDto),
      authenticationMiddleware(),
      this.turnOnTwoFactorAuthentication
    );
    this.router.post(
      `${this.path}/2fa/authenticate`,
      validationMiddleware(TwoFactorAuthenticationDto),
      authenticationMiddleware(true),
      this.secondFactorAuthentication
    );
  }

  private readonly registerUser = async (
    request: express.Request,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    const userData: CreateUserDto = request.body;

    const result = await this.authService.registerUser(userData);

    result.match(
      value => {
        response.setHeader('Set-Cookie', [value.cookie]);
        return response.send(new Ok(value.user, 201));
      },
      error => {
        throw new HttpException(error.message ?? '', 400);
      }
    );
  };

  private readonly logIn = async (
    request: express.Request,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    const userData: LoginDto = request.body;

    const result = await this.authService.login(userData);

    result.match(
      value => {
        response.setHeader('Set-Cookie', [value.cookie]);
        if (value.isTwoFactorAuthenticationEnabled) {
          return response.send({
            isTwoFactorAuthenticationEnabled:
              value.isTwoFactorAuthenticationEnabled,
          });
        }
        return response.send(new Ok(value.user));
      },
      error => {
        throw new HttpException(error.message ?? '', 400);
      }
    );
  };

  private readonly logout = async (
    _request: RequestWithUser,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
  };

  private readonly generateTwoFactorAuthenticationCode = async (
    request: RequestWithUser,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    const user = request.user;
    if (user === undefined) return response.send(new NotAuthorised());
    const otpauthUrl =
      await this.authService.generateTwoFactorAuthenticationCode(user);

    // TODO: Fix this later
    if (otpauthUrl === undefined) return response.send(new NotAuthorised());
    await this.authService.respondWithQRCode(otpauthUrl, response);
  };

  private readonly turnOnTwoFactorAuthentication = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const {
      twoFactorAuthenticationCode,
    }: { twoFactorAuthenticationCode: string } = request.body;
    const user = request.user;

    if (user === undefined) throw new Error('User not logged in');

    const result = await this.authService.turnOnTwoFactorAuthentication(
      user,
      twoFactorAuthenticationCode
    );

    result.match(
      _ => {
        response.send(200);
      },
      err => next(new WrongAuthenticationTokenException())
    );
  };

  private secondFactorAuthentication = async (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const { twoFactorAuthenticationCode } = request.body;
    const user = request.user;

    if (user === undefined) throw new Error('User not logged in');

    const result = await this.authService.secondFactorAuthentication(
      user,
      twoFactorAuthenticationCode
    );

    result.match(
      value => {
        response.setHeader('Set-Cookie', [value.cookie]);
        response.send({
          ...value.user,
        });
      },
      err => {
        next(err);
      }
    );
  };
}

export default AuthenticationController;
