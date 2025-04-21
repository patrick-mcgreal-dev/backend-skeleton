import { IUserRepository, UserRepository, User } from "@packages/db";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  static getUserService(): UserService {
    const userRepository = new UserRepository();
    return new UserService(userRepository);
  }

  async findByToken(token: string): Promise<User | null> {
    return this.userRepository.findByApiToken(token);
  }
}
