import { IsString, IsNotEmpty, IsArray, IsEnum } from 'class-validator';

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

enum GroupPermission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  SHARE = 'SHARE',
  UPLOAD_FILES = 'UPLOAD_FILES',
}

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsEnum(GroupPermission, { each: true })
  permissions: Permission[];
}
