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

  findById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  findByLogin(login: string) {
    return this.users.find((user) => user.login === login);
  }

  update(id: string, newUser: UpdateUserDto): User {
    const user = this.users.find((user) => user.id === id);
    Object.assign(user, newUser);
    return user;
  }

  delete(id: string) {
    const user = this.users.find((user) => user.id === id);
    console.log(user);
    Object.assign(user, { isDeleted: true });
    return user;
  }
}
