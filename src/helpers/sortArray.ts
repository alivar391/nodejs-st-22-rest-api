import { UserEntity } from 'src/users/entities/user.entity';

export const SortArray = (x: UserEntity, y: UserEntity) =>
  x.login.localeCompare(y.login);
