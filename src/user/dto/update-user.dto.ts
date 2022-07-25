import { IsString, IsNotEmpty, IsInt, Matches } from 'class-validator';
export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/)
  password: string;

  @IsInt()
  @IsNotEmpty()
  age: string;
}
