import { User } from "../../models/User";

export interface IUserRepository {
  findByApiToken(token: string): Promise<User | null>;
}
