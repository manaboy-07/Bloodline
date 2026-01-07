import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('register')
  register(@Body() dto: RegisterDto){
    
  }

  @Post('login')
  login(@Body() dto: LoginDto){
 
  }
  
  //Add signout later

}
