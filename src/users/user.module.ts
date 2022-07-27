import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UsersDataBase } from './users-storage';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';

@Module({
  controllers: [UserController],
  providers: [UserService, UsersDataBase],
  imports: [SequelizeModule.forFeature([User])],
})
export class UserModule {}
