import { IUserRepository } from "./IUserRepository";
import { User } from "../../models/User";
export declare class UserRepository implements IUserRepository {
    findByApiToken(token: string): Promise<User | null>;
}
