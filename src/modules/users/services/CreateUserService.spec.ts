import FakeCreateUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('shuld be able to create a new  user', async () => {
    const fakeCreateUsersRepository = new FakeCreateUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeCreateUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'Brasil Brasil',
      email: 'ogprs@gmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('shuld not be able to create a new  user with an existent e-mail', async () => {
    const fakeCreateUsersRepository = new FakeCreateUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeCreateUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'Brasil Brasil',
      email: 'igor.brasil@gmail.com',
      password: '123456',
    });

    expect(
      createUserService.execute({
        name: 'Brasidddl Brasil',
        email: 'igor.brasil@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
