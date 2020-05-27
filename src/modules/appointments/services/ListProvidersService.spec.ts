import FakeCreateUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
// import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeCreateUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeCreateUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'jonedoe@example.com',
      password: '123456',
    });

    const logedUser = await fakeUsersRepository.create({
      name: 'Igor Brasil',
      email: 'igorbr@outlook.com',
      password: '4444',
    });
    const providers = await listProviders.execute({
      user_id: logedUser.id,
    });
    expect(providers).toEqual([user1, user2]);
  });
});
