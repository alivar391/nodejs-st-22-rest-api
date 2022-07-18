import { IsString, IsNotEmpty, IsInt } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  @IsNotEmpty()
  age: string;
}
