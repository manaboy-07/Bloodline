import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async getUserExist(id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new BadRequestException('No such user exist');
    return user;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User ID missing');

    const user = await this.getUserExist(userId);
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //does user exist
    const user = await this.getUserExist(+id);
    if (user) {
      return this.usersService.update(+id, updateUserDto);
    }
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.getUserExist(+id);
    if (user) {
      return this.usersService.deleteUser(+id);
    }
  }
}
