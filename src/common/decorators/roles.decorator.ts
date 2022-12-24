import { SetMetadata } from '@nestjs/common';
import { Role } from '../consts/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('ROLES_KEY', roles);
