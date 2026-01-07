import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userService.findByEmail(dto.email);
    if (exists) {
      throw new UnauthorizedException('Email already in use');
    }
    const user = await this.userService.create(dto);

    return { message: 'User registered successfullly', userId: user.id };
  }

  async login(dto: LoginDto) {
    //find user by email
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Wrong Credentials');
    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Wrong Credentials');
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token, payload };
  }
}
