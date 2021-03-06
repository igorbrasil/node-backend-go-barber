import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeCreateUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeCreateUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeCreateUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to  authenticate', async () => {
    const user = await fakeCreateUsersRepository.create({
      name: 'Brasil Brasil',
      email: 'igorsbr@gmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'igorsbr@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to  authenticate with nonexistent user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'igorsbr@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to  authenticate to authenticate with whrong passwors', async () => {
    await fakeCreateUsersRepository.create({
      name: 'Brasil Brasil',
      email: 'igorsbr@gmail.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'igorsbr@gmail.com',
        password: '123456d',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
