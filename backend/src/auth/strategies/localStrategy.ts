import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Passport } from "passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

//Check if the user credentials are valid and login
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService: AuthService){
        super({
            usernameField: 'email'
            
        })
        
    }
    async validate(email: string, password: string){
        console.log('Validation in local strategy')
        if(password === ''){
            throw new UnauthorizedException('Please provide a password')
        }
        const user = await this.authService.validateUser(email, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}