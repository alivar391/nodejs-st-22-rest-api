import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersDataBase {
  users: User[] = [];

  create(user: User) {
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, newUser: User): User {
    const user = this.users.find((user) => user.id === id);
    Object.assign(user, newUser);
    return user;
  }

  delete(id: string) {
    const length = this.users.length;
    this.users = this.users.filter((item) => item.id !== id);
    return length === this.users.length;
  }
}
