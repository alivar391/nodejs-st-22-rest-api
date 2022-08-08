import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/users.model';
import { Group } from 'src/group/models/groups.model';
import { UserGroup } from 'src/group/models/user-groups.model';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [SequelizeModule.forFeature([User, Group, UserGroup])],
})
export class UserModule {}
