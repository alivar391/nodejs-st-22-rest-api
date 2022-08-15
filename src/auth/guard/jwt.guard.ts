import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';

export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      if (info instanceof JsonWebTokenError) {
        throw new ForbiddenException();
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
