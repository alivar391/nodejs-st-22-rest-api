import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let spyService: UserService;
  const createUserDto: CreateUserDto = {
    login: 'testLogin',
    password: 'testPassword',
    age: 32,
  };

  const existUser = {
    id: 1,
    login: 'existUser',
  };

  beforeEach(async () => {
    const mockUserService = {
      provide: UserService,
      useFactory: () => ({
        create: jest.fn((createUserDto: CreateUserDto) => {
          if (createUserDto.login === existUser.login) {
            return;
          }
          return { ...createUserDto, id: 1 };
        }),
        findAll: jest.fn((login: string, limit: number) => []),
        findOne: jest.fn(() => ''),
        update: jest.fn(() => '{}'),
        remove: jest.fn(() => '{}'),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, mockUserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    spyService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create method should return user', async () => {
    const result = await controller.create(createUserDto);
    expect(spyService.create).toBeCalledWith(createUserDto);
    expect(result).toEqual({ ...createUserDto, id: 1 });
  });

  it('if user exist should return 400 statusCode', async () => {
    const existUserDto = {
      ...createUserDto,
      login: 'existUser',
    };
    try {
      const result = await controller.create(existUserDto);
    } catch (err) {
      console.log(err.response.statusCode);
      expect(err.response.statusCode).toBe(400);
    }
  });

  it('should return instance of Array when called getAllUsers method', async () => {
    const result = await controller.getAutoSuggestUsers('', 5);
    expect(spyService.findAll).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
  });

  // it('calling getAllNote method', async () => {
  //   const result = await controller.findOne();
  //   expect(spyService.findAll).toHaveBeenCalled();
  //   expect(result).toBeInstanceOf(Array);
  // });
});
