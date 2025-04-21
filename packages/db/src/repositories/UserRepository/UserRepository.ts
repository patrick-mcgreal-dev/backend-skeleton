import { IUserRepository } from "./IUserRepository";
import { User } from "../../models/User";

const mockUsers: User[] = [
  {
    id: 1,
    apiToken: "test-api-token",
  },
];

export class UserRepository implements IUserRepository {
  async findByApiToken(token: string): Promise<User | null> {
    const user = mockUsers.find((u) => u.apiToken === token);
    return user || null;
  }
}
