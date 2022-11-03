import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import { Roles } from 'nest-keycloak-connect';
import { KeycloakAdminExceptionFilter } from 'shared/keycloak/keycloak-admin-exception.filter';
import { User, UserPage } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseFilters(KeycloakAdminExceptionFilter)
@Roles({ roles: ['realm:admin', 'realm:user_management'] })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(
    @Query('first') first = 0,
    @Query('max') max = 5,
    @Query('role') role: string,
    @Query('search') search: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDesc') sortDesc: boolean,
  ): Promise<UserPage> {
    if (first < 0 || max < 0) {
      throw new BadRequestException(
        'first or max should not be negative values.',
      );
    }

    return this.usersService.getUsers(
      first,
      max,
      role,
      search,
      sortBy,
      sortDesc,
    );
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Post()
  createUser(@Body() body): Promise<User> {
    return this.usersService.createUser(body);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() body): Promise<User> {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}