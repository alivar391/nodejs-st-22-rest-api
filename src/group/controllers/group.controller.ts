import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
  NotFoundException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { GroupService } from '../services/group.service';
import { CreateGroupDto } from '../dto/create-group.dto';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { AddUsersToGroupDto } from '../dto/user-group.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';

@Controller('groups')
@UseGuards(JwtGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGroupDto: CreateGroupDto) {
    return await this.groupService.create(createGroupDto);
  }

  @Post(':id')
  async addUsersToGroup(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() addUsersToGroupDto: AddUsersToGroupDto,
  ) {
    const group = await this.groupService.addUsersToGroup(
      id,
      addUsersToGroupDto,
    );
    if (!group) {
      throw new NotFoundException('Group is not found');
    }
    return group;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.groupService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const group = await this.groupService.findOne(id);
    if (!group) {
      throw new NotFoundException('Group is not found');
    }
    return group;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const group = await this.groupService.update(id, updateGroupDto);
    if (!group) {
      console.log('no');
      throw new NotFoundException('Group is not found');
    }
    return group;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const group = await this.groupService.remove(id);
    if (!group) {
      throw new NotFoundException('Group is not found');
    }
    return group;
  }
}
