import {
  Model,
  Table,
  Column,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from 'src/users/models/users.model';
import { Permission } from '../dto/create-group.dto';
import { UserGroup } from './user-groups.model';

interface GroupCreationsAttrs {
  name: string;
  permissions: Permission[];
}

@Table({ tableName: 'Groups', timestamps: false })
export class Group extends Model<Group, GroupCreationsAttrs> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4(),
    unique: true,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  permissions: Permission[];

  @BelongsToMany(() => User, () => UserGroup)
  users: User[];
}
