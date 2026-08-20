import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { JWTAuthGuard } from './guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto){
    return await this.authService.register(dto)
  }


  @UseGuards(LocalAuthGuard) //pass credentials
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Request() req, @Response() res) {
    console.log('Your request user object is : ', req.user)
   
    return this.authService.login(req.user, res);
  }

  

  @UseGuards(JWTAuthGuard) //must be authenticated
  @Post('signout')
  signOut(@Response() res){
  res.clearCookie('access_token');

  return {
    message: 'Logged out',
  };
  }
 
    
  

}
