import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { UsersDataBase } from './users-storage';
import { User } from './entities/user.entity';
import { SortArray } from 'src/helpers/sortArray';

@Injectable()
export class UserService {
  constructor(private readonly usersDataBase: UsersDataBase) {}

  create(createUserDto: CreateUserDto): User {
    const userExist = this.usersDataBase.findByLogin(createUserDto.login);
    if (userExist) {
      throw new BadRequestException(
        `User with login: ${createUserDto.login} already exist`,
      );
    }
    const newUser: User = {
      id: uuidv4(),
      ...createUserDto,
      age: +createUserDto.age,
      isDeleted: false,
    };
    return this.usersDataBase.create(newUser);
  }

  findAll(loginSubstring: string, limit: number) {
    const allUsers = this.usersDataBase.findAll();
    const filteredUsers = allUsers
      .filter((user: User) => {
        return user.login.includes(loginSubstring) && !user.isDeleted;
      })
      .sort(SortArray)
      .slice(0, limit);

    return filteredUsers;
  }

  findOne(id: string) {
    const user = this.usersDataBase.findById(id);
    if (!user || user.isDeleted) {
      throw new NotFoundException('User is not found');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.usersDataBase.findById(id);
    if (!user || user.isDeleted) {
      throw new NotFoundException('User is not found');
    }
    return this.usersDataBase.update(id, updateUserDto);
  }

  remove(id: string) {
    const user = this.usersDataBase.findById(id);
    if (!user || user.isDeleted) {
      throw new NotFoundException('User is not found');
    }
    return this.usersDataBase.delete(id);
  }
}
