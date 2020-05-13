import FakeCreateUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeCreateUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeCreateUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Brasil Brasil',
      email: 'ogprs@gmail.com',
      password: '123456',
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Brasil Igor',
      email: 'brasil@example.com',
    });
    expect(updatedUser.name).toBe('Brasil Igor');
    expect(updatedUser.email).toBe('brasil@example.com');
  });

  it('should not be able to update the profile for non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'Teste',
        email: 'teste@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not  be able to update the profile with a another existent user email', async () => {
    await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Igor Brasil',
      email: 'jbrasil@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Brasil Igor',
        email: 'johndoe@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Igor Brasil',
      email: 'brasil@example.com',
      password: '123p456',
      old_password: '123456',
    });
    expect(updatedUser.password).toBe('123p456');
  });
  it('should not be able to update the password without a current password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Igor Brasil',
        email: 'brasil@example.com',
        password: '123456x',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with a wrong current password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Igor Brasil',
        email: 'brasil@example.com',
        password: '12345678',
        old_password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
