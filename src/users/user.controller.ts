import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    if (!user) {
      throw new BadRequestException(
        `User with login: ${createUserDto.login} already exist`,
      );
    }
    return user;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAutoSuggestUsers(
    @Query('loginSubstring') loginSubstring: string,
    @Query('limit') limit: number,
  ) {
    return await this.userService.findAll(loginSubstring || '', limit || 10);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    return user;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(id);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    return user;
  }
}
