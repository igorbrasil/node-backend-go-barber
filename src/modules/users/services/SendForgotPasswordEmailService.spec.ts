import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
// import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    const user = await fakeUsersRepository.create({
      name: 'Brasil Brasil',
      email: 'ogprs@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: user.email,
    });

    expect(sendMail).toHaveBeenCalled();
    // expect(user).toHaveProperty('id');
  });

  it('should be able to recover a non exisitn user password ', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'uol@uol.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should gererate a forgot password token', async () => {
    const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Brasil Brasil',
      email: 'ogprs@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: user.email,
    });

    expect(generate).toHaveBeenCalledWith(user.id);
    // expect(user).toHaveProperty('id');
  });
});
