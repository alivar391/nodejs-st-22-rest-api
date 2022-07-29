import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../models/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from '../entities/user.entity';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userExist = await this.userModel.findOne({
      where: { login: createUserDto.login },
    });
    if (userExist) {
      return;
    }
    const res = await this.userModel.create(createUserDto);
    return res;
  }

  async findAll(loginSubstring: string, limit: number) {
    const allUsers = await this.userModel.findAll({
      where: { login: { [Op.substring]: loginSubstring }, isDeleted: false },
      order: [['login', 'ASC']],
      limit: limit,
    });
    return allUsers;
  }

  async findOne(id: string) {
    const user = await this.userModel.findByPk(id);
    if (!user || user.isDeleted) {
      return;
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);
    if (!user || user.isDeleted) {
      throw new Error('404');
    }
    const userExist = await this.userModel.findOne({
      where: { login: updateUserDto.login },
    });
    if (userExist) {
      throw new Error('400');
    }
    const newUser = await this.userModel.update(updateUserDto, {
      where: { id },
      returning: true,
    });
    return newUser[1][0];
  }

  async remove(id: string) {
    const user = await this.userModel.findByPk(id);
    if (!user || user.isDeleted) {
      return;
    }
    return await this.userModel.update({ isDeleted: true }, { where: { id } });
  }
}
