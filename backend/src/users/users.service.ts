import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { User } from 'generated/prisma/client';
import { User, Prisma } from 'src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const roleName = createUserDto.email.endsWith('@bdadmin.conm')
      ? Role.ADMIN
      : Role.USER;

    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new Error('Role not Found');
    }

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: { connect: { id: role.id } },
        name: createUserDto.name,
      },
      include: { role: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    return user;
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
