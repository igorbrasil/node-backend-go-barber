import FakeCreateUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';

let fakeCreateUsersRepository: FakeCreateUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeCreateUsersRepository = new FakeCreateUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeCreateUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('shuld be able to create a new  user', async () => {
    const user = await createUser.execute({
      name: 'Brasil Brasil',
      email: 'ogprs@gmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('shuld not be able to create a new  user with an existent e-mail', async () => {
    await createUser.execute({
      name: 'Brasil Brasil',
      email: 'igor.brasil@gmail.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Brasidddl Brasil',
        email: 'igor.brasil@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
