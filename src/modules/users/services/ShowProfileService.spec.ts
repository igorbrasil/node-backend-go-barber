import FakeCreateUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeCreateUsersRepository;
let showProfile: ShowProfileService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeCreateUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to Show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    });
    const profile = await showProfile.execute({
      user_id: user.id,
    });
    expect(profile.name).toBe('Jonh Doe');
    expect(profile.email).toBe('jonhdoe@example.com');
  });

  it('should not be able to Show the profile for non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
