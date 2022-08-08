import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { AddUsersToGroupDto } from '../dto/user-group.dto';
import { Group } from '../models/groups.model';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = await this.groupModel.create(createGroupDto);
    return group;
  }

  async findAll(): Promise<Group[]> {
    const groups = await this.groupModel.findAll({
      include: [
        {
          model: User,
          as: 'users',
          where: { isDeleted: false },
          through: {
            attributes: [],
          },
        },
      ],
    });
    return groups;
  }

  async findOne(id: string): Promise<Group> | undefined {
    const group = await this.groupModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'users',
          where: { isDeleted: false },
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!group) {
      return;
    }
    return group;
  }

  async update(
    id: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<Group> | undefined {
    const group = await this.groupModel.findByPk(id);
    if (!group) {
      return;
    }
    const newGroup = await this.groupModel.update(updateGroupDto, {
      where: { id },
      returning: true,
    });
    return newGroup[1][0];
  }

  async remove(id: string): Promise<number> | undefined {
    const group = await this.groupModel.findByPk(id);
    if (!group) {
      return;
    }
    return await this.groupModel.destroy({ where: { id } });
  }

  async addUsersToGroup(
    id: string,
    addUsersToGroupDto: AddUsersToGroupDto,
  ): Promise<Group> {
    try {
      await this.sequelize.transaction(async (t) => {
        const group = await this.groupModel.findByPk(id, {
          transaction: t,
        });
        if (!group) {
          return;
        }
        const users = await Promise.all(
          addUsersToGroupDto.usersIds.map(async (userId) => {
            const user = await this.userModel.findOne({
              where: { id: userId, isDeleted: false },
              transaction: t,
            });
            if (!user) {
              throw new NotFoundException(`User ${userId} is not found`);
            }
            return user;
          }),
        );

        return await group.$add('users', users, { transaction: t });
      });

      return await this.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}
