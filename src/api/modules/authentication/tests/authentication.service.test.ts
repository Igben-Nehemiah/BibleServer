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
    process.env.SALT_ROUNDS = '10';
    process.env.JWT_SECRET = 'secret';
    process.env.JWT_EXPIRATION_IN_SECONDS = '36000';
  });

  describe('When registering a user with a valid email address', () => {
    const createUserDto: CreateUserDto = {
      email: 'test30@test.com',
      name: 'Testing Test',
      password: 'testing',
    };

    beforeEach(() => {
      authRepository.findUserByEmail = jest.fn().mockResolvedValue(null);
      authRepository.add = jest.fn().mockResolvedValue({
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
        _id: '61505d4e7a7e6c001f2ce301',
      });
    });

    it('should return a user with the password field stripped out', async () => {
      const result = await authenticationService.registerUser(createUserDto);

      expect(result.isSuccessful).toBeTruthy();
      expect(result.value.user.password).toBeUndefined();
    });
  });

  describe('When registering a user with an existing email address', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@test.com',
      name: 'Testing Test',
      password: 'testing',
    };

    beforeEach(() => {
      authRepository.findUserByEmail = jest.fn().mockResolvedValue(null);
      authRepository.findUserByEmail = jest.fn().mockResolvedValue({
        _id: '61505d4e7a7e6c001f2ce301',
        name: 'Test Test',
        email: 'test@test.com',
      });
    });

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
