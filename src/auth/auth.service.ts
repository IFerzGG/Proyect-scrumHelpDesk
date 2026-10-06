import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UsersService,
        private readonly jwyService:JwtService,
    ){}

    async validateUser(email:string, password:string){
        const user = await this.userService.findByEmail(email)
        if(user && (await bcrypt.compare(password,user.password))){
            const {password, ...dataUser} = user;
            return dataUser;
        }
        return null;
    }

    async login(user:any){
        const payload = {
            sub: user.id,
            nombre:user.nombre,
            apellido:user.apellido,
            email: user.email,
            role: user.role,
        };
        return {access_token: this.jwyService.sign(payload)};
    }

    async register(data:RegisterDto){
        return await this.userService.create(data);
    }
}
