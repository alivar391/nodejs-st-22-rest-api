import {
  IsString,
  IsNotEmpty,
  IsInt,
  Matches,
  Min,
  Max,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/, {
    message: 'Password must contain at least one number and one letter',
  })
  password: string;

  @IsInt()
  @IsNotEmpty()
  @Min(4, {
    message: 'Person is too young',
  })
  @Max(130, {
    message: 'Person is too old',
  })
  age: string;
}
