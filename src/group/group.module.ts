import { Module } from '@nestjs/common';
import { GroupService } from './services/group.service';
import { GroupController } from './controllers/group.controller';
import { Group } from './models/groups.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
  imports: [SequelizeModule.forFeature([Group])],
})
export class GroupModule {}
