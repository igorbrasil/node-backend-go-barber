import FakeCreateUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to  authenticate', async () => {
    const fakeCreateUsersRepository = new FakeCreateUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeCreateUsersRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeCreateUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
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
    const fakeCreateUsersRepository = new FakeCreateUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeCreateUsersRepository,
      fakeHashProvider,
    );

    expect(
      authenticateUser.execute({
        email: 'igorsbr@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to  authenticate to authenticate with whrong passwors', async () => {
    const fakeCreateUsersRepository = new FakeCreateUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeCreateUsersRepository,
      fakeHashProvider,
    );
    const authenticateUser = new AuthenticateUserService(
      fakeCreateUsersRepository,
      fakeHashProvider,
    );

    await createUser.execute({
      name: 'Brasil Brasil',
      email: 'igorsbr@gmail.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'igorsbr@gmail.com',
        password: '123456d',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
