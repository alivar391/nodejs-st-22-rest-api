import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Group } from '../../group/models/groups.model';
import { UserGroup } from '../../group/models/user-groups.model';

interface UserCreationsAttrs {
  login: string;
  password: string;
  age: number;
}

@Table({ tableName: 'Users', timestamps: false })
export class User extends Model<User, UserCreationsAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4(),
    unique: true,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  age: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDeleted: boolean;

  @BelongsToMany(() => Group, () => UserGroup)
  groups: Group[];
}
