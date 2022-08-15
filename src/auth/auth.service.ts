import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/models/users.model';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private jwt: JwtService,
  ) {}

  async login(authDto: AuthDto) {
    const user = await this.userModel.findOne({
      where: { login: authDto.login },
    });
    if (!user) {
      throw new ForbiddenException('No user with this login');
    }
    const pwMatches = await argon.verify(user.password, authDto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Password is not correct');
    }
    const { accessToken } = await this.signToken(user.id, user.login);
    return { accessToken };
  }

  async signToken(
    userId: string,
    login: string,
  ): Promise<{
    accessToken: string;
  }> {
    const payload = {
      sub: userId,
      login: login,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });

    return { accessToken };
  }
}
