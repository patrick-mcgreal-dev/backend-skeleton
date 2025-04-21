import { UserService } from "@services/UserService";
import { IUserRepository, User } from "@packages/db";

// Mock the UserRepository class
jest.mock("@packages/db/UserRepository", () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => {
      return {
        findByApiToken: jest.fn(),
      };
    }),
  };
});

describe("UserService", () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    // Create a mocked instance of the UserRepository
    userRepositoryMock =
      new (require("@packages/db/UserRepository").UserRepository)() as jest.Mocked<IUserRepository>;

    // Initialize the UserService with the mocked repository
    userService = new UserService(userRepositoryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a user when a valid token is provided", async () => {
    const mockUser: User = {
      id: 1,
      apiToken: "valid-token",
    };

    // Set up the mock implementation to return a user for a valid token
    userRepositoryMock.findByApiToken.mockResolvedValue(mockUser);

    const token = "valid-token";
    const result = await userService.findByToken(token);

    // Assert that the user is returned correctly
    expect(result).toEqual(mockUser);
    expect(userRepositoryMock.findByApiToken).toHaveBeenCalledWith(token);
  });

  it("should return null when an invalid token is provided", async () => {
    // Set up the mock implementation to return null for an invalid token
    userRepositoryMock.findByApiToken.mockResolvedValue(null);

    const token = "invalid-token";
    const result = await userService.findByToken(token);

    // Assert that null is returned for an invalid token
    expect(result).toBeNull();
    expect(userRepositoryMock.findByApiToken).toHaveBeenCalledWith(token);
  });
});
