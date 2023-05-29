/* eslint-disable @typescript-eslint/no-unused-vars */

import * as express from 'express';
import type IController from '../../common/controller/controller.interface';
import type AuthenticationService from './authentication.service';
import CreateUserDto from './dtos/create-user.dto';
import LoginDto from './dtos/login.dto';
import { HttpException } from '../../common/errors/custom-error';
import { NotAuthorised, Ok } from '../../common/responses';
import { type RequestWithUser } from './interfaces';
import {
  authenticationMiddleware,
  validationMiddleware,
} from '../../middlewares';

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
        return response.status(201).json(new Ok(value.user, 201));
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
        return response.status(200).json(new Ok(value.user));
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
    if (user === undefined) return new NotAuthorised();
    const otpauthUrl =
      await this.authService.generateTwoFactorAuthenticationCode(user);

    // TODO: Fix this later
    if (otpauthUrl === undefined) return new NotAuthorised();
    await this.authService.respondWithQRCode(otpauthUrl, response);
  };
}

export default AuthenticationController;
