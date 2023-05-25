import App from "../../../../app";
import { IBaseRepository } from "../../../common/interfaces";
import AuthenticationController from "../authentication.controller";
import AuthenticationService from "../authentication.service";
import CreateUserDto from "../dtos/create-user.dto";
import IAuthenticationRepository from "../interfaces/authentication-repository.interface";
import request from 'supertest';
import User from "../interfaces/user.interface";
import IController from "../../../common/controller/controller.interface";

const authRepository : IAuthenticationRepository = {
  add: jest.fn().mockReturnValue({}),
  getAll: jest.fn().mockReturnValue({}),
  getById: jest.fn().mockReturnValue({}),
  remove: jest.fn().mockReturnValue({}),
  findUserByEmail: jest.fn().mockReturnValue({}),
};

describe("AuthenticationController", () => {
    describe("POST /auth/signup", () => {
      let authenticationService: AuthenticationService;
      let authenticationController: IController;
      let userData: CreateUserDto;

      beforeEach(() => {
        userData = {
          email: 'john@smith.com',
          password: 'strongPassword123',
        };

        process.env.JWT_SECRET = 'jwt_secret';

        authRepository.findUserByEmail = jest.fn().mockReturnValue(null);

        authRepository.add = jest.fn().mockReturnValue({
          email: 'john@smith.com',
          password: 'strongPassword123',
          _id: "61505d4e7a7e6c001f2ce301",
          name: "John Smith"
        });

        authenticationService = new AuthenticationService(authRepository)
        authenticationController = new AuthenticationController(authenticationService);
      });
      describe('if the email is not taken', () => {
          it('response should have the Set-Cookie header with the Authorization token', async () => {
            
            const app = new App([
              authenticationController,
            ], 3030);
            return request(app.app)
              .post(`${authenticationController.path}/signup`)
              .send(userData)
              .expect('Set-Cookie', /^Authorization=.+/)
          });
      });
    });
});