import { IsNotEmpty } from 'class-validator';

export class NewRoleDto {
  @IsNotEmpty()
  name: string;

  description?: string;
}
