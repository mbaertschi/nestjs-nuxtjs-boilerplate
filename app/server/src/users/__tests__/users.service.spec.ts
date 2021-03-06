import { getRepositoryToken } from "@nestjs/typeorm";
import { Test } from "@nestjs/testing";
import { FactoryModule, factory } from "typeorm-factories";
import { Repository } from "typeorm";

import { repositoryMockFactory, MockType } from "../../../test/factories";
import { ConfigModule, I18nModule } from "../../core";

import { User, UsersService } from "..";

describe("UsersService", () => {
  let usersService: UsersService;
  let repository: MockType<Repository<User>>;
  let user: User;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, I18nModule, FactoryModule],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    await moduleRef.init();

    usersService = moduleRef.get<UsersService>(UsersService);
    repository = moduleRef.get(getRepositoryToken(User));
    user = await factory(User).make();
  });

  it("should be defined", () => {
    expect(usersService).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe("findAll", () => {
    it("to return list of users", async () => {
      repository.find.mockReturnValueOnce([user]);
      expect(await usersService.findAll()).toEqual([user]);
    });
  });

  describe("findByEmail", () => {
    it("to return user by email", async () => {
      repository.findOne.mockReturnValueOnce(user);
      expect(await usersService.findByEmail(user.email)).toEqual(user);
      expect(repository.findOne).toBeCalledWith({ email: user.email });
    });
  });
});
