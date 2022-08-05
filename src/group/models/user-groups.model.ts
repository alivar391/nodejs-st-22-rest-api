import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';
import { Permission } from '../dto/create-group.dto';
import { Group } from './groups.model';

@Table({ tableName: 'UserGroup', timestamps: false })
export class UserGroup extends Model<UserGroup> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4(),
    unique: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.UUID,
  })
  groupId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  userId: string;
}
