import { Permission } from '../dto/create-group.dto';

export class Group {
  id: string;
  name: string;
  permissions: Permission[];
}
