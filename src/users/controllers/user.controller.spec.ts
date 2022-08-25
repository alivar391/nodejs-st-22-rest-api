import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let spyService: UserService;

  const userId = '5741351f-5843-4847-a9b5-026af82139c8';
  const wrongUserId = '5741351f-5843-4847-a9b5-026af82139c9';
  const createUserDto: CreateUserDto = {
    login: 'testLogin',
    password: 'testPassword',
    age: 32,
  };

  const updateUserDto: UpdateUserDto = {
    login: 'updateTestLogin',
    password: 'testPassword',
    age: 32,
  };

  const existUser = {
    id: '5741351f-5843-4847-a9b5-026af82139c8',
    login: 'existUser',
    age: 32,
    password: 'testPassword',
  };

  beforeEach(async () => {
    const mockUserService = {
      provide: UserService,
      useFactory: () => ({
        create: jest.fn((createUserDto: CreateUserDto) => {
          if (createUserDto.login === existUser.login) {
            return;
          }
          return {
            ...createUserDto,
            id: '5741351f-5843-4847-a9b5-026af82139c8',
          };
        }),
        findAll: jest.fn((login: string, limit: number) => []),
        findOne: jest.fn((id: string) => {
          if (id === userId) {
            return existUser;
          } else return;
        }),
        update: jest.fn((id: string, updateUserDto: UpdateUserDto) => {
          if (id !== userId) {
            throw new Error('404');
          } else if (updateUserDto.login === existUser.login) {
            throw new Error('400');
          } else {
            return {
              ...existUser,
              ...updateUserDto,
            };
          }
        }),
        remove: jest.fn((id: string) => {
          if (id !== existUser.id) {
            return;
          }
          if (id === existUser.id) {
            return {
              ...existUser,
              isDeleted: true,
            };
          }
        }),
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
    expect(result).toEqual({
      ...createUserDto,
      id: '5741351f-5843-4847-a9b5-026af82139c8',
    });
  });

  it('create method if user exist should return 400 statusCode', async () => {
    const existUserDto = {
      ...createUserDto,
      login: 'existUser',
    };
    try {
      const result = await controller.create(existUserDto);
    } catch (err) {
      expect(err.response.statusCode).toBe(400);
    }
  });

  it('getAllUsers method should return instance of Array when called', async () => {
    const result = await controller.getAutoSuggestUsers('', 5);
    expect(spyService.findAll).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
  });

  it('findOne method should return user', async () => {
    const result = await controller.findOne(userId);
    expect(spyService.findOne).toHaveBeenCalledWith(userId);
    expect(result).toBe(existUser);
  });

  it('findOne method should return 404 status code if no user with id', async () => {
    try {
      const result = await controller.findOne(wrongUserId);
    } catch (err) {
      expect(err.response.statusCode).toBe(404);
    }
  });

  it('update method should return updated user', async () => {
    const result = await controller.update(userId, updateUserDto);
    expect(spyService.update).toHaveBeenCalledWith(userId, updateUserDto);
    expect(result).toStrictEqual({ ...existUser, login: updateUserDto.login });
  });

  it('update method should return 404 status code if no user with id', async () => {
    try {
      const result = await controller.update(wrongUserId, updateUserDto);
    } catch (err) {
      expect(err.response.statusCode).toBe(404);
    }
  });

  it('update method should return 400 status code if user with login exist', async () => {
    try {
      const result = await controller.update(userId, createUserDto);
    } catch (err) {
      expect(err.response.statusCode).toBe(400);
      expect(err.response.message).toBe(
        `User with login: ${createUserDto.login} already exist`,
      );
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('delete method should return deleted user', async () => {
    const result = await controller.remove(userId);
    expect(spyService.remove).toHaveBeenCalledWith(userId);
    expect(result).toStrictEqual({ ...existUser, isDeleted: true });
  });

  it('delete method should return 404 statusCode if user not found', async () => {
    try {
      const result = await controller.update(wrongUserId, updateUserDto);
    } catch (err) {
      expect(err.response.statusCode).toBe(404);
      expect(err.response.message).toBe('User is not found');
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
});
