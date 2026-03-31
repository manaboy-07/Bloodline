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
    const roleName = createUserDto.email.endsWith('@bdadmin.com')
      ? Role.ADMIN
      : Role.USER;

    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });
    if (!role) {
      throw new Error('Role not Found');
    }

    return await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: { connect: { id: role.id } },
        name: createUserDto.name,
        club: createUserDto.club
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
    return this.prisma.user.findMany({
      include: { role: true}
    });
  }

  async findOne(id: number): Promise<{
  id: number;
  name: string;
  email: string;
  roleId: number | null;
  role: { id: number; name: string } | null;
  points: number;
  club: string | null;
  createdAt: Date;
} | null> {  
  return this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      roleId: true,
      role: { select: { id: true, name: true } },
      points: true,
      club: true,
      createdAt: true,
    },
  });
}
  
}
