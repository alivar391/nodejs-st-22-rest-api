import { User } from 'src/user/entities/user.entity';

export const SortArray = (x: User, y: User) => x.login.localeCompare(y.login);
