import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './users.model';
import { SortArray } from 'src/helpers/sortArray';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';

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
    const newUser = {
      id: uuidv4(),
      ...createUserDto,
      age: +createUserDto.age,
    };
    const res = await this.userModel.create(newUser);
    return res;
  }

  async findAll(loginSubstring: string, limit: number) {
    const allUsers = await this.userModel.findAll();
    const filteredUsers = allUsers
      .filter((user: User) => {
        return user.login.includes(loginSubstring) && !user.isDeleted;
      })
      .sort(SortArray)
      .slice(0, limit);

    return filteredUsers;
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
      throw new NotFoundException('User is not found');
    }
    const userExist = await this.userModel.findOne({
      where: { login: updateUserDto.login },
    });
    if (userExist) {
      throw new BadRequestException(
        `User with login: ${updateUserDto.login} already exist`,
      );
    }
    const newUser = await this.userModel.update(
      {
        ...updateUserDto,
        age: +updateUserDto.age,
      },
      {
        where: { id },
        returning: true,
      },
    );
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
