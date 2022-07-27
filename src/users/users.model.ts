import { Model, Table, Column, DataType } from 'sequelize-typescript';
import { CreateUserDto } from './dto/create-user.dto';

@Table({ tableName: 'users' })
export class User extends Model<User, CreateUserDto> {
  @Column({
    type: DataType.STRING,
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
}
