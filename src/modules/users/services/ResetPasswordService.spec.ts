import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
// import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset  the password ', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José da Silva',
      email: 'josedasilvas@example.com',
      password: '123456',
    });
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const { token } = await fakeUserTokensRepository.generate(user.id);
    await resetPassword.execute({
      password: '123123',
      token,
    });
    const updatedUser = await fakeUsersRepository.findById(user.id);
    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });
  it('should not be able to reset the password with an non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123132',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to reset the password with an non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );
    await expect(
      resetPassword.execute({
        token,
        password: '123132',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset  the password if past more than two hours ', async () => {
    const user = await fakeUsersRepository.create({
      name: 'José da Silva',
      email: 'josedasilvas@example.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
// hash
// 2h expiração do token
// UserTokem inexistent
// user inexistent
