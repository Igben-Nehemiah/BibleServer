import App from '../../../../app';
import AuthenticationController from '../authentication.controller';
import AuthenticationService from '../authentication.service';
import { type IAuthenticationRepository } from '../interfaces/authentication-repository.interface';
import request from 'supertest';
import type IController from '../../../common/controller/controller.interface';
import { CreateUserDto } from '../dtos';

const authRepository: IAuthenticationRepository = {
  add: jest.fn().mockReturnValue({}),
  getAll: jest.fn().mockReturnValue({}),
  getById: jest.fn().mockReturnValue({}),
  remove: jest.fn().mockReturnValue({}),
  findUserByEmail: jest.fn().mockReturnValue({}),
  findByIdAndUpdate: jest.fn().mockReturnValue({}),
};

describe('AuthenticationController', () => {
  describe('POST /auth/signup', () => {
    let authenticationService: AuthenticationService;
    let authenticationController: IController;
    let userData: CreateUserDto;

    beforeEach(() => {
      userData = {
        email: 'john@smith.com',
        name: 'John Smith',
        password: 'strongPassword123',
      };

      process.env.JWT_SECRET = 'jwt_secret';
      process.env.SALT_ROUNDS = '10';
      process.env.JWT_EXPIRATION_IN_SECONDS = '36000';

      authRepository.findUserByEmail = jest.fn().mockReturnValue(null);

      authRepository.add = jest.fn().mockReturnValue({
        email: 'john@smith.com',
        password: 'strongPassword123',
        _id: '61505d4e7a7e6c001f2ce301',
        name: 'John Smith',
      });

      authenticationService = new AuthenticationService(authRepository);
      authenticationController = new AuthenticationController(
        authenticationService
      );
    });
    describe('if the email is not taken', () => {
      it('response should have the Set-Cookie header with the Authorization token', async () => {
        const app = new App([authenticationController], 3030);
        return await request(app.app)
          .post(`${authenticationController.path}/signup`)
          .send(userData)
          .expect('Set-Cookie', /^Authorization=.+/);
      });
    });
  });
});
