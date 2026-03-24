import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { AuthService } from '../auth.service';

//Check if the user is authenticated
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }
  async validate(payload: AuthJwtPayload) {
    console.log( {
      message: 'Validating in JWT Strategy',
      payload,
    })
    const userId = payload.sub //get the id
    return await this.authService.validateJwtUser(userId) //returs current user
    
  }
}
