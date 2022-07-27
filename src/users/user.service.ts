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
      throw new BadRequestException(
        `User with login: ${createUserDto.login} already exist`,
      );
    }
    const newUser = {
      id: uuidv4(),
      ...createUserDto,
      age: +createUserDto.age,
    };
    return await this.userModel.create(newUser);
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
      throw new NotFoundException('User is not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);
    if (!user || user.isDeleted) {
      throw new NotFoundException('User is not found');
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
      throw new NotFoundException('User is not found');
    }
    return await this.userModel.update({ isDeleted: true }, { where: { id } });
  }
}
