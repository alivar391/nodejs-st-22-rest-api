import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UsersDataBase } from './users-storage';

@Module({
  controllers: [UserController],
  providers: [UserService, UsersDataBase],
})
export class UserModule {}
