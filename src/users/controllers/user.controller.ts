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
  InternalServerErrorException,
  ParseUUIDPipe,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';

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
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @SetMetadata('controller-name', 'UserController.getAutoSuggestUsers')
  async getAutoSuggestUsers(
    @Query('loginSubstring') loginSubstring: string,
    @Query('limit') limit: number,
  ) {
    return await this.userService.findAll(loginSubstring || '', limit || 10);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    return user;
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return user;
    } catch (err) {
      if (err.message === '400') {
        throw new BadRequestException(
          `User with login: ${updateUserDto.login} already exist`,
        );
      } else if (err.message === '404') {
        throw new NotFoundException('User is not found');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = await this.userService.remove(id);
    if (!user) {
      throw new NotFoundException('User is not found');
    }
    return user;
  }
}
