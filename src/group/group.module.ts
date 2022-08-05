import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { Group } from './models/groups.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/models/users.model';
import { UserGroup } from './models/user-groups.model';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [SequelizeModule.forFeature([Group, User, UserGroup])],
})
export class GroupModule {}
