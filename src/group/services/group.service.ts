import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { Group } from '../models/groups.model';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = await this.groupModel.create(createGroupDto);
    return group;
  }

  async findAll() {
    const groups = await this.groupModel.findAll();
    return groups;
  }

  async findOne(id: string) {
    const group = await this.groupModel.findByPk(id);
    if (!group) {
      return;
    }
    return group;
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupModel.findByPk(id);
    if (!group) {
      return;
    }
    const newGroup = await this.groupModel.update(updateGroupDto, {
      where: { id },
    });
    return newGroup;
  }

  async remove(id: string) {
    const group = await this.groupModel.findByPk(id);
    if (!group) {
      return;
    }
    return await this.groupModel.destroy({ where: { id } });
  }
}
