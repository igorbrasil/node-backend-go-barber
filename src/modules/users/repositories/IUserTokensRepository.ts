// import User from '@modules/users/infra/typeorm/entities/User';
// import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
}
