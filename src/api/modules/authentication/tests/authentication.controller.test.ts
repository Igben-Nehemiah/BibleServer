import App from "../../../../app";
import AuthenticationController from "../authentication.controller";
import AuthenticationService from "../authentication.service";
import CreateUserDto from "../dtos/create-user.dto";
import IAuthenticationRepository from "../interfaces/authentication-repository.interface";
import request from 'supertest';


const authRepository : IAuthenticationRepository = {
    add: jest.fn().mockReturnValue({}),
    findUserByEmail: jest.fn().mockReturnValue({
        _id: "61505d4e7a7e6c001f2ce301",
        name: "Test Test",
        email: "test@test.com",
    }),
    getAll: jest.fn().mockReturnValue({}),
    getById: jest.fn().mockReturnValue({}),
    remove: jest.fn().mockReturnValue({}),
}

describe("AuthenticationController", () => {
    describe("POST /auth/signup", () => {
        describe('if the email is not taken', () => {
            it('response should have the Set-Cookie header with the Authorization token', () => {
              const userData: CreateUserDto = {
                email: 'john@smith.com',
                password: 'strongPassword123',
              };
              process.env.JWT_SECRET = 'jwt_secret';

              const authenticationService = new AuthenticationService(authRepository)
              const authenticationController = new AuthenticationController(authenticationService);

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