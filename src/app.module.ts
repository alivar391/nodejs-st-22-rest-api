import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/models/users.model';
import { GroupModule } from './group/group.module';
import { Group } from './group/models/groups.model';
import { UserGroup } from './group/models/user-groups.model';
import { LoggerMiddleware } from './logger/logger.middleware';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Group, UserGroup],
      autoLoadModels: true,
      retryAttempts: 2,
    }),
    GroupModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('v1/users', 'v1/groups');
  }
}
