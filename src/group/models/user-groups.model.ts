import {
  Model,
  Table,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { User } from '../../users/models/users.model';
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
