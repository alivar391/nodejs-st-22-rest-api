import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { NotFoundException } from '@nestjs/common';
import { AddUsersToGroupDto } from '../dto/user-group.dto';

describe('GroupController', () => {
  let controller: GroupController;
  let spyService: GroupService;

  const groupId = '5741351f-5843-4847-a9b5-026af82139c8';
  const wrongGroupId = '5741351f-5843-4847-a9b5-026af82139c9';
  const createGroupDto: CreateGroupDto = {
    name: 'group1',
    permissions: ['WRITE'],
  };

  const updateGroupDto: UpdateGroupDto = {
    name: 'group2',
    permissions: ['WRITE', 'READ'],
  };

  const addUsersToGroupDto = { usersIds: [wrongGroupId] };

  const existGroup = {
    id: groupId,
    name: 'group1',
    permissions: ['WRITE'],
  };

  beforeEach(async () => {
    const mockGroupService = {
      provide: GroupService,
      useFactory: () => ({
        create: jest.fn((createGroupDto: CreateGroupDto) => {
          return {
            ...createGroupDto,
            id: groupId,
          };
        }),
        findAll: jest.fn(() => []),
        findOne: jest.fn((id: string) => {
          if (id === groupId) {
            return existGroup;
          } else return;
        }),
        update: jest.fn((id: string, updateGroupDto: UpdateGroupDto) => {
          if (id !== groupId) {
            return;
          } else {
            return {
              ...existGroup,
              ...updateGroupDto,
            };
          }
        }),
        remove: jest.fn((id: string) => {
          if (id !== existGroup.id) {
            return;
          }
          if (id === existGroup.id) {
            return existGroup;
          }
        }),
        addUsersToGroup: jest.fn(
          (id: string, addUsersToGroupDto: AddUsersToGroupDto) => {
            if (id !== existGroup.id) {
              return;
            }
          },
        ),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [GroupService, mockGroupService],
    }).compile();

    controller = module.get<GroupController>(GroupController);
    spyService = module.get<GroupService>(GroupService);
  });

  it('group controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create method should return group', async () => {
    const result = await controller.create(createGroupDto);
    expect(spyService.create).toBeCalledWith(createGroupDto);
    expect(result).toEqual({
      ...createGroupDto,
      id: groupId,
    });
  });

  it('findAll method should return instance of Array when called', async () => {
    const result = await controller.findAll();
    expect(spyService.findAll).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Array);
  });

  it('findOne method should return group', async () => {
    const result = await controller.findOne(groupId);
    expect(spyService.findOne).toHaveBeenCalledWith(groupId);
    expect(result).toBe(existGroup);
  });

  it('findOne method should return 404 status code if no group with id', async () => {
    try {
      const result = await controller.findOne(wrongGroupId);
    } catch (err) {
      expect(err.response.statusCode).toBe(404);
    }
  });

  it('update method should return updated group', async () => {
    const result = await controller.update(groupId, updateGroupDto);
    expect(spyService.update).toHaveBeenCalledWith(groupId, updateGroupDto);
    expect(result).toStrictEqual({
      ...existGroup,
      ...updateGroupDto,
    });
  });

  it('update method should return 404 status code if no group with id', async () => {
    try {
      const result = await controller.update(wrongGroupId, updateGroupDto);
    } catch (err) {
      expect(err.response.statusCode).toBe(404);
    }
  });

  it('delete method should return deleted group', async () => {
    const result = await controller.remove(groupId);
    expect(spyService.remove).toHaveBeenCalledWith(groupId);
    expect(result).toStrictEqual(existGroup);
  });

  it('delete method should return 404 statusCode if group not found', async () => {
    try {
      const result = await controller.update(wrongGroupId, updateGroupDto);
    } catch (err) {
      expect(err.response.statusCode).toBe(404);
      expect(err.response.message).toBe('Group is not found');
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });
  it('addUsersToGroup method should return 404 status code if no group with id', async () => {
    try {
      const result = await controller.addUsersToGroup(
        wrongGroupId,
        addUsersToGroupDto,
      );
    } catch (err) {
      expect(err.response.statusCode).toBe(404);
    }
  });
});
