import { Result } from '@nehemy/result-monad';
import AuthenticationService from '../authentication.service';
import { type TokenData } from '../interfaces';
import { type IAuthenticationRepository } from '../interfaces/authentication-repository.interface';
import { type User } from '../interfaces/user.interface';
import { CreateUserDto } from '../dtos';

const authRepository: IAuthenticationRepository = {
  add: jest.fn().mockReturnValue({}),
  findUserByEmail: jest.fn().mockReturnValue({
    _id: '61505d4e7a7e6c001f2ce301',
    name: 'Test Test',
    email: 'test@test.com',
  }),
  getAll: jest.fn().mockReturnValue({}),
  getById: jest.fn().mockReturnValue({}),
  remove: jest.fn().mockReturnValue({}),
  findByIdAndUpdate: jest.fn().mockReturnValue({}),
};

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  beforeEach(() => {
    authenticationService = new AuthenticationService(authRepository);
  });

  describe('When registering a user with an existing email address', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@test.com',
      password: 'testing',
    };
    it('should return a failed result', async () => {
      const result = await authenticationService.registerUser(createUserDto);

      expect(result).toEqual<Result<{ cookie: string; user: User }>>(
        new Result<{ cookie: string; user: User }>(
          new Error(`${createUserDto.email} has already been used`)
        )
      );
    });
  });

  describe('When creating a cookie', () => {
    const tokenData: TokenData = {
      token: '',
      expiresIn: 1,
    };

    it('should return a string', () => {
      expect(typeof authenticationService.createCookie(tokenData)).toEqual(
        'string'
      );
    });
  });
});
