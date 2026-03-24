import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from './types/current-user';
import { AuthJwtPayload } from './types/auth-jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async validateUser(email: string, password: string){
    const user = await this.userService.findByEmail(email)
    if(!user) throw new UnauthorizedException('Invalid Credentials')
    //compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password)  
    if(!isPasswordMatch) throw new UnauthorizedException('Invalid Credentials')
    return{id: user.id, email: user.email , roleId: user.roleId}
  }
  

  async register(dto: RegisterDto) {
    const exists = await this.userService.findByEmail(dto.email);
    if (exists) {
      throw new UnauthorizedException('Email already in use');
    }
    const user = await this.userService.create(dto);

    return { message: 'User registered successfullly', userId: user.id };
  }

   async validateJwtUser(userId: number) {
    //retrieve user from db based on id
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not Found');
    const currentUser: CurrentUser = { id: user.id! }; //should include role later
    return currentUser;
  }

  async login(user: any) {
    const payload: AuthJwtPayload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId
    };
    console.log(payload)

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
// Local Strategy: Authenticates user using credentials
// JWT Strategy: Authorizes access using a verified token